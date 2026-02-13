@echo off
TITLE GITHUB PUSH (FIXED) 🚀
COLOR 0A
CLS

ECHO =================================================
ECHO 📂 FIXING FOLDER LOCATION...
ECHO =================================================

:: Force navigate to the Git Root Folder
cd /d "D:\Adriuno\SmartCropAdvisory"

ECHO Current Folder: %CD%
ECHO.
ECHO =================================================
ECHO 📤 PUSHING CHANGES TO GITHUB...
ECHO =================================================

ECHO [1] Adding all files...
git add .

ECHO [2] Committing changes...
git commit -m "Fix: Dashboard and Vercel Config"

ECHO [3] Pushing to Main Branch...
git push origin main

ECHO.
ECHO =================================================
ECHO ✅ DONE! 
ECHO If you see 'Everything up-to-date', it worked.
ECHO If you see errors, check your Internet or Login.
ECHO =================================================
PAUSE
