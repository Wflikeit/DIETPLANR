from rest_framework.serializers import ModelSerializer

from panel.models import Appointment


class AppointmentSerializer(ModelSerializer):
    class Meta:
        model = Appointment
        # fields = ['content', 'sender']
        fields = '__all__'
