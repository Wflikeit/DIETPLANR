from rest_framework.serializers import ModelSerializer

from panel.models import Appointment
from recipes.models import Recipe


class AppointmentSerializer(ModelSerializer):
    class Meta:
        model = Appointment
        # fields = ['content', 'sender']
        fields = '__all__'


class PersonalizeRecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['instructions', 'cheap', 'dairyFree',
                  'ketogenic', 'vegan', 'vegetarian', 'summary',
                  'finished', 'is_personalised', 'title',
                  'assigned_to', 'ingredients', 'macros']
