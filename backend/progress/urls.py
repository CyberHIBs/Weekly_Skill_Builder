from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeeklyProgressViewSet

router = DefaultRouter()
router.register(r'', WeeklyProgressViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
]
