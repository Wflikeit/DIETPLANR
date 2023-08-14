from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from panel.models import CustomUser
from ..models import Message, Conversation


class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name']


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = ['content', 'sender']
        # fields = '__all__'


class ConversationSerializer(ModelSerializer):
    messages = SerializerMethodField()
    user2_data = SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['user2', 'messages', 'user2_data']

    def get_messages(self, conversation):
        messages = Message.objects.filter(conversation=conversation)
        serializer = MessageSerializer(messages, many=True)
        return serializer.data

    def get_user2_data(self, conversation):
        user2 = conversation.user2
        user1 = conversation.user1
        current_user = self.context['request'].user
        print(f'current_user:{current_user}')
        print(f'user1:{user1}')
        print(f'user2:{user2}')

        if current_user == user2 or current_user == user1:
            if current_user == user2:
                user_data = {
                    'name': user2.full_name,
                    'photo': user2.photo.url if user2.photo else None
                }
            else:
                user_data = {
                    'name': user1.full_name,
                    'photo': user1.photo.url if user1.photo else None
                }
            return user_data
        return None  # Jeśli bieżący użytkownik nie jest uczestnikiem konwersacji, zwracamy None

