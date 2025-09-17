import React, { useState, FormEvent } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ContactTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorName: string;
}

const ContactTutorModal: React.FC<ContactTutorModalProps> = ({ isOpen, onClose, tutorName }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setMessage('');
    setIsSending(false);
    setIsSent(false);
    setError('');
    onClose();
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
        setError('Message cannot be empty.');
        return;
    }
    setError('');
    setIsSending(true);
    await new Promise(res => setTimeout(res, 1000)); // Simulate API call
    setIsSending(false);
    setIsSent(true);
    setTimeout(handleClose, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
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
              {isSent ? (
                <div className="text-center py-8">
                  <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold">Message Sent!</h2>
                  <p className="text-gray-300 mt-2">{tutorName} will get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">Message {tutorName}</h2>
                  <form onSubmit={handleSubmit}>
                    <textarea
                      placeholder={`Write your message to ${tutorName}...`}
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none mb-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`}
                      required
                    />
                    {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
                    <div className="flex justify-end space-x-4">
                      <Button variant="secondary" onClick={handleClose} type="button" disabled={isSending}>
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit" disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactTutorModal;
