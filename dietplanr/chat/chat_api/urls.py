from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import path, include

from .views import MessagesView, ConversationsView

router = DefaultRouter()
router.register(r'get-messages', MessagesView, basename='messages')
router.register(r'get-conversations', ConversationsView, basename='conversations')

urlpatterns = [
    path('get-messages/<slug:user_slug>/<int:offset>/', MessagesView.as_view(), name='get-messages'),
    path('get-conversations/<slug:user_slug>/<int:offset>/', ConversationsView.as_view(), name='get-conversations'),
]
