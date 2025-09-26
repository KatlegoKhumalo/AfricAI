import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SendIcon } from './icons/SendIcon';
import Button from './Button';
import { MicIcon } from './icons/MicIcon';
import { useSpeechToText } from '../hooks/useSpeechToText';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const AITutor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New: speech-to-text hook
  const {
    isSupported: sttSupported,
    isRecording,
    isPermissionDenied,
    error: sttHookError,
    start: startRecording,
    stop: stopRecording,
    resetError: resetSttError,
  } = useSpeechToText({
    onFinalResult: (text) => {
      setPrompt((prev) => (prev ? prev + ' ' + text : text));
    },
  });

  useEffect(() => {
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollToBottom();
  }, [messages, isLoading]);

  // Step 1: Read API Key from Vite env and gate behind sign-in
  useEffect(() => {
        setIsInitializing(true);
        setError(null);
        try {
            const user = JSON.parse(localStorage.getItem('africai-user') || '{}');
      if (!user?.id) {
        setError('Please sign in to use the AI Tutor.');
        setIsInitializing(false);
        return;
      }

      const envKey = (process.env.GEMINI_API_KEY || process.env.API_KEY) as string | undefined;
      if (!envKey || !envKey.trim()) {
        setError('AI Tutor is not configured. Missing GEMINI_API_KEY.');
        setIsInitializing(false);
        return;
      }
      setApiKey(envKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to initialize AI Tutor: ${errorMessage}`);
            setIsInitializing(false);
            console.error(err);
        }
  }, []);

  // Step 2: Initialize GoogleGenAI client when the key is available
  useEffect(() => {
      if(apiKey) {
          try {
              const ai = new GoogleGenAI({ apiKey });
              chatRef.current = ai.chats.create({
                  model: 'gemini-2.5-flash',
                  config: {
                      systemInstruction: "You are an expert AI tutor for an online learning platform. Your role is to help students understand concepts from their courses. Be encouraging, clear, and provide helpful examples. Keep your answers concise and focused on the student's question.",
                  },
              });
              setIsInitializing(false);
          } catch(err) {
              const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during initialization.";
              setError(errorMessage);
              setIsInitializing(false);
              console.error(err);
          }
      }
  }, [apiKey]);
  
  // Update internal UI error state based on hook
  useEffect(() => {
    if (sttHookError) setSttError(sttHookError);
    else setSttError(null);
  }, [sttHookError]);

  const handleListen = async () => {
    setSttError(null);
    try {
      if (isRecording) {
        stopRecording();
        return;
      }
      await startRecording();
    } catch (e) {
      setSttError('Network or microphone issue. Check connection and permissions.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || !chatRef.current) return;

    const userMessage = { role: 'user' as const, text: prompt };
    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt('');
    setIsLoading(true);
    setError(null);

    try {
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: currentPrompt });
      const modelMessage = { role: 'model' as const, text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get response from AI Tutor. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderText = () => {
      if (isInitializing) return "Initializing AI Tutor...";
      if (error) return error;
      if (sttError) return sttError;
      if (isRecording) return "Listening...";
      return "e.g., Explain RAG in simple terms...";
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <div className="h-64 overflow-y-auto mb-4 pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-gradient-to-r from-nebula-700 to-nebula-600' : 'bg-gray-700'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
         {(error || sttError) && !isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-red-900/70 border border-red-500/50 text-red-200">
                   <p className="text-sm">{error || sttError}</p>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={getPlaceholderText()}
          className="flex-1 bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || isInitializing || !!error}
        />
        {sttSupported && (
             <Button type="button" variant="secondary" onClick={handleListen} disabled={isInitializing} aria-label="Use microphone">
            <MicIcon className={`w-5 h-5 ${isRecording ? 'text-red-400 animate-pulse' : ''}`} />
             </Button>
        )}

        <Button type="submit" variant="primary" disabled={isLoading || !prompt.trim() || isInitializing || !!error} aria-label="Send message">
          <SendIcon className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default AITutor;