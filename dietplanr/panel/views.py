# from django.shortcuts import render
from django.conf import settings
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView, FormView

# from django.contrib.auth.mixins import LoginRequiredMixin, \
#     PermissionRequiredMixin
# Create your views here.
from .forms import AppointmentForm
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


class UserRegistration(FormView):
    template_name = 'panel/registration.html'
    form_class = UserCreationForm

    class Meta:
        model = settings.AUTH_USER_MODEL  # Ustaw model, z którego ma dziedziczyć formularz
        fields = '__all__'


# class DietitianRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
#     # def test_func(self):
#     #     dietitian_slug = self.kwargs.get('dietitian_slug')
#     #     if dietitian_slug:
#     #         dietitian_profile = get_object_or_404(DietitianProfile, slug=dietitian_slug)
#     #         return dietitian_profile is not None
#     #     return False
#     def test_func(self):
#         user = self.request.user
#         if hasattr(user, 'dietitian_profile') and user.dietitian_profile is not None and user.is_dietitian:
#             return True
#         return False


class DietitianRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            dietitian_slug = self.kwargs.get('dietitian_slug')
            if dietitian_slug:
                dietitian_account = get_object_or_404(CustomUser, slug=dietitian_slug)
                dietitian_profile = DietitianProfile.objects.filter(user=dietitian_account).first()
                return dietitian_profile is not None and self.request.user.is_dietitian
        return False


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
            html = "<html><body>Spotkanie utworzone</body></html>"
            return HttpResponse(html)
        else:
            return render(request, 'panel/appointment_set.html', {'form': form})


class EditProfileForm(View, LoginRequiredMixin):
    def get(self, request):
        # ClientRequiredMixin.test_func()
        form = EditProfileForm

        return render(request, 'panel/user_profile_edit.html')

    class Meta:
        model = DietitianProfile  # Ustaw model, z którego ma dziedziczyć formularz
        fields = '__all__'
