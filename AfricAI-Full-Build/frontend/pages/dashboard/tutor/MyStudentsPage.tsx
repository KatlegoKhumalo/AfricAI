import React, { useState, useMemo } from 'react';
import Table from '../shared/Table';
import Button from '../../../components/Button';
import ContactLearnerModal from '../../../components/ContactLearnerModal';
import { useTestResults } from '../../../hooks/useTestResults';
import Pill from '../../../components/Pill';

// In a real app, this would come from a database query of students enrolled in the tutor's courses
const mockStudentData = [
    { id: 'jane-smith', name: 'Jane Smith', email: 'jane.smith@example.com', courseId: '1', courseName: 'AI-Powered Web Development', progress: '85%' },
    { id: 'user123', name: 'Alex Doe', email: 'alex.doe@example.com', courseId: '1', courseName: 'AI-Powered Web Development', progress: '100%' },
    { id: 'john-doe', name: 'John Doe', email: 'john.doe@example.com', courseId: '5', courseName: 'Modern Logo Design', progress: '100%' },
    { id: 'sam-wilson', name: 'Sam Wilson', email: 'sam.wilson@example.com', courseId: '1', courseName: 'AI-Powered Web Development', progress: '40%' },
];

const tableHeaders = ['Student Name', 'Enrolled In', 'Progress', 'Test Score', 'Actions'];

const MyStudentsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({ name: '', email: '' });
    const { getLatestResultForUserCourse } = useTestResults();

    const handleMessageClick = (name: string, email: string) => {
        setSelectedStudent({ name, email });
        setIsModalOpen(true);
    };

    const tableData = useMemo(() => {
        return mockStudentData.map(student => {
            const result = getLatestResultForUserCourse(student.id, student.courseId);
            const scoreDisplay = result
                ? <Pill color={result.status === 'Pass' ? 'green' : 'red'}>{result.score}% ({result.status})</Pill>
                : <span className="text-gray-400">Not Taken</span>;

            return [
                student.name,
                student.courseName,
                student.progress,
                scoreDisplay,
                <Button variant="secondary" size="sm" onClick={() => handleMessageClick(student.name, student.email)}>Message</Button>
            ];
        });
    }, [getLatestResultForUserCourse]);


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Students</h1>
      </div>
      <Table title="All Enrolled Students" headers={tableHeaders} data={tableData} />
      <ContactLearnerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        learnerName={selectedStudent.name}
      />
    </div>
  );
};

export default MyStudentsPage;