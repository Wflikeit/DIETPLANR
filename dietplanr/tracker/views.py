from django.shortcuts import render
from django.views.generic import ListView, FormView
from .forms import ActivityForm
from .models import Activity


class RegisterActivity(FormView):
    template_name = 'tracker/activity_register_form.html'
    form_class = ActivityForm

    # def __xor__(self, other):

    class Meta:
        model = Activity  # Ustaw model, z którego ma dziedziczyć formularz
        fields = '__all__'
# Create your views here.
