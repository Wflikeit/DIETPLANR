from panel.models import DietitianProfile, ClientProfile, Appointment
from recipes.models import Recipe
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from .serializers import AppointmentSerializer, PersonalizeRecipeSerializer, ClientsSerializer, NotificationsSerializer


class ConversationsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class AppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer

    # pagination_class = ConversationsPagination

    def get_queryset(self):
        print(self.request.user)

        try:
            user1 = DietitianProfile.objects.get(user=self.request.user)
            if user1: return user1.get_dietitian_appointments()
        except DietitianProfile.DoesNotExist:
            user2 = ClientProfile.objects.get(user=self.request.user)
            if user2: return user2.get_client_appointments()
        return []

class PersonalizeRecipeView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PersonalizeRecipeSerializer
    lookup_field = 'id'

    # pagination_class = ConversationsPagination

    def get_queryset(self):
        recipe_id = self.kwargs.get('id')

        return Recipe.objects.filter(id=recipe_id)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'pk'
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        appointment_id = self.kwargs.get('id')
        return Appointment.objects.filter(id=appointment_id)


class ClientsView(generics.ListAPIView):
    serializer_class = ClientsSerializer

    def get_queryset(self):
        return DietitianProfile.get_clients(self.request.user.dietitianprofile)


class NotificationsView(generics.ListAPIView):
    serializer_class = NotificationsSerializer

    def get_queryset(self):
        return self.request.user.get_user_notification()
