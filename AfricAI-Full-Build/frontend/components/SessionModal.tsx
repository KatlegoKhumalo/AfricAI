import React, { useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LiveSession } from '../types';
import GlassCard from './GlassCard';
import Button from './Button';
import TimezoneSelect from './TimezoneSelect';
import { useForm } from '../hooks/useForm';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: LiveSession) => void;
  session: LiveSession | null;
}

const SessionModal: React.FC<SessionModalProps> = ({ isOpen, onClose, onSave, session }) => {

  const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm({
    initialValues: {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        capacity: '30'
    },
    validationRules: {
        title: val => !val.trim() ? 'Title is required.' : null,
        date: val => !val ? 'Date is required.' : null,
        startTime: val => !val ? 'Start time is required.' : null,
        endTime: (val, formVals) => {
            if (!val) return 'End time is required.';
            if (formVals && formVals.startTime && val <= formVals.startTime) {
                return 'End time must be after start time.';
            }
            return null;
        },
        capacity: val => !val || isNaN(Number(val)) || Number(val) <= 0 ? 'Capacity must be a positive number.' : null,
    },
    onSubmit: async (formValues) => {
        const startDateTime = new Date(`${formValues.date}T${formValues.startTime}`);
        const endDateTime = new Date(`${formValues.date}T${formValues.endTime}`);

        onSave({
            id: session?.id || '',
            title: formValues.title,
            startTime: startDateTime,
            endTime: endDateTime,
            timezone: formValues.timezone,
            capacity: Number(formValues.capacity),
            bookedStudents: session?.bookedStudents || [],
        });
        onClose();
    }
  });

  useEffect(() => {
    if (isOpen) {
        if (session) {
             const start = session.startTime;
             setValues({
                title: session.title,
                date: start.toISOString().split('T')[0],
                startTime: start.toTimeString().substring(0, 5),
                endTime: session.endTime.toTimeString().substring(0, 5),
                timezone: session.timezone,
                capacity: String(session.capacity),
            });
        } else {
            // Reset form for a new session
            setValues({
                title: '',
                date: '',
                startTime: '',
                endTime: '',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                capacity: '30',
            });
        }
    }
  }, [session, isOpen, setValues]);
  

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
              <h2 className="text-2xl font-bold mb-6">{session ? 'Edit Session' : 'Create New Session'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300">Session Title</label>
                  <input type="text" id="title" name="title" value={values.title} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                        <input type="date" id="date" name="date" value={values.date} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                    </div>
                     <div className="sm:col-span-1">
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-300">Start Time</label>
                        <input type="time" id="startTime" name="startTime" value={values.startTime} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.startTime ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                         {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime}</p>}
                    </div>
                    <div className="sm:col-span-1">
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-300">End Time</label>
                        <input type="time" id="endTime" name="endTime" value={values.endTime} onChange={handleChange} required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.endTime ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                         {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                         <label htmlFor="timezone" className="block text-sm font-medium text-gray-300">Timezone</label>
                         <TimezoneSelect value={values.timezone} onChange={(tz) => setValues(prev => ({...prev, timezone: tz}))} />
                    </div>
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-300">Capacity</label>
                        <input type="number" id="capacity" name="capacity" value={values.capacity} onChange={handleChange} min="1" required className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.capacity ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                         {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Session'}
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

export default SessionModal;
