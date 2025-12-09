from django.db import models
from django.utils import timezone

class Skill(models.Model):
    id = models.BigAutoField(primary_key=True)
    skill_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'skills'
        ordering = ['category', 'skill_name']
    
    def __str__(self):
        return f"{self.skill_name} ({self.category})"
