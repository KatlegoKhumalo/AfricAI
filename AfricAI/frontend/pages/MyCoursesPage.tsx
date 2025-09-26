import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import { useCourseProgress } from '../../hooks/useCourseProgress';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';
import { mockCourses } from '../../mockData'; // We still need this for course details

const MyCoursesPage: React.FC = () => {
  const { calculateProgress } = useCourseProgress();
  const { token } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/v1/enrollments/mine`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const enrollments: { courseId: string }[] = await response.json();
        const enrolledCourseIds = enrollments.map(e => e.courseId);

        // In a real app, you might fetch course details for these IDs.
        // For now, we'll filter the mock data.
        const courses = mockCourses
          .filter(course => enrolledCourseIds.includes(course.id))
          .map(course => ({
            ...course,
            progress: calculateProgress(course),
          }));

        setEnrolledCourses(courses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [token, calculateProgress]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Courses</h1>
      
      {loading ? (
        <p>Loading your courses...</p>
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