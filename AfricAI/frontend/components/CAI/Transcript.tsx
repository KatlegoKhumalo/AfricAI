

import React, { useRef, useEffect } from 'react';
import { UserIcon } from '../icons/UserIcon';

export interface Message {
    speaker: 'you' | 'ai';
    text: string;
}

interface TranscriptProps {
    messages: Message[];
    aiAvatarUrl: string;
}

const Transcript: React.FC<TranscriptProps> = ({ messages, aiAvatarUrl }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto p-4 space-y-6">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-4 ${msg.speaker === 'you' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${msg.speaker === 'ai' ? 'bg-nebula-700' : 'bg-gray-600'}`}>
                        {msg.speaker === 'ai' ? 
                            <img src={aiAvatarUrl} alt="CAI Avatar" className="w-full h-full object-cover" /> 
                            : <UserIcon />}
                    </div>
                    <div className={`p-4 rounded-lg max-w-lg ${msg.speaker === 'ai' ? 'bg-gray-800' : 'bg-nebula-800'}`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default Transcript;