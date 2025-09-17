@echo off
echo ======================================================
echo.
echo      Setting up Frontend Environment Variables
echo.
echo ======================================================
set VITE_API_BASE_URL=http://localhost:8080/api/v1
set VITE_GEMINI_API_KEY=AIzaSyBIVTb4PFUeut9mpV0lRoi1QEW3rCLe8KI

echo.
echo ======================================================
echo.
echo         Starting Frontend Setup and Startup
echo.
echo ======================================================

REM Navigate to the frontend directory
cd frontend

echo.
echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting the development server...
echo Visit http://localhost:5173 (or the URL shown below) in your browser.
echo.
call npm run dev
