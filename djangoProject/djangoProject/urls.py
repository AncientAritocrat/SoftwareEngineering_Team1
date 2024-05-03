"""djangoProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.views.static import serve
from django.conf import settings
from IntegratedApp import views

urlpatterns = [
    path('spider/', views.run_spider, name='spider'),
    path('predict/', views.run_predict, name='predict'),
    path('BIM/', views.run_BIM, name='BIM'),
    path('BimMaster/', views.run_BimMaster, name='BimMaster'),
    path('CAD/', views.run_CAD, name='CAD'),
    path('chat/', views.run_chat, name='chat'),
    path('home/', views.home, name='home'),
    path('index/', views.index, name='index'),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}, name='media')
]
