import React from 'react';
import GlassCard from '../components/GlassCard';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <GlassCard className="p-8 md:p-12">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-4">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
                    <p>
                        Welcome to AfricAI ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>

                    <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                        <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor (e.g., Stripe).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white">3. Use of Your Information</h2>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>Process your payments and refunds.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                        <li>Notify you of updates to the Site.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white">4. Security of Your Information</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>
                    
                     <h2 className="text-2xl font-semibold text-white">5. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at: privacy@africai.com
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};

export default PrivacyPolicyPage;
