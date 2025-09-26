@echo off
setlocal ENABLEDELAYEDEXPANSION
title AfricAI One-Click Startup

echo ======================================================
echo        Setting up and starting the AfricAI system
echo ======================================================
echo.

REM Change directory to this script location
cd /d "%~dp0"

REM ------------------------------------------------------
REM Environment for Frontend -> Token endpoint
REM ------------------------------------------------------
set VITE_CAI_TOKEN_URL=http://localhost:8001/token

REM ------------------------------------------------------
REM Launch components in separate terminals
REM ------------------------------------------------------

echo Launching Backend...
start "AfricAI Backend" cmd /c "call start-backend.bat"

echo Launching CAI Agent + Token Server...
start "AfricAI CAI Agent" cmd /c "call start-cai-agent.bat"

echo Waiting a moment for services to bind to ports...
timeout /t 5 /nobreak >nul

echo Launching Frontend...
start "AfricAI Frontend" cmd /c "call start-frontend.bat"

echo.
echo All components launched. Check the opened windows for logs.
echo - Backend API (Spring)
echo - CAI Token Server + Python Agent (Gemini via LiveKit)
echo - Frontend (Vite)
echo.
echo If the frontend cannot fetch a token, allow Python through Windows Firewall or change ports.

endlocal