@echo off
TITLE Krishimitra - PUBLIC CLOUD LAUNCHER
CLS
ECHO ==========================================================
ECHO ☁️  Going Public! (Secure Tunneling)
ECHO ==========================================================
ECHO.
ECHO This will create a public link like "https://krishimitra-app.loca.lt"
ECHO readable from anywhere in the world.
ECHO.
ECHO ⚠️ NOTE: You must keep these windows OPEN.
ECHO.

:: 1. Launch Frontend Tunnel (Port 8000)
ECHO [1/3] Exposing Website (Port 8000)...
start "TUNNEL: FRONTEND" cmd /k "npx localtunnel --port 8000 --subdomain krishimitra-kanishkar-app"

:: 2. Launch Backend Tunnel (Port 5000)
ECHO [2/3] Exposing Backend API (Port 5000)...
start "TUNNEL: API" cmd /k "npx localtunnel --port 5000 --subdomain krishimitra-api"

:: 3. Launch ML Tunnel (Port 5001)
ECHO [3/3] Exposing AI Service (Port 5001)...
start "TUNNEL: ML" cmd /k "npx localtunnel --port 5001 --subdomain krishimitra-ml"

ECHO.
ECHO ✅ Tunnels are starting...
ECHO.
ECHO 🌍 YOUR PUBLIC WEBSITE LINK:
ECHO.
ECHO    👉 https://krishimitra-kanishkar-app.loca.lt/index.html
ECHO.
ECHO (Share this link with anyone!)
ECHO.
PAUSE
