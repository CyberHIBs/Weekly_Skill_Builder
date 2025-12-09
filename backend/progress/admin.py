from django.contrib import admin
from .models import WeeklyProgress

@admin.register(WeeklyProgress)
class WeeklyProgressAdmin(admin.ModelAdmin):
    list_display = ['student', 'skill', 'week_number', 'year', 'proficiency_level', 'hours_spent', 'created_at']
    list_filter = ['proficiency_level', 'year', 'week_number', 'created_at']
    search_fields = ['student__name', 'student__email', 'skill__skill_name', 'notes']
    ordering = ['-year', '-week_number', 'student']
    
    fieldsets = (
        ('Student & Skill', {
            'fields': ('student', 'skill')
        }),
        ('Week Information', {
            'fields': ('week_number', 'year')
        }),
        ('Progress Details', {
            'fields': ('proficiency_level', 'hours_spent', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('student', 'skill')
