from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Skill
from .serializers import SkillSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
    
    def create(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({
                'error': 'Only admins can create skills'
            }, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({
                'error': 'Only admins can update skills'
            }, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({
                'error': 'Only admins can delete skills'
            }, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        categories = Skill.objects.values_list('category', flat=True).distinct()
        return Response({'categories': list(categories)})
