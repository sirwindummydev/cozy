@echo off
echo Starting Django Backend Server on http://localhost:8000 ...
cd backend
venv\Scripts\python.exe manage.py runserver
