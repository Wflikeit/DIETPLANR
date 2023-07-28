# from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.http import HttpResponse, HttpResponseNotFound, Http404
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView

# from django.contrib.auth.mixins import LoginRequiredMixin, \
#     PermissionRequiredMixin
# Create your views here.
from .forms import AppointmentForm, ClientProfileForm, DietitianProfileForm, UserAccountForm
from .models import DietitianProfile, CustomUser, ClientProfile


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


def show_notifications(request):
    pass


class UserRegistration(View):
    template_name = 'panel/registration.html'
    form_class = UserCreationForm

    def get(self, request):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save()
            html = "<html><body>Użytkownik zarejestrowany</body></html>"
            return HttpResponse(html)
        else:
            return render(request, self.template_name, {'form': form})


class DietitianRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            dietitian_slug = self.kwargs.get('dietitian_slug')
            if dietitian_slug:
                dietitian_account = get_object_or_404(CustomUser, slug=dietitian_slug)
                dietitian_profile = DietitianProfile.objects.filter(user=dietitian_account).first()
                return dietitian_profile is not None and self.request.user.is_dietitian
        return False


def get_profile_or_404(request, profile_slug, is_dietitian=False, is_client=False):
    user = get_object_or_404(CustomUser, slug=profile_slug, is_dietitian=is_dietitian, is_client=is_client)
    if user == request.user:
        return user
    else:
        raise Http404("Użytkownik nie ma uprawnień do edycji tego profilu.")


class ClientRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            client_account = self.request.user
            client_profile = ClientProfile.objects.filter(user=client_account)
            return client_profile is not None and self.request.user.is_client


class CreateAppointmentView(ClientRequiredMixin, View):
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


class ClientProfileEditView(ClientRequiredMixin, View):
    form_class = ClientProfileForm

    def get(self, request, profile_slug):
        client_account = get_profile_or_404(request, profile_slug, is_client=True)
        client_profile = get_object_or_404(ClientProfile, user=client_account)
        form = self.form_class(instance=client_profile)
        return render(request, 'panel/user_profile_edit.html', {'form': form})

    def post(self, request, profile_slug):
        client_profile = get_object_or_404(ClientProfile, user=request.user)
        form = ClientProfileForm(request.POST, instance=client_profile)
        if form.is_valid():
            form.save()
            html = "<html><body>Spotkanie utworzone</body></html>"
            return HttpResponse(html)
        return render(request, 'panel/user_profile_edit.html', {'form': form})


class DietitianProfileEditView(DietitianRequiredMixin, View):
    form_class = DietitianProfileForm

    def get(self, request, profile_slug):
        dietitian_account = get_profile_or_404(request, profile_slug,
                                               is_dietitian=True)
        dietitian_profile = get_object_or_404(DietitianProfile, user=dietitian_account)
        form = self.form_class(instance=dietitian_profile)
        return render(request, 'panel/dietitian_profile_edit.html', {'form': form})


    def post(self, request, profile_slug):
        dietitian_profile = get_object_or_404(DietitianProfile, user=request.user)
        form = DietitianProfileForm(request.POST, instance=dietitian_profile)
        if form.is_valid():
            form.save()
            html = "<html><body>Spotkanie utworzone</body></html>"
            return HttpResponse(html)
        return render(request, 'panel/dietitian_profile_edit.html', {'form': form})


class CustomUserEditView(LoginRequiredMixin, View):
    form_class = UserAccountForm

    def get(self, request, account_slug):
        account = get_object_or_404(CustomUser, slug=account_slug)
        if account == request.user:
            form = self.form_class(instance=account)
            return render(request, 'panel/user_profile_edit.html', {'form': form})
        return HttpResponse("<html><body>Zjebales</body></html>")

    def post(self, request, account_slug):
        account = get_object_or_404(CustomUser, slug=account_slug)
        form = UserAccountForm(request.POST, instance=account)
        if form.is_valid():
            form.save()
            html = "<html><body>Spotkanie utworzone</body></html>"
            return HttpResponse(html)
        return render(request, 'panel/user_profile_edit.html', {'form': form})
