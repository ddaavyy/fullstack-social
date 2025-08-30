from django.contrib.auth.models import AbstractUser
from django.db import models
from uuid import uuid4
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

def user_photo_path(instance, filename):
    ext = filename.split('.')[-1].lower()
    return f'users/{instance.pk or "new"}/{uuid4().hex}.{ext}'

def max_2mb(file):
    if file.size > 2 * 1024 * 1024:
        raise ValidationError('Imagem deve ter no máximo 2MB.')

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    photo = models.ImageField(
        upload_to=user_photo_path,
        null=True, blank=True,
        validators=[FileExtensionValidator(['jpg','jpeg','png','webp']), max_2mb]
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
