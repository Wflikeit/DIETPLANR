from panel.models import CustomUser
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

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
    messages = SerializerMethodField()  # Dodaj to pole
    user2_data = SerializerMethodField()  # Dodaj to pole

    class Meta:
        model = Conversation
        fields = ['messages', 'user2_data']

    def get_messages(self, conversation):
        messages = Message.objects.filter(conversation=conversation)
        serializer = MessageSerializer(messages, many=True)
        return serializer.data

    def get_user2_data(self, conversation):
        user2 = conversation.user2
        user1 = conversation.user1
        if self.context['request'].user == user1:
            # print('sukces')
            user_data = {
                'name': user2.full_name,
                'id': user2.id,
                'photo': user2.photo.url if user2.photo else None
            }
            return user_data
        elif self.context['request'].user == user2:
            user_data = {
                'name': user1.full_name,
                'id': user1.id,
                'photo': user1.photo.url if user1.photo else None
            }
            return user_data
        return {
            'name': "error",
            'id': "error",
            'photo': "error"
        }
