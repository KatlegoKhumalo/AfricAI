

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { mockTutors, mockLearnerUser } from '../mockData'; // Assuming mock users are available for demo
import { User } from '../types';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validation';
import Logo from '../components/Logo';

const AuthPage: React.FC = () => {
    const [role, setRole] = useState<'learner' | 'tutor'>('learner');
    const [serverError, setServerError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm({
        initialValues: { identifier: '', password: '' },
        validationRules: {
            identifier: (val) => role === 'learner' ? validateEmail(val) : (!val ? 'Tutor ID is required.' : null),
            password: (val) => !val ? 'Password is required.' : null,
        },
        onSubmit: async (formValues) => {
            setServerError('');
            
            try {
                const response = await fetch('/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identifier: formValues.identifier,
                        password: formValues.password,
                        role: role
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Login failed');
                }

                const data = await response.json();
                login(data.user, data.token);
                navigate('/dashboard');
            } catch (error) {
                console.error('Login error:', error);
                setServerError(error instanceof Error ? error.message : 'Login failed. Please try again.');
            }
        },
    });

    const handleRoleChange = (newRole: 'learner' | 'tutor') => {
        setRole(newRole);
        setServerError('');
        setValues({ identifier: '', password: '' }); // Reset form on role change
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
            <GlassCard className="max-w-md w-full p-8">
                <Logo className="h-24 w-auto mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>

                <div className="flex justify-center bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
                    <button onClick={() => handleRoleChange('learner')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'learner' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Learner
                    </button>
                    <button onClick={() => handleRoleChange('tutor')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'tutor' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Tutor
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-300">{role === 'learner' ? 'Email Address' : 'Tutor ID'}</label>
                        <input 
                          id="identifier" 
                          name="identifier"
                          type={role === 'learner' ? 'email' : 'text'}
                          value={values.identifier}
                          onChange={handleChange}
                          placeholder={role === 'learner' ? 'alex.doe@example.com' : 'e.g., 1234567'}
                          className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.identifier ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                        {errors.identifier && <p className="text-red-400 text-xs mt-1">{errors.identifier}</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input 
                          type="password" 
                          id="password" 
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {serverError && <p className="text-red-400 text-sm text-center" aria-live="polite">{serverError}</p>}

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-gray-700 border-gray-600 text-nebula-600 focus:ring-nebula-500 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-300">Remember me</label>
                        </div>
                        <a href="#" className="font-medium text-nebula-700 hover:text-nebula-600">Forgot password?</a>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Logging In...' : 'Log In'}
                        </Button>
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