@echo off
TITLE Krishimitra RESTART
COLOR 0A
CLS

ECHO =================================================
ECHO 🔄 RESTARTING EVERYTHING FOR YOU...
ECHO =================================================
ECHO.

ECHO [1/3] Closing old servers (if running)...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1

ECHO.
ECHO [2/3] applying your new API Key...
timeout /t 2 >nul

ECHO.
ECHO [3/3] Starting fresh...
call run_krishimitra.bat
