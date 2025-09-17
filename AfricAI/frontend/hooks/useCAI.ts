import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Part } from "@google/genai";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    ImageCapture: any;
  }
}

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

const findBestVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    
    const preferredVoices = ["Zoe", "Samantha", "Google US English", "Victoria"];
    
    for (const name of preferredVoices) {
        const voice = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
        if (voice) return voice;
    }
    
    return voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en')) || null;
};

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

    const aiRef = useRef<GoogleGenAI | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
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

    const updateLastMessage = useCallback((textChunk: string) => {
        const lastMsgIndex = conversationHistoryRef.current.length - 1;
        if (lastMsgIndex >= 0 && conversationHistoryRef.current[lastMsgIndex].speaker === 'ai') {
            conversationHistoryRef.current[lastMsgIndex].text += textChunk;
            setTranscript([...conversationHistoryRef.current]);
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!text.trim()) {
            const fallbackText = "I'm sorry, I didn't catch that. Could you please repeat it?";
            addMessage('ai', fallbackText);
            // Recursively call speak to say the fallback message.
            // A small timeout can prevent potential rapid-fire loops if the API consistently returns empty strings.
            setTimeout(() => speak(fallbackText), 100);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (voiceRef.current) {
            utterance.voice = voiceRef.current;
            utterance.rate = 1.05;
            utterance.pitch = 1.1;
        }
        utterance.onstart = () => setAgentState(AgentState.SPEAKING);
        utterance.onend = () => {
            if (agentStateRef.current === AgentState.SPEAKING) {
                if (isMicActive) {
                    setAgentState(AgentState.LISTENING);
                } else {
                    setAgentState(AgentState.IDLE);
                }
            }
        };
        utterance.onerror = (e) => {
            if (e.error !== 'interrupted') console.error('Speech synthesis error:', e.error);
             setAgentState(AgentState.IDLE);
        };
        window.speechSynthesis.speak(utterance);
    }, [isMicActive, setAgentState, addMessage]);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (err: any) {
                if (err.name !== 'InvalidStateError') {
                    console.error('Speech recognition start error:', err);
                     if (agentStateRef.current === AgentState.LISTENING) {
                        setAgentState(AgentState.IDLE); // Go to idle on error
                    }
                }
            }
        }
    }, [setAgentState]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (err) {
                // Ignore errors, likely already stopped.
            }
        }
    }, []);
    
    const captureFrame = useCallback(async (): Promise<string | null> => {
        const stream = videoStreamRef.current;
        if (!stream?.active) return null;
        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) return null;

        try {
            const imageCapture = new window.ImageCapture(videoTrack);
            const blob = await imageCapture.takePhoto();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || null);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Could not capture frame:", error);
            return null;
        }
    }, []);

    const processUserInput = useCallback(async (text: string) => {
        if (!text.trim() || !aiRef.current) {
            if (isMicActive) setAgentState(AgentState.LISTENING);
            return;
        }
        addMessage('you', text);
        setAgentState(AgentState.PROCESSING);
        
        try {
            const frame = await captureFrame();
            const history = conversationHistoryRef.current.slice(0, -1).map(msg => ({
                role: msg.speaker === 'you' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const userParts: Part[] = [{ text }];
            if (frame) {
                userParts.push({ inlineData: { mimeType: 'image/jpeg', data: frame } });
            }
            
            const contents = [...history, { role: 'user', parts: userParts }];

            const stream = await aiRef.current.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents,
                config: { systemInstruction: CAI_SYSTEM_INSTRUCTION }
            });
            
            let fullResponse = "";
            let firstChunk = true;
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    if (firstChunk) {
                        addMessage('ai', chunkText);
                        firstChunk = false;
                    } else {
                        updateLastMessage(chunkText);
                    }
                    fullResponse += chunkText;
                }
            }
            speak(fullResponse);

        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMsg = "I'm sorry, I encountered a problem. Could you please say that again?";
            addMessage('ai', errorMsg);
            speak(errorMsg);
        }

    }, [captureFrame, speak, setAgentState, addMessage, updateLastMessage, isMicActive]);

     // Central effect to manage microphone state based on agent state
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        const handleRecognitionEnd = () => {
            if (agentStateRef.current === AgentState.LISTENING) {
                startListening();
            }
        };

        recognition.addEventListener('end', handleRecognitionEnd);

        if (agentState === AgentState.LISTENING) {
            startListening();
        } else {
            stopListening();
        }

        return () => {
            recognition.removeEventListener('end', handleRecognitionEnd);
        };
    }, [agentState, startListening, stopListening]);


    const connect = useCallback(async (userName: string) => {
        setConnectionState(ConnectionState.CONNECTING);
        conversationHistoryRef.current = [];
        setTranscript([]);

        try {
            // Request permission early. This is a crucial user interaction.
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // We only needed permission, not the stream itself yet.
            
            // Get API key from backend
            const token = localStorage.getItem('africai-token');
            if (!token) throw new Error("User not authenticated");
            
            const response = await fetch('/api/v1/ai/get-api-key', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("Failed to get API key");
            }
            
            const data = await response.json();
            const apiKey = data.apiKey;
            if (!apiKey) throw new Error("API_KEY not found.");
            aiRef.current = new GoogleGenAI({ apiKey });
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) throw new Error("Speech Recognition not supported.");
            
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';
            
            recognitionRef.current.onresult = (event: any) => {
                setAgentState(AgentState.PROCESSING);
                const userTranscript = event.results[0][0].transcript;
                processUserInput(userTranscript);
            };
            
            recognitionRef.current.onerror = (event: any) => {
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    console.error('Speech recognition error:', event.error);
                }
            };
            
            const loadVoices = () => { voiceRef.current = findBestVoice(); };
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();

            setConnectionState(ConnectionState.CONNECTED);
            setIsMicActive(true);
            
            const welcomeMessage = `Hello ${userName}, I'm CAI, your personal educational assistant from AfricAI. It's great to connect with you. How can I help you learn today?`;
            addMessage('ai', welcomeMessage);
            speak(welcomeMessage);

        } catch (error) {
            console.error("CAI Connection failed:", error);
            setConnectionState(ConnectionState.FAILED);
            // Show user-friendly error message
            const errorMsg = "I'm having trouble connecting right now. Please make sure you're logged in and try again.";
            addMessage('ai', errorMsg);
        }
    }, [processUserInput, setAgentState, addMessage, speak]);

    const disconnect = useCallback(() => {
        window.speechSynthesis.cancel();
        setAgentState(AgentState.IDLE);
        stopListening();
        aiRef.current = null;
        if (videoStreamRef.current) {
            videoStreamRef.current.getTracks().forEach(track => track.stop());
            videoStreamRef.current = null;
        }
        setConnectionState(ConnectionState.DISCONNECTED);
        setIsMicActive(false);
    }, [setAgentState, stopListening]);
    
    const toggleMic = useCallback(() => {
        const nextState = !isMicActive;
        setIsMicActive(nextState);
        if (connectionState === ConnectionState.CONNECTED) {
            if (nextState) {
                // If we are turning the mic on, immediately go to listening state
                window.speechSynthesis.cancel(); // Interrupt any ongoing speech
                setAgentState(AgentState.LISTENING);
            } else {
                // If we are turning it off, go to idle
                setAgentState(AgentState.IDLE);
            }
        }
    }, [isMicActive, connectionState, setAgentState]);

    const setVideoStream = (stream: MediaStream | null) => {
        videoStreamRef.current = stream;
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