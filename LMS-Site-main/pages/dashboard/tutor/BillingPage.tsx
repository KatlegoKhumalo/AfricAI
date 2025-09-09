import React, { useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import Button from '../../../components/Button';
import Table from '../shared/Table';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { mockTutors, mockInvoices } from '../../../mockData';
import type { Tutor, PaymentMethod } from '../../../types';
import PaymentModal from '../../../components/PaymentModal';

const payoutHeaders = ['Date', 'Amount', 'Status', 'Details'];
const payoutData = [
    ['2024-06-01', '$3100.00', 'Paid', 'View'],
    ['2024-05-01', '$2800.00', 'Paid', 'View'],
    ['2024-04-01', '$1900.00', 'Paid', 'View'],
];

const invoiceHeaders = ['Invoice ID', 'Date', 'Amount', 'Status', 'Description'];

const BillingPage: React.FC = () => {
    const { user } = useAuth();
    // In a real app, this data would be fetched from the backend.
    const initialTutorData = mockTutors.find(t => t.id === user?.id);
    const [tutorData, setTutorData] = useState<Tutor | undefined>(initialTutorData);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
        `R${invoice.amount.toFixed(2)}`,
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
                                    Next payment of <span className="font-bold text-nebula-600">R{tutorData.subscription.fee.toFixed(2)}</span> is on <span className="font-semibold text-white">{tutorData.subscription.nextBillingDate.toLocaleDateString()}</span>.
                                </p>
                            </div>
                            <Button variant="secondary">Manage Subscription</Button>
                        </div>
                    ) : (
                         <div className="text-center py-4">
                            <p className="text-lg text-yellow-400 mb-4">Your subscription is inactive. Please subscribe to continue offering courses.</p>
                            <Button onClick={() => setIsPaymentModalOpen(true)}>Subscribe Now (R2000/month)</Button>
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
                        <p className="text-gray-400 mt-1">Your earnings from course sales are sent via Stripe Connect.</p>
                    </div>
                    <Link to="/tutor-onboarding/payment">
                        <Button variant="secondary">Manage Payouts</Button>
                    </Link>
                </div>
            </GlassCard>
            
            <Table title="Course Sale Payouts" headers={payoutHeaders} data={payoutData} />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={handleSubscriptionPayment}
                paymentDetails={{
                    title: "Tutor Subscription",
                    description: "Activate your monthly subscription to host courses on AfricAI.",
                    amount: 2000,
                }}
            />
        </div>
    );
};

export default BillingPage;