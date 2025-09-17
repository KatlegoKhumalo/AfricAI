# Backend for the Learning App

This is the backend for the Learning App, a platform for online learning.

## Getting Started

This project uses Docker Compose to run the full stack, including the backend and frontend services.

### Prerequisites

-   [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose
-   A terminal or command line interface (like Git Bash for Windows users).
-   Your API keys for MongoDB Atlas, Gemini, and LiveKit.

### 1. Configure Environment Variables

The backend service requires a `.env` file for configuration. Create a file named `.env` inside the `backend/` directory.

```bash
touch backend/.env
```

Open this new `backend/.env` file and add the following variables, replacing the placeholder values with your actual credentials and keys:

```dotenv
# The full connection string for your MongoDB Atlas cluster.
MONGO_URI=mongodb+srv://<user>:<password>@<your-cluster-url>/<database>?retryWrites=true&w=majority&appName=<AppName>

# A secure secret for signing JWT tokens.
JWT_SECRET=a-very-strong-and-long-secret-key

# The expiration time for JWT tokens in milliseconds (e.g., 86400000 for 24 hours).
JWT_EXPIRATION_MS=86400000

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=your_livekit_websocket_url
```

### 2. Run the Application

With the `.env` file configured, you can run the entire application with a single command from the **root directory** of the project.

```bash
# Note: You may need to use 'sudo' depending on your Docker setup.
docker compose up --build
```

This command will:
1.  Build the Docker image for the backend service.
2.  Start the backend container.
3.  The application will be available on `http://localhost:8080`.

### 3. Running the Frontend

To interact with the application, you also need to run the frontend:

1.  Open a **new, separate terminal**.
2.  Navigate to the frontend directory:
    ```bash
    cd B/frontend
    ```
3.  Install dependencies and start the dev server:
    ```bash
    npm install
    npm run dev
    ```
4.  The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

## API Endpoints

The API is versioned with `/v1`. The API is also documented using Swagger, which you can access at `http://localhost:8080/swagger-ui.html` once the application is running.

### Public Endpoints

-   `POST /api/v1/auth/signup`: Register a new user.
-   `POST /api/v1/auth/login`: Log in a user.

### Authenticated Endpoints

#### Courses
-   `GET /api/v1/courses`: Get all courses.
-   `GET /api/v1/courses/{id}`: Get a course by ID.
-   `POST /api/v1/courses`: Create a new course.
-   `PUT /api/v1/courses/{id}`: Update a course.
-   `DELETE /api/v1/courses/{id}`: Delete a course.

#### Users
-   `GET /api/v1/auth/me`: Get the current authenticated user.

## Default Admin User

On first startup, the application will create a default administrator account with the following credentials:
-   **Email:** `admin@africai.com`
-   **Password:** `@00000000`
