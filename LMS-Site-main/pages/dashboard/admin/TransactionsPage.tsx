import React from 'react';
import Table from '../shared/Table';
import { mockTransactions } from '../../../mockData';
import { SearchIcon } from '../../../components/icons/SearchIcon';
import Pill from '../../../components/Pill';

const TransactionsPage: React.FC = () => {
    const tableHeaders = ['Transaction ID', 'User', 'Type', 'Amount', 'Date', 'Description'];

    const tableData = mockTransactions.map(txn => [
        <span className="font-mono text-xs text-gray-400">{txn.id}</span>,
        txn.user.name,
        <Pill color={txn.type === 'Course Sale' ? 'green' : 'primary'}>{txn.type}</Pill>,
        `R${txn.amount.toFixed(2)}`,
        txn.date.toLocaleDateString(),
        <span className="text-sm text-gray-300">{txn.description}</span>
    ]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-bold">Transactions</h1>
                <div className="relative">
                    <input type="text" placeholder="Search transactions..." className="bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
            
            <Table title="All Transactions" headers={tableHeaders} data={tableData} />
        </div>
    );
};

export default TransactionsPage;