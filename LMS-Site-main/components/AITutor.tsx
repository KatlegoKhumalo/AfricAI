import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SendIcon } from './icons/SendIcon';
import Button from './Button';

const AITutor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "You are an expert AI tutor for an online learning platform. Your role is to help students understand concepts from their courses. Be encouraging, clear, and provide helpful examples. Keep your answers concise and focused on the student's question.",
        },
      });
    } catch(err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during initialization.";
        setError(errorMessage);
        console.error(err);
    }
  }, []);

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
         {error && (
            <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-red-900/70 border border-red-500/50 text-red-200">
                   <p className="text-sm">{error}</p>
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
          placeholder="e.g., Explain RAG in simple terms..."
          className="flex-1 bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"
          disabled={isLoading || !chatRef.current}
        />
        <Button type="submit" variant="primary" disabled={isLoading || !prompt.trim() || !chatRef.current}>
          <SendIcon className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default AITutor;