# from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, FormView
from django.shortcuts import get_object_or_404

# from django.contrib.auth.mixins import LoginRequiredMixin, \
#     PermissionRequiredMixin
# Create your views here.
from .forms import DietitianProfileForm, AppointmentForm
from .models import DietitianProfile, UserProfile


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


class UserRegistration(FormView):
    template_name = 'panel/registration.html'
    form_class = UserCreationForm

    class Meta:
        model = User  # Ustaw model, z którego ma dziedziczyć formularz
        fields = '__all__'


def create_appointment(request, dietitian_slug):
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        dietitian_profile = get_object_or_404(DietitianProfile, slug=dietitian_slug)
        user_profile = get_object_or_404(UserProfile, user=request.user)
        if form.is_valid():
            appointment = form.save(commit=False)
            # Sprawdź, czy aktualnie zalogowany użytkownik to dietetyk
            # Jeśli tak, przypisz go jako dietetyka w spotkaniu
            appointment.dietitian_profile = dietitian_profile
            appointment.user_profile = user_profile
            appointment.save()
            html = "<html><body>Appointment created</body></html>"
            return HttpResponse(html)
            # return redirect('success_page')
    else:
        form = AppointmentForm()
    return render(request, 'panel/appointment_set.html', {'form': form})

# class SetAppointment(FormView):
#     template_name = 'panel/appointment_set.html'
#     form_class = AppointmentForm
#     class Meta:
#         model = Appointment  # Ustaw model, z którego ma dziedziczyć formularz
#         fields = '__all__'
#
#
#
