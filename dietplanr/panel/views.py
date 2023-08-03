from django.contrib.auth import login
from django.contrib.auth.hashers import make_password
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import get_object_or_404, redirect
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView

# Create your views here.
from .forms import AppointmentForm, ClientProfileForm, DietitianProfileForm, UserAccountForm
from .models import DietitianProfile, CustomUser, ClientProfile


def get_proper_template(request, dietitian_template, client_template, dietitan_required, client_required):
    dietitian_mixin = DietitianRequiredMixin()
    client_mixin = ClientRequiredMixin()
    if dietitan_required:
        dietitian_mixin.test_func()
    if dietitan_required:
        dietitian_mixin.test_func()

    if request.user.is_dietitian and not request.user.is_client:
        return render(request, dietitian_template, {'username': request.user.first_name})
    elif request.user.is_client and not request.user.is_dietitian:
        return render(request, client_template, {'username': request.user.first_name})
    else:
        return render(request, 'panel/user_account_edit.html', {'username': request.user.first_name})


class Home(LoginRequiredMixin, View):
    def get(self, request):
        return get_proper_template(request,
                                   dietitian_template='panel/client_home.html',
                                   client_template='panel/dietitian_home.html',
                                   profile_required=False)


class CreateEventView(ListView):
    pass


class OwnerEditMixin:
    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)


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


class DietitianRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_dietitian and not self.request.user.is_client:
            try:
                dietitian_profile = DietitianProfile.objects.get(user=self.request.user)
                return True
            except DietitianProfile.DoesNotExist:
                return False
        return False

    def handle_no_permission(self):
        print('Użytkownik nie ma profilu klienta.')
        print(self.request.user.id)
        dietitian_profile = ClientProfile.objects.create(user=self.request.user)
        if dietitian_profile:
            return redirect("panel:client_update_form")
        return redirect('panel:home')


# def get_account_or_404(request, profile_slug, is_dietitian=False, is_client=False):

class ClientRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_client and not self.request.user.is_dietitian:
            try:
                # Sprawdzamy, czy użytkownik ma profil klienta
                client_profile = ClientProfile.objects.get(user=self.request.user)
                return True
            except ClientProfile.DoesNotExist:
                return False
        return False

    def handle_no_permission(self):
        print('Użytkownik nie ma profilu klienta.')
        print(self.request.user.id)
        client_profile = ClientProfile.objects.create(user=self.request.user)
        if client_profile:
            redirect("panel:user_edit_profile")
        return redirect('panel:home')


class ClientProfileEditView(ClientRequiredMixin, View):
    form_class = ClientProfileForm

    def get(self, request):
        print('Zalogowany użytkownik:', request.user)
        client_profile = ClientProfile.objects.get(user=self.request.user)
        form = self.form_class(instance=client_profile)
        return render(request, 'panel/user_profile_edit.html', {'form': form})

    def post(self, request):
        client_profile = get_object_or_404(ClientProfile, user=request.user)
        form = ClientProfileForm(request.POST, instance=client_profile)
        if form.is_valid():
            form.save()
            return redirect('panel:home')

        return render(request, 'panel/user_profile_edit.html', {'form': form})


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
    template_name = 'panel/list_of_clients.html'
    context_object_name = 'clients'

    def get_queryset(self):
        # TODO return only clients of the current dietitian
        qs = super().get_queryset()
        dietitian_profile = get_object_or_404(DietitianProfile, user=self.request.user)
        return qs.filter(dietitian=dietitian_profile)


class ManageCalendar(DietitianRequiredMixin, ListView):
    model = ClientProfile
    template_name = 'panel/list_of_clients.html'
    context_object_name = 'clients'

    def get_queryset(self):
        # TODO return only clients of the current dietitian
        qs = super().get_queryset()
        dietitian_profile = get_object_or_404(DietitianProfile, user=self.request.user)
        return qs.filter(dietitian=dietitian_profile)
