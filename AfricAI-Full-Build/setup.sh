#!/bin/bash

# AfricAI Setup Script
echo "🌍 Setting up AfricAI Learning Management System..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 21 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB 6.0 or higher."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.9 or higher."
    exit 1
fi

echo "✅ All prerequisites are installed!"

# Create environment file for backend
echo "📝 Creating environment configuration..."
cat > AfricAI-main-build/User/User/.env << EOF
# AfricAI Backend Environment Variables

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/africai

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-that-is-very-long-and-secure-africai-2024
JWT_EXPIRATION_MS=86400000

# AI Configuration
GEMINI_API_KEY=your-google-gemini-api-key

# LiveKit Configuration (for real-time AI)
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_WS_URL=wss://your-livekit-server.com

# Server Configuration
SERVER_PORT=8080

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
EOF

# Create environment file for frontend
cat > .env << EOF
# AfricAI Frontend Environment Variables

VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GEMINI_API_KEY=your-google-gemini-api-key
EOF

echo "✅ Environment files created!"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd AfricAI-main-build/User/User
mvn clean install
cd ../../..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install AI assistant dependencies
echo "📦 Installing AI assistant dependencies..."
cd AfricAI-main-build/User/User/src/main/resources/ai-assistant
pip install -r requirements.txt
cd ../../../../../../..

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env files with your actual API keys"
echo "2. Start MongoDB: mongod"
echo "3. Start the backend: cd AfricAI-main-build/User/User && mvn spring-boot:run"
echo "4. Start the frontend: npm run dev"
echo "5. Start the AI assistant: cd AfricAI-main-build/User/User/src/main/resources/ai-assistant && python agent.py"
echo ""
echo "🌍 Welcome to AfricAI - Empowering Africa through Technology Education!"
