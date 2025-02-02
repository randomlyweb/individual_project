from django.db import models
from django.utils.timezone import now
from adminapi.models import TeacherProfile  


class Blockchain(models.Model):
    name = models.CharField(max_length=255, unique=True)


class Block(models.Model):

    STATUS_CHOICES = [
        ('отправлено', 'Отправлено'),
        ('просмотрено', 'Просмотрено'),
        ('проверено', 'Проверено'),
        ('оценено', 'Оценено'),
    ]

    blockchain = models.ForeignKey(Blockchain, on_delete=models.CASCADE)
    prev_hash = models.CharField(max_length=64)
    timestamp = models.DateTimeField(default=now)
    file_hash = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='отправлено')
    signature = models.TextField()
    file = models.FileField(upload_to='uploads/blocks/')
    teacher_profile = models.ForeignKey(TeacherProfile, on_delete=models.SET_NULL, null=True)
    work_title = models.CharField(max_length=255, default="Без названия")

    def save(self, *args, **kwargs):
        if not self.prev_hash:
            last_block = Block.objects.filter(blockchain=self.blockchain).order_by('-id').first()
            self.prev_hash = last_block.file_hash if last_block else '0'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"блок #{self.id} ({self.status})"
    
    class Meta:
        verbose_name = 'блок'
        verbose_name_plural = 'блоки'
