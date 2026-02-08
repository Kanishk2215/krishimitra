@echo off
TITLE Krishimitra - ML Service Watchdog
:START
ECHO Starting ML Service on Port 5001...
CD /D "d:\Adriuno\SmartCropAdvisory\krishimitra\ml-service"
REM Kill any process on 5001
FOR /F "tokens=5" %%P IN ('netstat -aon ^| findstr :5001') DO taskkill /F /PID %%P >nul 2>&1
venv\Scripts\python.exe app.py
IF ERRORLEVEL 1 (
    ECHO ML Service crashed. Restarting in 2 seconds...
    timeout /t 2
    GOTO START
)
GOTO START
