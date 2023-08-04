from django.contrib.auth import login
from django.contrib.auth.hashers import make_password
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import get_object_or_404, redirect
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView, DetailView

from dietplanr.utils import ClientRequiredMixin, DietitianRequiredMixin
# Create your views here.
from .forms import AppointmentForm, ClientProfileForm, DietitianProfileForm, UserAccountForm
from .models import DietitianProfile, CustomUser, ClientProfile, Appointment


class Home(LoginRequiredMixin, View):
    template_name = 'panel/home.html'

    def get(self, request):
        return render(request, self.template_name)


class DisplayDietitianProfile(LoginRequiredMixin, DetailView):
    template_name = 'panel/dietitian_profile.html'
    context_object_name = 'dietitian'

    def get_object(self, queryset=None):
        profile_slug = self.kwargs.get('dietitian_slug')
        profile_account = get_object_or_404(CustomUser, slug=profile_slug)
        dietitian_profile = get_object_or_404(DietitianProfile, user=profile_account)
        return dietitian_profile

    def get_clients_and_appointments(self, dietitian_profile):
        clients = ClientProfile.objects.filter(dietitian=dietitian_profile)
        appointments = Appointment.objects.filter(dietitian_profile=dietitian_profile)
        return clients, appointments

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        dietitian_profile = self.get_object()
        clients, appointments = self.get_clients_and_appointments(dietitian_profile)

        context.update(dietitian_profile.user.get_user_data())
        context['appointments'] = appointments
        context['clients'] = clients
        context['dietitian_profile'] = dietitian_profile
        return context


class CreateEventView(ListView):
    pass


class OwnerEditMixin:
    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)


class ManageRecipesView(ListView):
    # model = Client
    template_name = 'panel/dietitian_panel.html'

    def get_queryset(self):
        qs = super().get_queryset()
        # TODO return only recipes of current dietitian
        # return qs.filter()


class ManageSettings(ListView):
    # model = Client
    template_name = 'panel/dietitian_panel.html'

    def get_queryset(self):
        qs = super().get_queryset()
        # TODO return only recipes of current dietitian
        # return qs.filter()


def show_notifications(request):
    pass


class EditAccount(View):
    template_name = 'panel/registration.html'
    form_class = UserAccountForm

    def get(self, request):
        if request.user.is_authenticated:
            form = self.form_class(instance=request.user)
        else:
            form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.password = make_password(form.cleaned_data['password'])  # Haszowanie hasła
            user.save()

            if user:
                login(request, user)
                print('Użytkownik zalogowany:')
                redirect('panel:home')

        return render(request, self.template_name, {'form': form})


class ClientProfileEditView(ClientRequiredMixin, View):
    form_class = ClientProfileForm
    template_name = 'panel/user_profile_edit.html'

    def get_client_profile(self):
        return get_object_or_404(ClientProfile, user=self.request.user)

    def get(self, request):
        print('Zalogowany użytkownik:', request.user)
        client_profile = self.get_client_profile()
        form = self.form_class(instance=client_profile)
        return render(request, self.template_name, {'form': form})

    def save_form(self, form):
        client_profile = self.get_client_profile()
        if form.is_valid():
            form.save()
            return True
        return False

    def post(self, request):
        form = self.form_class(request.POST, instance=self.get_client_profile())
        if self.save_form(form):
            return redirect('panel:home')
        return render(request, self.template_name, {'form': form})


class CreateAppointmentView(View):
    def get(self, request, dietitian_slug):
        if dietitian_slug:
            dietitian_account = get_object_or_404(CustomUser, slug=dietitian_slug)
            dietitian_profile = DietitianProfile.objects.filter(user=dietitian_account).first()
            if dietitian_profile is not None and dietitian_account.is_dietitian:
                form = AppointmentForm()
                return render(request, 'panel/appointment_set.html', {'form': form})
        return HttpResponseNotFound("Użytkownik nie jest dietetykiem.")

    def post(self, request, dietitian_slug):
        form = AppointmentForm(request.POST)
        dietitian_account = get_object_or_404(CustomUser, slug=dietitian_slug)
        dietitian_profile = get_object_or_404(DietitianProfile, user=dietitian_account)
        user_profile = request.user
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.dietitian_profile = dietitian_profile
            appointment.user_profile = user_profile
            appointment.save()
            return HttpResponse("<html><body>Spotkanie utworzone</body></html>")
        return render(request, 'panel/appointment_set.html', {'form': form})


class DietitianProfileEditView(DietitianRequiredMixin, View):
    form_class = DietitianProfileForm

    def get(self, request):
        dietitian_profile = DietitianProfile.objects.get(user=request.user)
        form = self.form_class(instance=dietitian_profile)
        return render(request, 'panel/dietitian_profile_edit.html', {'form': form})

    def post(self, request):
        dietitian_profile = get_object_or_404(DietitianProfile, user=request.user)
        form = DietitianProfileForm(request.POST, instance=dietitian_profile)
        if form.is_valid():
            form.save()
            print('saceeeeee')
            return redirect('panel:home')
        return render(request, 'panel/dietitian_profile_edit.html', {'form': form})


class ManageClientsView(DietitianRequiredMixin, ListView):
    model = ClientProfile
    template_name = 'panel/dietitian_panel.html'
    context_object_name = 'clients'

    def get_queryset(self):
        qs = super().get_queryset()
        dietitian_profile = get_object_or_404(DietitianProfile, user=self.request.user)
        return qs.filter(dietitian=dietitian_profile)


class CalendarAppointmentsMixin:
    def get_appointments(self, user):
        if hasattr(user, 'dietitianprofile'):
            dietitian_profile = user.dietitianprofile
            return dietitian_profile.get_dietitian_appointments()

        else:
            return user.get_user_appointments()


class ManageCalendar(LoginRequiredMixin, ListView, CalendarAppointmentsMixin):
    template_name = 'panel/calendar.html'  # Zastąp 'twoj_szablon.html' odpowiednią nazwą szablonu
    context_object_name = 'appointments'  # Zmieniona nazwa zmiennej w kontekście

    def get_queryset(self):
        return self.get_appointments(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user

        if hasattr(user, 'dietitianprofile'):
            dietitian_profile = user.dietitianprofile
            context.update(dietitian_profile.user.get_user_data())
            context['dietitian_profile'] = dietitian_profile

        return context
