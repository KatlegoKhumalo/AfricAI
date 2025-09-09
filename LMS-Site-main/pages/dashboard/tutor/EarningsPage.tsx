import React from 'react';
import StatCard from '../shared/StatCard';
import Chart from '../shared/Chart';
import { DollarSignIcon } from '../../../components/icons/DollarSignIcon';
import Table from '../shared/Table';

const chartData = [
  { name: 'Jan', earnings: 1200 },
  { name: 'Feb', earnings: 1800 },
  { name: 'Mar', earnings: 2200 },
  { name: 'Apr', earnings: 1900 },
  { name: 'May', earnings: 2800 },
  { name: 'Jun', earnings: 3100 },
];

const tableHeaders = ['Date', 'Course', 'Amount', 'Status'];
const tableData = [
  ['2024-06-15', 'AI-Powered Web Development', '$199.00', 'Paid'],
  ['2024-06-12', 'Modern Logo Design', '$129.00', 'Paid'],
  ['2024-06-05', 'AI-Powered Web Development', '$199.00', 'Paid'],
];

const EarningsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Earnings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard title="Total Revenue" value="$23,456" icon={DollarSignIcon} />
        <StatCard title="This Month" value="$3,100" icon={DollarSignIcon} />
      </div>
      <Chart data={chartData} title="Monthly Earnings" dataKey="earnings" />
      <Table title="Payout History" headers={tableHeaders} data={tableData} />
    </div>
  );
};

export default EarningsPage;
