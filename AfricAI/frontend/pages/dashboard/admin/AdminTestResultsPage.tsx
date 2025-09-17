import React, { useMemo, useState } from 'react';
import Table from '../shared/Table';
import { useTestResults } from '../../../hooks/useTestResults';
import { mockCourses } from '../../../mockData';
import type { User } from '../../../types';
import Pill from '../../../components/Pill';
import { SearchIcon } from '../../../components/icons/SearchIcon';

// In a real app, users would be fetched from the backend. Here we create a mock map.
const mockUsers: User[] = [
    { id: 'user123', publicId: '1000001', name: 'Alex Doe', email: 'alex.doe@example.com', avatarUrl: '', role: 'learner', joinDate: new Date() },
    { id: 'jane-smith', publicId: '1000002', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: '', role: 'learner', joinDate: new Date() },
    { id: 'john-doe', publicId: '1000003', name: 'John Doe', email: 'john.doe@example.com', avatarUrl: '', role: 'learner', joinDate: new Date() },
    { id: 'sam-wilson', publicId: '1000004', name: 'Sam Wilson', email: 'sam.wilson@example.com', avatarUrl: '', role: 'learner', joinDate: new Date() },
];
const userMap = new Map(mockUsers.map(u => [u.id, u]));
const courseMap = new Map(mockCourses.map(c => [c.id, c]));


const AdminTestResultsPage: React.FC = () => {
    const { getAllResults } = useTestResults();
    const [searchTerm, setSearchTerm] = useState('');
    
    const allResults = getAllResults();

    const filteredResults = useMemo(() => {
        if (!searchTerm) return allResults;
        const lowercasedFilter = searchTerm.toLowerCase();
        return allResults.filter(result => {
            const user = userMap.get(result.userId);
            const course = courseMap.get(result.courseId);
            return (
                user?.name.toLowerCase().includes(lowercasedFilter) ||
                course?.title.toLowerCase().includes(lowercasedFilter)
            );
        });
    }, [allResults, searchTerm]);

    const tableHeaders = ['Student', 'Course', 'Score', 'Status', 'Date Taken'];

    const tableData = filteredResults.map(result => [
        userMap.get(result.userId)?.name || 'Unknown User',
        courseMap.get(result.courseId)?.title || 'Unknown Course',
        `${result.score}%`,
        <Pill color={result.status === 'Pass' ? 'green' : 'red'}>{result.status}</Pill>,
        new Date(result.dateTaken).toLocaleDateString(),
    ]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-bold">Test Results</h1>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search by student or course..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-nebula-600 focus:outline-none" 
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
            
            <Table title={`All Test Submissions (${filteredResults.length})`} headers={tableHeaders} data={tableData} />
        </div>
    );
};

export default AdminTestResultsPage;
