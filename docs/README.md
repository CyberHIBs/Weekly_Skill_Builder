Weekly Skill Tracker

A comprehensive full-stack web application for tracking weekly skill development progress with analytics and reporting capabilities.

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![Django](https://img.shields.io/badge/Django-5.0-green)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Options](#database-options)
- [API Endpoints](#api-endpoints)
- [Default Credentials](#default-credentials)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

🚀 Features

For Students
- ✅ Track weekly learning progress across multiple skills
- ✅ Log hours spent and proficiency levels (Beginner/Intermediate/Advanced)
- ✅ View personalized dashboard with statistics
- ✅ Visualize progress with interactive charts and graphs
- ✅ Browse available skills catalog with search and filters
- ✅ Generate detailed progress reports
- ✅ Update profile and change password

For Admins
- ✅ Manage skills catalog (Add/Edit/Delete)
- ✅ View all students' progress entries
- ✅ System-wide analytics and insights
- ✅ User management via Django admin panel
- ✅ Comprehensive reporting dashboard
- ✅ Monitor student activity and engagement

🛠️ Tech Stack

Backend
- Django 5.0 - Python web framework
- Django REST Framework - API development
- SQLite/PostgreSQL - Database options
- JWT Authentication - Secure token-based auth
- Python 3.10+ - Programming language

### Frontend
- **React 19** - UI library
- **Tailwind CSS 3** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** (optional) - For version control
- **PostgreSQL** (optional) - Only if using PostgreSQL instead of SQLite

## 🔧 Installation

### Step 1: Clone or Download the Project

If using Git
git clone <your-repository-url>
cd weekly-skill-tracker

Or download and extract the ZIP file


### Step 2: Backend Setup

Navigate to backend directory
cd backend

Create virtual environment
python -m venv venv

Activate virtual environment

On Windows:
venv\Scripts\activate

On macOS/Linux:
source venv/bin/activate

Install Python dependencies
pip install -r requirements.txt

Create environment file
Create a file named .env in the backend directory with the following content:


**Create `.env` file in `backend/` directory:**

Backend Environment Variables
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

Database Configuration (SQLite - Default)
No additional configuration needed for SQLite

CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

JWT Token Settings
JWT_ACCESS_TOKEN_LIFETIME=24
JWT_REFRESH_TOKEN_LIFETIME=168

Email Configuration (Optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

undefined

Run database migrations
python manage.py makemigrations
python manage.py migrate

Load seed data (demo users and sample data)
python seed_data.py

Start development server
python manage.py runserver


Backend will run at: [**http://127.0.0.1:8000**](http://127.0.0.1:8000)

### Step 3: Frontend Setup

Open a **new terminal window** and:

Navigate to frontend directory
cd frontend

Install dependencies
npm install

Create environment file
Create a file named .env in the frontend directory

**Create `.env` file in `frontend/` directory:**

REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_NAME=Weekly Skill Tracker

undefined

Start development server
npm start


Frontend will run at: [**http://localhost:3000**](http://localhost:3000)

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Backend:**

cd backend
venv\Scripts\activate # On Windows
source venv/bin/activate # On macOS/Linux
python manage.py runserver


**Terminal 2 - Frontend:**

cd frontend
npm start


### Access Points

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://127.0.0.1:8000/api
- **Django Admin Panel:** http://127.0.0.1:8000/admin
- **API Documentation:** http://127.0.0.1:8000/api (browsable API)

## 🔑 Default Credentials

### Admin Account
- **Email:** admin@torus.com
- **Password:** admin123456

### Student Accounts
- **Email:** student1@torus.com | **Password:** student123
- **Email:** student2@torus.com | **Password:** student123
- **Email:** student3@torus.com | **Password:** student123

## 💾 Database Options (what to use now)

- **Default (local dev): SQLite** — already configured, no extra steps.
- **Recommended for staging/production: PostgreSQL** — supported out of the box.

### Quick switch to PostgreSQL
1) Install PostgreSQL (use your OS package manager or official installer).  
2) Create a database/user (example):
   - `CREATE DATABASE weekly_tracker;`
   - `CREATE USER tracker_admin WITH PASSWORD 'your_secure_password';`
   - `GRANT ALL PRIVILEGES ON DATABASE weekly_tracker TO tracker_admin;`
3) Install the driver in the backend venv: `pip install psycopg2-binary`
4) Update `backend/weekly_tracker/settings.py`:
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='weekly_tracker'),
        'USER': config('DB_USER', default='tracker_admin'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}
```
5) Add to `backend/.env`:
```
DB_NAME=weekly_tracker
DB_USER=tracker_admin
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
```
6) Apply migrations and seed: `python manage.py migrate && python seed_data.py`

## 🔌 API Endpoints

### Authentication

POST /api/auth/register/ - Register new user
POST /api/auth/login/ - Login user
POST /api/auth/token/refresh/ - Refresh access token
GET /api/auth/profile/ - Get user profile
PATCH /api/auth/profile/ - Update user profile
POST /api/auth/change-password/ - Change password


### Skills Management

GET /api/skills/ - List all skills
POST /api/skills/ - Create skill (Admin only)
GET /api/skills/{id}/ - Get skill details
PUT /api/skills/{id}/ - Update skill (Admin only)
DELETE /api/skills/{id}/ - Delete skill (Admin only)
GET /api/skills/categories/ - Get skill categories


### Progress Tracking

GET /api/progress/ - List progress entries
POST /api/progress/ - Create progress entry
GET /api/progress/{id}/ - Get progress details
PUT /api/progress/{id}/ - Update progress entry
DELETE /api/progress/{id}/ - Delete progress entry
GET /api/progress/my_progress/ - Get current user's progress
GET /api/progress/statistics/ - Get progress statistics


### Dashboard

GET /api/dashboard/ - Get dashboard data (role-based)


## 📁 Project Structure

weekly-skill-tracker/
│
├── backend/ # Django Backend
│ ├── weekly_tracker/ # Main project settings
│ │ ├── settings.py # Django configuration
│ │ ├── urls.py # URL routing
│ │ └── wsgi.py # WSGI application
│ │
│ ├── users/ # User authentication app
│ │ ├── models.py # User model
│ │ ├── serializers.py # User serializers
│ │ ├── views.py # Authentication views
│ │ ├── urls.py # User routes
│ │ └── admin.py # Admin configuration
│ │
│ ├── skills/ # Skills management app
│ │ ├── models.py # Skill model
│ │ ├── serializers.py # Skill serializers
│ │ ├── views.py # Skill CRUD views
│ │ ├── urls.py # Skill routes
│ │ └── admin.py # Admin configuration
│ │
│ ├── progress/ # Progress tracking app
│ │ ├── models.py # WeeklyProgress model
│ │ ├── serializers.py # Progress serializers
│ │ ├── views.py # Progress CRUD views
│ │ ├── urls.py # Progress routes
│ │ └── admin.py # Admin configuration
│ │
│ ├── dashboard/ # Dashboard analytics app
│ │ ├── views.py # Dashboard views
│ │ └── urls.py # Dashboard routes
│ │
│ ├── manage.py # Django management script
│ ├── requirements.txt # Python dependencies
│ ├── seed_data.py # Database seeding script
│ ├── .env # Environment variables
│ └── db.sqlite3 # SQLite database file
│
├── frontend/ # React Frontend
│ ├── public/ # Static files
│ │ └── index.html
│ │
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ │ └── common/
│ │ │ ├── LoadingSpinner.jsx
│ │ │ ├── ErrorMessage.jsx
│ │ │ └── Navbar.jsx
│ │ │
│ │ ├── pages/ # Page components
│ │ │ ├── Login.jsx # Login page
│ │ │ ├── Register.jsx # Registration page
│ │ │ ├── Dashboard.jsx # Dashboard page
│ │ │ ├── Skills.jsx # Skills management
│ │ │ ├── Progress.jsx # Progress tracking
│ │ │ ├── Reports.jsx # Reports & analytics
│ │ │ └── Profile.jsx # User profile
│ │ │
│ │ ├── context/ # React context
│ │ │ └── AuthContext.jsx # Authentication context
│ │ │
│ │ ├── utils/ # Utility functions
│ │ │ ├── api.js # Axios API instance
│ │ │ └── authHelper.js # Auth helper functions
│ │ │
│ │ ├── App.jsx # Main app component
│ │ ├── index.js # Entry point
│ │ └── index.css # Global styles
│ │
│ ├── package.json # Node dependencies
│ ├── tailwind.config.js # Tailwind configuration
│ ├── postcss.config.js # PostCSS configuration
│ └── .env # Environment variables
│
└── README.md # This file


## 📸 Screenshots

### Login Page
Clean and modern authentication interface with form validation.

### Dashboard
Role-based dashboards showing personalized statistics and recent activity.

### Skills Management
Browse, search, and filter skills with admin controls for CRUD operations.

### Progress Tracking
Table view with add, edit, and delete functionality for weekly progress entries.

### Reports & Analytics
Interactive charts showing proficiency distribution, top skills, and trends.

## 🚀 Deployment

### Backend on Render (recommended managed option)
1) Push code to GitHub/GitLab.  
2) Create a new Web Service on Render, connect the repo.  
3) Environment:
   - Runtime: Python 3.10+
   - Build command: `pip install -r requirements.txt`
   - Start command: `python manage.py migrate && python manage.py runserver 0.0.0.0:8000`
4) Add environment variables:
   - `SECRET_KEY=your-production-secret-key`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=your-render-domain.onrender.com`
   - Database vars if using Postgres (recommended): `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
5) Add Render PostgreSQL add-on or point to your own Postgres; update `.env` accordingly.
6) On first deploy, run migrations/seed once via Render shell:
   - `python manage.py migrate`
   - `python seed_data.py`

### Frontend Deployment (Vercel example)
1) `npm install -g vercel` (or use dashboard).  
2) From `frontend/`: `vercel` and follow prompts.  
3) Set env var in Vercel: `REACT_APP_API_URL=https://<your-backend>/api`

### Other options
- Backend: Railway, AWS Elastic Beanstalk, DigitalOcean App Platform
- Frontend: Netlify, GitHub Pages, AWS S3 + CloudFront, Firebase Hosting

## 🧪 Testing

### Backend Tests

cd backend
python manage.py test


### Frontend Tests

cd frontend
npm test


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: mohammedyousuf8505@gmail.com
- LinkedIn: (https://bit.ly/48BrgNB)
## 🙏 Acknowledgments

- Built as an internship project for Torus Innotech
- React documentation and community
- Django REST Framework documentation
- Tailwind CSS team
- Recharts library contributors

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: mohammedyousuf8505@gmail.com

---

**Made with ❤️ using Django and React**

⭐ If you find this project useful, please consider giving it a star!
