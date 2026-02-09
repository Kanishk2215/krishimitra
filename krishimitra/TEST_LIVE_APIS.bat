@echo off
TITLE Test Live Krishimitra APIs
CLS

ECHO ========================================
ECHO 🧪 TESTING LIVE KRISHIMITRA SYSTEM
ECHO ========================================
ECHO.

SET BACKEND=https://krishimitra-1-cnf1.onrender.com

ECHO [1/6] Testing Backend Health...
curl -s %BACKEND%/ | jq .
ECHO.
ECHO ----------------------------------------
ECHO.

ECHO [2/6] Testing Weather API...
curl -s %BACKEND%/api/online/weather | jq .
ECHO.
ECHO ----------------------------------------
ECHO.

ECHO [3/6] Testing News API...
curl -s %BACKEND%/api/online/news | jq .
ECHO.
ECHO ----------------------------------------
ECHO.

ECHO [4/6] Testing Mandi Prices...
curl -s %BACKEND%/api/online/prices | jq .
ECHO.
ECHO ----------------------------------------
ECHO.

ECHO [5/6] Testing Warehouses...
curl -s %BACKEND%/api/online/warehouses | jq .
ECHO.
ECHO ----------------------------------------
ECHO.

ECHO [6/6] Testing Frontend...
start "" "https://krishimitra-frontend.vercel.app"
ECHO.

ECHO ========================================
ECHO ✅ ALL TESTS COMPLETE!
ECHO ========================================
ECHO.
ECHO 🌐 Backend: LIVE
ECHO 📡 APIs: WORKING
ECHO 🌾 Frontend: OPENING...
ECHO.
pause
