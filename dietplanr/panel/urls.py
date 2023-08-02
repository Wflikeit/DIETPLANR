from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from . import views
from .views import (ClientProfileEditView,
                    DietitianProfileEditView,
                    CreateAppointmentView,
                    ManageClientsView,
                    EditAccount)

app_name = 'panel'
urlpatterns = [
    path('', views.show_my_profile, name='home'),
    path('user/edit-profile/', ClientProfileEditView.as_view(), name='user_edit_profile'),
    path('dietitian/edit-profile/', DietitianProfileEditView.as_view(), name='edit_profile'),
    path('account/edit', EditAccount.as_view(), name='edit_account'),
    path('appointment/<slug:dietitian_slug>/', CreateAppointmentView.as_view(), name='appointment'),
    path('account/register/', EditAccount.as_view(), name='registration'),
    path('clients/', ManageClientsView.as_view(), name='show_clients'),
    path('login/', LoginView.as_view(), name='login'),  # Przekierowanie na AppLoginView dla logowania
    path('account/logout/', LogoutView.as_view(template_name='registration/logout.html'), name='logout'),

]
