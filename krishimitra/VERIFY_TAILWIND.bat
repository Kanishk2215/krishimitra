@echo off
TITLE Tailwind CSS Setup Verification
CLS

ECHO ========================================
ECHO ✅ TAILWIND CSS PRODUCTION SETUP
ECHO ========================================
ECHO.

cd /d "%~dp0frontend"

ECHO [1/4] Checking dependencies...
npm list tailwindcss postcss autoprefixer
ECHO.

ECHO [2/4] Checking configuration files...
IF EXIST "tailwind.config.js" (
    ECHO ✅ tailwind.config.js found
) ELSE (
    ECHO ❌ tailwind.config.js missing
)

IF EXIST "postcss.config.js" (
    ECHO ✅ postcss.config.js found
) ELSE (
    ECHO ❌ postcss.config.js missing
)

IF EXIST "src\index.css" (
    ECHO ✅ src\index.css found
) ELSE (
    ECHO ❌ src\index.css missing
)
ECHO.

ECHO [3/4] Checking for CDN script...
findstr /C:"cdn.tailwindcss.com" index.html >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    ECHO ❌ CDN script still present in index.html
) ELSE (
    ECHO ✅ CDN script removed from index.html
)
ECHO.

ECHO [4/4] Starting development server...
ECHO.
ECHO ========================================
ECHO 🚀 STARTING DEV SERVER
ECHO ========================================
ECHO.
ECHO Open browser to: http://localhost:5173
ECHO Check console - NO CDN warnings!
ECHO.
npm run dev

pause
