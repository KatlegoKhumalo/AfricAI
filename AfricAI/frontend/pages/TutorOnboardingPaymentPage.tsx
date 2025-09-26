import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const TutorOnboardingPaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [accountId, setAccountId] = useState('');
    const [last4, setLast4] = useState('');
    const [saving, setSaving] = useState(false);

    const createAccount = () => {
        const rand = Math.random().toString(36).slice(2, 10);
        setAccountId(`acct_${rand}`);
        setStep(2);
    };

    const linkBank = () => {
        // In a real flow, this would be collected via Stripe Elements
        const bank = '4242';
        setLast4(bank);
        setStep(3);
    };

    const finish = () => {
        setSaving(true);
        try {
            localStorage.setItem('africai-payouts-connected', 'true');
            localStorage.setItem('africai-payouts-account', accountId || 'acct_mock');
            localStorage.setItem('africai-payouts-bank-last4', last4 || '4242');
            localStorage.setItem('africai-payouts-connected-at', new Date().toISOString());
        } catch {}
        navigate('/dashboard/tutor/billing');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Set Up Payouts</h1>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                To receive payments for your course sales, please connect your bank account via Stripe. 
                We use Stripe for secure and reliable payouts.
            </p>
            <GlassCard className="max-w-2xl mx-auto p-8">
                 <h3 className="text-xl font-semibold mb-4">Connect with Stripe</h3>
                <p className="text-gray-400 text-center mb-6">
                    Click the button below to be redirected to Stripe to securely connect your account. 
                    You will be returned to AI-Learn once you're done.
                </p>
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-gray-300">
                        {step === 1 && (
                            <div className="space-y-3">
                                <p className="font-semibold">Step 1: Create Stripe account</p>
                                <Button onClick={createAccount}>Create Account</Button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-3">
                                <p className="font-semibold">Step 2: Link bank account</p>
                                <p className="text-sm text-gray-400">For demo, we’ll use test bank ending in 4242.</p>
                                <Button onClick={linkBank}>Link Bank</Button>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-3">
                                <p className="font-semibold">Review</p>
                                <p className="text-sm">Account ID: <span className="font-mono">{accountId}</span></p>
                                <p className="text-sm">Bank last4: <span className="font-mono">{last4}</span></p>
                                <Button onClick={finish} disabled={saving} className="w-full">{saving ? 'Finishing...' : 'Finish & Return'}</Button>
                            </div>
                        )}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default TutorOnboardingPaymentPage;
