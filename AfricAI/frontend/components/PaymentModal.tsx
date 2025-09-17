import React, { useState } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentForm from './PaymentForm';
import { PaymentMethod } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: PaymentMethod) => void;
  paymentDetails: {
    title: string;
    description: string;
    amount: number | null; // Null if just saving a card
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, paymentDetails }) => {
  const [isPaid, setIsPaid] = useState(false);

  const handleFormSubmit = (paymentData: PaymentMethod) => {
    setIsPaid(true);
    onPaymentSuccess(paymentData);
    setTimeout(() => {
        setIsPaid(false); // Reset for next time
        onClose();
    }, 3000);
  };

  const submitButtonText = paymentDetails.amount !== null
    ? `Pay R${paymentDetails.amount.toFixed(2)}`
    : 'Save Card';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()} 
          >
            <GlassCard className="p-8">
                {isPaid ? (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold">Success!</h2>
                        <p className="text-gray-300 mt-2">{paymentDetails.amount ? 'Your payment was successful.' : 'Payment method saved.'}</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2">{paymentDetails.title}</h2>
                        <p className="text-gray-400 mb-6">{paymentDetails.description}</p>
                        <PaymentForm 
                            onSubmit={handleFormSubmit}
                            submitButtonText={submitButtonText}
                        />
                    </>
                )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
