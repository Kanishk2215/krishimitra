@echo off
TITLE Krishimitra - Restarting Services
CLS
ECHO Stopping all services...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

ECHO.
ECHO Starting Backend...
CD backend
START "Krishimitra Backend" cmd /k "npm run dev"
CD ..

timeout /t 3 /nobreak >nul

ECHO Starting Frontend...
CD frontend  
START "Krishimitra Frontend" cmd /k "npm run dev"
CD ..

timeout /t 3 /nobreak >nul

ECHO Starting ML Service...
CD ml-service
START "Krishimitra ML" cmd /k "python app.py"
CD ..

ECHO.
ECHO ✅ All services started!
ECHO 🌐 Frontend: http://localhost:3000
ECHO 🔌 Backend: http://localhost:5000
ECHO.
PAUSE
