import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        # self.room_group_name = None
        self.chat_active = None
        self.user = None
        self.user_inbox = None

    async def connect(self):
        self.chat_active = self.scope['url_route']['kwargs']['chat_active']
        self.user = self.scope['user']
        if not self.user_inbox:
            self.user_inbox = 'default'
        if self.chat_active:
            if self.user.is_authenticated:
                self.user_inbox = f'inbox_{self.user.first_name}'  # new
                await self.channel_layer.group_add(self.user_inbox, self.channel_name)
                await self.accept()
                print('done')
        else:
            await self.close()
        # Join the group

    async def disconnect(self, close_code):
        # Leave the room group
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.user_inbox, self.channel_name)

    # receive message from Websocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print(self.user)

        if not self.user.is_authenticated:  # new
            print('dupa')
            return  # new
        if message.startswith('/pm '):
            split = message.split(' ', 2)
            target = split[1]
            target_msg = split[2]

            # send private message to the target
            await self.channel_layer.group_send(
                f'inbox_{target}',
                {
                    'type': 'private_message',
                    'user': self.user.first_name,
                    'message': target_msg,
                }
            )
            # send private message delivered to the user
            await self.send(json.dumps({
                'type': 'private_message_delivered',
                'target': target,
                'message': target_msg,
            }))
            # await self.save_message(message)
            return

        # await self.save_message(message)
        # send message to room group
        await self.channel_layer.group_send(
            self.user_inbox, {'type': 'chat_message',
                              'user': self.user.first_name,
                              'message': message}
        )

    async def chat_message(self, event):
        # message = event['message']
        # send message to Websocket
        # await self.send(text_data=json.dumps({'message': message}))
        await self.send(text_data=json.dumps(event))

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))
