from django.contrib.auth.urls import path
from .forms import ActivityForm
from .views import RegisterActivity
urlpatterns = [
    path('register-activity/', RegisterActivity.as_view(), name='register_activity')
]

app_name = 'tracker'
