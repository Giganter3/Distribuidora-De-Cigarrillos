from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone

User = get_user_model()

class Account(models.Model):
    class AccountType(models.TextChoices):
        ASSET = 'AS', 'Activo'
        LIABILITY = 'LI', 'Pasivo'
        EQUITY = 'EQ', 'Patrimonio'
        REVENUE = 'RE', 'Ingreso'
        EXPENSE = 'EX', 'Gasto'

    code = models.CharField(max_length=20, unique=True, blank=True, null=True)
    name = models.CharField(max_length=120)
    type = models.CharField(max_length=2, choices=AccountType.choices)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.PROTECT, related_name='children')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        ordering = ['code']

class JournalEntry(models.Model):
    date = models.DateField(default=timezone.now)
    description = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='journal_entries')
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        total_debit = sum(line.debit for line in self.lines.all())
        total_credit = sum(line.credit for line in self.lines.all())
        if round(total_debit, 2) != round(total_credit, 2):
            raise ValidationError('La partida doble no cuadra: debe = haber.')

    def __str__(self):
        return f"Asiento #{self.id} - {self.date} - {self.description[:30]}"

    class Meta:
        ordering = ['-date', '-id']

class JournalEntryLine(models.Model):
    entry = models.ForeignKey(JournalEntry, related_name='lines', on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def clean(self):
        if self.debit and self.credit:
            raise ValidationError('Una línea no puede tener importe en Debe y en Haber a la vez.')
        if not self.debit and not self.credit:
            raise ValidationError('La línea debe tener Debe o Haber.')
        if self.account.children.exists():
            raise ValidationError(f'La cuenta {self.account} es una cuenta padre y no puede usarse en un asiento.')

    def __str__(self):
        side = 'D' if self.debit else 'H'
        amount = self.debit or self.credit
        return f"{self.account} - {side} {amount}"