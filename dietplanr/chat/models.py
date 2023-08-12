from django.db import models

from panel.models import CustomUser


class Conversation(models.Model):
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='conversations_as_user1')
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='conversations_as_user2')

    def __str__(self):
        return f'{self.user1} +  {self.user2} chat'


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, null=True)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_private = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.sender.first_name}: {self.content} [{self.timestamp}]'

    def get_content(self):
        return self.content
# class PrivateChat
# Create your models here.
