from django.test import TestCase
from django.contrib.auth.models import User
from .models import Account, JournalEntry, JournalEntryLine

class AccountingTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='123')
        self.activo = Account.objects.create(code='1', name='Caja', type='AS')
        self.ingreso = Account.objects.create(code='4', name='Ventas', type='RE')

    def test_asiento_partida_doble(self):
        e = JournalEntry.objects.create(description='Venta', created_by=self.user)
        JournalEntryLine.objects.create(entry=e, account=self.activo, debit=1000)
        JournalEntryLine.objects.create(entry=e, account=self.ingreso, credit=1000)
        e.full_clean()  # no debería tirar error