from django.conf import settings
from django.contrib.auth.models import User
from django.db import models

ENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
]


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    photo = models.ImageField(upload_to='user/%Y/%m/%d/',
                              blank=True, unique=True)
    name = models.TextField(max_length=40, editable=False)
    age = models.PositiveSmallIntegerField(editable=False)
    gender = models.TextField(choices=ENDER_CHOICES, editable=False, max_length=1)
    City = models.TextField(max_length=40)
    Country = models.TextField(editable=False)


class DietitianProfile(UserProfile):
    specialty = models.TextField(max_length=40)
    experience = models.TextField(max_length=40)
    nutritional_philosophy = models.TextField(max_length=40)
    some_more = models.TextField(max_length=40)

# Create your models here.
