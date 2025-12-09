from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_verification_email(user, request=None):
    """Send email verification link to user"""
    
    # Generate verification URL
    verification_url = f"http://localhost:3000/verify-email/{user.email_verification_token}"
    
    # Email subject
    subject = 'Verify Your Email - Weekly Skill Tracker'
    
    # Email body (HTML version)
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(to right, #3b82f6, #2563eb); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
            .button {{ display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Weekly Skill Tracker!</h1>
            </div>
            <div class="content">
                <h2>Hi {user.name},</h2>
                <p>Thank you for registering with Weekly Skill Tracker. Please verify your email address to activate your account.</p>
                
                <p>Click the button below to verify your email:</p>
                
                <a href="{verification_url}" class="button">Verify Email Address</a>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #3b82f6;">{verification_url}</p>
                
                <p><strong>This link will expire in 24 hours.</strong></p>
                
                <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>© 2025 Weekly Skill Tracker. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text version (fallback)
    plain_message = f"""
    Hi {user.name},
    
    Thank you for registering with Weekly Skill Tracker.
    
    Please verify your email address by clicking the link below:
    {verification_url}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
    
    Best regards,
    Weekly Skill Tracker Team
    """
    
    # Send email
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending verification email: {e}")
        return False
