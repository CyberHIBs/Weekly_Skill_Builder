from django.contrib import admin
from .models import Skill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['skill_name', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['skill_name', 'category', 'description']
    ordering = ['category', 'skill_name']
    
    fieldsets = (
        ('Skill Information', {
            'fields': ('skill_name', 'category', 'description')
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ['created_at']
