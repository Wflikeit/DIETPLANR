from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from panel.models import CustomUser
from .serializers import MessageSerializer, ConversationSerializer
from ..models import Message, Conversation


class MessagesPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'


class ConversationsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class MessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    pagination_class = MessagesPagination

    def get_queryset(self):
        user_slug = self.kwargs.get('user_slug')
        user = CustomUser.objects.get(slug=user_slug)

        print(user)
        return Message.objects.filter(sender=user)


class ConversationsView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    pagination_class = ConversationsPagination
    template_name = 'chat/list.html'

    def get_queryset(self):
        user_slug = self.kwargs.get('user_slug')
        user = CustomUser.objects.get(slug=user_slug)

        print(user)
        return Conversation.objects.filter(user1=user)
