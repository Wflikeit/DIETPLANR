from django.contrib.auth.models import User
from django.db import models
from datetime import timedelta
from django.utils.timezone import now
from datetime import timedelta

from django.contrib.auth.models import User
from django.db import models
from django.utils.timezone import now


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    user = models.OneToOneField(User,
                                on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    photo = models.ImageField(upload_to='user/%Y/%m/%d/',
                              blank=True, unique=True)
    full_name = models.TextField(max_length=40)
    age = models.PositiveSmallIntegerField()
    gender = models.TextField(choices=GENDER_CHOICES, max_length=1)
    City = models.TextField(max_length=40)
    Country = models.TextField()

    def __str__(self):
        return self.user.username


class DietitianProfile(UserProfile):
    specialty = models.TextField(max_length=40)
    experience = models.TextField(max_length=100)
    nutritional_philosophy = models.TextField(max_length=40)
    some_more = models.TextField(max_length=40)
    # TODO Payment info
    # TODO change speciality to ArrayField in PostgresSQL


class Appointment(models.Model):
    APPOINTMENT_CHOICES = [
        ('diet_consultation', 'Diet_consultation'),
        ('deep_analyse_of_activity', 'Deep_analyse_of_activity'),
        ('swimming', 'Swimming'),
    ]
    DURATION_CHOICES = [
        (timedelta(minutes=30), '30 minutes'),
        (timedelta(minutes=60), '60 minutes'),

    ]
    title = models.TextField(max_length=40)
    event_duration = models.DurationField(choices=DURATION_CHOICES)
    date = models.DateTimeField()
    user_profile = models.ForeignKey(UserProfile,
                                     on_delete=models.CASCADE,
                                     related_name='user_appointments')
    dietitian_profile = models.ForeignKey(DietitianProfile,
                                          on_delete=models.CASCADE,
                                          related_name='dietitian_appointments')
    published_time = models.DateTimeField(default=now, editable=False)

    def __str__(self):
        return self.title

# Create your models here.
