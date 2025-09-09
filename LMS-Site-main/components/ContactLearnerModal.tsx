import React from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactLearnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
}

const ContactLearnerModal: React.FC<ContactLearnerModalProps> = ({ isOpen, onClose, learnerName }) => {
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
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()} 
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold mb-4">Message {learnerName}</h2>
              <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                <textarea
                  placeholder={`Write your message to ${learnerName}...`}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none mb-4"
                  required
                />
                <div className="flex justify-end space-x-4">
                  <Button variant="secondary" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Send Message
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactLearnerModal;
