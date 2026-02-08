@echo off
TITLE AgriFarm Developer Launcher
CLS
ECHO ==========================================================
ECHO 🌾 Starting AgriFarm Local Development Environment
ECHO ==========================================================
ECHO.

REM Check for Node.js
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO ❌ Node.js is not installed. Please install it from nodejs.org
    PAUSE
    EXIT /B
)

ECHO 1. Setup Backend (Port 5000)
CD backend
IF NOT EXIST "node_modules" (
    ECHO    - Installing Backend Dependencies...
    call npm install
)
ECHO    - Starting Backend Server...
START "AgriFarm Backend" cmd /k "set DB_DIALECT=sqlite && npm run dev"
CD ..

ECHO.
ECHO 2. Setup Frontend (Port 5173)
CD frontend
IF NOT EXIST "node_modules" (
    ECHO    - Installing Frontend Dependencies...
    call npm install
)
ECHO    - Starting Frontend Server...
START "AgriFarm Frontend" cmd /k "npm run dev"
CD ..

ECHO.
ECHO ==========================================================
ECHO ✅ Servers are starting in new windows!
ECHO 🌍 Frontend: http://localhost:5173
ECHO 🔌 Backend:  http://localhost:5000
ECHO.
ECHO Press any key to exit this launcher (servers will keep running)...
PAUSE >nul
