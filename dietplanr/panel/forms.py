from django import forms
from django.contrib.auth.models import User

from .models import DietitianProfile, ClientProfile, Appointment, CustomUser
from django.conf import settings


class ClientProfileForm(forms.ModelForm):
    class Meta:
        model = ClientProfile
        fields = ['age', 'dietitian']


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
    # password = forms.CharField(label='Password',
    #                            widget=forms.PasswordInput)
    # password2 = forms.CharField(label='Password',
    #                             widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name',
                  'is_active', 'is_staff', 'is_dietitian',
                  'is_client', 'gender', 'City', 'Country',
                  'photo', 'slug', 'full_name', 'date_of_birth']
    # 'password', 'password2'
    # def clean_password2(self):
    #     cd = self.cleaned_data
    #     if cd['password'] != cd['password2']:
    #         raise forms.ValidationError('Password don\'t match.')
    #     return cd['password2']
    #
    # def clean_email(self):
    #     data = self.cleaned_data['email']
    #     if User.objects.filter(email=data).exists():
    #         raise forms.ValidationError('Email already in use')
    #     return data
