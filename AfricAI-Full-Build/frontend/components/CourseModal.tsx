import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Course } from '../types';
import GlassCard from './GlassCard';
import Button from './Button';
import { useForm } from '../hooks/useForm';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  course: Course | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course }) => {
    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm({
        initialValues: {
            title: '',
            category: 'Development',
            price: '',
            description: '',
        },
        validationRules: {
            title: val => !val.trim() ? 'Course title is required.' : null,
            description: val => !val.trim() ? 'Description is required.' : null,
            price: val => !val || isNaN(Number(val)) || Number(val) < 0 ? 'Please enter a valid, non-negative price.' : null,
        },
        onSubmit: async (formValues) => {
            if (course) {
                onSave({
                    ...course,
                    title: formValues.title,
                    category: formValues.category,
                    price: Number(formValues.price),
                    description: formValues.description,
                });
            }
            onClose();
        },
    });

  useEffect(() => {
    if (isOpen && course) {
        setValues({
            title: course.title,
            category: course.category,
            price: String(course.price),
            description: course.description || '',
        });
    }
  }, [course, isOpen, setValues]);

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
              <h2 className="text-2xl font-bold mb-6">Edit Course</h2>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300">Course Title</label>
                  <input type="text" id="title" name="title" value={values.title} onChange={handleChange} className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                        <select id="category" name="category" value={values.category} onChange={handleChange} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                           <option>Development</option>
                            <option>Data Science</option>
                            <option>Design</option>
                            <option>Creative</option>
                            <option>Business</option>
                            <option>AI Ethics</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price (R)</label>
                         <input type="number" id="price" name="price" value={values.price} onChange={handleChange} min="0" className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
                         {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                    </div>
                 </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea id="description" name="description" rows={4} value={values.description} onChange={handleChange} className={`mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`}></textarea>
                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
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

export default CourseModal;