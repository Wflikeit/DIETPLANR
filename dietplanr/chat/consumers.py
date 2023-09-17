import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from panel.models import Notification, CustomUser


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        # self.room_group_name = None
        self.chat_active = None
        self.user = None
        self.user_inbox = None
        self.chat_group = 'chat'
        self.user_id = None

    async def connect(self):
        self.chat_active = self.scope['url_route']['kwargs']['chat_active']
        self.user = self.scope['user']
        self.user_id = str(self.user.id)
        # if not self.user_inbox:
        #     self.user_inbox = 'default'
        if self.chat_active:
            if self.user.is_authenticated:
                # self.user_inbox = f'inbox_{self.user.first_name}'  # new
                await self.channel_layer.group_add(self.user_id, self.channel_name)
                await self.accept()
                print('done')
        else:
            await self.close()
        # Join the group

    async def disconnect(self, close_code):
        # Leave the room group
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.user_id, self.channel_name)

    # receive message from Websocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')
        receiver_id = text_data_json.get('user_inbox')

        if not self._is_authenticated():
            return

        if message and receiver_id:
            message_data = {
                'type': 'private_message',
                'user': self.user.full_name,
                'user_id': str(self.user.id),
                'message': message
            }

            await self.channel_layer.group_send(self.user_id, message_data)
            await self.channel_layer.group_send(receiver_id, message_data)
            await self.save_notification(self.user_id, receiver_id, self.user.full_name)

    def _is_authenticated(self):
        if not self.user.is_authenticated:
            print('User is not authenticated')
            return False
        return True

    # async def save_message(self, message, receiver_id):
    # inbox_with_receiver = await self.get_conversation(receiver_id)
    #     await database_sync_to_async(Message.objects.create)(
    #         sender=self.user,
    #         content=message,
    #         is_private=True,
    #         conversation=inbox1
    #     )
    #

    async def private_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_notification(self, sender_id, receiver_id, full_name):
        Notification.objects.create(
            title=f"New message from {full_name}",
            from_user=CustomUser.objects.get(id=sender_id),
            user=CustomUser.objects.get(id=receiver_id),
            type='message'
        )

# @database_sync_to_async
# def get_conversation(self, receiver_id):
#     conversation = Conversation.objects.get(user1=self.user, user2=receiver_id)
#     return conversation
