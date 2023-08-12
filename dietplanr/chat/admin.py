from django.contrib import admin

from .models import Conversation, Message


@admin.register(Conversation)
class RoomAdminRegister(admin.ModelAdmin):
    pass


@admin.register(Message)
class MessageAdminRegister(admin.ModelAdmin):
    pass
# Register your models here.
