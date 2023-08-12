from django.urls import path, include

app_name = 'chat'
urlpatterns = [
    path('api/', include('chat.chat_api.urls'), name='chat_api'),
]
