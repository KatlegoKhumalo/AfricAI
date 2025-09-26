import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../../components/CourseCard';
import { useAuth } from '../../../context/AuthContext';
import { Course } from '../../../types';
import { listCoursesByTutor, deleteCourse } from '../../../services/courseService';
import Button from '../../../components/Button';
import { PlusCircleIcon } from '../../../components/icons/PlusCircleIcon';

const TutorMyCoursesPage: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (!user?.id) { setCourses([]); setLoading(false); return; }
        const data = listCoursesByTutor(String(user.id));
        setCourses(data);
        setLoading(false);
    }, [user]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">My Courses</h1>
                <Link to="/dashboard/tutor/create-course">
                    <Button>
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Create New Course
                    </Button>
                </Link>
            </div>

            {loading ? (
                <p>Loading your courses...</p>
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <div key={course.id} className="space-y-3">
                            <Link to={`/dashboard/tutor/edit-course/${course.id}`}>
                                <CourseCard course={course} />
                            </Link>
                            <div className="flex gap-2">
                                <Link to={`/dashboard/tutor/edit-course/${course.id}`}>
                                    <Button variant="secondary" size="sm">Edit</Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20" onClick={()=>{
                                    if (!confirm('Delete this course?')) return;
                                    const ok = deleteCourse(course.id);
                                    if (ok) setCourses(prev=>prev.filter(c=>c.id!==course.id));
                                }}>Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-400">You haven't created any courses yet.</p>
                </div>
            )}
        </div>
    );
};

export default TutorMyCoursesPage;
