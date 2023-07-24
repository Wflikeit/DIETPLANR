from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    photo = models.ImageField(upload_to='user/%Y/%m/%d/',
                              blank=True, unique=True)
    full_name = models.TextField(max_length=40)
    age = models.PositiveSmallIntegerField()
    gender = models.TextField(choices=GENDER_CHOICES, max_length=1)
    City = models.TextField(max_length=40)
    Country = models.TextField()


class DietitianProfile(UserProfile):
    specialty = models.TextField(max_length=40)
    experience = models.TextField(max_length=100)
    nutritional_philosophy = models.TextField(max_length=40)
    some_more = models.TextField(max_length=40)
    # TODO Payment info
    # TODO change speciality to ArrayField in PostgresSQL


class Activity(models.Model):
    period = models.DurationField
    video = models.URLField(null=True)

    pass
# Create your models here.
