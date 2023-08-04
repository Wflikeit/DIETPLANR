from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from .views import (ClientProfileEditView,
                    DietitianProfileEditView,
                    CreateAppointmentView,
                    ManageClientsView,
                    EditAccount,
                    Home,
                    DisplayDietitianProfile,
                    ManageCalendar)

app_name = 'panel'
urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('user/edit-profile/', ClientProfileEditView.as_view(), name='user_edit_profile'),
    path('dietitian/edit-profile/', DietitianProfileEditView.as_view(), name='edit_profile'),
    path('account/edit', EditAccount.as_view(), name='edit_account'),
    path('appointment/<slug:dietitian_slug>/', CreateAppointmentView.as_view(), name='appointment'),
    path('account/register/', EditAccount.as_view(), name='registration'),
    path('clients/', ManageClientsView.as_view(), name='show_clients'),
    path('login/', LoginView.as_view(), name='login'),  # Przekierowanie na AppLoginView dla logowania
    path('account/logout/', LogoutView.as_view(template_name='registration/logout.html'), name='logout'),
    path('dietitians/<slug:dietitian_slug>', DisplayDietitianProfile.as_view(), name='show_clients'),
    path('calendar/', ManageCalendar.as_view(), name='show_calendar'),

]
