from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DashboardView, GeneratePDFView

router = DefaultRouter()
router.register(r'', DashboardView, basename='dashboard')
router.register(r'export', GeneratePDFView, basename='export-pdf')

urlpatterns = router.urls
