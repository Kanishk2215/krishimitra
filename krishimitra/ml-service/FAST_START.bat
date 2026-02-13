@echo off
TITLE Krishimitra FAST START 🚀
COLOR 0A
CLS

ECHO =================================================
ECHO ⚡ STARTING BACKEND (SKIPPING UPDATES)...
ECHO =================================================

taskkill /F /IM python.exe /T >nul 2>&1

:: Fix: Switch to correct directory
cd /d "%~dp0"

python backend_fixed.py

PAUSE
