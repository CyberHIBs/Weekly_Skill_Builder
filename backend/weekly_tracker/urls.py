from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Weekly Skill Tracker API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'skills': '/api/skills/',
            'progress': '/api/progress/',
            'dashboard': '/api/dashboard/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/skills/', include('skills.urls')),
    path('api/progress/', include('progress.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]
