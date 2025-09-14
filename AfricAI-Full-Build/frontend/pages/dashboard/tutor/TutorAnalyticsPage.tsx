import React from 'react';
import StatCard from '../shared/StatCard';
import Chart from '../shared/Chart';
import { UsersIcon } from '../../../components/icons/UsersIcon';
import { BookOpenIcon } from '../../../components/icons/BookOpenIcon';
import { DollarSignIcon } from '../../../components/icons/DollarSignIcon';
import Table from '../shared/Table';

const chartData = [
  { name: 'Jan', students: 50 },
  { name: 'Feb', students: 75 },
  { name: 'Mar', students: 120 },
  { name: 'Apr', students: 110 },
  { name: 'May', students: 150 },
  { name: 'Jun', students: 180 },
];

const tableHeaders = ['Course', 'Students', 'Rating', 'Revenue'];
const tableData = [
    ['AI-Powered Web Development', 1204, '4.9/5', 'R222,210'],
    ['Modern Logo Design', 850, '4.8/5', 'R199,998'],
];


const TutorAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Tutor Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Students" value="2,054" icon={UsersIcon} />
        <StatCard title="Courses Published" value="2" icon={BookOpenIcon} />
        <StatCard title="Total Revenue" value="R422,208" icon={DollarSignIcon} />
      </div>
      <Chart data={chartData} title="New Student Enrollments" dataKey="students" />
      <Table title="Course Performance" headers={tableHeaders} data={tableData} />
    </div>
  );
};

export default TutorAnalyticsPage;
