

import React from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { mockCourses } from '../mockData';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const getYouTubeEmbedUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const ChapterViewPage: React.FC = () => {
    const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
    const { isChapterCompleted, markChapterAsComplete } = useCourseProgress();

    const course = mockCourses.find(c => c.id === courseId);
    const chapter = course?.chapters.find(ch => ch.id === chapterId);

    if (!course || !chapter) {
        return <div className="text-center py-20">Chapter not found.</div>;
    }

    const isCompleted = isChapterCompleted(course.id, chapter.id);
    const embedUrl = getYouTubeEmbedUrl(chapter.videoUrl);
    
    const chapterLinkClassName = "flex items-center justify-between gap-3 p-3 rounded-md text-sm transition-colors w-full text-gray-300 hover:bg-white/10";
    const activeChapterLinkClassName = "bg-nebula-600/50 text-white";


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link to={`/course/${courseId}`} className="text-nebula-600 hover:text-nebula-500 transition-colors">&larr; Back to Course</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <h1 className="text-4xl font-bold">{chapter.title}</h1>
                         <Button
                            onClick={() => markChapterAsComplete(course.id, chapter.id)}
                            disabled={isCompleted}
                            className={`flex-shrink-0 ${isCompleted ? 'bg-green-600/50 text-green-300 cursor-not-allowed' : ''}`}
                         >
                             {isCompleted ? (
                                <>
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    Completed
                                </>
                             ) : (
                                 'Mark as Complete'
                             )}
                         </Button>
                    </div>
                     {embedUrl && (
                        <div className="aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title={chapter.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg"
                            ></iframe>
                        </div>
                     )}

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Courseware</h2>
                        <div
                            className="text-gray-300 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline"
                            dangerouslySetInnerHTML={{ __html: chapter.content }}
                        />
                    </GlassCard>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <GlassCard className="p-4 sticky top-28">
                         <h3 className="text-lg font-bold mb-4 px-3">{course.title}</h3>
                         <nav className="space-y-2">
                             {course.chapters.map(ch => {
                                const isChapterDone = isChapterCompleted(course.id, ch.id);
                                return (
                                <NavLink to={`/course/${courseId}/chapter/${ch.id}`} key={ch.id} className={({isActive}) => isActive ? `${chapterLinkClassName} ${activeChapterLinkClassName}` : chapterLinkClassName}>
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <BookOpenIcon className="w-5 h-5 flex-shrink-0" />
                                        <span className="truncate">{ch.title}</span>
                                    </div>
                                    {isChapterDone && <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />}
                                </NavLink>
                                );
                             })}
                         </nav>
                    </GlassCard>
                </aside>
            </div>
        </div>
    );
};

export default ChapterViewPage;