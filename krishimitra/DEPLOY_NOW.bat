@echo off
TITLE Krishimitra - DEPLOYMENT WIZARD 🚀
CLS
ECHO ==========================================================
ECHO 🌍  Krishimitra Deployment Wizard
ECHO ==========================================================
ECHO.
ECHO This script will help you deploy your project to the cloud!
ECHO.
ECHO [1] Deploy Frontend (Vercel) -> https://krishimitra.vercel.app
ECHO [2] Deploy Backend (Railway) -> https://krishimitra-backend.up.railway.app
ECHO [3] Help / Instructions
ECHO [4] Exit
ECHO.
SET /P M=Type 1, 2, 3, or 4 and press ENTER: 
IF %M%==1 GOTO FRONTEND
IF %M%==2 GOTO BACKEND
IF %M%==3 GOTO HELP
IF %M%==4 GOTO EOF

:FRONTEND
CLS
ECHO ----------------------------------------------------------
ECHO 🚀 Deploying Frontend to Vercel...
ECHO ----------------------------------------------------------
ECHO.
ECHO 1. Installing Vercel CLI...
call npm install -g vercel
ECHO.
ECHO 2. Login to Vercel (Check your browser)...
call vercel login
ECHO.
ECHO 3. Start Deployment...
ECHO    (Select defaults: Y, default scope, N to project link, 'krishimitra', ./)
call vercel --prod
ECHO.
ECHO ✅ Frontend Deployment Complete!
ECHO.
PAUSE
GOTO EOF

:BACKEND
CLS
ECHO ----------------------------------------------------------
ECHO 🚂 Deploying Backend to Railway...
ECHO ----------------------------------------------------------
ECHO.
ECHO 1. Installing Railway CLI...
call npm install -g @railway/cli
ECHO.
ECHO 2. Login to Railway...
call railway login
ECHO.
ECHO 3. Deploying...
cd backend
call railway init
call railway up
cd ..
ECHO.
ECHO ✅ Backend Deployment Complete!
ECHO.
PAUSE
GOTO EOF

:HELP
CLS
ECHO ----------------------------------------------------------
ECHO 📖 Deployment Instructions
ECHO ----------------------------------------------------------
ECHO.
ECHO 1. Frontend (Vercel):
ECHO    - Deploys index.html & dashboard.html
ECHO    - Creates: https://krishimitra.vercel.app
ECHO.
ECHO 2. Backend (Railway):
ECHO    - Deploys the Node.js API
ECHO    - Creates: https://krishimitra-backend.up.railway.app
ECHO    - Don't forget to set DATABASE_URL (PostgreSQL) in Railway settings!
ECHO.
ECHO 3. Configuration:
ECHO    - After deploying backend, update `config.js` with your new URL.
ECHO.
PAUSE
GOTO EOF

:EOF
EXIT
