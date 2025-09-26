import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
      <GlassCard className="max-w-md w-full p-8">
        {isSubmitted ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>
            <p className="text-gray-300">
              If an account with that email exists, we've sent a link to reset your password.
            </p>
            <Link to="/login">
              <Button className="mt-6 w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Forgot Password</h1>
            <p className="text-center text-gray-400 mb-6">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </div>
              <div className="text-center">
                <Link to="/login" className="text-sm text-nebula-500 hover:underline">
                  Remember your password? Log in
                </Link>
              </div>
            </form>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default ForgotPasswordPage;
