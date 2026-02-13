@echo off
TITLE Krishimitra UPDATE & FIX
COLOR 0B
CLS

ECHO =================================================
ECHO 🛠️ FIXING AI LIBRARY & RESTARTING...
ECHO =================================================

ECHO [1/3] Stopping old processes (unlocking files)...
taskkill /F /IM python.exe /T >nul 2>&1

ECHO [2/3] Re-installing Google AI Library...
pip uninstall -y google-generativeai
pip install google-generativeai --upgrade

ECHO [3/3] Starting Backend...
python backend_fixed.py

PAUSE
