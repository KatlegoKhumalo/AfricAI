import React from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
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
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  {cancelText}
                </Button>
                <Button variant="primary" onClick={onConfirm} className="bg-red-600 hover:bg-red-500 focus:ring-red-500">
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
