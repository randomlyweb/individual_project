from django.urls import path

from .views import BlockAPIView, TBlockAPIView

urlpatterns = [
    path('blocks/', BlockAPIView.as_view(), name='block-api'),
    path('blocks/<int:id>/', TBlockAPIView.as_view()),
]
