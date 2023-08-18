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
        return DietitianProfile.get_dietitian_appointments(
            self.request.user.dietitianprofile) | ClientProfile.get_client_appointments(self.request.user.clientprofile)


class RecipesView(generics.ListCreateAPIView):
    serializer_class = PersonalizeRecipeSerializer

    # pagination_class = ConversationsPagination

    def get_queryset(self):
        recipe_id = self.kwargs.get('recipe_id')

        return Recipe.objects.filter(id=recipe_id)
