@echo off
echo ========================================
echo    AfricAI Project Setup Script
echo ========================================
echo.

echo [1/4] Setting up environment variables...
echo.

REM Create backend .env file
echo Creating backend environment file...
(
echo # AfricAI Backend Environment Variables
echo.
echo # MongoDB Configuration
echo MONGO_URI=mongodb+srv://katlegokhumalo718_db_user:^<$Katlie94^>@africaicluster.joqlgqh.mongodb.net/?retryWrites=true^&w=majority^&appName=AfricAICluster
echo.
echo # JWT Configuration
echo JWT_SECRET_KEY=africai-super-secret-key-that-is-very-long-and-secure-2024-production
echo JWT_EXPIRATION_MS=86400000
echo.
echo # AI Configuration
echo GEMINI_API_KEY=AIzaSyBIVTb4PFUeut9mpV0lRoi1QEW3rCLe8KI
echo.
echo # LiveKit Configuration ^(for real-time AI^)
echo LIVEKIT_API_KEY=APIsQkVBNR2aoPo
echo LIVEKIT_API_SECRET=lMySOAShtNLFkVVfvQnri4Rs6oJqyBmNePePgfPznfTC
echo LIVEKIT_WS_URL=wss://africai-wuzzjhxw.livekit.cloud
echo.
echo # Server Configuration
echo SERVER_PORT=8080
echo.
echo # CORS Configuration
echo CORS_ORIGINS=http://localhost:5173,http://localhost:3000
) > backend\.env

REM Create frontend .env file
echo Creating frontend environment file...
(
echo VITE_API_BASE_URL=http://localhost:8080/api/v1
echo VITE_GEMINI_API_KEY=AIzaSyBIVTb4PFUeut9mpV0lRoi1QEW3rCLe8KI
) > frontend\.env

echo ✓ Environment files created successfully!
echo.

echo [2/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Root dependency installation failed!
    pause
    exit /b 1
)
echo ✓ Root dependencies installed!
echo.

echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed!
echo.

echo [4/4] Compiling backend...
cd ..\backend
call mvn clean compile
if %errorlevel% neq 0 (
    echo ❌ Backend compilation failed!
    pause
    exit /b 1
)
echo ✓ Backend compiled successfully!
echo.

echo [5/5] Setup complete! 🎉
echo.
echo ========================================
echo    AfricAI is ready to run!
echo ========================================
echo.
echo To start the application:
echo.
echo Option 1 - Start both together:
echo    npm run dev
echo.
echo Option 2 - Start separately:
echo    1. Backend: cd backend ^&^& mvn spring-boot:run
echo    2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Access the application:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo.
echo ========================================
echo.
pause