from django.urls import re_path

from chat import consumers

chat_active = False
websocket_urlpatterns = [
    re_path(r'ws/(?P<chat_active>[\w-]+)/$', consumers.ChatConsumer.as_asgi()),
]
