import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, UserRole } from '../types';
import GlassCard from './GlassCard';
import Button from './Button';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('learner');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setVerified(user.verified || false);
    } else if (isOpen && !user) {
        // Reset for new user if needed, though this modal seems for editing
        setName('');
        setEmail('');
        setRole('learner');
        setVerified(false);
    }
  }, [user, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave({
        ...user,
        name,
        email,
        role,
        verified,
      });
    }
    onClose();
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
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold mb-6">Edit User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value as User['role'])} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                            <option value="learner">Learner</option>
                            <option value="tutor">Tutor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-end pb-1">
                        <div className="flex items-center">
                            <input id="verified" name="verified" type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="h-4 w-4 bg-gray-700 border-gray-600 text-nebula-600 focus:ring-nebula-500 rounded" />
                            <label htmlFor="verified" className="ml-2 block text-sm text-gray-300">Verified</label>
                        </div>
                    </div>
                 </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                  <Button variant="primary" type="submit">Save Changes</Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserModal;
