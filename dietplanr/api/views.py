from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from panel.models import DietitianProfile, ClientProfile
from recipes.models import Recipe
from .serializers import AppointmentSerializer, PersonalizeRecipeSerializer


class ConversationsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class AppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer

    # pagination_class = ConversationsPagination

    def get_queryset(self):
        user1 = DietitianProfile.objects.get(user=self.request.user)
        user2 = ClientProfile.objects.get(user=self.request.user)
        if user1: return user1.get_dietitian_appointments()
        if user2: return user2.get_client_appointments()


class RecipesView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PersonalizeRecipeSerializer
    lookup_field = 'id'

    # pagination_class = ConversationsPagination

    def get_queryset(self):
        recipe_id = self.kwargs.get('id')

        return Recipe.objects.filter(id=recipe_id)
