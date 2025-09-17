import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import CourseCardSkeleton from '../../components/CourseCardSkeleton';
import { mockCourses } from '../../mockData';
import { useCourseProgress } from '../../hooks/useCourseProgress';
import { useTestResults } from '../../hooks/useTestResults';
import { useAuth } from '../../context/AuthContext';
import type { Course } from '../../types';

const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { calculateProgress } = useCourseProgress();
  const { getLatestResultForUserCourse } = useTestResults();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For this demo, we'll assume the user is enrolled in the first two courses from the mock data.
  const enrolledCourseIds = ['1', '5']; 
  
  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching user's enrolled courses
    const timer = setTimeout(() => {
        const courses = mockCourses
            .filter(course => enrolledCourseIds.includes(course.id))
            .map(course => {
                const latestResult = user ? getLatestResultForUserCourse(user.id, course.id) : null;
                return {
                    ...course,
                    progress: calculateProgress(course),
                    score: latestResult?.score,
                }
            });
        setEnrolledCourses(courses);
        setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, calculateProgress, getLatestResultForUserCourse]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Courses</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 2 }).map((_, index) => <CourseCardSkeleton key={index} />)}
        </div>
      ) : enrolledCourses.length > 0 ? (
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