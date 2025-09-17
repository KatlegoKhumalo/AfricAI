import React from 'react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const TutorOnboardingPaymentPage: React.FC = () => {
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
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center text-gray-400">
                    Stripe Connect Onboarding Element would be here.
                </div>
                 <div className="mt-8">
                    <Button className="w-full text-lg">
                        Connect with Stripe
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};

export default TutorOnboardingPaymentPage;
