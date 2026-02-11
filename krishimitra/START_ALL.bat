@echo off
TITLE KrishiMitra - Start All Services
CLS

ECHO ========================================
ECHO 🌾 KRISHIMITRA - STARTING ALL SERVICES
ECHO ========================================
ECHO.

cd /d "%~dp0"

ECHO [1/3] Starting Backend Server...
ECHO.
start "KrishiMitra Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

ECHO [2/3] Starting Frontend Server...
ECHO.
start "KrishiMitra Frontend" cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak >nul

ECHO [3/3] Opening Dashboard...
ECHO.
timeout /t 5 /nobreak >nul
start http://localhost:3000

ECHO.
ECHO ========================================
ECHO ✅ ALL SERVICES STARTED!
ECHO ========================================
ECHO.
ECHO Backend:  http://localhost:5000
ECHO Frontend: http://localhost:3000
ECHO Dashboard: Open in browser
ECHO.
ECHO Press any key to stop all services...
pause >nul

ECHO.
ECHO Stopping services...
taskkill /FI "WINDOWTITLE eq KrishiMitra Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq KrishiMitra Frontend*" /T /F >nul 2>&1

ECHO.
ECHO ✅ All services stopped.
ECHO.
pause
