from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from django.conf import settings
import os

from .models import Block, Blockchain
from .serializers import BlockSerializer
from .utils import *
from adminapi.models import TeacherProfile


class BlockAPIView(APIView):
    def get(self, request, *args, **kwargs):
        __block_id = request.GET.get('block_id')
        if __block_id:
            block = get_object_or_404(Block, id=__block_id)
            return Response(BlockSerializer(block).data)
        blocks = Block.objects.all()
        serializer = BlockSerializer(blocks, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        file_hash = hash_file(file)
        
        if is_duplicate(file_hash):
            return Response({"message": "Такой документ уже существует!"}, status=400)
        
        sk, _ = generate_keys()
        blockchain, _ = Blockchain.objects.get_or_create(name="Default")
        
        subject_name = request.data.get('subject_name')
        teacher_profile = get_object_or_404(TeacherProfile, subject__name=subject_name)
        work_title = request.data.get('work_title')
        new_block = Block(
            blockchain=blockchain,
            file_hash=file_hash,
            status='отправлено',
            signature=sign_data(sk, file_hash),
            file=file,
            teacher_profile=teacher_profile,
            work_title=work_title
        )
        new_block.save()
        return Response(BlockSerializer(new_block).data)

class TBlockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        __teacher_user = request.user
        teacher_profile = get_object_or_404(TeacherProfile, user=__teacher_user)
        blocks = Block.objects.filter(teacher_profile=teacher_profile).order_by('status')
        serializer = BlockSerializer(blocks, many=True)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        block = Block.objects.get(id=kwargs['id'])
        new_status = request.data.get('status')

        valid_statuses = {choice[0] for choice in Block.STATUS_CHOICES}

        if new_status not in valid_statuses:
            return Response({"error": "Неверный статус"}, status=status.HTTP_400_BAD_REQUEST)

        block.status = new_status
        block.save()
        return Response(BlockSerializer(block).data)