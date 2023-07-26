from django.urls import path
from . import views
from .views import EditProfileForm, UserRegistration

app_name = 'panel'
urlpatterns = [
    path('my-profile/', views.show_my_profile, name='show_my_profile'),
    path('dietitian_form/', EditProfileForm.as_view(), name='client_update_form'),
    path('appointment/<slug:dietitian_slug>/', views.create_appointment, name='appointment'),
    path('account/register/', UserRegistration.as_view(), name='registration'),
]