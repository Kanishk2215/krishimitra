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
ECHO [2] Deploy Backend (Render/Railway) -> (Requires GitHub)
ECHO [3] Push Code to GitHub (Required for Render)
ECHO [4] Help / Instructions
ECHO [5] Exit
ECHO.
SET /P M=Type 1, 2, 3, 4, or 5 and press ENTER: 
IF %M%==1 GOTO FRONTEND
IF %M%==2 GOTO BACKEND
IF %M%==3 GOTO GITHUB
IF %M%==4 GOTO HELP
IF %M%==5 GOTO EOF

:FRONTEND
CLS
ECHO ----------------------------------------------------------
ECHO 🚀 Deploying Frontend to Vercel...
ECHO ----------------------------------------------------------
call vercel --prod
PAUSE
GOTO EOF

:BACKEND
CLS
ECHO ----------------------------------------------------------
ECHO ☁️ Deploying Backend to Render...
ECHO ----------------------------------------------------------
ECHO.
ECHO 1. Ensure your code is on GitHub (Option 3).
ECHO 2. Go to https://dashboard.render.com
ECHO 3. Click "New" -> "Blueprint"
ECHO 4. Connect your GitHub Repo (Kanishk2215/krishimitra)
ECHO 5. Click "Apply" -> It will deploy EVERYTHING automatically!
ECHO.
PAUSE
GOTO EOF

:GITHUB
CLS
ECHO ----------------------------------------------------------
ECHO � Pushing Code to GitHub...
ECHO ----------------------------------------------------------
ECHO.
ECHO 1. Adding files...
git add .
git commit -m "Update for deployment"
ECHO.
ECHO 2. Pushing to GitHub (Login if asked)...
git branch -M main
git push -u origin main
ECHO.
ECHO ✅ Done!
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
ECHO.
ECHO 2. Backend (Render):
ECHO    - Uses `render.yaml` to deploy Backend + ML + Database.
ECHO    - Free, No Credit Card required.
ECHO.
PAUSE
GOTO EOF

:EOF
EXIT
