from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import path, include

from .views import AppointmentsView, PersonalizeRecipeView, AppointmentDetailView,\
    ClientsView, NotificationsView, MyProfileView, MakeAppointmentView
app_name = 'api'

urlpatterns = [
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointments-detail'),

    path('appointments/', AppointmentsView.as_view(), name='appointments-list'),
    path('recipes/<int:id>/personalize/', PersonalizeRecipeView.as_view(), name='personalize-recipe'),
    path('clients/', ClientsView.as_view(), name='clients-list'),
    path('notifications/', NotificationsView.as_view(), name='notification-list'),
    path('notifications/<int:id>', ClientsView.as_view(), name='notification-details'),
    path('my-profile/', MyProfileView.as_view(), name='notification-details'),

    path('create-appointment/', MakeAppointmentView.as_view(), name='create_appointment'),

    # path('clients/<int:id>/', ClientsDetailView.as_view(), name='clients-detail'),
    # path('clients/', ClientsView.as_view(), name='clients-list'),
]

