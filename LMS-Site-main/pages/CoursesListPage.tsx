import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { mockCourses } from '../mockData';

const categories = ['All', ...Array.from(new Set(mockCourses.map(c => c.category)))];

const CoursesListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = selectedCategory === 'All' 
    ? mockCourses 
    : mockCourses.filter(course => course.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">All Courses</h1>
      <p className="text-gray-400 text-center mb-10">Find your next learning adventure from our curated list of courses.</p>
      
      {/* Category Filters */}
      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-nebula-700 to-nebula-600 text-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCourses.map(course => (
          <Link to={`/course/${course.id}`} key={course.id}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursesListPage;
