import React, { useState } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  requiresPassword?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  requiresPassword = false
}) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    onConfirm(requiresPassword ? password : undefined);
  };

  if (!isOpen) return null;

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
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()} 
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              {requiresPassword && (
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Please enter your password to confirm</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  {cancelText}
                </Button>
                <Button variant="primary" onClick={handleConfirm} className="bg-red-600 hover:bg-red-500 focus:ring-red-500">
                  {confirmText}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
