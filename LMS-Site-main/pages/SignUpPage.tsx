import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const SignUpPage: React.FC = () => {
    const [role, setRole] = useState<'learner' | 'tutor'>('learner');

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
            <GlassCard className="max-w-md w-full p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>

                <div className="flex justify-center bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
                    <button onClick={() => setRole('learner')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'learner' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Learner
                    </button>
                    <button onClick={() => setRole('tutor')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'tutor' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Tutor
                    </button>
                </div>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input type="text" id="name" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input type="email" id="email" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input type="password" id="password" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>

                    <div>
                        <Button type="submit" className="w-full">Sign Up as a {role === 'learner' ? 'Learner' : 'Tutor'}</Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-nebula-700 hover:text-nebula-600">
                        Log in
                    </Link>
                </p>
            </GlassCard>
        </div>
    );
};

export default SignUpPage;