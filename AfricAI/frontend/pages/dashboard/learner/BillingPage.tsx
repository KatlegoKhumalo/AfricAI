import React, { useState, useEffect } from 'react';
import GlassCard from '../../../components/GlassCard';
import { useAuth } from '../../../context/AuthContext';
import { Transaction } from '../../../types';

const BillingPage: React.FC = () => {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`/api/v1/transactions/mine`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }

                const data: Transaction[] = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [token]);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Billing</h1>
            <GlassCard className="p-8">
                <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
                {loading ? (
                    <p>Loading transactions...</p>
                ) : transactions.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-4">Date</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} className="border-b border-white/5">
                                    <td className="p-4">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="p-4">{tx.description}</td>
                                    <td className="p-4">R{tx.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-400">You have no transactions yet.</p>
                )}
            </GlassCard>
        </div>
    );
};

export default BillingPage;
