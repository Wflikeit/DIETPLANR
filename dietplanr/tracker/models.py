from django.db import models
from django.utils.timezone import now
from panel.models import UserProfile


class Activity(models.Model):
    ACTIVITY_CHOICES = [
        ('running', 'Running'),
        ('riding_on_bike', 'Cycling'),
        ('swimming', 'Swimming'),
        ('walking', 'Walking'),
        ('fitness', 'Fitness'),
        ('gymnastics', 'Gymnastics'),
        ('yoga', 'Yoga'),
        ('strength training', 'Strength training'),
        ('dance', 'Dance'),
        ('skipping', 'Skipping'),
        # Add other activities that interest you
    ]
    activity_duration = models.PositiveSmallIntegerField(default=15)
    video = models.URLField(null=True, unique=True)
    activity_date = models.DateField(unique=True, default=now)
    title = models.TextField(unique_for_date=activity_date,
                             max_length=40, choices=ACTIVITY_CHOICES)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

# Create your models here.
