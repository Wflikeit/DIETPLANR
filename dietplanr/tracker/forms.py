from django import forms
from .models import Activity


class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ['activity_duration', 'video',
                  'activity_date', 'title',
                  'user_profile']