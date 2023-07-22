from django.urls import path
from . import views

app_name = 'panel'
urlpatterns = [
    path('my-profile/', views.show_my_profile())
]
