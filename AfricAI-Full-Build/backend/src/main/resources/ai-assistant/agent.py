from dotenv import load_dotenv
import os
import logging
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation
from livekit.plugins import google
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from tools import search_web, get_african_education_resources, explain_concept

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AfricAIAssistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=AGENT_INSTRUCTION,
            llm=google.beta.realtime.RealtimeModel(
                voice="Aoede",
                temperature=0.7,
            ),
            tools=[
                search_web,
                get_african_education_resources,
                explain_concept
            ],
        )

async def entrypoint(ctx: agents.JobContext):
    session = AgentSession()
    
    await session.start(
        room=ctx.room,
        agent=AfricAIAssistant(),
        room_input_options=RoomInputOptions(
            video_enabled=True,
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()

    await session.generate_reply(
        instructions=SESSION_INSTRUCTION,
    )

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
