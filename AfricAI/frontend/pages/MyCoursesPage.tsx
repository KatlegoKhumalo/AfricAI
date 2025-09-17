import React from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import { mockCourses } from '../../mockData';
import { useCourseProgress } from '../../hooks/useCourseProgress';

const MyCoursesPage: React.FC = () => {
  const { calculateProgress } = useCourseProgress();

  // For this demo, we'll assume the user is enrolled in the first two courses from the mock data.
  const enrolledCourseIds = ['1', '5']; 
  
  const enrolledCourses = mockCourses
    .filter(course => enrolledCourseIds.includes(course.id))
    .map(course => ({
      ...course,
      progress: calculateProgress(course),
    }));

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