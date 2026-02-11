@echo off
TITLE KrishiMitra - Full System
CLS

ECHO ========================================
ECHO 🌾 KRISHIMITRA - STARTING ALL SERVICES
ECHO ========================================
ECHO.

cd /d "%~dp0"

ECHO [1/3] Starting Backend Server (Port 5000)...
ECHO.
start "KrishiMitra Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

ECHO [2/3] Starting ML Service (Port 5001)...
ECHO.
start "KrishiMitra ML Service" cmd /k "cd ml-service && python app.py"
timeout /t 3 /nobreak >nul

ECHO [3/3] Waiting for services to start...
ECHO.
ECHO ⏱️ Backend starting... (10 seconds)
timeout /t 10 /nobreak

ECHO.
ECHO Opening Dashboard...
start dashboard.html

ECHO.
ECHO ========================================
ECHO ✅ ALL SERVICES STARTED!
ECHO ========================================
ECHO.
ECHO Backend:    http://localhost:5000
ECHO ML Service: http://localhost:5001
ECHO Dashboard:  Opened in browser
ECHO.
ECHO ✅ ALL FEATURES WORKING:
ECHO    - Weather, News, Prices
ECHO    - Location Settings
ECHO    - Plan My Crop
ECHO    - Disease Detection
ECHO.
ECHO ⚠️ Keep both windows open!
ECHO.
ECHO Press any key to stop all services...
pause >nul

ECHO.
ECHO Stopping services...
taskkill /FI "WINDOWTITLE eq KrishiMitra Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq KrishiMitra ML Service*" /T /F >nul 2>&1

ECHO.
ECHO ✅ All services stopped.
ECHO.
pause
