from dotenv import load_dotenv
import os
import threading
from flask import Flask, jsonify
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation
from livekit.plugins import google
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from tools import get_weather, search_web  # removed send_email

load_dotenv()

# Flask App for API Key
flask_app = Flask(__name__)

@flask_app.route('/api/v1/ai/get-api-key', methods=['GET'])
def get_api_key():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "GEMINI_API_KEY not found in environment"}), 404
    return jsonify({"apiKey": api_key})

def run_flask_app():
    # Use a different port for Flask to avoid conflict with other services
    flask_app.run(port=5001)

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=AGENT_INSTRUCTION,
            llm=google.beta.realtime.RealtimeModel(
                voice="Aoede",
                temperature=0.8,
            ),
            tools=[
                get_weather,
                search_web,  # only the active tools
            ],
        )


async def entrypoint(ctx: agents.JobContext):
    session = AgentSession()

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation
            # - If self-hosting, omit this parameter
            # - For telephony applications, use `BVCTelephony` for best results
            video_enabled=True,
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()

    await session.generate_reply(
        instructions=SESSION_INSTRUCTION,
    )


if __name__ == "__main__":
    # Start Flask app in a background thread
    flask_thread = threading.Thread(target=run_flask_app, daemon=True)
    flask_thread.start()

    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
