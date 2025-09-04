from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, JournalEntryViewSet, ReportsViewSet, UserViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'journal-entries', JournalEntryViewSet, basename='journalentry')
router.register(r'users', UserViewSet, basename='user')
# Reports as a fake viewset with custom actions
reports = ReportsViewSet.as_view({'get': 'diario'})
mayor = ReportsViewSet.as_view({'get': 'mayor'})

urlpatterns = [
    path('', include(router.urls)),
    path('reports/diario', reports, name='reporte-diario'),
    path('reports/mayor', mayor, name='reporte-mayor'),
]