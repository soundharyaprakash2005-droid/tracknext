@echo off
REM TrackNext Startup Script for Windows
REM This script automates the setup and startup process

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo   TrackNext - Student Opportunity Portal
echo   Windows Setup & Startup Script
echo ============================================================
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js/npm is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: %random%
npm --version

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo.
    echo You need to configure MongoDB before starting.
    echo.
    echo Choice 1: Run MongoDB setup (requires MongoDB URI)
    echo   Run: .\setup-mongodb.ps1
    echo.
    echo Choice 2: Use demo data without MongoDB
    echo   The app will work with sample opportunities.
    echo.
    set /p choice="Continue without MongoDB setup? (y/n): "
    if /i not "!choice!"=="y" (
        echo Exiting...
        pause
        exit /b 0
    )
) else (
    echo ✓ Configuration file found
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo.
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
) else (
    echo ✓ Dependencies already installed
)

echo.
echo ============================================================
echo   Starting TrackNext Server
echo ============================================================
echo.
echo Server will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
pause

REM Start the server
call npm start
