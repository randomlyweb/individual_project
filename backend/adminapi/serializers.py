from rest_framework import serializers
from django.contrib.auth.models import User

from .models import *


class AuthorizationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=128)

    class Meta:
        model = User
        fields = ('username', 'password')


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subjects
        fields = '__all__'