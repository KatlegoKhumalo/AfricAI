

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Room,
  RoomEvent,
  LocalParticipant,
  RemoteParticipant,
  Participant,
  Track,
} from 'livekit-client';
import VideoTile from '../components/VideoTile';
import ControlButton from '../components/ControlButton';
import { MicIcon } from '../components/icons/MicIcon';
import { MicOffIcon } from '../components/icons/MicOffIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { VideoOffIcon } from '../components/icons/VideoOffIcon';
import { ScreenShareIcon } from '../components/icons/ScreenShareIcon';
import { PhoneOffIcon } from '../components/icons/PhoneOffIcon';
import { MessageCircleIcon } from '../components/icons/MessageCircleIcon';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

// In a real app, fetch these from your backend.
// The URL should point to your LiveKit server.
const LIVEKIT_URL = process.env.LIVEKIT_URL || 'wss://your-livekit-server-url.com';
// The token is a JWT that authenticates the user and grants access to a specific room.
// It MUST be generated on your server to keep the API key secret.
const getLiveKitToken = async (roomName: string, participantName: string) => {
    // Example: const response = await fetch(`/api/livekit/token?room=${roomName}&participant=${participantName}`);
    // const data = await response.json();
    // return data.token;
    
    // For this demo, we'll return a placeholder.
    // NOTE: This will not work without a valid token. The UI will show a disconnected state.
    return "YOUR_SERVER_GENERATED_TOKEN";
};


const LiveSessionPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [room, setRoom] = useState<Room | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isConnecting, setIsConnecting] = useState(true);

    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    const sessionTitle = `Live Session: ${sessionId}`;

    useEffect(() => {
        if (!user) return;

        const room = new Room({
            adaptiveStream: true,
            dynacast: true,
        });

        setRoom(room);

        const connectToRoom = async () => {
            try {
                // IMPORTANT: Replace this with your actual token generation logic
                const token = await getLiveKitToken(sessionId!, user.name);

                await room.connect(LIVEKIT_URL, token);
                
                await room.localParticipant.setCameraEnabled(true);
                await room.localParticipant.setMicrophoneEnabled(true);
                
                setIsConnecting(false);
                updateParticipants(room);
            } catch (error) {
                console.error("Failed to connect to LiveKit room", error);
                setIsConnecting(false);
                // Handle connection error (e.g., show a message to the user)
            }
        };

        connectToRoom();

        const updateParticipants = (currentRoom: Room) => {
            const allParticipants = [currentRoom.localParticipant, ...Array.from(currentRoom.remoteParticipants.values())];
            setParticipants(allParticipants);
        };

        const handleParticipantConnected = (participant: RemoteParticipant) => updateParticipants(room);
        const handleParticipantDisconnected = (participant: RemoteParticipant) => updateParticipants(room);

        room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

        return () => {
            room.disconnect();
        };
    }, [sessionId, user]);

    const toggleMic = async () => {
        if (room) {
            const enabled = !isMicOn;
            await room.localParticipant.setMicrophoneEnabled(enabled);
            setIsMicOn(enabled);
        }
    };

    const toggleCamera = async () => {
        if (room) {
            const enabled = !isCameraOn;
            await room.localParticipant.setCameraEnabled(enabled);
            setIsCameraOn(enabled);
        }
    };

    const handleLeave = () => {
        room?.disconnect();
        navigate(-1);
    };

    if (isConnecting) {
        return <div className="bg-black text-white h-screen flex items-center justify-center">Connecting to session...</div>;
    }

    return (
        <div className="bg-black text-white h-screen flex flex-col">
            <header className="p-4 flex justify-between items-center bg-black/50">
                <h1 className="text-xl font-semibold">{sessionTitle}</h1>
                <div className="text-sm">Participants: {participants.length}</div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
                    {participants.map(p => (
                        <VideoTile key={p.sid} participant={p} />
                    ))}
                </main>
            </div>

            <footer className="p-4 bg-black/50 flex justify-center">
                <GlassCard className="p-2 rounded-full">
                    <div className="flex items-center gap-4">
                        <ControlButton onClick={toggleMic} label={isMicOn ? 'Mute' : 'Unmute'} isActive={isMicOn}>
                            {isMicOn ? <MicIcon /> : <MicOffIcon />}
                        </ControlButton>
                        <ControlButton onClick={toggleCamera} label={isCameraOn ? 'Stop Video' : 'Start Video'} isActive={isCameraOn}>
                           {isCameraOn ? <VideoIcon /> : <VideoOffIcon />}
                        </ControlButton>
                         <ControlButton onClick={() => {}} label={'Share Screen'} isActive={isSharingScreen}>
                            <ScreenShareIcon />
                        </ControlButton>
                        <ControlButton onClick={() => setIsChatOpen(!isChatOpen)} label={isChatOpen ? 'Hide Chat' : 'Show Chat'} isActive={isChatOpen}>
                            <MessageCircleIcon />
                        </ControlButton>
                        <ControlButton onClick={handleLeave} label="Leave" variant="danger">
                            <PhoneOffIcon />
                        </ControlButton>
                    </div>
                </GlassCard>
            </footer>
        </div>
    );
};

export default LiveSessionPage;