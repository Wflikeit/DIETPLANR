from django.contrib import admin

from .models import UserProfile, DietitianProfile, Appointment


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'age', 'date_of_birth']
    list_filter = ['age', 'date_of_birth', 'City', 'Country']


@admin.register(DietitianProfile)
class DietitianProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'age', 'date_of_birth']
    list_filter = ['age', 'date_of_birth',
                   'City', 'Country', 'specialty']


@admin.register(Appointment)
class DietitianProfileAdmin(admin.ModelAdmin):
    list_display = ['title', 'dietitian_profile', 'user_profile', 'published_time',
                    'event_duration']

    list_filter = ['title', 'dietitian_profile', 'user_profile', 'published_time',
                   'event_duration']
# @admin.register(DietitianProfile)
# class DietitianProfileAdmin(admin.ModelAdmin):
#     list_display = ['full_name', 'age', 'date_of_birth']
#     list_filter = ['age', 'age', 'date_of_birth',
#                    'City', 'Country', 'specialty']

# Register your models here.
