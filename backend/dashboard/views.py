from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, F, Q
from django.db.models.functions import Coalesce
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
from progress.models import WeeklyProgress
from skills.models import Skill
from users.models import User


class DashboardView(viewsets.ViewSet):
    """Dashboard API endpoints"""

    @action(detail=False, methods=['get'])
    def index(self, request):
        """Get dashboard summary data"""
        user = request.user

        # Basic statistics
        if user.role == 'admin':
            total_students = User.objects.filter(role='student').count()
            total_progress_entries = WeeklyProgress.objects.count()
            total_hours = WeeklyProgress.objects.aggregate(Sum('hours_spent'))['hours_spent__sum'] or 0
        else:
            total_students = 0
            total_progress_entries = WeeklyProgress.objects.filter(student=user).count()
            total_hours = WeeklyProgress.objects.filter(student=user).aggregate(Sum('hours_spent'))['hours_spent__sum'] or 0

        total_skills = Skill.objects.count()

        # Top skills by hours
        top_skills = []
        skills = Skill.objects.annotate(
            total_hours=Coalesce(Sum('weeklyprogress__hours_spent'), 0),
            practice_count=Count('weeklyprogress')
        ).order_by('-total_hours')[:5]

        for skill in skills:
            latest_progress = skill.weeklyprogress_set.order_by('-created_at').first()
            top_skills.append({
                'skill_id': skill.id,
                'skill_name': skill.skill_name,
                'category': skill.category,
                'total_hours': float(skill.total_hours),
                'practice_count': skill.practice_count,
                'latest_proficiency': latest_progress.proficiency_level if latest_progress else 'beginner'
            })

        # Recent progress
        if user.role == 'admin':
            recent_progress = WeeklyProgress.objects.select_related('skill', 'student').order_by('-created_at')[:5]
        else:
            recent_progress = WeeklyProgress.objects.filter(student=user).select_related('skill').order_by('-created_at')[:5]

        recent_data = []
        for entry in recent_progress:
            recent_data.append({
                'id': entry.id,
                'skill_details': {
                    'skill_name': entry.skill.skill_name,
                    'category': entry.skill.category
                },
                'week_number': entry.week_number,
                'year': entry.year,
                'hours_spent': float(entry.hours_spent),
                'proficiency_level': entry.proficiency_level
            })

        return Response({
            'total_students': total_students,
            'total_progress_entries': total_progress_entries,
            'total_hours': float(total_hours),
            'total_skills': total_skills,
            'top_skills': top_skills,
            'recent_progress': recent_data
        })


class GeneratePDFView(viewsets.ViewSet):
    """Generate PDF reports for skill tracking"""

    @action(detail=False, methods=['get'])
    def export_report(self, request):
        """Export comprehensive skill report with clean table format"""
        
        # Get all skills with aggregated data
        top_skills = Skill.objects.annotate(
            total_hours=Coalesce(Sum('weeklyprogress__hours_spent'), 0),
            practice_count=Count('weeklyprogress')
        ).order_by('-total_hours')[:10]

        # Create PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="skill-tracker-report-{datetime.now().strftime("%Y-%m-%d")}.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        elements = []

        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#374151'),
            spaceAfter=12,
            fontName='Helvetica-Bold'
        )

        # Title
        elements.append(Paragraph('Weekly Skill Tracker - Progress Report', title_style))
        elements.append(Spacer(1, 0.2*inch))

        # Header Info
        user_info = f"Generated for {request.user.name} | Role: {request.user.role} | Date: {datetime.now().strftime('%d/%m/%Y')}"
        elements.append(Paragraph(user_info, styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))

        # ========== SUMMARY STATISTICS TABLE ==========
        elements.append(Paragraph('Summary Statistics', heading_style))
        
        total_entries = WeeklyProgress.objects.count()
        total_hours_sum = WeeklyProgress.objects.aggregate(Sum('hours_spent'))['hours_spent__sum'] or 0
        avg_hours = round(total_hours_sum / max(total_entries, 1), 1)
        total_skills_count = Skill.objects.count()

        summary_data = [
            ['Total Entries', f'{total_entries}'],
            ['Total Hours', f'{total_hours_sum:.1f} h'],
            ['Average Hours/Week', f'{avg_hours} h'],
            ['Skills Practiced', f'{total_skills_count}']
        ]
        
        summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1e293b')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
            ('BACKGROUND', (1, 0), (1, -1), colors.HexColor('#f1f5f9')),
            ('TEXTCOLOR', (1, 0), (1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ]))
        
        elements.append(summary_table)
        elements.append(Spacer(1, 0.3*inch))

        # ========== TOP SKILLS BY HOURS - CLEAN TABLE FORMAT ==========
        elements.append(Paragraph('Top Skills by Hours', heading_style))
        
        # Build table data with proper headers
        table_data = [
            ['Rank', 'Skill Name', 'Category', 'Total Hours', 'Sessions', 'Avg Hours/Session', 'Latest Level']
        ]
        
        # Add rows for each skill
        for idx, skill in enumerate(top_skills, 1):
            latest_progress = skill.weeklyprogress_set.order_by('-created_at').first()
            proficiency = latest_progress.proficiency_level.capitalize() if latest_progress else 'Beginner'
            
            sessions = skill.practice_count if skill.practice_count else 0
            total_h = float(skill.total_hours)
            avg_h = (total_h / sessions) if sessions > 0 else 0.0
            
            table_data.append([
                str(idx),                      # Rank
                str(skill.skill_name),         # Skill Name
                str(skill.category),           # Category
                f'{total_h:.1f} h',            # Total Hours with 1 decimal
                str(sessions),                 # Sessions/Practice Count
                f'{avg_h:.1f} h',              # Average Hours per Session
                str(proficiency)               # Latest Proficiency Level
            ])
        
        # Create the table with proper column widths
        top_skills_table = Table(
            table_data,
            colWidths=[0.55*inch, 1.95*inch, 1.3*inch, 1.1*inch, 0.9*inch, 1.3*inch, 1.15*inch],
            repeatRows=1
        )
        
        # Apply professional table styling
        top_skills_table.setStyle(TableStyle([
            # ===== HEADER ROW (Row 0) =====
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            
            # ===== DATA ROWS (Row 1 onwards) =====
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
            
            # ===== COLUMN ALIGNMENT =====
            ('ALIGN', (0, 1), (0, -1), 'CENTER'),      # Rank - center
            ('ALIGN', (1, 1), (2, -1), 'LEFT'),        # Skill & Category - left
            ('ALIGN', (3, 1), (-1, -1), 'CENTER'),     # All metrics - center
            
            # ===== GRID & BORDERS =====
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            
            # ===== PADDING =====
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ]))
        
        elements.append(top_skills_table)
        elements.append(Spacer(1, 0.3*inch))

        # ========== PROFICIENCY DISTRIBUTION TABLE ==========
        elements.append(Paragraph('Proficiency Distribution', heading_style))
        
        proficiency_counts = WeeklyProgress.objects.values('proficiency_level').annotate(count=Count('id'))
        total_records = sum(item['count'] for item in proficiency_counts)
        
        prof_data = [['Proficiency Level', 'Count', 'Percentage']]
        for prof in proficiency_counts:
            percentage = round((prof['count'] / total_records * 100), 1) if total_records > 0 else 0
            prof_data.append([
                prof['proficiency_level'].capitalize(),
                str(prof['count']),
                f'{percentage}%'
            ])
        
        prof_table = Table(prof_data, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
        prof_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f9fafb')),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 1), (-1, -1), 'CENTER'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 1), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 10),
        ]))
        
        elements.append(prof_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # ========== FOOTER ==========
        footer_text = f"Page 1 of 1 | Report generated on {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}"
        elements.append(Paragraph(footer_text, ParagraphStyle('footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)))

        # Build PDF
        doc.build(elements)
        return response
