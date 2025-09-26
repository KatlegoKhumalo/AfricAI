@echo off
setlocal ENABLEDELAYEDEXPANSION
echo ======================================================
echo.
echo      Setting up CAI Agent Environment Variables
echo.
echo ======================================================
set GEMINI_API_KEY=AIzaSyBIVTb4PFUeut9mpV0lRoi1QEW3rCLe8KI
set LIVEKIT_API_KEY=APIsQkVBNR2aoPo
set LIVEKIT_API_SECRET=lMySOAShtNLFkVVfvQnri4Rs6oJqyBmNePePgfPznfTC
set LIVEKIT_WS_URL=wss://africai-wuzzjhxw.livekit.cloud
set CAI_HTTP_PORT=9090

echo.
echo ======================================================
echo.
echo         Starting CAI Agent
echo.
echo ======================================================

REM Navigate to this script's directory, then into the cai folder
pushd "%~dp0"
cd backend\cai

REM Ensure a Python interpreter is available (prefer venv, then python, then py)
set VENV_PY=.venv\Scripts\python.exe
if exist "%VENV_PY%" goto :HAVE_VENV

echo.
echo Creating Python virtual environment (if needed)...
echo.

REM Prefer Python Launcher (avoids Windows Store shim)
where py >nul 2>nul
if %ERRORLEVEL%==0 (
    py -3.11 --version >nul 2>nul
    if %ERRORLEVEL%==0 (
        py -3.11 -m venv .venv
    ) else (
        py -3 -m venv .venv
    )
) else (
    REM Fallback to system python
    where python >nul 2>nul
    if %ERRORLEVEL%==0 (
        python -m venv .venv
    ) else (
        echo.
        echo ERROR: Python is not installed. Please install Python 3.10+ from https://www.python.org/downloads/ and re-run this script.
        echo Tip: During install, check "Add Python to PATH".
        echo.
        goto :END
    )
)

if not exist "%VENV_PY%" (
    echo.
    echo ERROR: Failed to create virtual environment.
    echo.
    goto :END
)

:HAVE_VENV
echo.
echo Using virtual environment at .venv
echo Installing dependencies...
"%VENV_PY%" -m pip install --upgrade pip >nul
"%VENV_PY%" -m pip install -r requirements.txt

echo.
echo Starting the CAI token server on port 8001...
start "CAI Token Server" "%VENV_PY%" token_server.py

echo.
echo Starting the CAI Python agent...
echo This agent will connect to LiveKit and handle voice conversations.
echo.
"%VENV_PY%" agent.py start

echo.
echo The CAI agent process has finished. Press any key to close this window.
:END
pause
endlocal
