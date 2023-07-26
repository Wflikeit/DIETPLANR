from django import forms
from django.contrib.auth.models import User

from .models import DietitianProfile, UserProfile, Appointment


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['date_of_birth', 'photo', 'full_name',
                  'age', 'gender', 'City', 'Country']


class DietitianProfileForm(forms.ModelForm):
    class Meta:
        model = DietitianProfile
        fields = ['date_of_birth', 'photo', 'full_name',
                  'age', 'gender', 'City', 'Country']


class AppointmentForm(forms.ModelForm):

    class Meta:
        model = Appointment
        fields = ['title', 'event_duration',
                  'date']
    # def clean_data(self):
    #     cd = self.cleaned_data[]


class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label='Password',
                               widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password',
                                widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'email']

    def clean_password2(self):
        cd = self.cleaned_data
        if cd['password'] != cd['password2']:
            raise forms.ValidationError('Password don\'t match.')
        return cd['password2']

    def clean_email(self):
        data = self.cleaned_data['email']
        if User.objects.filter(email=data).exists():
            raise forms.ValidationError('Email already in use')
        return data

