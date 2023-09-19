from panel.models import DietitianProfile, ClientProfile, Appointment
from recipes.models import Recipe
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .serializers import AppointmentSerializer, PersonalizeRecipeSerializer, \
    ClientsSerializer, NotificationsSerializer, \
    ClientProfileSerializer, DietitianProfileSerializer, MakeAppointmentSerializer


class ConversationsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class AppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer

    # pagination_class = ConversationsPagination

    def get_queryset(self):
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

    def get_object(self):
        appointment_id = self.kwargs.get('pk')
        l = Appointment.objects.get(id=appointment_id)
        return l


class ClientsView(generics.ListAPIView):
    serializer_class = ClientsSerializer

    def get_queryset(self):
        return DietitianProfile.get_clients(self.request.user.dietitianprofile)


class NotificationsView(generics.ListAPIView):
    serializer_class = NotificationsSerializer

    def get_queryset(self):
        return self.request.user.get_user_notification()


class MyProfileView(generics.RetrieveUpdateDestroyAPIView):

    def get_serializer_class(self):
        if self.request.user.is_dietitian:
            return DietitianProfileSerializer
        else:
            return ClientProfileSerializer

    def get_object(self):
        # Pobierz zalogowanego użytkownika
        user = self.request.user
        if user.is_dietitian:
            try:
                profile = DietitianProfile.objects.get(user=user)
                return profile
            except DietitianProfile.DoesNotExist:
                print('Brak profilu dietetyka')
        else:
            try:
                profile = ClientProfile.objects.get(user=user)
                return profile
            except ClientProfile.DoesNotExist:
                print('Brak profilu klienta')
        return None


class MakeAppointmentView(generics.CreateAPIView):
    serializer_class = MakeAppointmentSerializer

    def perform_create(self, serializer):
        dietitian_profile_id = self.request.data.get('dietitian_profile_id')
        if self.request.user.is_dietitian:
            serializer.save(dietitian_profile_id=dietitian_profile_id)
        else:
            return Response({'detail': 'You do not have permission to assign a dietitian.'},
                            status=status.HTTP_403_FORBIDDEN)
