@echo off
TITLE Krishimitra - Permanent Server Launcher
CLS
ECHO ==========================================================
ECHO 🌾 Starting Krishimitra Permanent Server
ECHO ==========================================================
ECHO.

:: 1. Get IPv4 Address
FOR /F "tokens=14" %%a IN ('ipconfig ^| findstr IPv4') DO SET IP=%%a
:: Trim spaces if necessary (usually findstr handles it well enough for simple display)
ECHO 📡 Detected Local IP: %IP%
ECHO.

:: 2. Start Backend (New Window)
ECHO [1/3] Launching Backend Server...
start "Krishimitra Backend" cmd /k "cd backend && npm run dev"

:: 3. Start ML Service (New Window)
ECHO [2/3] Launching ML Service...
start "Krishimitra ML Service" cmd /k "cd ml-service && venv\Scripts\activate && python app.py"

:: 4. Start Frontend HTTP Server (New Window)
ECHO [3/3] Launching Frontend Web Server...
start "Krishimitra Web Server" cmd /k "python -m http.server 8000"

:: 5. Display Access Link
ECHO.
ECHO ==========================================================
ECHO ✅ All Services Started!
ECHO 📱 Access the App on your Mobile via these URLs:
ECHO.
ECHO    Option 1 (Best):  👉 http://%IP%:8000/index.html
ECHO    Option 2 (Name):  👉 http://%COMPUTERNAME%:8000/index.html
ECHO.
ECHO    (Both require your mobile to be on the same Wi-Fi)
ECHO ==========================================================
PAUSE
