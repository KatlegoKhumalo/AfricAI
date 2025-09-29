## AfricAI – Deploy and Run Guide

This repo contains:
- Frontend (Vite + React + Tailwind) in `frontend/`
- Java backend (Spring Boot) in `backend/`
- CAI realtime voice agent (Python) and a lightweight token server (FastAPI) in `backend/cai/`

You can run everything locally with one click, and you can deploy the pieces to Vercel (frontend) and Render (backend + Python services). Hostinger can be used for Java with Docker or as a VM/VPS; instructions below focus on Render + Vercel.


### Quick Start (Local)

Requirements
- Node 18+ and npm
- Java 21 (set `JAVA_HOME`)
- Python 3.10+

Environment Vars you must have (you get the first 3 from LiveKit Cloud; the fourth from Google AI Studio):
- `LIVEKIT_WS_URL` e.g. `wss://<your-subdomain>.livekit.cloud`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `GEMINI_API_KEY`

One click boot
1) Double‑click `start_africai_system.bat` (Windows). It will launch:
   - Spring Boot backend
   - CAI token server (FastAPI) on port 8001 and Python CAI worker
   - Frontend (Vite) on port 5173
2) Open `http://localhost:5173/#/cai` to use voice-to-voice CAI; `/#/about` for About; `/dashboard` for dashboards, etc.

If Windows prompts for firewall access, allow Python and Node to communicate on private networks.


### Project Layout

```
backend/                     # Spring Boot app
  src/main/java/com/project  # Java sources
  pom.xml
  cai/
    agent.py                 # Python CAI agent (Gemini Realtime via LiveKit)
    token_server.py          # FastAPI token signer → returns { token, url }
    requirements.txt         # fastapi, uvicorn, PyJWT, livekit-agents, plugins
frontend/                    # Vite + React app
  package.json
  public/assets/images       # Put team photos here (william.jpg, njabulo.jpg, ...)
```


### Environment Variables

Backend (Spring Boot)
- `MONGO_URI` – your MongoDB URI
- `JWT_SECRET` – long random string
- `JWT_EXPIRATION_MS` – e.g. `86400000`
- `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_WS_URL`

Python CAI (token server + worker)
- `GEMINI_API_KEY`
- `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_WS_URL`
- optional `CAI_TOKEN_PORT` (defaults 8001), `CAI_HTTP_PORT` (worker http)

Frontend (Vite)
- `VITE_API_BASE_URL` – e.g. `https://your-backend.onrender.com/api/v1`
- `VITE_CAI_TOKEN_URL` – e.g. `https://your-cai-token.onrender.com/token`


### Deploy – Frontend (Vercel)

1) Push your repo to GitHub.
2) Create a new Vercel project and import the repo. Root directory: `frontend`.
3) Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output dir: `dist`
4) Add Environment Variables in Vercel → Settings → Environment Variables:
   - `VITE_API_BASE_URL` → your Render backend URL like `https://africai-backend.onrender.com/api/v1`
   - `VITE_CAI_TOKEN_URL` → your Render token server URL like `https://africai-cai-token.onrender.com/token`
5) Deploy. Visit the assigned URL.

Static assets like team photos should be committed under `frontend/public/assets/images/` with these names so About page finds them:
- `william.jpg`, `njabulo.jpg`, `botlhale.jpg`, `ayabulela.jpg`


### Deploy – Backend (Render)

We’ll deploy the Spring Boot app as a Render Web Service.

1) In Render, create a new Web Service from your GitHub repo.
2) Root directory: `backend`.
3) Build command:
```
./mvnw -DskipTests=true clean package
```
4) Start command:
```
java -jar target/*.jar
```
5) Environment → add:
   - `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRATION_MS`
   - `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_WS_URL`
6) Save and deploy. Copy the service URL and set it as `VITE_API_BASE_URL` on Vercel.


### Deploy – CAI Token Server (Render)

This signs LiveKit tokens. It’s a lightweight FastAPI service.

1) Create a new Web Service in Render → Root: `backend/cai`.
2) Build command:
```
pip install -r requirements.txt
```
3) Start command:
```
uvicorn token_server:app --host 0.0.0.0 --port $PORT
```
4) Environment → add:
   - `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_WS_URL`
5) Deploy. Copy the URL and set on Vercel as `VITE_CAI_TOKEN_URL` (append `/token`).


### Deploy – CAI Python Agent Worker (Render)

This is a worker that connects to LiveKit Cloud and streams realtime Gemini.

1) Create a new Background Worker service in Render → Root: `backend/cai`.
2) Build command:
```
    pip install -r requirements.txt
    ```
3) Start command:
```
    python agent.py
    ```
4) Environment → add:
   - `GEMINI_API_KEY`
   - `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_WS_URL`
5) Deploy. Confirm logs show the worker connected to LiveKit.

Note: Workers do not accept web traffic; they maintain a persistent connection to LiveKit.


### Hostinger Notes (Alternative)

- Shared hosting usually won’t support Java + Python workers. Use a Cloud/VPS plan or Docker containers.
- If you have a VPS with Docker, run three services:
  - Java backend image
  - FastAPI token server image (expose 8001 → 443 via reverse proxy)
  - Python agent worker image (no public port; outbound only)
- Point the frontend (Vercel) to your VPS HTTPS URLs.


### Pricing Rules (Frontend)

- Course prices are enforced to R49–R99 everywhere:
  - UI validation (create/edit forms)
  - Client-side service clamps values before save
  - Mock data generation maps prices into this range


### Images for About Page

Put the following in `frontend/public/assets/images/`:
- `william.jpg`  `njabulo.jpg`  `botlhale.jpg`  `ayabulela.jpg`

The About page also has a fallback to a Picsum placeholder if a file is missing.


### Troubleshooting

LiveKit cannot connect
- Ensure `LIVEKIT_WS_URL` is exactly the Cloud URL (wss://...). No trailing slash.
- Verify DNS: open `https://<subdomain>.livekit.cloud/` in the browser.
- Fix system time if JWTs fail (iat/exp must be valid).
- Allow outbound 443 in the firewall for Python and Java.

Token server 404 or CORS
- Confirm Render token server is running and exposes `/token`.
- On the frontend, set `VITE_CAI_TOKEN_URL` to the full URL including `/token`.

Missing team photos on About
- Confirm the files exist under `frontend/public/assets/images/` with the exact names above.
- Hard refresh the browser (Ctrl+Shift+R).

Admin/dash buttons not responding
- Buttons now default to `type="button"` to avoid form-submit side effects.

Voice transcription “network”/permission errors
- Mic blocked: allow mic in the browser.
- Network hiccup: the UI shows a friendly message; retry recording.


### Scripts

- `start_africai_system.bat` – launches backend, CAI token server + agent, and frontend for local dev.
- `start-backend.bat`, `start-frontend.bat`, `start-cai-agent.bat` – individual runners.


### License

Proprietary – All rights reserved by the AfricAI team.