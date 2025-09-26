import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useForm } from '../../hooks/useForm';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import RichTextEditor from '../../components/RichTextEditor';
import type { Chapter } from '../../types';
import { PlusCircleIcon } from '../../components/icons/PlusCircleIcon';
import { BookOpenIcon } from '../../components/icons/BookOpenIcon';

type ChapterFormData = Omit<Chapter, 'id'>;

const TeacherCourseCreatePage: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [chapters, setChapters] = useState<ChapterFormData[]>([]);
    const [currentChapter, setCurrentChapter] = useState<ChapterFormData>({
        title: '',
        duration: 0,
        videoUrl: '',
        content: ''
    });

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
            price: val => {
                const n = Number(String(val).replace(',', '.'));
                if (isNaN(n)) return 'Please enter a valid price.';
                if (n < 49 || n > 99) return 'Price must be between R49 and R99.';
                return null;
            }
        },
        onSubmit: async (formValues) => {
            if (chapters.length === 0) {
                alert('Please add at least one chapter to the course.');
                return;
            }
            // Simulate API call
            console.log('Creating course:', { ...formValues, chapters });
            await new Promise(res => setTimeout(res, 1000));
            setIsSubmitted(true);
            setTimeout(() => {
                resetForm();
                setChapters([]);
                setIsSubmitted(false);
            }, 3000);
        }
    });

    const handleChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentChapter(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));
    };
    
    const handleContentChange = (content: string) => {
        setCurrentChapter(prev => ({ ...prev, content }));
    };

    const handleAddChapter = () => {
        if (!currentChapter.title || !currentChapter.duration || !currentChapter.videoUrl || !currentChapter.content) {
            alert('Please fill all fields for the chapter.');
            return;
        }
        setChapters([...chapters, currentChapter]);
        setCurrentChapter({ title: '', duration: 0, videoUrl: '', content: '' }); // Reset form
    };

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
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-8">
            <GlassCard className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Course Details</h2>
                <div className="space-y-4">
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
                </div>
            </GlassCard>
            
            <GlassCard className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Course Chapters</h2>
                
                {chapters.length > 0 && (
                    <div className="space-y-3 mb-8">
                        {chapters.map((chap, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <BookOpenIcon className="w-5 h-5 text-gray-400" />
                                    <p>{chap.title}</p>
                                </div>
                                <span className="text-xs text-gray-400">{chap.duration} mins</span>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="space-y-4 p-4 border border-dashed border-white/20 rounded-lg">
                     <h3 className="font-semibold text-lg">Add New Chapter</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-300">Chapter Title</label>
                             <input type="text" name="title" value={currentChapter.title} onChange={handleChapterChange} className="mt-1 block w-full bg-white/10 border border-white/10 rounded-md py-2 px-3 text-sm" />
                         </div>
                         <div>
                              <label className="block text-sm font-medium text-gray-300">Duration (mins)</label>
                              <input type="number" name="duration" value={currentChapter.duration} onChange={handleChapterChange} className="mt-1 block w-full bg-white/10 border border-white/10 rounded-md py-2 px-3 text-sm" />
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-300">Video URL</label>
                         <input type="text" name="videoUrl" value={currentChapter.videoUrl} onChange={handleChapterChange} className="mt-1 block w-full bg-white/10 border border-white/10 rounded-md py-2 px-3 text-sm" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Chapter Content</label>
                        <RichTextEditor value={currentChapter.content} onChange={handleContentChange} placeholder="Write the lesson material here..." />
                     </div>
                     <div className="flex justify-end">
                        <Button type="button" variant="secondary" onClick={handleAddChapter}>
                           <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Chapter
                        </Button>
                     </div>
                </div>
            </GlassCard>

            <div className="pt-4 flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default TeacherCourseCreatePage;
