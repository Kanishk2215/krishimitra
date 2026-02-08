@echo off
echo ==========================================
echo      Smart Crop System - Save Tool
echo ==========================================
echo.
echo Saving your latest changes...
echo.

git add .
git commit -m "Auto-save: %date% %time%"

echo.
echo ==========================================
echo SUCCESS! Your work is saved.
echo You can close this window.
echo ==========================================
pause
