import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCAI, ConnectionState, AgentState } from '../hooks/useCAI';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Transcript from '../components/CAI/Transcript';
import { MicIcon } from '../components/icons/MicIcon';
import { MicOffIcon } from '../components/icons/MicOffIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { PhoneOffIcon } from '../components/icons/PhoneOffIcon';
import Logo from '../components/Logo';
import { VideoIcon } from '../components/icons/VideoIcon';
import { VideoOffIcon } from '../components/icons/VideoOffIcon';
import type { LucideIconProps } from '../components/icons/LucideIcon';

// Helper to format seconds into MM:SS
const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CallControlButton: React.FC<{
    onClick: () => void;
    label: string;
    Icon: React.FC<LucideIconProps>;
    isActive?: boolean;
    isDanger?: boolean;
    isListening?: boolean;
}> = ({ onClick, label, Icon, isActive, isDanger, isListening }) => {
    const baseClasses = 'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 relative';
    const colorClasses = isDanger
        ? 'bg-red-600 hover:bg-red-500'
        : isActive
        ? 'bg-white/30'
        : 'bg-white/10 hover:bg-white/20';

    return (
        <div className="flex flex-col items-center gap-2 w-20 text-center">
            <button onClick={onClick} className={`${baseClasses} ${colorClasses}`} aria-label={label}>
                 {isListening && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                )}
                <Icon className="w-7 h-7 text-white relative" />
            </button>
            <span className="text-xs font-semibold truncate">{label}</span>
        </div>
    );
};

const CAIPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { 
        connectionState, 
        agentState, 
        transcript, 
        connect, 
        disconnect, 
        isMicActive,
        toggleMic,
        setVideoStream 
    } = useCAI();

    const [isVideoOn, setIsVideoOn] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    
    const caiAvatarUrl = 'https://i.pravatar.cc/150?u=africai-cai-agent';

    useEffect(() => {
        if (connectionState === ConnectionState.CONNECTED) {
            const timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCallDuration(0);
        }
    }, [connectionState]);

    const handleConnect = () => {
        if (user) {
            connect(user.name);
        } else {
            alert("Please log in to use CAI.");
            navigate('/login');
        }
    };
    
    const handleDisconnect = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setVideoStream(null);
        setIsVideoOn(false);
        disconnect();
    }

    const toggleVideo = async () => {
        if (isVideoOn) {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
                setVideoStream(null);
            }
            setIsVideoOn(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setVideoStream(stream);
                setIsVideoOn(true);
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access the camera. Please check your browser permissions.");
            }
        }
    };

    const getAgentStatusText = () => {
        switch (agentState) {
            case AgentState.LISTENING: return "Listening...";
            case AgentState.PROCESSING: return "CAI is thinking...";
            case AgentState.SPEAKING: return "CAI is speaking...";
            case AgentState.IDLE: 
                return connectionState === ConnectionState.CONNECTED 
                    ? (isMicActive ? "Ready..." : "Mic is muted")
                    : "Ready to connect";
            default: return "";
        }
    };
    
    const renderConnectedView = () => (
        <div className="w-full h-full flex flex-col p-4 md:p-6">
             <header className="absolute top-6 left-6 z-30">
                <button onClick={() => navigate('/')} aria-label="Go to homepage"><Logo className="h-12 w-auto" /></button>
            </header>
             {isVideoOn && (
                <div className="absolute top-6 right-6 w-48 h-auto aspect-video rounded-lg overflow-hidden z-20 shadow-lg border-2 border-white/20">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"></video>
                </div>
            )}
            <div className="flex-shrink-0 text-center py-4 z-10">
                <div className="relative inline-block">
                    <img src={caiAvatarUrl} alt="CAI Avatar" className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-nebula-600"/>
                     {agentState === AgentState.SPEAKING && (
                        <span className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-blue-400 animate-ping"></span>
                    )}
                </div>
                <h2 className="text-2xl font-semibold">CAI</h2>
                <p className="text-gray-300 font-mono tracking-wider">{formatDuration(callDuration)}</p>
                <p className="text-sm text-nebula-400 mt-1 h-5">{getAgentStatusText()}</p>
            </div>
            
            <Transcript messages={transcript} aiAvatarUrl={caiAvatarUrl} />

            <footer className="w-full max-w-sm mx-auto flex items-center justify-center pt-4 mt-auto z-10">
                <GlassCard className="p-2 rounded-full">
                    <div className="flex items-center gap-4 px-2">
                         <CallControlButton 
                            onClick={toggleMic}
                            label={isMicActive ? "Mute" : "Unmute"}
                            Icon={isMicActive ? MicIcon : MicOffIcon}
                            isActive={!isMicActive}
                            isListening={agentState === AgentState.LISTENING}
                         />
                         <CallControlButton 
                            onClick={toggleVideo}
                            label={isVideoOn ? "Cam Off" : "Cam On"}
                            Icon={isVideoOn ? VideoIcon : VideoOffIcon}
                            isActive={isVideoOn}
                         />
                         <CallControlButton 
                            onClick={handleDisconnect}
                            label="End Call"
                            Icon={PhoneOffIcon}
                            isDanger
                         />
                    </div>
                </GlassCard>
            </footer>
        </div>
    );
    
    const renderDisconnectedView = () => (
        <div className="flex flex-col items-center justify-center h-full">
            <header className="absolute top-6 left-6 z-10">
                <button onClick={() => navigate('/')} aria-label="Go to homepage"><Logo className="h-12 w-auto" /></button>
            </header>
            <GlassCard className="p-12 flex flex-col items-center text-center">
                <Logo className="h-24 w-auto mb-6" />
                <h1 className="text-3xl font-bold mb-2">CAI</h1>
                <p className="text-gray-400 mb-8 max-w-sm">
                    Experience a seamless, real-time voice conversation with our advanced AI assistant.
                </p>
                {connectionState === ConnectionState.DISCONNECTED && (
                    <Button size="lg" onClick={handleConnect}>
                        <PhoneIcon className="w-5 h-5 mr-2"/>
                        Start Conversation
                    </Button>
                )}
                {connectionState === ConnectionState.CONNECTING && (
                     <div className="flex items-center gap-2 text-lg">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        Connecting...
                     </div>
                )}
                {connectionState === ConnectionState.FAILED && (
                    <div className="text-center">
                        <p className="text-red-400 mb-4">Connection Failed. Please try again.</p>
                        <Button size="lg" onClick={handleConnect}>
                            <PhoneIcon className="w-5 h-5 mr-2"/>
                            Retry
                        </Button>
                    </div>
                )}
            </GlassCard>
        </div>
    );

    return (
        <div className="h-screen w-screen text-white flex flex-col items-center justify-center relative overflow-hidden">
            {connectionState === ConnectionState.CONNECTED ? renderConnectedView() : renderDisconnectedView()}
        </div>
    );
};

export default CAIPage;
