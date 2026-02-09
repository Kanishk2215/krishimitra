@echo off
TITLE Krishimitra - GLOBAL ONLINE LAUNCHER
CLS
ECHO ==========================================================
ECHO 🌍 Krishimitra Global Online Launcher
ECHO ==========================================================
ECHO.
ECHO Your Host ID is: krishimitra-live-hq
ECHO.

:: 1. Start Backend
ECHO [1/4] Starting Backend Server...
start "Krishimitra Backend" cmd /k "cd backend && npm run dev"

:: 2. Start ML Service
ECHO [2/4] Starting ML Service...
start "Krishimitra ML Service" cmd /k "cd ml-service && python app.py"

:: 3. Start Frontend Web Server
ECHO [3/4] Starting Web Server (Local Port 8000)...
start "Krishimitra Web Server" cmd /k "python -m http.server 8000"

timeout /t 5 /nobreak > nul

:: 4. Launch Tunnels (The "Online" Part)
ECHO [4/4] Activating Global Online Tunnels...

:: Frontend Tunnel
start "ONLINE: Frontend" cmd /k "npx localtunnel --port 8000 --subdomain krishimitra-live-hq"

:: Backend Tunnel
start "ONLINE: Backend" cmd /k "npx localtunnel --port 5000 --subdomain krishimitra-live-hq-api"

:: ML Tunnel
start "ONLINE: ML" cmd /k "npx localtunnel --port 5001 --subdomain krishimitra-live-hq-ml"

ECHO.
ECHO ✅ ALL SERVICES ARE LIVE!
ECHO.
ECHO 🔗 PUBLIC URL: https://krishimitra-live-hq.loca.lt/index.html
ECHO.
ECHO (NOTE: You must keep these windows open for the website to be online)
ECHO ==========================================================
PAUSE
