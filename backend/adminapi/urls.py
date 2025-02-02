from django.urls import path

from . import views

urlpatterns = [
    path('auth/', views.AuthenticateView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('subjects/', views.GetSubjectsName.as_view()),
]