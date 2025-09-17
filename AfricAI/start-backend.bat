@echo off
@REM ----------------------------------------------------------------
@REM IMPORTANT: SET YOUR JAVA_HOME PATH HERE
@REM ----------------------------------------------------------------
@REM If you don't have Java installed, this script will not work.
@REM The path should not end with a backslash.
@REM Example: set JAVA_HOME=C:\Program Files\Java\jdk-21
set JAVA_HOME=C:\Program Files\Java\jdk-21

@REM ----------------------------------------------------------------

echo ======================================================
echo.
echo      Setting up Backend Environment Variables
echo.
echo ======================================================
set MONGO_URI=mongodb+srv://katlegokhumalo718_db_user:Katlie94@africaicluster.zvyzxjh.mongodb.net/africai?retryWrites=true&w=majority&appName=AfricAICluster
set JWT_SECRET=6d8f0e2c4a9b7d1e5f3a0c8e4b2d6f9a7c1e3d5f8b4a2c6e9f0d7a3b5c8e2f1
set GEMINI_API_KEY=AIzaSyBIVTb4PFUeut9mpV0lRoi1QEW3rCLe8KI
set LIVEKIT_API_KEY=APIsQkVBNR2aoPo
set LIVEKIT_API_SECRET=lMySOAShtNLFkVVfvQnri4Rs6oJqyBmNePePgfPznfTC
set LIVEKIT_WS_URL=wss://africai-wuzzjhxw.livekit.cloud
set JWT_EXPIRATION_MS=86400000

echo.
echo ======================================================
echo.
echo            Starting Backend Application
echo.
echo ======================================================

REM Navigate to the backend directory
cd backend

echo.
echo Starting the Spring Boot application...
echo This may take a few minutes to download dependencies the first time.
echo.
call mvnw.cmd spring-boot:run

echo.
echo The backend process has finished. Press any key to close this window.
pause
