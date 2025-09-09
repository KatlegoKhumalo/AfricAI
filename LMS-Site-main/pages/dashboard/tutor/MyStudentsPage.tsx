import React, { useState } from 'react';
import Table from '../shared/Table';
import Button from '../../../components/Button';
import ContactLearnerModal from '../../../components/ContactLearnerModal';

const tableHeaders = ['Student Name', 'Email', 'Enrolled In', 'Progress', 'Actions'];

const MyStudentsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({ name: '', email: '' });

    const handleMessageClick = (name: string, email: string) => {
        setSelectedStudent({ name, email });
        setIsModalOpen(true);
    };
    
    const tableData = [
        ['Jane Smith', 'jane.smith@example.com', 'AI-Powered Web Development', '85%', <Button variant="secondary" onClick={() => handleMessageClick('Jane Smith', 'jane.smith@example.com')}>Message</Button>],
        ['John Doe', 'john.doe@example.com', 'Modern Logo Design', '100%', <Button variant="secondary" onClick={() => handleMessageClick('John Doe', 'john.doe@example.com')}>Message</Button>],
        ['Sam Wilson', 'sam.wilson@example.com', 'AI-Powered Web Development', '40%', <Button variant="secondary" onClick={() => handleMessageClick('Sam Wilson', 'sam.wilson@example.com')}>Message</Button>],
    ];


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
