from rest_framework import serializers
from .models import Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'skill_name', 'category', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_skill_name(self, value):
        if not value or value.strip() == '':
            raise serializers.ValidationError("Skill name cannot be empty.")
        return value.strip()
    
    def validate_category(self, value):
        if not value or value.strip() == '':
            raise serializers.ValidationError("Category cannot be empty.")
        return value.strip()
