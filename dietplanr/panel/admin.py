from django.contrib import admin

from .models import ClientProfile, DietitianProfile, Appointment, CustomUser


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ['age', 'dietitian']
    list_filter = ['age', 'dietitian']


@admin.register(DietitianProfile)
class DietitianProfileAdmin(admin.ModelAdmin):
    list_display = ['get_full_name', 'specialty', 'experience', 'nutritional_philosophy', 'some_more']

    list_filter = ['user', 'specialty',
                   'experience', 'nutritional_philosophy',
                   'some_more']

    def get_full_name(self, obj):
        return obj.user.full_name

    get_full_name.short_description = 'Full Name'


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'dietitian_profile', 'user_profile', 'published_time',
                    'event_duration']

    list_filter = ['title', 'dietitian_profile', 'user_profile', 'published_time',
                   'event_duration']


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name',
                    'is_active', 'is_staff', 'is_dietitian',
                    'is_client']
    list_filter = ['email', 'first_name', 'last_name',
                   'is_active', 'is_staff', 'is_dietitian',
                   'is_client']

# Register your models here.
