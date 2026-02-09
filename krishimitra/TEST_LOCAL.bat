@echo off
TITLE Test Real System Locally
CLS

ECHO ========================================
ECHO 🧪 Testing Krishimitra Real System
ECHO ========================================
ECHO.

cd /d "%~dp0"

ECHO [1/3] Starting Backend Server...
start "Backend" cmd /k "cd krishimitra\backend && npm start"
timeout /t 3 >nul

ECHO [2/3] Starting ML Service...
start "ML Service" cmd /k "cd krishimitra\ml-service && python app.py"
timeout /t 3 >nul

ECHO [3/3] Opening Dashboard...
timeout /t 2 >nul
start "" "http://localhost:5000" 
start "" "krishimitra\dashboard.html"

ECHO.
ECHO ✅ All services started!
ECHO.
ECHO 📡 Backend: http://localhost:5000
ECHO 🤖 ML Service: http://localhost:5001
ECHO 🌾 Dashboard: Open in browser
ECHO.
ECHO Press any key to stop all services...
pause >nul

taskkill /FI "WindowTitle eq Backend*" /T /F
taskkill /FI "WindowTitle eq ML Service*" /T /F
