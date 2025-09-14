# 🌍 AfricAI Learning Management System

A comprehensive, AI-powered Learning Management System designed specifically for African learners, featuring real-time AI tutoring, course management, and culturally relevant educational content.

## 📁 Project Structure

```
AfricAI-LMS/
├── frontend/                    # React + TypeScript frontend
│   ├── components/             # React components
│   ├── pages/                 # Application pages
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React context providers
│   ├── utils/                 # Utility functions
│   ├── public/                # Public static files
│   │   └── assets/           # Static assets (images, etc.)
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.ts        # Vite configuration
│   └── tsconfig.json         # TypeScript configuration
├── backend/                   # Spring Boot backend
│   ├── src/main/java/        # Java source code
│   │   └── com/LearningApp/User/
│   │       ├── controller/   # REST controllers
│   │       ├── service/      # Business logic
│   │       ├── repository/   # Data access layer
│   │       ├── model/        # Data models
│   │       ├── dto/          # Data transfer objects
│   │       ├── security/     # Security configuration
│   │       └── config/       # Application configuration
│   ├── src/main/resources/   # Configuration files
│   │   └── ai-assistant/     # AI assistant Python scripts
│   ├── pom.xml              # Maven dependencies
│   └── application.properties # Spring Boot configuration
├── package.json             # Root package.json with scripts
├── README.md               # This file
├── setup.bat              # Windows setup script
└── start.bat              # Easy startup script
```

## 🚀 Quick Start

### Prerequisites

- **Java 21+** (for backend)
- **Node.js 18+** (for frontend)
- **MongoDB** (cloud or local)
- **Google Gemini API Key**
- **LiveKit Account** (for real-time AI features)

### 1. Environment Setup

Create the following environment files:

#### Frontend Environment (frontend/.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Backend Environment (backend/.env)
```env
# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRATION_MS=86400000

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_secret
LIVEKIT_WS_URL=your_livekit_ws_url

# Server Configuration
SERVER_PORT=8080
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 2. Installation and Setup

#### Option 1: Automated Setup (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev
```

#### Option 2: Manual Setup
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies and compile
cd ../backend
mvn clean compile

# Start backend (in one terminal)
mvn spring-boot:run

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api/v1

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules + Tailwind CSS
- **State Management**: React Context + Hooks
- **Routing**: React Router
- **AI Integration**: Google Gemini API

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 21
- **Database**: MongoDB with Spring Data MongoDB
- **Security**: Spring Security + JWT
- **Authentication**: Role-based access control (RBAC)
- **API**: RESTful APIs with `/api/v1` prefix

### AI Assistant (CAI)
- **Text-based AI**: Google Gemini API integration
- **Real-time AI**: LiveKit agents with Python
- **Features**: Voice, video, and text interactions
- **Personality**: African-focused educational assistant

## 📊 Available Scripts

### Root Level Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run start` - Start both frontend and backend in production mode

### Frontend Scripts (in frontend/ directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts (in backend/ directory)
- `mvn spring-boot:run` - Start Spring Boot application
- `mvn clean package` - Build JAR file
- `mvn test` - Run tests

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/payment-method` - Add payment method

### Course Management
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/{id}` - Get course by ID
- `POST /api/v1/courses` - Create course (tutors only)
- `PUT /api/v1/courses/{id}` - Update course (tutors only)
- `DELETE /api/v1/courses/{id}` - Delete course (tutors only)

### Enrollment & Checkout
- `POST /api/v1/checkout/enroll` - Enroll in course
- `POST /api/v1/checkout/subscribe` - Subscribe to tutor
- `GET /api/v1/enrollments` - Get user enrollments

### Live Sessions
- `GET /api/v1/live-sessions` - Get live sessions
- `POST /api/v1/live-sessions` - Create live session (tutors only)
- `POST /api/v1/live-sessions/{id}/join` - Join live session

### AI Assistant
- `POST /api/v1/ai/chat` - Text-based AI chat
- `GET /api/v1/ai/get-api-key` - Get Gemini API key
- `POST /api/v1/live-ai/start` - Start real-time AI session

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/courses` - Get user courses
- `GET /api/v1/dashboard/analytics` - Get analytics data

## 🤖 AI Assistant Features

### Text-based CAI (Conversational AI)
- Interactive Q&A with African context
- Course recommendations
- Learning path suggestions
- Cultural relevance in responses

### Real-time AI (LiveKit Integration)
- Voice interactions
- Video tutoring sessions
- Screen sharing capabilities
- Real-time transcription

## 🛠️ Development

### Adding New Features
1. **Frontend**: Add components in `frontend/components/` and pages in `frontend/pages/`
2. **Backend**: Add controllers in `backend/src/main/java/com/LearningApp/User/controller/`
3. **Database**: Add models in `backend/src/main/java/com/LearningApp/User/model/`

### Code Style
- **Frontend**: TypeScript with React functional components
- **Backend**: Java with Spring Boot conventions
- **Database**: MongoDB with Spring Data

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@africai.com or join our Slack channel.

---

**AfricAI** - Empowering the next generation of African innovators through AI-driven education.