import React from 'react';
import GlassCard from '../components/GlassCard';

const TermsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <GlassCard className="p-8 md:p-12">
                <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-4">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white">1. Agreement to Terms</h2>
                    <p>
                        By using our services, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the services.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white">2. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white">3. Content</h2>
                    <p>
                        Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the service, including its legality, reliability, and appropriateness.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white">4. Intellectual Property</h2>
                    <p>
                        The service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of AfricAI and its licensors.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white">5. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 className="text-2xl font-semibold text-white">6. Limitation of Liability</h2>
                    <p>
                        In no event shall AfricAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                    </p>

                    <h2 className="text-2xl font-semibold text-white">7. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is established, without regard to its conflict of law provisions.
                    </p>

                    <h2 className="text-2xl font-semibold text-white">8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at: legal@africai.com
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};

export default TermsPage;
