from django import forms
from .models import Activity
from panel.views import ClientRequiredMixin


class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ['activity_duration', 'video',
                  'activity_date', 'title']