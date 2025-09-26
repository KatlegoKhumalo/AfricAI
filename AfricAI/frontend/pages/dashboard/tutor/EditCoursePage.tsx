import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../../../components/GlassCard';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { Course, Chapter } from '../../../types';
import { getCourseById, updateCourse } from '../../../services/courseService';
import CoverCropModal from '../../../components/CoverCropModal';

const EditCoursePage: React.FC = () => {
    const params = useParams();
    const id = (params as any).id || (params as any).courseId || '';
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState<Partial<Course> | null>(null);
    const [chapters, setChapters] = useState<Omit<Chapter, 'id'>[]>([]);
    const [newChapter, setNewChapter] = useState<Omit<Chapter, 'id'>>({ title: '', duration: 0, videoUrl: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | undefined>(undefined);

    const isSignedIn = useMemo(() => !!user?.id, [user]);

    useEffect(() => {
        if (!id) return;
        const c = getCourseById(id);
        if (!c) { navigate('/dashboard/tutor/my-courses'); return; }
        setCourse(c);
        setChapters((c.chapters as any) || []);
        setCroppedImageUrl((c as any).imageUrl);
    }, [id, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setSelectedFile(file);
        setIsCropOpen(true);
    };

    const onCropped = (blob: Blob) => {
        setIsCropOpen(false);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!course) return;
        if (name === 'price') {
            const normalized = value.replace(',', '.');
            const num = Number(normalized);
            setCourse({ ...course, price: isNaN(num) ? 0 : num });
        } else {
            setCourse({ ...course, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn) { setError('Please sign in to update a course.'); return; }
        if (!course || !id) return;
        setIsSubmitting(true);
        setError('');

        try {
            const payload: Partial<Course> = {
                ...course,
                chapters: chapters.map(c => ({ ...c })),
            } as any;
            if (croppedImageUrl) (payload as any).imageUrl = croppedImageUrl;
            const updated = updateCourse(id, payload);
            if (updated) navigate('/dashboard/tutor/my-courses');
            else setError('Failed to update course.');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!course) return <div className="p-6 text-gray-400">Loading course...</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Edit Course</h1>
            <GlassCard className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Course Title</label>
                        <input type="text" name="title" id="title" value={String(course.title || '')} onChange={handleInputChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Course Description</label>
                        <textarea name="description" id="description" value={String(course.description || '')} onChange={handleInputChange} required rows={4} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                            <select name="category" id="category" value={String(course.category || 'Development')} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
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
                            <input type="number" name="price" id="price" value={Number(course.price || 0)} onChange={handleInputChange} required className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">Difficulty</label>
                            <select name="difficulty" id="difficulty" value={String(course.difficulty || 'Beginner')} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-300">Cover Image</label>
                        <input type="file" name="coverImage" id="coverImage" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nebula-600 file:text-white hover:file:bg-nebula-500" />
                        {croppedImageUrl && (
                            <div className="mt-3 w-full max-w-xl aspect-video rounded-md overflow-hidden border border-white/10">
                                <img src={croppedImageUrl} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Chapters</h2>
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
                        <div className="mt-3">
                            <Button type="button" onClick={addChapter}>Add Chapter</Button>
                        </div>
                        {chapters.length > 0 && (
                            <ul className="space-y-2 mt-3">
                                {chapters.map((c, i) => (
                                    <li key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-md px-3 py-2">
                                        <span className="text-sm">{c.title} • {c.duration}m</span>
                                        <button type="button" onClick={() => removeChapter(i)} className="text-red-400 text-sm">Remove</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="pt-4">
                        <Button type="submit" disabled={isSubmitting || !isSignedIn}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </GlassCard>
            <CoverCropModal isOpen={isCropOpen} file={selectedFile} onClose={() => setIsCropOpen(false)} onCropped={onCropped} />
        </div>
    );
};

export default EditCoursePage;


