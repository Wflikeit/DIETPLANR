from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from panel.models import CustomUser, DietitianProfile, ClientProfile
from .serializers import AppointmentSerializer


class ConversationsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class AppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    # pagination_class = ConversationsPagination

    def get_queryset(self):
        user_slug = self.kwargs.get('user_slug')
        user = CustomUser.objects.get(slug=user_slug)

        print(user)

        return DietitianProfile.get_dietitian_appointments(
            user.dietitianprofile) | ClientProfile.get_client_appointments(user.clientprofile)
