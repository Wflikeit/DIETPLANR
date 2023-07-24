# from django.shortcuts import render
from django.views.generic import ListView, FormView

# from django.contrib.auth.mixins import LoginRequiredMixin, \
#     PermissionRequiredMixin
# Create your views here.
from .forms import DietitianProfileForm
from .models import DietitianProfile


def show_my_profile(request):
    pass
    # return render()


class CreateEventView(ListView):
    pass


class OwnerEditMixin:
    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)


class ManageClientsView(ListView):
    # model = Client
    template_name = 'panel/list_of_clients.html'

    def get_queryset(self):
        # TODO return only clients of current dietitian
        qs = super().get_queryset()
        # return qs.filter()


class ManageRecipesView(ListView):
    # model = Client
    template_name = 'panel/list_of_clients.html'

    def get_queryset(self):
        qs = super().get_queryset()
        # TODO return only recipes of current dietitian
        # return qs.filter()


class ManageSettings(ListView):
    # model = Client
    template_name = 'panel/list_of_clients.html'

    def get_queryset(self):
        qs = super().get_queryset()
        # TODO return only recipes of current dietitian
        # return qs.filter()


class EditProfileForm(FormView):
    template_name = 'panel/dietitian_profile_edit.html'
    form_class = DietitianProfileForm

    class Meta:
        model = DietitianProfile  # Ustaw model, z którego ma dziedziczyć formularz
        fields = '__all__'


def show_notifications(request):
    pass
