from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from panel.models import CustomUser
from .serializers import MessageSerializer
from ..models import Message


class MessagesPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'


class MessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    pagination_class = MessagesPagination

    def get_queryset(self):
        user_slug = self.kwargs.get('user_slug')
        user = CustomUser.objects.get(slug=user_slug)

        print(user)
        return Message.objects.filter(sender=user)
