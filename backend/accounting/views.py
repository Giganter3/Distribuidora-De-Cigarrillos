from django.db.models import Sum, Q, F
from rest_framework import viewsets, permissions, decorators, response, status
from rest_framework.permissions import IsAuthenticated
from .models import Account, JournalEntry, JournalEntryLine
from django.contrib.auth.models import User
from .serializers import (
    AccountSerializer, AccountTreeSerializer,
    JournalEntrySerializer, UserSerializer
)
from .permissions import IsAdminOrReadOnly

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all().order_by('code')
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated & IsAdminOrReadOnly]

    @decorators.action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def tree(self, request):
        roots = Account.objects.filter(parent__isnull=True).order_by('code')
        data = AccountTreeSerializer(roots, many=True).data
        return response.Response(data)

class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.prefetch_related('lines__account').all()
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ReportsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @decorators.action(detail=False, methods=['get'])
    def diario(self, request):
        # /api/reports/diario?desde=2025-01-01&hasta=2025-12-31
        desde = request.query_params.get('desde')
        hasta = request.query_params.get('hasta')
        qs = JournalEntry.objects.all().order_by('date', 'id')
        if desde:
            qs = qs.filter(date__gte=desde)
        if hasta:
            qs = qs.filter(date__lte=hasta)

        data = []
        for e in qs:
            for l in e.lines.all():
                data.append({
                    'entry_id': e.id,
                    'fecha': e.date,
                    'descripcion': e.description,
                    'cuenta': f"{l.account.code} - {l.account.name}",
                    'debe': float(l.debit),
                    'haber': float(l.credit),
                    'usuario': e.created_by.username if e.created_by else None,
                })
        return response.Response(data)

    @decorators.action(detail=False, methods=['get'])
    def mayor(self, request):
        # /api/reports/mayor?cuenta_id=1&desde=2025-01-01&hasta=2025-12-31
        cuenta_id = request.query_params.get('cuenta_id')
        if not cuenta_id:
            return response.Response({'detail': 'cuenta_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        desde = request.query_params.get('desde')
        hasta = request.query_params.get('hasta')
        qs = JournalEntryLine.objects.select_related('entry', 'account').filter(account_id=cuenta_id)
        if desde:
            qs = qs.filter(entry__date__gte=desde)
        if hasta:
            qs = qs.filter(entry__date__lte=hasta)
        qs = qs.order_by('entry__date', 'entry_id', 'id')

        saldo = 0.0
        movimientos = []
        for l in qs:
            saldo += float(l.debit) - float(l.credit)
            movimientos.append({
                'entry_id': l.entry_id,
                'fecha': l.entry.date,
                'descripcion': l.entry.description,
                'debe': float(l.debit),
                'haber': float(l.credit),
                'saldo': saldo
            })
        return response.Response(movimientos)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] # Only admin users can list users