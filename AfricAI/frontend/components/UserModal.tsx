import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, UserRole } from '../types';
import GlassCard from './GlassCard';
import Button from './Button';
import { useForm } from '../hooks/useForm';
import { validateEmail, validateName } from '../utils/validation';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm({
    initialValues: {
      name: '',
      email: '',
      role: 'learner' as UserRole,
      verified: false,
    },
    validationRules: {
      name: validateName,
      email: validateEmail,
    },
    onSubmit: async (formValues) => {
      if (user) {
        onSave({
          ...user,
          name: formValues.name,
          email: formValues.email,
          role: formValues.role,
          verified: formValues.verified,
        });
      }
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen && user) {
        setValues({
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified || false,
        });
    }
  }, [user, isOpen, setValues]);

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
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input type="text" id="name" name="name" value={values.name} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                  <input type="email" id="email" name="email" value={values.email} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role</label>
                        <select id="role" name="role" value={values.role} onChange={handleChange} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                            <option value="learner">Learner</option>
                            <option value="tutor">Tutor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-end pb-1">
                        <div className="flex items-center">
                            <input id="verified" name="verified" type="checkbox" checked={values.verified} onChange={handleChange} className="h-4 w-4 bg-gray-700 border-gray-600 text-nebula-600 focus:ring-nebula-500 rounded" />
                            <label htmlFor="verified" className="ml-2 block text-sm text-gray-300">Verified</label>
                        </div>
                    </div>
                 </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default UserModal;