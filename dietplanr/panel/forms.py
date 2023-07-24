from django.forms import ModelForm

from .models import DietitianProfile, UserProfile


class UserProfileForm(ModelForm):
    class Meta:
        model = UserProfile
        fields = ['date_of_birth', 'photo', 'full_name',
                  'age', 'gender', 'City', 'Country']


class DietitianProfileForm(ModelForm):
    class Meta:
        model = DietitianProfile
        fields = ['date_of_birth', 'photo', 'full_name',
                  'age', 'gender', 'City', 'Country']

