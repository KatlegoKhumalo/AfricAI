import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { mockTutors, mockLearnerUser } from '../mockData'; // Assuming mock users are available for demo
import { User } from '../types';

const AuthPage: React.FC = () => {
    const [role, setRole] = useState<'learner' | 'tutor'>('learner');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        let userToLogin: User | null = null;
        if (role === 'learner') {
            // Demo login: find learner by email
            if (mockLearnerUser.email === identifier) {
                userToLogin = mockLearnerUser;
            }
        } else {
            // Demo login: find tutor by publicId
            const foundTutor = mockTutors.find(t => t.publicId === identifier);
            if (foundTutor) {
                userToLogin = {
                    id: foundTutor.id,
                    publicId: foundTutor.publicId,
                    name: foundTutor.name,
                    email: `${foundTutor.name.toLowerCase().replace(' ', '.')}@africai.com`,
                    avatarUrl: foundTutor.avatarUrl,
                    role: 'tutor',
                    bio: foundTutor.bio,
                    verified: foundTutor.verified,
                    joinDate: foundTutor.joinDate,
                };
            }
        }

        if (userToLogin) {
            login(userToLogin);
            navigate('/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
            <GlassCard className="max-w-md w-full p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>

                <div className="flex justify-center bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
                    <button onClick={() => setRole('learner')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'learner' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Learner
                    </button>
                    <button onClick={() => setRole('tutor')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'tutor' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Tutor
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-300">{role === 'learner' ? 'Email Address' : 'Tutor ID'}</label>
                        <input 
                          id="identifier" 
                          type={role === 'learner' ? 'email' : 'text'}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder={role === 'learner' ? 'you@example.com' : 'e.g., 1234567'}
                          className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input 
                          type="password" 
                          id="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-gray-700 border-gray-600 text-nebula-600 focus:ring-nebula-500 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-nebula-700 hover:text-nebula-600">Forgot password?</a>
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full">Log In</Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Not a member?{' '}
                    <Link to="/signup" className="font-medium text-nebula-700 hover:text-nebula-600">
                        Sign up now
                    </Link>
                </p>
            </GlassCard>
        </div>
    );
};

export default AuthPage;