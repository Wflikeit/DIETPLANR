from datetime import timedelta

from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
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
    full_name = models.CharField(max_length=40)
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(choices=GENDER_CHOICES, max_length=1)
    City = models.CharField(max_length=40)
    Country = models.CharField(max_length=40)
    dietitian = models.ForeignKey('DietitianProfile', on_delete=models.SET_NULL,
                                  null=True, blank=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Tworzenie unikalnego sluga na podstawie pola full_name
        if not self.slug:
            self.slug = slugify(self.full_name)
        super(UserProfile, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username


class DietitianProfile(UserProfile):
    specialty = models.CharField(max_length=40, blank=True)
    experience = models.CharField(max_length=100, blank=True)
    nutritional_philosophy = models.CharField(max_length=40, blank=True)
    some_more = models.CharField(max_length=40, blank=True)
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
    title = models.CharField(max_length=40)
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


class Notification(models.Model):
    date = models.DateField(auto_now_add=True)
    title = models.CharField(max_length=40) # TODO to every TEXTFIELD add a method
    # for checking the lenght
    seen = models.BooleanField(default=False)
    sent = models.BooleanField(default=False)
    url = models.URLField(null=True, blank=True, )
    user = models.OneToOneField(User, on_delete=models.CASCADE)

# Create your models here.