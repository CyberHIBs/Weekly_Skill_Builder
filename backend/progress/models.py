from django.db import models
from django.utils import timezone
from users.models import User
from skills.models import Skill

class WeeklyProgress(models.Model):
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress_entries')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='progress_entries')
    week_number = models.IntegerField()
    year = models.IntegerField()
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)
    hours_spent = models.FloatField(default=0.0)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'weekly_progress'
        ordering = ['-year', '-week_number']
        unique_together = ['student', 'skill', 'week_number', 'year']
    
    def __str__(self):
        return f"{self.student.name} - {self.skill.skill_name} - Week {self.week_number}/{self.year}"
