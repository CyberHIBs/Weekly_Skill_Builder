from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Avg
from .models import WeeklyProgress
from .serializers import WeeklyProgressSerializer, WeeklyProgressCreateSerializer

class WeeklyProgressViewSet(viewsets.ModelViewSet):
    serializer_class = WeeklyProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = WeeklyProgress.objects.select_related('student', 'skill')
        
        if user.role == 'admin':
            student_id = self.request.query_params.get('student_id', None)
            if student_id:
                queryset = queryset.filter(student_id=student_id)
        else:
            queryset = queryset.filter(student=user)
        
        skill_id = self.request.query_params.get('skill_id', None)
        if skill_id:
            queryset = queryset.filter(skill_id=skill_id)
        
        week_number = self.request.query_params.get('week_number', None)
        if week_number:
            queryset = queryset.filter(week_number=week_number)
        
        year = self.request.query_params.get('year', None)
        if year:
            queryset = queryset.filter(year=year)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return WeeklyProgressCreateSerializer
        return WeeklyProgressSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        progress = serializer.save(student=request.user)
        
        return Response(
            WeeklyProgressSerializer(progress).data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if request.user.role != 'admin' and instance.student != request.user:
            return Response({
                'error': 'You can only update your own progress entries'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if request.user.role != 'admin' and instance.student != request.user:
            return Response({
                'error': 'You can only delete your own progress entries'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        queryset = WeeklyProgress.objects.filter(student=request.user).select_related('skill')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        user = request.user
        
        if user.role == 'admin':
            student_id = request.query_params.get('student_id', None)
            if student_id:
                queryset = WeeklyProgress.objects.filter(student_id=student_id)
            else:
                queryset = WeeklyProgress.objects.all()
        else:
            queryset = WeeklyProgress.objects.filter(student=user)
        
        total_entries = queryset.count()
        total_hours = queryset.aggregate(Sum('hours_spent'))['hours_spent__sum'] or 0
        avg_hours = queryset.aggregate(Avg('hours_spent'))['hours_spent__avg'] or 0
        
        proficiency_distribution = queryset.values('proficiency_level').annotate(
            count=Count('id')
        )
        
        skills_practiced = queryset.values('skill__skill_name').annotate(
            count=Count('id'),
            total_hours=Sum('hours_spent')
        ).order_by('-total_hours')[:10]
        
        return Response({
            'total_entries': total_entries,
            'total_hours': round(total_hours, 2),
            'average_hours_per_week': round(avg_hours, 2),
            'proficiency_distribution': list(proficiency_distribution),
            'top_skills': list(skills_practiced)
        })
