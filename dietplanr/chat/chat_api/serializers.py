from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from ..models import Message, Conversation


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = ['content']
        # fields = '__all__'


class ConversationSerializer(ModelSerializer):
    messages = SerializerMethodField()  # Dodaj to pole

    class Meta:
        model = Conversation
        fields = ['user2', 'messages']

    def get_messages(self, conversation):
        messages = Message.objects.filter(conversation=conversation)  # Pobierz wiadomości dla tej konwersacji
        serializer = MessageSerializer(messages, many=True)  # Serializuj wiadomości
        return serializer.data
