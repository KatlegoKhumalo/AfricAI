import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../../components/PaymentModal';
import { PaymentMethod } from '../../types';

const SettingsPage: React.FC = () => {
  const { user, login } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSavePaymentMethod = (paymentMethod: PaymentMethod) => {
    if(user) {
        const updatedUser = { ...user, paymentMethod };
        login(updatedUser); // This will also update localStorage via the AuthContext
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
          <form className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-300">Current Password</label>
              <input type="password" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">New Password</label>
              <input type="password" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
              <input type="password" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
            </div>
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
            <Button className="bg-red-600 hover:bg-red-500 focus:ring-red-500">Delete Account</Button>
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
    </div>
  );
};

export default SettingsPage;