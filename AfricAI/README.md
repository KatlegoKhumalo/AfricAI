# AfricAI: AI-Powered Learning Platform

Welcome to AfricAI, an innovative learning platform that combines a robust Python backend with a modern React frontend and a new, integrated AI conversational assistant, AfricAI.

## Getting Started

To get the entire AfricAI system up and running, simply run the `start_africai_system.bat` script from the root of the project:

```bash
start_africai_system.bat
```

This script will automate the following steps:
1.  Install all the necessary Python dependencies for the backend and AfricAI agent.
2.  Install all the necessary npm packages for the frontend.
3.  Start both the backend agent and the frontend development server in separate console windows.

### Manual Setup

If you prefer to run the components manually, follow these steps:

#### Backend & AfricAI Agent

The backend and the new AfricAI agent are built in Python and are located in the `backend` directory.

**Prerequisites:**
- Python 3.8+
- LiveKit account and API keys
- Google Gemini API key

**Setup:**
1.  **Set Environment Variables:**
    Create a `.env` file in the `backend` directory and add the following, replacing the placeholder values with your actual keys:
    ```
    GEMINI_API_KEY="your_google_gemini_api_key"
    LIVEKIT_API_KEY="your_livekit_api_key"
    LIVEKIT_API_SECRET="your_livekit_api_secret"
    LIVEKIT_WS_URL="your_livekit_ws_url"
    ```
2.  **Install Dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
3.  **Start the Agent:**
    ```bash
    cd backend
    python agent.py
    ```

#### Frontend

The frontend is a modern React application built with Vite.

**Setup:**
1.  **Install Dependencies:**
    ```bash
    cd frontend
    npm install
    ```
2.  **Start the Development Server:**
    ```bash
    cd frontend
    npm run dev
    ```

### AfricAI Features

- **Voice Interaction:** Real-time speech-to-speech conversation.
- **Innovative and Versatile:** A smart, African-centered AI assistant.
- **Tools:** Includes weather lookup and web search capabilities.
- **Multimodal:** Can process video input for visual context.
- **Sign-In Gated:** Access to the agent is secured behind user authentication.