import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Course } from '../types';
import GlassCard from './GlassCard';
import Button from './Button';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  course: Course | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen && course) {
        setTitle(course.title);
        setCategory(course.category);
        setPrice(course.price);
        setDescription(course.description || '');
    } else if (isOpen && !course) {
        // Reset for new course
        setTitle('');
        setCategory('Development');
        setPrice(99);
        setDescription('');
    }
  }, [course, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (course) {
      onSave({
        ...course,
        title,
        category,
        price,
        description,
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
              <h2 className="text-2xl font-bold mb-6">Edit Course</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300">Course Title</label>
                  <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                           <option>Development</option>
                            <option>Data Science</option>
                            <option>Design</option>
                            <option>Creative</option>
                            <option>Business</option>
                            <option>AI Ethics</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price (USD)</label>
                         <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} min="0" required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>
                 </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"></textarea>
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

export default CourseModal;
