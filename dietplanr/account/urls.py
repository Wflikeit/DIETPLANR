from django.urls.conf import path
from . import views
app_name ='account'
urlpatterns=[
    path('profile/', views.view_profile, name="view_profile"),
    path('panel/', views.view_panel, name="view_panel"),
    path('home/', views.view_landing_page, name="view_landing_page")
]
