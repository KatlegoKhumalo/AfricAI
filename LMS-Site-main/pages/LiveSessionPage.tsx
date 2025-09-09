import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoTile from '../components/VideoTile';
import ControlButton from '../components/ControlButton';
import { MicIcon } from '../components/icons/MicIcon';
import { MicOffIcon } from '../components/icons/MicOffIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { VideoOffIcon } from '../components/icons/VideoOffIcon';
import { ScreenShareIcon } from '../components/icons/ScreenShareIcon';
import { PhoneOffIcon } from '../components/icons/PhoneOffIcon';
import { MessageCircleIcon } from '../components/icons/MessageCircleIcon';
import { mockTutors, mockLearnerUser } from '../mockData';
import GlassCard from '../components/GlassCard';

const participants = [
    { ...mockTutors[0], isSelf: false, isMuted: false },
    { ...mockLearnerUser, isSelf: true, isMuted: true },
    // FIX: Added 'id' to ensure all participant objects have a unique key.
    { id: 'jane-smith', name: "Jane Smith", avatarUrl: "https://i.pravatar.cc/150?u=jane", isSelf: false, isMuted: false },
    { id: 'john-doe', name: "John Doe", avatarUrl: "https://i.pravatar.cc/150?u=john", isSelf: false, isMuted: true },
];

const LiveSessionPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    
    const [isMicOn, setIsMicOn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    // In a real app, sessionId would be used to fetch session details.
    const sessionTitle = `Live Q&A for AI-Powered Web Development`;

    const handleLeave = () => {
        // In a real app, this would disconnect from the session.
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="bg-black text-white h-screen flex flex-col">
            <header className="p-4 flex justify-between items-center bg-black/50">
                <h1 className="text-xl font-semibold">{sessionTitle}</h1>
                <div className="text-sm">Session ID: {sessionId}</div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content: Video Grid */}
                <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
                    {participants.map(p => (
                        <VideoTile key={p.id} name={p.name} avatarUrl={p.avatarUrl} isSelf={p.isSelf} isMuted={p.isMuted} />
                    ))}
                </main>

                {/* Chat Panel */}
                {isChatOpen && (
                    <aside className="w-80 bg-gray-900/70 backdrop-blur-sm border-l border-white/10 flex flex-col">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="font-semibold">Session Chat</h2>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                           {/* Chat messages would go here */}
                           <div className="text-sm">
                               <p className="font-semibold text-nebula-600">Jane Smith</p>
                               <p className="bg-gray-700 p-2 rounded-lg mt-1">Great question about RAG!</p>
                           </div>
                           <div className="text-sm text-right">
                               <p className="font-semibold text-blue-400">You</p>
                               <p className="bg-blue-600 inline-block p-2 rounded-lg mt-1">Thanks!</p>
                           </div>
                        </div>
                        <div className="p-4 border-t border-white/10">
                            <input type="text" placeholder="Type a message..." className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"/>
                        </div>
                    </aside>
                )}
            </div>

            {/* Control Bar */}
            <footer className="p-4 bg-black/50 flex justify-center">
                <GlassCard className="p-2 rounded-full">
                    <div className="flex items-center gap-4">
                        <ControlButton onClick={() => setIsMicOn(!isMicOn)} label={isMicOn ? 'Mute' : 'Unmute'} isActive={isMicOn}>
                            {isMicOn ? <MicIcon /> : <MicOffIcon />}
                        </ControlButton>
                        <ControlButton onClick={() => setIsCameraOn(!isCameraOn)} label={isCameraOn ? 'Stop Video' : 'Start Video'} isActive={isCameraOn}>
                           {isCameraOn ? <VideoIcon /> : <VideoOffIcon />}
                        </ControlButton>
                         <ControlButton onClick={() => setIsSharingScreen(!isSharingScreen)} label={isSharingScreen ? 'Stop Sharing' : 'Share Screen'} isActive={isSharingScreen}>
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