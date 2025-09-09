import React, { useState } from 'react';
import Table from '../shared/Table';
import Button from '../../../components/Button';
import CourseModal from '../../../components/CourseModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Pill from '../../../components/Pill';
import { mockCourses } from '../../../mockData';
import type { Course } from '../../../types';
import { SearchIcon } from '../../../components/icons/SearchIcon';

const CourseManagementPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(mockCourses);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setIsCourseModalOpen(true);
    };

    const handleDeleteClick = (course: Course) => {
        setCourseToDelete(course);
        setIsDeleteModalOpen(true);
    };

    const handleSaveCourse = (courseData: Course) => {
        setCourses(courses.map(c => (c.id === courseData.id ? courseData : c)));
    };

    const confirmDelete = () => {
        if (courseToDelete) {
            setCourses(courses.filter(c => c.id !== courseToDelete.id));
            setCourseToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const tableHeaders = ['Course Title', 'Tutor', 'Category', 'Price', 'Rating', 'Actions'];

    const tableData = courses.map(course => [
        <div className="flex items-center gap-3">
            <img src={course.imageUrl} alt={course.title} className="w-16 h-10 object-cover rounded-md" />
            <span className="font-semibold">{course.title}</span>
        </div>,
        course.tutor?.name || 'N/A',
        <Pill>{course.category}</Pill>,
        `$${course.price.toFixed(2)}`,
        `⭐ ${course.rating} (${course.reviews} reviews)`,
        <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleEdit(course)}>Edit</Button>
            <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20" onClick={() => handleDeleteClick(course)}>Delete</Button>
        </div>
    ]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-bold">Course Management</h1>
                 <div className="relative">
                    <input type="text" placeholder="Search courses..." className="bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
            
            <Table title="All Courses" headers={tableHeaders} data={tableData} />

            <CourseModal 
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                onSave={handleSaveCourse}
                course={selectedCourse}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Course"
                message={`Are you sure you want to delete the course "${courseToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default CourseManagementPage;
