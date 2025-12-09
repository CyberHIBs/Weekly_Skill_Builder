import os
import django
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'weekly_tracker.settings')
django.setup()

from users.models import User
from skills.models import Skill
from progress.models import WeeklyProgress

def create_seed_data():
    print("Starting seed data creation...")
    
    # Create Admin User
    print("\nCreating admin user...")
    admin_user, created = User.objects.get_or_create(
        email='admin@torus.com',
        defaults={
            'name': 'Admin User',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123456')
        admin_user.save()
        print("✅ Admin user created: admin@torus.com / admin123456")
    else:
        print("⚠️  Admin user already exists")
    
    # Create Student Users
    print("\nCreating student users...")
    students_data = [
        {'email': 'student1@torus.com', 'name': 'Rahul Kumar', 'password': 'student123'},
        {'email': 'student2@torus.com', 'name': 'Priya Sharma', 'password': 'student123'},
        {'email': 'student3@torus.com', 'name': 'Amit Patel', 'password': 'student123'},
    ]
    
    students = []
    for student_data in students_data:
        student, created = User.objects.get_or_create(
            email=student_data['email'],
            defaults={
                'name': student_data['name'],
                'role': 'student'
            }
        )
        if created:
            student.set_password(student_data['password'])
            student.save()
            print(f"✅ Student created: {student_data['email']} / {student_data['password']}")
        else:
            print(f"⚠️  Student already exists: {student_data['email']}")
        students.append(student)
    
    # Create Skills
    print("\nCreating skills...")
    skills_data = [
        {'skill_name': 'Python Programming', 'category': 'Programming', 'description': 'Learn Python basics, OOP, and advanced concepts'},
        {'skill_name': 'React Development', 'category': 'Frontend', 'description': 'Modern React with hooks, context, and routing'},
        {'skill_name': 'Django REST Framework', 'category': 'Backend', 'description': 'Building REST APIs with Django'},
        {'skill_name': 'PostgreSQL', 'category': 'Database', 'description': 'Relational database management'},
        {'skill_name': 'Data Structures', 'category': 'Programming', 'description': 'Arrays, linked lists, trees, graphs'},
        {'skill_name': 'Algorithms', 'category': 'Programming', 'description': 'Sorting, searching, dynamic programming'},
        {'skill_name': 'UI/UX Design', 'category': 'Design', 'description': 'User interface and experience design'},
        {'skill_name': 'Git & GitHub', 'category': 'Tools', 'description': 'Version control and collaboration'},
        {'skill_name': 'Tailwind CSS', 'category': 'Frontend', 'description': 'Utility-first CSS framework'},
        {'skill_name': 'JavaScript ES6+', 'category': 'Programming', 'description': 'Modern JavaScript features'},
    ]
    
    skills = []
    for skill_data in skills_data:
        skill, created = Skill.objects.get_or_create(
            skill_name=skill_data['skill_name'],
            defaults={
                'category': skill_data['category'],
                'description': skill_data['description']
            }
        )
        if created:
            print(f"✅ Skill created: {skill_data['skill_name']}")
        else:
            print(f"⚠️  Skill already exists: {skill_data['skill_name']}")
        skills.append(skill)
    
    # Create Sample Progress Entries
    print("\nCreating sample progress entries...")
    current_year = datetime.now().year
    
    progress_data = [
        # Student 1 progress
        {'student': students[0], 'skill': skills[0], 'week': 48, 'year': current_year, 'level': 'intermediate', 'hours': 8, 'notes': 'Completed OOP concepts'},
        {'student': students[0], 'skill': skills[1], 'week': 48, 'year': current_year, 'level': 'beginner', 'hours': 5, 'notes': 'Started React basics'},
        {'student': students[0], 'skill': skills[4], 'week': 47, 'year': current_year, 'level': 'intermediate', 'hours': 6, 'notes': 'Practiced binary trees'},
        
        # Student 2 progress
        {'student': students[1], 'skill': skills[2], 'week': 48, 'year': current_year, 'level': 'advanced', 'hours': 10, 'notes': 'Built complete API'},
        {'student': students[1], 'skill': skills[3], 'week': 48, 'year': current_year, 'level': 'intermediate', 'hours': 4, 'notes': 'Database optimization'},
        {'student': students[1], 'skill': skills[6], 'week': 47, 'year': current_year, 'level': 'beginner', 'hours': 3, 'notes': 'Learning Figma'},
        
        # Student 3 progress
        {'student': students[2], 'skill': skills[8], 'week': 48, 'year': current_year, 'level': 'intermediate', 'hours': 7, 'notes': 'Building responsive layouts'},
        {'student': students[2], 'skill': skills[9], 'week': 48, 'year': current_year, 'level': 'advanced', 'hours': 9, 'notes': 'Async/await mastery'},
        {'student': students[2], 'skill': skills[7], 'week': 47, 'year': current_year, 'level': 'intermediate', 'hours': 5, 'notes': 'Git branching strategies'},
    ]
    
    for prog_data in progress_data:
        progress, created = WeeklyProgress.objects.get_or_create(
            student=prog_data['student'],
            skill=prog_data['skill'],
            week_number=prog_data['week'],
            year=prog_data['year'],
            defaults={
                'proficiency_level': prog_data['level'],
                'hours_spent': prog_data['hours'],
                'notes': prog_data['notes']
            }
        )
        if created:
            print(f"✅ Progress created: {prog_data['student'].name} - {prog_data['skill'].skill_name}")
        else:
            print(f"⚠️  Progress already exists")
    
    print("\nSeed data creation completed!")
    print("\n" + "="*60)
    print("LOGIN CREDENTIALS:")
    print("="*60)
    print("\nADMIN:")
    print("   Email: admin@torus.com")
    print("   Password: admin123456")
    print("\nSTUDENTS:")
    print("   Email: student1@torus.com | Password: student123")
    print("   Email: student2@torus.com | Password: student123")
    print("   Email: student3@torus.com | Password: student123")
    print("="*60)

if __name__ == '__main__':
    create_seed_data()
