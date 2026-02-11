@echo off
TITLE Test Weather API - All India Locations
CLS

ECHO ========================================
ECHO 🌤️ TESTING WEATHER API - ALL INDIA
ECHO ========================================
ECHO.

cd /d "%~dp0backend"

ECHO Testing weather for different Indian cities...
ECHO.

ECHO [1/6] Testing Mumbai (19.0760, 72.8777)
curl "http://localhost:5000/api/online/weather?lat=19.0760&lon=72.8777"
ECHO.
ECHO.

ECHO [2/6] Testing Delhi (28.7041, 77.1025)
curl "http://localhost:5000/api/online/weather?lat=28.7041&lon=77.1025"
ECHO.
ECHO.

ECHO [3/6] Testing Bangalore (12.9716, 77.5946)
curl "http://localhost:5000/api/online/weather?lat=12.9716&lon=77.5946"
ECHO.
ECHO.

ECHO [4/6] Testing Chennai (13.0827, 80.2707)
curl "http://localhost:5000/api/online/weather?lat=13.0827&lon=80.2707"
ECHO.
ECHO.

ECHO [5/6] Testing Kolkata (22.5726, 88.3639)
curl "http://localhost:5000/api/online/weather?lat=22.5726&lon=88.3639"
ECHO.
ECHO.

ECHO [6/6] Testing Nashik (19.9975, 73.7898)
curl "http://localhost:5000/api/online/weather?lat=19.9975&lon=73.7898"
ECHO.
ECHO.

ECHO ========================================
ECHO ✅ TESTING COMPLETE
ECHO ========================================
ECHO.
ECHO All cities should show their actual weather!
ECHO Check the "city" field in each response.
ECHO.

pause
