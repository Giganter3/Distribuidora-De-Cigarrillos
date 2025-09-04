from rest_framework import serializers
from .models import Account, JournalEntry, JournalEntryLine
from django.contrib.auth.models import User

import uuid # Add this import

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'code', 'name', 'type', 'parent', 'is_active']
        extra_kwargs = {
            'code': {'required': False} # Make code not required for creation
        }

    def create(self, validated_data):
        if 'code' not in validated_data or not validated_data['code']:
            # Generate a unique code if not provided
            validated_data['code'] = uuid.uuid4().hex[:20] # Use first 20 chars of UUID
        return super().create(validated_data)

class AccountTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ['id', 'code', 'name', 'type', 'is_active', 'children']

    def get_children(self, obj):
        qs = obj.children.all().order_by('code')
        return AccountTreeSerializer(qs, many=True).data

class JournalEntryLineSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)
    account_code = serializers.CharField(source='account.code', read_only=True)

    class Meta:
        model = JournalEntryLine
        fields = ['id', 'account', 'account_code', 'account_name', 'debit', 'credit']

class JournalEntrySerializer(serializers.ModelSerializer):
    lines = JournalEntryLineSerializer(many=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = JournalEntry
        fields = ['id', 'date', 'description', 'created_by', 'created_by_username', 'lines', 'created_at']
        read_only_fields = ['created_by', 'created_at']

    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        entry = JournalEntry.objects.create(**validated_data)
        for line in lines_data:
            JournalEntryLine.objects.create(entry=entry, **line)
        entry.full_clean()
        entry.save()
        return entry

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']

    def get_role(self, obj):
        if obj.is_superuser:
            return 'Administrador'
        elif obj.is_staff:
            return 'Staff'
        elif obj.groups.filter(name='Comprador').exists():
            return 'Comprador'
        else:
            return 'Usuario'