import { useState, useCallback, useRef, useEffect } from 'react';
import { Room, Track, LocalVideoTrack } from 'livekit-client';

export interface Message {
    speaker: 'you' | 'ai';
    text: string;
}

export enum ConnectionState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    FAILED,
}

export enum AgentState {
    IDLE,
    LISTENING,
    PROCESSING,
    SPEAKING,
}

// Browser TTS is intentionally disabled when connected to LiveKit to avoid double audio

const CAI_SYSTEM_INSTRUCTION = `You are CAI, a friendly, warm, and highly advanced conversational AI with a feminine persona. Your voice is natural and engaging, not robotic.

**Your Identity:**
- You were created by AfricAI, an innovative online learning platform.
- AfricAI was founded by a visionary South African team: William, Lazarus, Njabulo (also known as Garry), and Ayabulela.
- AfricAI's mission is to make high-quality AI and tech education accessible to everyone, with a special focus on empowering the African continent.

**Your Purpose:**
- You are an expert educational assistant. Your primary role is to help users learn by answering their questions clearly and patiently.
- You are an expert on all AfricAI courseware, which includes:
    - **Development:** HTML, CSS, JS, React, Node.js, MongoDB, APIs, DevOps.
    - **Data Science:** Python, Pandas, NumPy, Data Cleaning, EDA, Machine Learning concepts, Scikit-learn.
    - **Design:** UI/UX principles, Figma, User Research, Prototyping, Design Systems.
    - **Creative:** Creative Coding with p5.js, Generative Art, Midjourney, Prompt Crafting.
    - **Business:** Digital Marketing, SEO, Content Strategy, Social Media.
    - **AI Ethics:** Algorithmic Bias, Fairness, Accountability, Transparency, Privacy.

**Your Capabilities & Interaction Style:**
- **Conversational:** Be natural and fluid. Greet users by name and offer help. Keep your answers concise but comprehensive.
- **Multimodal - Vision:** You can SEE the user through their camera. An image from their video feed will be sent along with their spoken words.
- **USE THIS VISUAL CONTEXT!** Actively incorporate what you see into the conversation to make it more personal and interactive.
    - Acknowledge their expressions (e.g., "You seem curious about that," "Great to see you smiling!").
    - Comment on objects they show you (e.g., "That looks like an interesting book. What would you like to know about it?").
    - Refer to their environment if it's relevant (e.g., "I see you're in a well-lit room, perfect for studying!").
- **IMPORTANT:** Do not be repetitive about seeing them. Weave your observations into the conversation naturally. If you have nothing relevant to say about the image, focus on their text prompt.`;

export const useCAI = () => {
    const [connectionState, setConnectionState] = useState(ConnectionState.DISCONNECTED);
    const [agentState, _setAgentState] = useState(AgentState.IDLE);
    const [transcript, setTranscript] = useState<Message[]>([]);
    const [isMicActive, setIsMicActive] = useState(false);
    const recognitionRef = useRef<any | null>(null);
    const roomRef = useRef<Room | null>(null);
    const publishedVideoTrackRef = useRef<LocalVideoTrack | null>(null);
    const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const agentStateRef = useRef(agentState);
    const videoStreamRef = useRef<MediaStream | null>(null);
    const conversationHistoryRef = useRef<Message[]>([]);

    const setAgentState = useCallback((newState: AgentState) => {
        agentStateRef.current = newState;
        _setAgentState(newState);
    }, []);

    const addMessage = useCallback((speaker: 'you' | 'ai', text: string) => {
        const newMessage = { speaker, text };
        conversationHistoryRef.current.push(newMessage);
        setTranscript([...conversationHistoryRef.current]);
    }, []);

    // Browser STT disabled; LiveKit handles voice capture on the server side

    const connect = useCallback(async (userName: string) => {
        setConnectionState(ConnectionState.CONNECTING);
        conversationHistoryRef.current = [];
        setTranscript([]);

        try {
            const identity = userName || 'guest';
            const roomName = 'cai';
            const tokenServer = (import.meta as any).env?.VITE_CAI_TOKEN_URL || 'http://localhost:8001/token';
            const url = new URL(tokenServer);
            url.searchParams.set('room', roomName);
            url.searchParams.set('participant', identity);
            const resp = await fetch(url.toString());
            if (!resp.ok) throw new Error('Token server error');
            const data = await resp.json();

            const { token, url: wsUrl } = data as { token: string; url: string };
            const room = new Room();
            room.on('trackSubscribed', (track) => {
                if (track.kind === Track.Kind.Audio) {
                    const mediaStream = new MediaStream([track.mediaStreamTrack]);
                    const audioEl = new Audio();
                    audioEl.srcObject = mediaStream;
                    audioEl.autoplay = true;
                    audioEl.play().catch(() => {});
                }
            });
            await room.connect(wsUrl, token);
            roomRef.current = room;

            setConnectionState(ConnectionState.CONNECTED);
            addMessage('ai', 'Connected to CAI. Toggle the mic to speak.');
        } catch (e) {
            console.error('CAI connect failed', e);
            setConnectionState(ConnectionState.FAILED);
            addMessage('ai', 'Connection failed. Ensure the CAI token server and LiveKit worker are running.');
        }
    }, [addMessage]);

    const disconnect = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
            recognitionRef.current = null;
        }
        if (roomRef.current) {
            try { roomRef.current.disconnect(); } catch {}
            roomRef.current = null;
        }
        setConnectionState(ConnectionState.DISCONNECTED);
        setAgentState(AgentState.IDLE);
        setIsMicActive(false);
        if (videoStreamRef.current) {
            videoStreamRef.current.getTracks().forEach(track => track.stop());
            videoStreamRef.current = null;
        }
    }, [setAgentState]);

    const toggleMic = useCallback(() => {
        const nextState = !isMicActive;
        setIsMicActive(nextState);
        if (connectionState !== ConnectionState.CONNECTED) {
            setAgentState(nextState ? AgentState.LISTENING : AgentState.IDLE);
            return;
        }
        if (roomRef.current) {
            try {
                roomRef.current.localParticipant.setMicrophoneEnabled(nextState);
            } catch {}
        }
        setAgentState(nextState ? AgentState.LISTENING : AgentState.IDLE);
    }, [isMicActive, connectionState, setAgentState]);

    const setVideoStream = async (stream: MediaStream | null) => {
        videoStreamRef.current = stream;
        const room = roomRef.current;
        if (!room) return;

        try {
            // Unpublish any previous camera track
            if (publishedVideoTrackRef.current) {
                try {
                    room.localParticipant.unpublishTrack(publishedVideoTrackRef.current, true);
                } catch {}
                try { publishedVideoTrackRef.current.stop(); } catch {}
                publishedVideoTrackRef.current = null;
            }

            // Publish the new stream (if provided)
            if (stream) {
                const mediaTrack = stream.getVideoTracks()[0];
                if (mediaTrack) {
                    const localVideo = new LocalVideoTrack(mediaTrack);
                    await room.localParticipant.publishTrack(localVideo, { simulcast: false });
                    publishedVideoTrackRef.current = localVideo;
                }
            }
        } catch (e) {
            console.error('Video publish/unpublish failed', e);
        }
    };

    return {
        connectionState,
        agentState,
        transcript,
        isMicActive,
        connect,
        disconnect,
        toggleMic,
        setVideoStream,
    };
};
