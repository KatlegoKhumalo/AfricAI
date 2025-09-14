import React from 'react';
import AITutor from '../components/AITutor';
import GlassCard from '../components/GlassCard';

const AITutorPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">AI Tutor</h1>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl text-center">
                Have a question about any topic? Our AI tutor is here to help you 24/7.
                Just type your question below to get started.
            </p>
            <GlassCard className="w-full max-w-3xl p-6">
                <AITutor />
            </GlassCard>
        </div>
    );
};

export default AITutorPage;
