from panel.models import Appointment, ClientProfile
from recipes.models import Recipe
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer


class AppointmentSerializer(ModelSerializer):
    user2_data = SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ['user2_data', 'date', 'event_duration', 'title']
        # fields = 'all'

    def get_user2_data(self, appointment):
        user2 = appointment.user_profile
        user1 = appointment.dietitian_profile.user
        if self.context['request'].user == user1:
            user_data = {
                'name': user2.full_name,
                'id': user2.id,
            }
            return user_data
        elif self.context['request'].user == user2:
            user_data = {
                'name': user1.full_name,
                'id': user1.id,
            }
            return user_data
        return {
            'name': "error",
            'id': "error",
        }


class PersonalizeRecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['instructions', 'cheap', 'dairyFree',
                  'ketogenic', 'vegan', 'vegetarian', 'summary',
                  'finished', 'is_personalised', 'title',
                  'assigned_to', 'ingredients', 'macros']


class ClientsSerializer(ModelSerializer):
    client_data = SerializerMethodField()

    class Meta:
        model = ClientProfile
        fields = ["client_data", ]

    def get_client_data(self, client_profile):
        user_data = client_profile.user.get_user_data()
        return user_data
