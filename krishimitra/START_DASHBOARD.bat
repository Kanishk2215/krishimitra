@echo off
TITLE KrishiMitra - Dashboard Only
CLS

ECHO ========================================
ECHO 🌾 KRISHIMITRA - STARTING DASHBOARD
ECHO ========================================
ECHO.

cd /d "%~dp0"

ECHO Starting Backend Server (for weather data)...
ECHO.
start "KrishiMitra Backend" cmd /k "cd backend && npm start"

ECHO.
ECHO Waiting for backend to start...
timeout /t 8 /nobreak

ECHO.
ECHO Opening Dashboard...
start dashboard.html

ECHO.
ECHO ========================================
ECHO ✅ DASHBOARD OPENED!
ECHO ========================================
ECHO.
ECHO Backend running at: http://localhost:5000
ECHO Dashboard: dashboard.html (opened in browser)
ECHO.
ECHO ⚠️ Keep this window open to keep backend running!
ECHO.
ECHO Press any key to stop backend server...
pause >nul

ECHO.
ECHO Stopping backend...
taskkill /FI "WINDOWTITLE eq KrishiMitra Backend*" /T /F >nul 2>&1

ECHO.
ECHO ✅ Backend stopped.
ECHO.
pause
