from django.db import models
from django.contrib.auth.models import User


class Subjects(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "предмет"
        verbose_name_plural = "предметы"


class TeacherProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    subject = models.ForeignKey(Subjects, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.name} - {self.subject.name}"
    
    class Meta:
        verbose_name = "профиль учителя"
        verbose_name_plural = "профили учителей"