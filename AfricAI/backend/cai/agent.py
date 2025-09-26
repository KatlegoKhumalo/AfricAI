from dotenv import load_dotenv
import os
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation
from livekit.plugins import google
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from tools import get_weather, search_web

load_dotenv()

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=AGENT_INSTRUCTION,
            llm=google.beta.realtime.RealtimeModel(
                voice="Aoede",
                temperature=0.8,
                api_key=os.getenv("GEMINI_API_KEY"),
            ),
            tools=[
                get_weather,
                search_web,
            ],
        )


async def entrypoint(ctx: agents.JobContext):
    session = AgentSession()

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            video_enabled=True,
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()

    # Generate initial greeting immediately upon connection
    await session.generate_reply(
        instructions=SESSION_INSTRUCTION,
    )

    # Keep the session alive for continuous conversation
    await session.wait_for_disconnect()


if __name__ == "__main__":
    # Configure worker to connect to LiveKit cloud
    worker_options = agents.WorkerOptions(entrypoint_fnc=entrypoint)
    worker_options.ws_url = os.getenv("LIVEKIT_WS_URL")
    worker_options.api_key = os.getenv("LIVEKIT_API_KEY")
    worker_options.api_secret = os.getenv("LIVEKIT_API_SECRET")
    # Avoid port conflicts for the local health/metrics HTTP server by using an ephemeral port
    try:
        http_port_env = os.getenv("CAI_HTTP_PORT", "0")
        worker_options.http_port = int(http_port_env)
    except Exception:
        worker_options.http_port = 0

    agents.cli.run_app(worker_options)
