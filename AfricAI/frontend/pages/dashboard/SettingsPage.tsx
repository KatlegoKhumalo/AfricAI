import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../../components/PaymentModal';
import { PaymentMethod } from '../../types';
import ConfirmationModal from '../../components/ConfirmationModal';

const SettingsPage: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFields({ ...passwordFields, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }

    const token = localStorage.getItem('africai-token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword
        })
      });

      if (res.ok) {
        setPasswordSuccess('Password updated successfully!');
        setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        setPasswordError(data.message || 'Failed to update password.');
      }
    } catch (error) {
      setPasswordError('An error occurred. Please try again.');
    }
  };

  const handleSavePaymentMethod = (paymentMethod: PaymentMethod) => {
    if(user) {
        const updatedUser = { ...user, paymentMethod };
        login(updatedUser, localStorage.getItem('africai-token') || '');
    }
  };

  const handleDeleteAccount = async (password?: string) => {
    if (!password) {
        // Handle case where password is required but not provided
        alert("Password is required to delete your account.");
        return;
    }
    const token = localStorage.getItem('africai-token');
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        });
        if (res.ok) {
            logout();
            window.location.href = '/';
        } else {
            // Handle error response
            alert("Failed to delete account. Please check your password and try again.");
        }
    } catch (error) {
        console.error("Error deleting account:", error);
        alert("An error occurred while deleting your account.");
    } finally {
        setIsDeleteModalOpen(false);
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
          {user?.paymentMethod ? (
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                <div>
                    <p className="font-semibold">{maskCardNumber(user.paymentMethod.cardNumber)}</p>
                    <p className="text-sm text-gray-400">Expires {user.paymentMethod.expiryDate}</p>
                </div>
                <Button variant="secondary" onClick={() => setIsPaymentModalOpen(true)}>Update Card</Button>
            </div>
          ) : (
            <div className="text-center py-4">
                <p className="text-gray-400 mb-4">You have no saved payment methods.</p>
                <Button onClick={() => setIsPaymentModalOpen(true)}>Add Payment Method</Button>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form className="space-y-4 max-w-lg" onSubmit={handleChangePassword}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Current Password</label>
              <input type="password" name="currentPassword" value={passwordFields.currentPassword} onChange={handlePasswordFieldChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">New Password</label>
              <input type="password" name="newPassword" value={passwordFields.newPassword} onChange={handlePasswordFieldChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordFields.confirmPassword} onChange={handlePasswordFieldChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-green-400">{passwordSuccess}</p>}
            <div className="pt-2">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
            <div>
              <h3 className="font-semibold">Delete Account</h3>
              <p className="text-sm text-red-300/80">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-500 focus:ring-red-500" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
          </div>
        </GlassCard>
      </div>
       <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={handleSavePaymentMethod}
            paymentDetails={{
                title: user?.paymentMethod ? 'Update Payment Method' : 'Add Payment Method',
                description: 'Securely save your card details for future purchases.',
                amount: null, // No charge for saving a card
            }}
        />
        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
            title="Delete Your Account"
            message="This action is irreversible. To proceed, please enter your password."
            confirmText="Delete My Account"
            requiresPassword={true}
        />
    </div>
  );
};

export default SettingsPage;