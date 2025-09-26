import os
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt

# Environment configuration
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "")
LIVEKIT_WS_URL = os.getenv("LIVEKIT_WS_URL", "")

app = FastAPI(title="CAI Token Server", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TokenResponse(BaseModel):
    token: str
    url: str


def _ensure_config():
    if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET or not LIVEKIT_WS_URL:
        raise HTTPException(
            status_code=500,
            detail="Missing LiveKit configuration: set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_WS_URL",
        )


@app.get("/token", response_model=TokenResponse)
def get_token(room: str, participant: str) -> TokenResponse:
    _ensure_config()

    now = datetime.now(tz=timezone.utc)
    exp = now + timedelta(hours=1)

    payload = {
        "iss": LIVEKIT_API_KEY,
        "sub": participant,
        "aud": "livekit",
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        # LiveKit room grants
        "video": {
            "room": room,
            "roomJoin": True,
            "canPublish": True,
            "canSubscribe": True,
            "canPublishData": True,
        },
    }

    token = jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")
    return TokenResponse(token=token, url=LIVEKIT_WS_URL)


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("CAI_TOKEN_PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)


