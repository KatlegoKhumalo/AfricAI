@echo off
echo "Setting up AfricAI..."

REM Change directory to the location of the script
cd /d "%~dp0"

REM Navigate to the backend directory
cd backend

REM Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Setup complete. You can now run the AfricAI agent by running 'python agent.py' from the backend directory."