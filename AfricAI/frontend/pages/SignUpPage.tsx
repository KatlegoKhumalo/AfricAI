

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const SignUpPage: React.FC = () => {
    const [role, setRole] = useState<'learner' | 'tutor'>('learner');
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

     const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: { name: '', email: '', password: '', confirmPassword: '' },
        validationRules: {
            name: validateName,
            email: validateEmail,
            password: validatePassword,
            confirmPassword: (val, formVals) => val !== formVals?.password ? "Passwords do not match." : null,
        },
        onSubmit: async (formValues) => {
            setServerError('');
            
            try {
                const response = await fetch('/api/v1/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formValues.name,
                        email: formValues.email,
                        password: formValues.password,
                        role: role
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Signup failed');
                }

                const data = await response.json();
                login(data.user, data.token);
                navigate('/dashboard');
            } catch (error) {
                console.error('Signup error:', error);
                setServerError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
            }
        },
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
            <GlassCard className="max-w-md w-full p-8">
                <Logo className="h-24 w-auto mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>

                <div className="flex justify-center bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
                    <button onClick={() => setRole('learner')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'learner' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Learner
                    </button>
                    <button onClick={() => setRole('tutor')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-all ${role === 'tutor' ? 'bg-nebula-600 text-white shadow' : 'text-gray-300'}`}>
                        I'm a Tutor
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input type="text" id="name" name="name" value={values.name} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input type="email" id="email" name="email" value={values.email} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input type="password" id="password" name="password" value={values.password} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                    
                    {serverError && <p className="text-red-400 text-sm text-center" aria-live="polite">{serverError}</p>}

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                           {isSubmitting ? 'Creating Account...' : `Sign Up as a ${role === 'learner' ? 'Learner' : 'Tutor'}`}
                        </Button>
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