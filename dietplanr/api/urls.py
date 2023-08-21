from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import path, include

from .views import AppointmentsView, RecipesView
app_name = 'api'
router = DefaultRouter()
router.register(r'get-appointments', AppointmentsView, basename='appointments')

urlpatterns = [
    path('get-appointments', AppointmentsView.as_view(), name='get_appointments'),
    path('personalise-reicipe/<int:id>', RecipesView.as_view(), name='personalize_recipes'),
]