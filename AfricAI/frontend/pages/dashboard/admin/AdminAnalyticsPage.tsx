import React from 'react';
import StatCard from '../shared/StatCard';
import Chart from '../shared/Chart';
import PieChart from '../shared/PieChart';
import Table from '../shared/Table';
import MapChart from '../shared/MapChart';
import { UsersIcon } from '../../../components/icons/UsersIcon';
import { BookOpenIcon } from '../../../components/icons/BookOpenIcon';
import { DollarSignIcon } from '../../../components/icons/DollarSignIcon';
import { ReceiptIcon } from '../../../components/icons/ReceiptIcon';

const userGrowthData = [
  { name: 'Jan', users: 1200 },
  { name: 'Feb', users: 1800 },
  { name: 'Mar', users: 2500 },
  { name: 'Apr', users: 2300 },
  { name: 'May', users: 3100 },
  { name: 'Jun', users: 3500 },
];

const categoryDistributionData = [
    { name: 'Development', value: 450 },
    { name: 'Data Science', value: 300 },
    { name: 'Design', value: 150 },
    { name: 'Business', value: 100 },
];

const recentUsersHeaders = ['Name', 'Email', 'Role', 'Join Date'];
const recentUsersData = [
    ['Amara Adekunle', 'amara.a@example.com', 'Tutor', '2024-06-15'],
    ['Kenji Tanaka', 'kenji.t@example.com', 'Learner', '2024-06-14'],
    ['Sofia Rodriguez', 'sofia.r@example.com', 'Learner', '2024-06-14'],
];

const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Platform Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Users" value="15,432" icon={UsersIcon} />
        <StatCard title="Total Courses" value="97" icon={BookOpenIcon} />
        <StatCard title="Total Revenue" value="R22,222,206" icon={DollarSignIcon} />
        <StatCard title="Today's Revenue" value="R82,440" icon={ReceiptIcon} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Chart data={userGrowthData} title="User Growth" dataKey="users" />
        <PieChart data={categoryDistributionData} title="Course Category Distribution" />
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Table title="Recent Registrations" headers={recentUsersHeaders} data={recentUsersData} />
        <MapChart title="User Distribution" />
       </div>
    </div>
  );
};

export default AdminAnalyticsPage;
