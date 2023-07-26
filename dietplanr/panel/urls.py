from django.urls import path
from . import views
from .views import EditProfileForm, UserRegistration, CreateAppointmentView

app_name = 'panel'
urlpatterns = [
    path('my-profile/', views.show_my_profile, name='show_my_profile'),
    path('user/edit-profile/', EditProfileForm.as_view(), name='client_update_form'),
    path('edit-profile/', EditProfileForm.as_view(), name='client_update_form'),
    path('appointment/<slug:dietitian_slug>/', CreateAppointmentView.as_view(), name='appointment'),
    path('account/register/', UserRegistration.as_view(), name='registration'),
]