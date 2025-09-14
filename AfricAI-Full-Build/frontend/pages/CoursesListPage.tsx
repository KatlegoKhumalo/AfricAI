import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import CourseCardSkeleton from '../components/CourseCardSkeleton';
import { mockCourses } from '../mockData';
import type { Course } from '../types';

const categories = ['All', ...Array.from(new Set(mockCourses.map(c => c.category)))];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const priceRanges = [
  { label: 'All', value: 'All' },
  { label: 'Free', value: 'Free' },
  { label: 'Under R500', value: 'Under R500' },
  { label: 'R500 - R1000', value: 'R500 - R1000' },
  { label: 'Over R1000', value: 'Over R1000' },
];


const CoursesListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch to demonstrate loading state
    const timer = setTimeout(() => {
      setCourses(mockCourses);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredCourses = useMemo(() => {
    if (isLoading) return [];
    return courses.filter(course => {
        const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
        const difficultyMatch = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
        const priceMatch = (() => {
            switch (selectedPrice) {
                case 'Free':
                    return course.price === 0;
                case 'Under R500':
                    return course.price > 0 && course.price < 500;
                case 'R500 - R1000':
                    return course.price >= 500 && course.price <= 1000;
                case 'Over R1000':
                    return course.price > 1000;
                case 'All':
                default:
                    return true;
            }
        })();

        return categoryMatch && difficultyMatch && priceMatch;
    });
}, [selectedCategory, selectedDifficulty, selectedPrice, courses, isLoading]);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">All Courses</h1>
      <p className="text-gray-400 text-center mb-10">Find your next learning adventure from our curated list of courses.</p>
      
      {/* Filters Section */}
      <div className="flex flex-col items-center gap-8 mb-12">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-semibold text-gray-400 mr-2">Category:</span>
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

        {/* Other Filters */}
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {/* Difficulty Filter */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="font-semibold text-gray-400 mr-2">Difficulty:</span>
                {difficulties.map(difficulty => (
                    <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                        selectedDifficulty === difficulty
                            ? 'bg-gradient-to-r from-nebula-700 to-nebula-600 text-white shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 text-gray-300'
                        }`}
                    >
                        {difficulty}
                    </button>
                ))}
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="price-filter" className="font-semibold text-gray-400">Price:</label>
                <select
                    id="price-filter"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="bg-white/10 hover:bg-white/20 text-gray-300 font-semibold px-4 py-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-nebula-600 appearance-none text-sm"
                >
                    {priceRanges.map(range => (
                        <option key={range.value} value={range.value} className="bg-gray-800 text-white">{range.label}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>


      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => <CourseCardSkeleton key={index} />)
        ) : filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Link to={`/course/${course.id}`} key={course.id}>
                <CourseCard course={course} />
              </Link>
            ))
        ) : null}
      </div>
      {!isLoading && filteredCourses.length === 0 && (
        <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No courses match your selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesListPage;