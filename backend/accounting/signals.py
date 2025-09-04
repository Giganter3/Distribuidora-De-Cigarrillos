from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .models import Account, JournalEntryLine

@receiver(pre_delete, sender=Account)
def prevent_delete_if_used(sender, instance, **kwargs):
    if JournalEntryLine.objects.filter(account=instance).exists():
        raise ValidationError('No se puede eliminar la cuenta porque tiene asientos asociados.')