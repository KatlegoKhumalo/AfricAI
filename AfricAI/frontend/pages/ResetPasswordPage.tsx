import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');

    try {
      const response = await fetch(`/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password. The link may be invalid or expired.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
      <GlassCard className="max-w-md w-full p-8">
        {isSuccess ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Password Reset Successful</h1>
            <p className="text-gray-300">You can now log in with your new password.</p>
            <p className="text-gray-400 mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">Reset Your Password</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div>
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
            </form>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default ResetPasswordPage;
