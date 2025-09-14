@echo off
echo ========================================
echo    Starting AfricAI Application
echo ========================================
echo.

echo Starting both frontend and backend...
echo This will start both servers in the same window.
echo Press Ctrl+C to stop both servers.
echo.

call npm run dev

echo.
echo ========================================
echo    AfricAI has stopped
echo ========================================
echo.
pause