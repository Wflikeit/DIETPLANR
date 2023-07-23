from django.shortcuts import render


# Create your views here.
def view_profile(request):
    return render(request, "account/profile.html")
def view_panel(request):
    return render(request, "account/dietitian_panel.html")