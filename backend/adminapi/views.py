import random
from uuid import uuid4
from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate

from .models import *
from .serializers import *


class AuthenticateView(APIView):
    def post(self, request):
        serializer = AuthorizationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.data.get('username')
            password = serializer.data.get('password')

            if (not username) or (not password):
                return Response({
                    'description': "Login or password are required!"
                }, status=status.HTTP_404_NOT_FOUND)
            user = authenticate(username=username, password=password)

            if user:
                token = Token.objects.get_or_create(user=user)
                response = Response({
                    'data': f'{token[0]}'
                }, status=status.HTTP_200_OK)
                return response           
            else:
                return Response({
                    'description': "Login or password are incorrect"
                }, status=status.HTTP_400_BAD_REQUEST)
            

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        token = Token.objects.get(user=request.user)
        token.delete()
        response = Response({'description': 'Вы успешно вышли из системы'}, status=status.HTTP_200_OK)
        return response
    

class GetSubjectsName(APIView):
    def get(self, request):
        subjects = Subjects.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)