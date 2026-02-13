@echo off
TITLE Krishimitra STABLE START 🟢
COLOR 0A
CLS

ECHO =================================================
ECHO 🌾 KRISHIMITRA STARTUP: STABLE MODE
ECHO =================================================

ECHO [1] Cleaning up old processes...
taskkill /F /IM python.exe /T >nul 2>&1

:: Change to the directory where this script is located
cd /d "%~dp0"

ECHO [2] Starting Backend Server...
ECHO *************************************************
ECHO *** DO NOT CLOSE THIS WINDOW (MINIMIZE IT) ***
ECHO *** The Bot lives here! If you close, it stops. ***
ECHO *************************************************
ECHO -------------------------------------------------
python backend_fixed.py
ECHO -------------------------------------------------
ECHO ⚠️ SERVER STOPPED OR CRASHED! ⚠️
ECHO Check the error message above.
PAUSE
