from rest_framework import serializers
from .models import WeeklyProgress
from skills.serializers import SkillSerializer
from users.serializers import UserSerializer

class WeeklyProgressSerializer(serializers.ModelSerializer):
    skill_details = SkillSerializer(source='skill', read_only=True)
    student_details = UserSerializer(source='student', read_only=True)
    
    class Meta:
        model = WeeklyProgress
        fields = [
            'id', 'student', 'skill', 'week_number', 'year', 
            'proficiency_level', 'hours_spent', 'notes', 
            'created_at', 'updated_at', 'skill_details', 'student_details'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_hours_spent(self, value):
        if value < 0:
            raise serializers.ValidationError("Hours spent cannot be negative.")
        if value > 168:
            raise serializers.ValidationError("Hours spent cannot exceed 168 hours per week.")
        return value
    
    def validate_week_number(self, value):
        if value < 1 or value > 53:
            raise serializers.ValidationError("Week number must be between 1 and 53.")
        return value
    
    def validate_year(self, value):
        if value < 2020 or value > 2100:
            raise serializers.ValidationError("Invalid year.")
        return value

class WeeklyProgressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyProgress
        fields = [
            'skill', 'week_number', 'year', 
            'proficiency_level', 'hours_spent', 'notes'
        ]
    
    def validate_hours_spent(self, value):
        if value < 0:
            raise serializers.ValidationError("Hours spent cannot be negative.")
        if value > 168:
            raise serializers.ValidationError("Hours spent cannot exceed 168 hours per week.")
        return value
    
    def validate_week_number(self, value):
        if value < 1 or value > 53:
            raise serializers.ValidationError("Week number must be between 1 and 53.")
        return value
    
    def validate_year(self, value):
        if value < 2020 or value > 2100:
            raise serializers.ValidationError("Invalid year.")
        return value
