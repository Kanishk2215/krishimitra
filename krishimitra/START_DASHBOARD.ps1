# KrishiMitra - Start Dashboard
Write-Host "========================================" -ForegroundColor Green
Write-Host "🌾 KRISHIMITRA - STARTING DASHBOARD" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\backend'; npm start"

Write-Host "Waiting for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "[2/2] Opening Dashboard..." -ForegroundColor Yellow
Write-Host ""

# Open dashboard
Start-Process "$scriptPath\dashboard.html"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ DASHBOARD OPENED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Dashboard: Opened in browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️ Keep backend window open!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
