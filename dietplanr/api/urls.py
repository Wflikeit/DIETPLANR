from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import path, include

from .views import AppointmentsView, PersonalizeRecipeView, AppointmentDetailView, ClientsView
app_name = 'api'
router = DefaultRouter()
router.register(r'get-appointments', AppointmentsView, basename='appointments')

urlpatterns = [
    path('appointments/', AppointmentsView.as_view(), name='appointments-list'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointments-detail'),
    path('recipes/<int:id>/personalize/', PersonalizeRecipeView.as_view(), name='personalize-recipe'),
    path('clients/', ClientsView.as_view(), name='clients-list'),
    # path('create-appointment/', CreateAppointmentView.as_view(), name='create_appointment'),

    # path('clients/<int:id>/', ClientsDetailView.as_view(), name='clients-detail'),
    # path('clients/', ClientsView.as_view(), name='clients-list'),
]

