import React, { useEffect, useMemo, useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import Button from '../../../components/Button';
import Table from '../shared/Table';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { mockTutors, mockInvoices } from '../../../mockData';
import type { Tutor, PaymentMethod } from '../../../types';
import { formatRand } from '../../../utils/currency';
import PaymentModal from '../../../components/PaymentModal';

type PayoutStatus = 'Paid' | 'Pending' | 'Failed';
type Payout = { id: string; date: string; amount: number; status: PayoutStatus; description: string };

const STORAGE_PAYOUTS = 'africai-payouts-history';
const STORAGE_EARNINGS = 'africai-earnings-summary';

const fmt = (n: number) => formatRand(n);
const genId = () => Math.random().toString(36).slice(2, 10);

const invoiceHeaders = ['Invoice ID', 'Date', 'Amount', 'Status', 'Description'];

const BillingPage: React.FC = () => {
    const { user } = useAuth();
    // In a real app, this data would be fetched from the backend.
    const initialTutorData = mockTutors.find(t => t.id === user?.id);
    const [tutorData, setTutorData] = useState<Tutor | undefined>(initialTutorData);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [statusFilter, setStatusFilter] = useState<'All' | PayoutStatus>('All');
    const [search, setSearch] = useState('');
    const [range, setRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

    // bootstrap mock payouts/earnings in localStorage once
    useEffect(() => {
        try {
            const existing = localStorage.getItem(STORAGE_PAYOUTS);
            if (!existing) {
                const seed: Payout[] = [
                    { id: genId(), date: '2025-08-01', amount: 55800, status: 'Paid', description: 'Course sales July' },
                    { id: genId(), date: '2025-09-01', amount: 50400, status: 'Paid', description: 'Course sales August' },
                    { id: genId(), date: '2025-09-22', amount: 14200, status: 'Pending', description: 'Course sales Sept (to date)' },
                ];
                localStorage.setItem(STORAGE_PAYOUTS, JSON.stringify(seed));
            }
            const loaded = JSON.parse(localStorage.getItem(STORAGE_PAYOUTS) || '[]');
            setPayouts(loaded);
        } catch {}
    }, []);

    const filteredPayouts = useMemo(() => {
        return payouts.filter(p => {
            const inStatus = statusFilter === 'All' || p.status === statusFilter;
            const inSearch = !search || p.description.toLowerCase().includes(search.toLowerCase());
            const inRange = (!range.from || p.date >= range.from) && (!range.to || p.date <= range.to);
            return inStatus && inSearch && inRange;
        });
    }, [payouts, statusFilter, search, range]);

    const summary = useMemo(() => {
        const paid = payouts.filter(p => p.status === 'Paid').reduce((a,b)=>a+b.amount,0);
        const pending = payouts.filter(p => p.status === 'Pending').reduce((a,b)=>a+b.amount,0);
        const lastPaid = payouts.filter(p=>p.status==='Paid').sort((a,b)=>a.date.localeCompare(b.date)).slice(-1)[0];
        return { paid, pending, lastPaidDate: lastPaid?.date };
    }, [payouts]);

    const savePayouts = (next: Payout[] | ((prev: Payout[]) => Payout[])) => {
        if (typeof next === 'function') {
            setPayouts(prev => {
                const result = (next as (p: Payout[]) => Payout[])(prev);
                try { localStorage.setItem(STORAGE_PAYOUTS, JSON.stringify(result)); } catch {}
                return result;
            });
        } else {
            setPayouts(next);
            try { localStorage.setItem(STORAGE_PAYOUTS, JSON.stringify(next)); } catch {}
        }
    };

    const retryPayout = (id: string) => {
        const next = payouts.map(p => p.id === id ? { ...p, status: 'Pending' as PayoutStatus } : p);
        savePayouts(next);
        // Simulate processing to Paid
        setTimeout(() => {
            savePayouts(prev => prev.map((p: Payout) => p.id === id ? { ...p, status: 'Paid' } : p));
        }, 1200);
    };

    const handleSubscriptionPayment = () => {
        // Mock payment success
        if (tutorData) {
            const newNextBillingDate = new Date();
            newNextBillingDate.setMonth(newNextBillingDate.getMonth() + 1);

            setTutorData({
                ...tutorData,
                subscription: {
                    ...tutorData.subscription,
                    status: 'active',
                    nextBillingDate: newNextBillingDate,
                }
            });
        }
    };

    const invoiceData = mockInvoices.map(invoice => [
        invoice.id,
        invoice.date.toLocaleDateString(),
        `${formatRand(invoice.amount)}`,
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{invoice.status}</span>,
        invoice.description
    ]);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Billing & Payouts</h1>
            
            <GlassCard className="p-8">
                <h2 className="text-2xl font-bold mb-4">My Subscription</h2>
                {tutorData?.subscription ? (
                    tutorData.subscription.status === 'active' ? (
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                            <div>
                                <p className="text-gray-400">
                                    Your plan is currently <span className="font-semibold text-green-400">active</span>.
                                </p>
                                <p className="text-lg">
                                    Next payment of <span className="font-bold text-nebula-600">{formatRand(tutorData.subscription.fee)}</span> is on <span className="font-semibold text-white">{tutorData.subscription.nextBillingDate.toLocaleDateString()}</span>.
                                </p>
                            </div>
                            <Button variant="secondary">Manage Subscription</Button>
                        </div>
                    ) : (
                         <div className="text-center py-4">
                            <p className="text-lg text-yellow-400 mb-4">Your subscription is inactive. Please subscribe to continue offering courses.</p>
                            <Button onClick={() => setIsPaymentModalOpen(true)}>Subscribe Now (R350/month)</Button>
                        </div>
                    )
                ) : (
                    <p>No active subscription found.</p>
                )}
            </GlassCard>

            <Table title="Subscription Invoices" headers={invoiceHeaders} data={invoiceData} />

            <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Payout Method</h2>
                        {localStorage.getItem('africai-payouts-connected') === 'true' ? (
                            <div className="text-sm text-green-300 mt-1">
                                Connected as <span className="font-mono">{localStorage.getItem('africai-payouts-account') || 'acct_mock'}</span> • Bank **** {localStorage.getItem('africai-payouts-bank-last4') || '4242'}
                                <div className="text-gray-400">Since {new Date(localStorage.getItem('africai-payouts-connected-at') || new Date().toISOString()).toLocaleDateString()}</div>
                            </div>
                        ) : (
                        <p className="text-gray-400 mt-1">Your earnings from course sales are sent via Stripe Connect.</p>
                        )}
                    </div>
                    <Link to="/tutor-onboarding/payment">
                        <Button variant="secondary">{localStorage.getItem('africai-payouts-connected') === 'true' ? 'Update Payouts' : 'Connect Payouts'}</Button>
                    </Link>
                </div>
            </GlassCard>
            
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-6"><p className="text-sm text-gray-400">Total Paid</p><p className="text-3xl font-bold">{fmt(summary.paid)}</p></GlassCard>
                <GlassCard className="p-6"><p className="text-sm text-gray-400">Pending Payouts</p><p className="text-3xl font-bold text-yellow-400">{fmt(summary.pending)}</p></GlassCard>
                <GlassCard className="p-6"><p className="text-sm text-gray-400">Last Payout</p><p className="text-xl font-semibold">{summary.lastPaidDate || '—'}</p></GlassCard>
            </div>

            {/* Payouts with filters */}
            <GlassCard className="p-8 mt-6">
                <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
                    <div>
                        <label className="block text-xs text-gray-400">Status</label>
                        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm">
                            <option>All</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Failed</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div>
                            <label className="block text-xs text-gray-400">From</label>
                            <input type="date" value={range.from} onChange={e=>setRange(r=>({ ...r, from: e.target.value }))} className="bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400">To</label>
                            <input type="date" value={range.to} onChange={e=>setRange(r=>({ ...r, to: e.target.value }))} className="bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400">Search</label>
                        <input placeholder="Description..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm" />
                    </div>
                    <div>
                        <Button variant="secondary" onClick={() => {
                            const csv = ['id,date,amount,status,description', ...filteredPayouts.map(p=>`${p.id},${p.date},${p.amount},${p.status},"${p.description.replace(/"/g,'""')}"`)].join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = 'payouts.csv'; a.click(); URL.revokeObjectURL(url);
                        }}>Export CSV</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400">
                                <th className="py-2">Date</th>
                                <th className="py-2">Amount</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Description</th>
                                <th className="py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayouts.map(p => (
                                <tr key={p.id} className="border-t border-white/10">
                                    <td className="py-3">{p.date}</td>
                                    <td className="py-3">{fmt(p.amount)}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status==='Paid'?'bg-green-500/20 text-green-300':p.status==='Pending'?'bg-yellow-500/20 text-yellow-300':'bg-red-500/20 text-red-300'}`}>{p.status}</span>
                                    </td>
                                    <td className="py-3">{p.description}</td>
                                    <td className="py-3 text-right">
                                        {p.status==='Failed' && <Button size="sm" variant="secondary" onClick={()=>retryPayout(p.id)}>Retry</Button>}
                                        {p.status!=='Failed' && <span className="text-gray-500 text-xs">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={handleSubscriptionPayment}
                paymentDetails={{
                    title: "Tutor Subscription",
                    description: "Activate your monthly subscription to host courses on AfricAI.",
                    amount: 350,
                }}
            />
        </div>
    );
};

export default BillingPage;