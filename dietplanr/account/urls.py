from django.urls.conf import path
from . import views
app_name ='account'
urlpatterns=[
    path('profile/', views.view_profile, name="view_profile")
]
