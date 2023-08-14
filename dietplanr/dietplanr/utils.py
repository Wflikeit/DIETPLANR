from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.http import HttpResponseNotFound
from django.shortcuts import redirect

from panel.models import ClientProfile, DietitianProfile


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

    def has_client_profile(self):
        try:
            client_profile = ClientProfile.objects.get(user=self.request.user)
            return True
        except ClientProfile.DoesNotExist:
            return False


class DietitianRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_dietitian and not self.request.user.is_client:
            try:
                DietitianProfile.objects.get(user=self.request.user)
                return True
            except DietitianProfile.DoesNotExist:
                return False
        return False

    def handle_no_permission(self):
        print('Użytkownik nie ma profilu klienta.')
        print(self.request.user.id)
        if self.request.user.is_dietitian and not self.request.user.is_client:
            dietitian_profile = ClientProfile.objects.create(user=self.request.user)
            if dietitian_profile:
                return redirect("panel:client_update_form")
        return redirect('panel:home')

    def has_dietitian_profile(self):
        try:
            dietitian_profile = DietitianProfile.objects.get(user=self.request.user)
            return True
        except DietitianProfile.DoesNotExist:
            return False


def get_proper_template(request, dietitian_template, client_template, profile_required):
    dietitian_mixin = DietitianRequiredMixin()
    client_mixin = ClientRequiredMixin()

    dietitian_profile = client_profile = False

    if profile_required:
        dietitian_profile = dietitian_mixin.has_dietitian_profile()
        client_profile = client_mixin.has_client_profile()

    if (request.user.is_dietitian and not request.user.is_client) or dietitian_profile:
        return dietitian_template
    elif (request.user.is_client and not request.user.is_dietitian) or client_profile:
        return client_template
    else:
        raise HttpResponseNotFound
