import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q

from chat.models import Conversation


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        # self.room_group_name = None
        self.chat_active = None
        self.user = None
        self.user_conversations = []
        self.chat_group = 'chat'

    async def connect(self):
        self.chat_active = self.scope['url_route']['kwargs']['chat_active']
        self.user = self.scope['user']

        # if not self.user_inbox:
        #     self.user_inbox = 'default'
        if self.chat_active:
            if self.user.is_authenticated:
                # self.user_inbox = f'inbox_{self.user.first_name}'  # new
                # self.user_conversations = await self.get_conversations()  # Poczekaj na zakończenie operacji
                # self.user_conversations = await self.get_conversations()  # Poczekaj na zakończenie operacji
                # self.user_inbox = f'inbox_{self.user.first_name}'  # new
                # print(self.user_conversations)
                # self.user_conversations = await self.get_conversations()

                self.user_conversations = await self.get_conversations()  # Poprawione to miejsce
                await self.print_conversations()
                await self.channel_layer.group_add(self.chat_group, self.channel_name)
                await self.accept()
                print('done')
        else:
            await self.close()
        # Join the group

    async def disconnect(self, close_code):
        # Leave the room group
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.chat_group, self.channel_name)

    # receive message from Websocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        print(self.user)
        # print(self.user_conversations)

        if not self.user.is_authenticated:  # new
            print('dupa')
            return  # new

        message = text_data_json.get('message')
        receiver_id = text_data_json.get('user_inbox')
        if message and receiver_id:
            # await self.save_message(message=message,
            #                         receiver_id=receiver_id)
            iddd = str(self.user.id)
            await self.channel_layer.group_send(
                self.chat_group, {'type': 'chat_message',
                                  'user': iddd,
                                  'message': message}
            )

    async def chat_message(self, event):
        # message = event['message']
        # send message to Websocket
        # await self.send(text_data=json.dumps({'message': message}))
        await self.send(text_data=json.dumps(event))

    # @database_sync_to_async
    # def get_conversations(self):
    #     conversation = Conversation.objects.filter(Q(user1=self.user) | Q(user2=self.user))
    #     # conversation = Conversation.objects.filter(user1=self.user)
    #     return list(conversation)
    # @database_sync_to_async
    # def get_conversations(self):
    #     conversation = Conversation.objects.filter(Q(user1=self.user) | Q(user2=self.user))
    #     return list(conversation)
    @database_sync_to_async
    def get_conversations(self):
        # conversation = Conversation.objects.filter(Q(user1=self.user) | Q(user2=self.user))
        conversation = Conversation.objects.filter(user1=self.user)
        return list(conversation)

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))
    async def print_conversations(self):
        print(self.user_conversations)

        # async def save_message(self, message, receiver_id):
        #     inbox_with_receiver = await self.get_conversation(receiver_id)
        #     await database_sync_to_async(Message.objects.create)(
        #         sender=self.user,
        #         content=message,
        #         is_private=True,
        #         conversation=inbox1
        #     )
        #
        # @database_sync_to_async
        # def get_conversation(self, receiver_id):
        #     conversation = Conversation.objects.get(user1=self.user, user2=receiver_id)
        #     return conversation
# if message.startswith('/pm '):
#     split = message.split(' ', 2)
#     target = split[1]
#     target_msg = split[2]
#
#     # send private message to the target
#     await self.channel_layer.group_send(
#         f'inbox_{target}',
#         {
#             'type': 'private_message',
#             'user': self.user.first_name,
#             'message': target_msg,
#         }
#     )
#     # send private message delivered to the user
#     await self.send(json.dumps({
#         'type': 'private_message_delivered',
#         'target': target,
#         'message': target_msg,
#     }))
#     # await self.save_message(message)
#     return

# await self.save_message(message)
# send message to room group

