import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Room, RoomEvent } from 'livekit-client';

const AfricAIPage: React.FC = () => {
    const { user, loading } = useAuth();
    const [room, setRoom] = useState<Room | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (user) {
            const connectToRoom = async () => {
                const response = await fetch('/api/v1/livekit/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomName: `africai-${user.id}`, identity: user.id }),
                });
                const { token } = await response.json();

                const newRoom = new Room();
                await newRoom.connect(import.meta.env.VITE_LIVEKIT_WS_URL, token);
                setRoom(newRoom);

                newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
                    const message = new TextDecoder().decode(payload);
                    setMessages((prev) => [...prev, message]);
                });
            };
            connectToRoom();
        }
        return () => {
            room?.disconnect();
        };
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <GlassCard className="p-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">Welcome to AfricAI</h1>
                    <p className="text-gray-300 mb-6">Please sign in to continue.</p>
                    <Link to="/login">
                        <Button>Sign In</Button>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white">
            <header className="bg-gray-900 text-white p-4 text-center">
                <h1 className="text-2xl font-bold">AfricAI</h1>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className="p-4 bg-gray-700 rounded-lg">
                            {msg}
                        </div>
                    ))}
                </div>
            </main>
            <footer className="p-4 bg-gray-900">
                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
                        placeholder="Type your message..."
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                const payload = new TextEncoder().encode(input);
                                room?.localParticipant.publishData(payload, {});
                                setInput('');
                            }
                        }}
                    />
                    <Button
                        className="rounded-r-lg"
                        onClick={() => {
                            const payload = new TextEncoder().encode(input);
                            room?.localParticipant.publishData(payload, {});
                            setInput('');
                        }}
                    >
                        Send
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default AfricAIPage;