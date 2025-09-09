import React from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import type { Course } from '../../types';

const enrolledCourses: Course[] = [
  { id: '1', title: 'AI-Powered Web Development', category: 'Development', imageUrl: 'https://picsum.photos/seed/ai/600/400', chapters: [], price: 199, progress: 75 },
  { id: '5', title: 'Modern Logo Design', category: 'Design', imageUrl: 'https://picsum.photos/seed/logo/600/400', chapters: [], price: 129, progress: 30 },
];

const MyCoursesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Courses</h1>
      
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map(course => (
            <Link to={`/course/${course.id}`} key={course.id}>
                <CourseCard course={course} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400">You haven't enrolled in any courses yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;