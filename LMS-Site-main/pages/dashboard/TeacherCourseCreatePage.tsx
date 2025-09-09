import React from 'react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';

const TeacherCourseCreatePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Create a New Course</h1>
      <GlassCard className="p-8">
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Course Title</label>
            <input type="text" id="title" placeholder="e.g., Introduction to Neural Networks" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Course Description</label>
            <textarea id="description" rows={5} placeholder="Describe what students will learn in your course..." className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
              <select id="category" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                <option>Development</option>
                <option>Data Science</option>
                <option>Design</option>
                <option>Creative</option>
              </select>
            </div>
             <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price (USD)</label>
              <input type="number" id="price" min="0" placeholder="e.g., 199" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
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
            <Button type="submit">Create Course</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default TeacherCourseCreatePage;
