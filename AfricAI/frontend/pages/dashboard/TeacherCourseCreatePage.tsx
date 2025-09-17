import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useForm } from '../../hooks/useForm';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';

const TeacherCourseCreatePage: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { values, errors, isSubmitting, handleChange, handleSubmit, resetForm } = useForm({
        initialValues: {
            title: '',
            description: '',
            category: 'Development',
            price: ''
        },
        validationRules: {
            title: val => !val.trim() ? 'Course title is required.' : null,
            description: val => !val.trim() ? 'Course description is required.' : null,
            price: val => !val || isNaN(Number(val)) || Number(val) <= 0 ? 'Please enter a valid positive price.' : null
        },
        onSubmit: async (formValues) => {
            // Simulate API call
            console.log('Creating course:', formValues);
            await new Promise(res => setTimeout(res, 1000));
            setIsSubmitted(true);
            setTimeout(() => {
                resetForm();
                setIsSubmitted(false);
            }, 3000);
        }
    });

    if (isSubmitted) {
        return (
            <div className="text-center py-12">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold">Course Created Successfully!</h2>
                <p className="text-gray-300 mt-2">Your new course has been submitted for review.</p>
            </div>
        );
    }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Create a New Course</h1>
      <GlassCard className="p-8">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Course Title</label>
            <input type="text" id="title" name="title" value={values.title} onChange={handleChange} placeholder="e.g., Introduction to Neural Networks" className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Course Description</label>
            <textarea id="description" name="description" rows={5} value={values.description} onChange={handleChange} placeholder="Describe what students will learn in your course..." className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`}></textarea>
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <input type="number" id="price" name="price" value={values.price} onChange={handleChange} min="0" placeholder="e.g., 299" className={`mt-1 block w-full bg-white/5 border rounded-md py-2 px-3 text-sm focus:ring-2 focus:outline-none ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-nebula-600'}`} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="cover-image" className="block text-sm font-medium text-gray-300">Cover Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-500"><p className="pl-1">Upload a file or drag and drop</p></div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default TeacherCourseCreatePage;
