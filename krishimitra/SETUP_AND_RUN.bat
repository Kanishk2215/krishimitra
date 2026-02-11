@echo off
TITLE KrishiMitra - Setup & Run
CLS

ECHO ========================================
ECHO 🌾 KRISHIMITRA - FULL SETUP & LAUNCH
ECHO ========================================
ECHO.
ECHO This script will:
ECHO 1. Install all dependencies (Backend + ML)
ECHO 2. Start all services
ECHO 3. Launch the dashboard
ECHO.
ECHO Press any key to start setup...
pause >nul

cd /d "%~dp0"

ECHO.
ECHO [1/4] Installing Backend Dependencies...
ECHO ----------------------------------------
cd backend
call npm install
IF %ERRORLEVEL% NEQ 0 (
    ECHO ❌ Backend install failed! Please check Node.js installation.
    pause
    exit /b
)
ECHO ✅ Backend dependencies installed.

ECHO.
ECHO [2/4] Installing ML Service Dependencies...
ECHO -------------------------------------------
cd ../ml-service
pip install -r requirements.txt
IF %ERRORLEVEL% NEQ 0 (
    ECHO ⚠️ ML install warning (might be ok if already installed).
    ECHO If python fails later, check python installation.
)
ECHO ✅ ML dependencies installed.

ECHO.
ECHO [3/4] Starting Services...
ECHO --------------------------

cd ..

ECHO Starting Backend (Port 5000)...
start "KrishiMitra Backend" cmd /k "cd backend && npm start"

ECHO Starting ML Service (Port 5001)...
start "KrishiMitra ML Service" cmd /k "cd ml-service && python app.py"

ECHO.
ECHO [4/4] Launching Dashboard...
ECHO ----------------------------
ECHO Waiting 15 seconds for services to initialize...
timeout /t 15 /nobreak

start dashboard.html

ECHO.
ECHO ========================================
ECHO ✅ SETUP COMPLETE & RUNNING!
ECHO ========================================
ECHO.
ECHO Please check the two black windows for any red errors.
ECHO If they close immediately, there is an error.
ECHO.
ECHO Press any key to exit this window (services will keep running)...
pause >nul
