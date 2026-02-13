@echo off
TITLE Krishimitra Launcher
CLS
ECHO ==========================================================
ECHO 🚜 Starting Krishimitra (Smart Crop Advisory)
ECHO ==========================================================
ECHO.

REM Check dependencies
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO ❌ Node.js is not installed!
    PAUSE
    EXIT /B
)

where python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO ⚠️ Python is not found. ML Service might not start.
)

ECHO [1/3] Starting Backend Server...
CD backend
IF NOT EXIST "node_modules" call npm install
START "Krishimitra Backend" cmd /k "npm run dev"
CD ..

ECHO [2/3] Starting ML Service...
CD ml-service
IF NOT EXIST "venv" (
    ECHO Creating Virtual Environment...
    python -m venv venv
)

call venv\Scripts\activate
ECHO Installing Dependencies...
pip install -r requirements.txt

START "Krishimitra ML Service" cmd /k "venv\Scripts\activate && python app.py"
CD ..

ECHO [3/3] Starting Frontend...
CD frontend
IF NOT EXIST "node_modules" call npm install
START "Krishimitra Frontend" cmd /k "npm run dev"
CD ..

ECHO.
ECHO ✅ Services are launching...
ECHO 📱 Frontend: http://localhost:3000
ECHO 🔌 Backend:  http://localhost:5000
ECHO 🧠 ML Service: http://localhost:5001
ECHO.
PAUSE
