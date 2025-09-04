from django.contrib import admin
from .models import Account, JournalEntry, JournalEntryLine

class JournalEntryLineInline(admin.TabularInline):
    model = JournalEntryLine
    extra = 1

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    inlines = [JournalEntryLineInline]
    list_display = ('id', 'date', 'description', 'created_by', 'created_at')
    list_filter = ('date', 'created_by')

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'type', 'parent', 'is_active')
    search_fields = ('code', 'name')
    list_filter = ('type', 'is_active')