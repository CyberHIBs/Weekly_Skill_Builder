# Weekly Skill Tracker

Developer setup and deployment notes

## Backend (Django)

1. Create and activate a Python virtualenv:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies and run migrations:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python manage.py migrate
```

3. (Optional) Seed demo data:

```powershell
python seed_data.py
```

4. Run the dev server:

```powershell
python manage.py runserver
```

Notes:
- To use the included SQLite DB for local dev, set `USE_SQLITE=True` in `backend/.env`.
- Ensure `SECRET_KEY` (and any DB env vars) are set in `backend/.env`.

## Frontend (React)

1. Install dependencies and run locally:

```powershell
cd frontend
npm ci
npm start
```

2. Build for production:

```powershell
npm run build
```

3. Environment variables:
- `REACT_APP_API_URL` — point to your backend API (e.g., `https://api.example.com/api`)

## Vercel deployment

- This repo contains a `vercel.json` which tells Vercel to build the `frontend` folder using `@vercel/static-build`.
- Ensure in Vercel Project Settings the `Build Command` is `npm run build` and the `Output Directory` is `build`.
- If your build requires env vars (e.g., `REACT_APP_API_URL`), add them in Vercel's Environment Variables settings.

## Common tasks

- Add migrations: `python manage.py makemigrations` then `python manage.py migrate`.
- Create superuser: `python manage.py createsuperuser`.

If you want, I can also add CI checks, Dockerfile, or switch the backend to use sqlite by default in dev.
