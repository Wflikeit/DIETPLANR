from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import path

from .views import MessagesView

router = DefaultRouter()

urlpatterns = [
    path('get-messages/<slug:user_slug>/<int:offset>', MessagesView.as_view()),
    path('get-messages', MessagesView.as_view()),

]
