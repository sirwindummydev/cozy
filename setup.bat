@echo off
echo ========================================
echo  Cozy Travel and Tours - Setup Script
echo ========================================
echo.

echo [1/4] Setting up Django backend...
cd backend
py -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
py manage.py makemigrations accounts tours bookings
py manage.py migrate
py manage.py seed_data
echo Backend setup complete!
echo.

echo [2/4] Setting up React frontend...
cd ..\frontend
npm install
echo Frontend setup complete!
echo.

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo To start the project, run:
echo   start_backend.bat   (in one terminal)
echo   start_frontend.bat  (in another terminal)
echo.
echo Admin credentials: admin / admin123
echo.
pause
