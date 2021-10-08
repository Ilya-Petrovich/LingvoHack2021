from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="home"),
    path('ex1.1', views.ex1_1, name="ex1.1"),
    path('ex1.2', views.ex1_2, name="ex1.2")
]
