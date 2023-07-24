from django.contrib import admin

from .models import UserProfile, DietitianProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'age', 'date_of_birth']
    list_filter = ['age', 'age', 'date_of_birth', 'City', 'Country']


@admin.register(DietitianProfile)
class DietitianProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'age', 'date_of_birth']
    list_filter = ['age', 'age', 'date_of_birth', 'City', 'Country', 'specialty']

# Register your models here.
