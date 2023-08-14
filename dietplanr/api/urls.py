from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import path, include

from .views import AppointmentsView

router = DefaultRouter()
router.register(r'get-appointments', AppointmentsView, basename='appointments')

urlpatterns = [
    path('get-appointments/<slug:user_slug>/<int:offset>/', AppointmentsView.as_view(), name='get_appointments'),
]