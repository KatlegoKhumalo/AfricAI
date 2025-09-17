import React from 'react';
import StatCard from '../shared/StatCard';
import Chart from '../shared/Chart';
import Table from '../shared/Table';
import { BookOpenIcon } from '../../../components/icons/BookOpenIcon';
import { CheckCircleIcon } from '../../../components/icons/CheckCircleIcon';
import { AwardIcon } from '../../../components/icons/AwardIcon';

const chartData = [
  { name: 'Jan', minutes: 240 },
  { name: 'Feb', minutes: 180 },
  { name: 'Mar', minutes: 320 },
  { name: 'Apr', minutes: 290 },
  { name: 'May', minutes: 400 },
  { name: 'Jun', minutes: 350 },
];

const tableHeaders = ['Course', 'Progress', 'Completed On'];
const tableData = [
  ['AI-Powered Web Development', '100%', '2024-06-10'],
  ['Modern Logo Design', '60%', 'In Progress'],
];

const LearnerAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">My Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Courses Enrolled" value="2" icon={BookOpenIcon} />
        <StatCard title="Courses Completed" value="1" icon={CheckCircleIcon} />
        <StatCard title="Certificates Earned" value="1" icon={AwardIcon} />
      </div>
      <Chart data={chartData} title="Learning Activity (Minutes)" dataKey="minutes" />
      <Table title="Course Status" headers={tableHeaders} data={tableData} />
    </div>
  );
};

export default LearnerAnalyticsPage;
