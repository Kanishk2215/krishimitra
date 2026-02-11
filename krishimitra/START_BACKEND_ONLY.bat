@echo off
TITLE KrishiMitra - Backend Only
CLS

ECHO ========================================
ECHO 🌾 KRISHIMITRA - BACKEND ONLY
ECHO ========================================
ECHO.

cd /d "%~dp0"

ECHO [1/2] Starting Backend Server...
ECHO.
start "KrishiMitra Backend" cmd /k "cd backend && npm start"

ECHO.
ECHO [2/2] Waiting for backend to start...
ECHO.
timeout /t 10 /nobreak

ECHO.
ECHO Opening Dashboard...
start dashboard.html

ECHO.
ECHO ========================================
ECHO ✅ BACKEND STARTED!
ECHO ========================================
ECHO.
ECHO Backend: http://localhost:5000
ECHO Dashboard: Opened in browser
ECHO.
ECHO ⚠️ NOTE: ML features (Plan My Crop, Disease Detection)
ECHO    will show "Local AI Node restarting" error.
ECHO    This is NORMAL - ignore it!
ECHO.
ECHO ✅ Location Settings will work fine!
ECHO.
ECHO Keep backend window open!
ECHO Press any key to exit...
pause >nul
