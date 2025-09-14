import React from 'react';
import StatCard from '../shared/StatCard';
import Chart from '../shared/Chart';
import { DollarSignIcon } from '../../../components/icons/DollarSignIcon';
import Table from '../shared/Table';

const chartData = [
  { name: 'Jan', earnings: 21600 },
  { name: 'Feb', earnings: 32400 },
  { name: 'Mar', earnings: 39600 },
  { name: 'Apr', earnings: 34200 },
  { name: 'May', earnings: 50400 },
  { name: 'Jun', earnings: 55800 },
];

const tableHeaders = ['Date', 'Course', 'Amount', 'Status'];
const tableData = [
  ['2024-06-15', 'AI-Powered Web Development', 'R3582.00', 'Paid'],
  ['2024-06-12', 'Modern Logo Design', 'R2322.00', 'Paid'],
  ['2024-06-05', 'AI-Powered Web Development', 'R3582.00', 'Paid'],
];

const EarningsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Earnings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard title="Total Revenue" value="R422,208" icon={DollarSignIcon} />
        <StatCard title="This Month" value="R55,800" icon={DollarSignIcon} />
      </div>
      <Chart data={chartData} title="Monthly Earnings" dataKey="earnings" />
      <Table title="Payout History" headers={tableHeaders} data={tableData} />
    </div>
  );
};

export default EarningsPage;
