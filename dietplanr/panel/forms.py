from django import forms
from django.contrib.auth.models import User

from .models import DietitianProfile, ClientProfile, Appointment, CustomUser
from django.conf import settings


class ClientProfileForm(forms.ModelForm):
    class Meta:
        model = ClientProfile
        fields = ['dietitian']


class DietitianProfileForm(forms.ModelForm):
    class Meta:
        model = DietitianProfile
        fields = ['user', 'specialty',
                  'experience', 'nutritional_philosophy',
                  'some_more']


class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['title', 'event_duration',
                  'date']
    # def clean_data(self):
    #     cd = self.cleaned_data[]


class UserAccountForm(forms.ModelForm):
    age = forms.IntegerField(label='Age', required=False, initial=None)  # Dodaj pole "age" do formularza

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name',
                  'is_dietitian', 'is_client', 'gender',
                  'City', 'Country', 'photo', 'full_name',
                  'date_of_birth']

    def save_age(self, user):  # Metoda do zapisywania wartości "age" w modelu ClientProfile
        age = self.cleaned_data.get('age')
        if age:
            client_profile, created = ClientProfile.objects.get_or_create(user=user)
            client_profile.age = age
            client_profile.save()

    # def clean_date_of_birth(self):
    #     cleaned_data = super().clean()
    #     date_of_birth = cleaned_data.get('date_of_birth')
    #     if date_of_birth and date_of_birth >= timezone.now().date():
    #         raise ValidationError('Data urodzin nie może być w przyszłości.')
    #     return date_of_birth
