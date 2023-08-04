from django.views.generic import View
from .forms import ActivityForm
from panel.views import ClientRequiredMixin
from django.views.generic import View

from panel.views import ClientRequiredMixin
from .forms import ActivityForm


class RegisterActivity(ClientRequiredMixin, View):
    template_name = 'tracker/activity_register.html'
    form_class = ActivityForm

    def get(self, request, *args, **kwargs):

        pass

    def post(self, request, *args, **kwargs):
        pass

# Create your views here.
