import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../components/GlassCard';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { Course, Chapter } from '../../../types';
import { createCourse } from '../../../services/courseService';
import CoverCropModal from '../../../components/CoverCropModal';

const CreateCoursePage: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Partial<Course>>({
        title: '',
        description: '',
        category: 'Development',
        price: 99.99,
        difficulty: 'Beginner',
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [chapters, setChapters] = useState<Omit<Chapter, 'id'>[]>([]);
    const [newChapter, setNewChapter] = useState<Omit<Chapter, 'id'>>({ title: '', duration: 0, videoUrl: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | undefined>(undefined);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'price') {
            // Normalize and clamp to R49–R99
            const normalized = value.replace(',', '.');
            let num = Number(normalized);
            if (isNaN(num)) num = 0;
            if (num < 49) num = 49;
            if (num > 99) num = 99;
            setCourse({ ...course, price: num });
        } else {
            setCourse({ ...course, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setCoverImage(file);
        setSelectedFile(file);
        setIsCropOpen(true);
    };

    const onCropped = async (blob: Blob) => {
        setIsCropOpen(false);
        // Convert blob to data URL (bounded in size by JPEG quality)
        const reader = new FileReader();
        reader.onload = () => setCroppedImageUrl(String(reader.result || ''));
        reader.readAsDataURL(blob);
    };

    const addChapter = () => {
        if (!newChapter.title.trim()) return;
        setChapters([...chapters, { ...newChapter }]);
        setNewChapter({ title: '', duration: 0, videoUrl: '', content: '' });
    };

    const removeChapter = (index: number) => {
        setChapters(chapters.filter((_, i) => i !== index));
    };

    const isSignedIn = useMemo(() => !!user?.id, [user]);

    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Failed to read image'));
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn) { setError('Please sign in to create a course.'); return; }
        if (!coverImage) { setError('Please upload a cover image.'); return; }
        setIsSubmitting(true);
        setError('');

        const payload = {
            ...course,
            // Map difficulty string (e.g. "Beginner") to enum name used by backend (e.g. "BEGINNER")
            difficulty: (course.difficulty || 'Beginner').toString().toUpperCase(),
            tutor: user ? { id: user.id } : undefined,
            chapters: chapters.map(c => ({ ...c })),
        };

        try {
            let imageUrl: string | undefined = undefined;
            if (croppedImageUrl) {
                imageUrl = croppedImageUrl;
            } else if (coverImage) {
                // Avoid blowing up memory/quota with large files (>1MB)
                if (coverImage.size <= 1_000_000) {
                    imageUrl = await fileToDataUrl(coverImage);
                } else {
                    // Store without image to prevent localStorage quota errors
                    imageUrl = undefined;
                }
            }

            await createCourse({
                title: String(payload.title || ''),
                description: String(payload.description || ''),
                category: String(payload.category || 'Development'),
                // Enforce cap [49, 99]
                price: Math.min(99, Math.max(49, Number(payload.price || 0))),
                difficulty: String(payload.difficulty || 'BEGINNER'),
                imageUrl,
                chapters: payload.chapters || [],
                tutorId: String(user!.id),
            });

            navigate('/dashboard/tutor/my-courses');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Create New Course</h1>
            <GlassCard className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Course Title</label>
                        <input type="text" name="title" id="title" value={course.title} onChange={handleInputChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Course Description</label>
                        <textarea name="description" id="description" value={course.description} onChange={handleInputChange} required rows={4} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"></textarea>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                        <select name="category" id="category" value={course.category} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                            <option>Development</option>
                            <option>Data Science</option>
                            <option>Creative</option>
                            <option>Design</option>
                            <option>Business</option>
                            <option>AI Ethics</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
                        <input type="number" name="price" id="price" value={course.price} onChange={handleInputChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">Difficulty</label>
                        <select name="difficulty" id="difficulty" value={course.difficulty} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-300">Cover Image</label>
                        <input type="file" name="coverImage" id="coverImage" onChange={handleFileChange} required className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nebula-600 file:text-white hover:file:bg-nebula-500" />
                        {croppedImageUrl && (
                            <div className="mt-3 w-full max-w-xl aspect-video rounded-md overflow-hidden border border-white/10">
                                <img src={croppedImageUrl} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    {(!isSignedIn) && <p className="text-yellow-400 text-sm">Please sign in to create a course.</p>}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="pt-4">
                        <Button type="submit" disabled={isSubmitting || !isSignedIn}>
                            {isSubmitting ? 'Creating...' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </GlassCard>
            <CoverCropModal isOpen={isCropOpen} file={selectedFile} onClose={() => setIsCropOpen(false)} onCropped={onCropped} />
            <GlassCard className="p-8 mt-8">
                <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Title</label>
                            <input className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" value={newChapter.title} onChange={e => setNewChapter({ ...newChapter, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Duration (minutes)</label>
                            <input type="number" className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" value={newChapter.duration} onChange={e => setNewChapter({ ...newChapter, duration: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">YouTube URL</label>
                            <input className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" value={newChapter.videoUrl} onChange={e => setNewChapter({ ...newChapter, videoUrl: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Content</label>
                            <input className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" value={newChapter.content} onChange={e => setNewChapter({ ...newChapter, content: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <Button type="button" onClick={addChapter}>Add Chapter</Button>
                    </div>
                    {chapters.length > 0 && (
                        <ul className="space-y-2">
                            {chapters.map((c, i) => (
                                <li key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-md px-3 py-2">
                                    <span className="text-sm">{c.title} • {c.duration}m</span>
                                    <button type="button" onClick={() => removeChapter(i)} className="text-red-400 text-sm">Remove</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

export default CreateCoursePage;
