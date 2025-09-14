import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../../components/PaymentModal';
import { PaymentMethod } from '../../types';
import { useForm } from '../../hooks/useForm';
import { validatePassword } from '../utils/validation';

const SettingsPage: React.FC = () => {
  const { user, login } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  const passwordForm = useForm({
    initialValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
    validationRules: {
        currentPassword: (val) => !val ? 'Current password is required.' : null,
        newPassword: validatePassword,
        confirmNewPassword: (val, formVals) => val !== formVals?.newPassword ? 'Passwords do not match.' : null,
    },
    onSubmit: async (values) => {
        // Mock API call
        console.log('Updating password:', values);
        await new Promise(res => setTimeout(res, 1000));
        setPasswordUpdateSuccess(true);
        passwordForm.resetForm();
        setTimeout(() => setPasswordUpdateSuccess(false), 3000);
    }
  });

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
          <form onSubmit={passwordForm.handleSubmit} className="space-y-4 max-w-lg" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-300">Current Password</label>
              <input type="password" name="currentPassword" value={passwordForm.values.currentPassword} onChange={passwordForm.handleChange} className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${passwordForm.errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
              {passwordForm.errors.currentPassword && <p className="text-red-400 text-xs mt-1">{passwordForm.errors.currentPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">New Password</label>
              <input type="password" name="newPassword" value={passwordForm.values.newPassword} onChange={passwordForm.handleChange} className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${passwordForm.errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
              {passwordForm.errors.newPassword && <p className="text-red-400 text-xs mt-1">{passwordForm.errors.newPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
              <input type="password" name="confirmNewPassword" value={passwordForm.values.confirmNewPassword} onChange={passwordForm.handleChange} className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${passwordForm.errors.confirmNewPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
              {passwordForm.errors.confirmNewPassword && <p className="text-red-400 text-xs mt-1">{passwordForm.errors.confirmNewPassword}</p>}
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={passwordForm.isSubmitting}>
                {passwordForm.isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
            {passwordUpdateSuccess && <p className="text-green-400 text-sm mt-2">Password updated successfully!</p>}
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
