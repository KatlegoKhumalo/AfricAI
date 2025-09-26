import React from 'react';
import GlassCard from '../components/GlassCard';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <GlassCard className="p-8 md:p-12">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-6">
                    <p className="text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white pt-4">1. Introduction</h2>
                    <p>
                        AfricAI ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy details how we collect, use, and protect your personal information when you use our Services. By using our platform, you agree to the collection and use of information in accordance with this policy.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">2. Information We Collect</h2>
                    <p>We collect information to provide and improve our Services. The types of information we collect include:</p>
                    <ul>
                        <li><strong>Personal Data:</strong> Information you provide when you create an account, such as your name, email address, and password.</li>
                        <li><strong>Profile Data:</strong> Information you add to your profile, such as a photo, bio, or links to your social media.</li>
                        <li><strong>Payment Data:</strong> To process payments, we collect transaction details. However, we do not store your full credit card information, which is handled by our secure payment processors.</li>
                        <li><strong>Course Data:</strong> We track your progress in courses, including completed lessons, quiz scores, and project submissions.</li>
                        <li><strong>Communications:</strong> If you contact us directly, we may receive additional information about you.</li>
                        <li><strong>Automatically Collected Data:</strong> We automatically log usage data when you use the Services, such as your IP address, browser type, and device information.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white pt-4">3. How We Use Your Information</h2>
                    <p>We use your information for various purposes, including to:</p>
                    <ul>
                        <li>Provide, operate, and maintain our Services.</li>
                        <li>Process transactions and manage your account.</li>
                        <li>Improve, personalize, and expand our Services.</li>
                        <li>Communicate with you, including for customer service and to send you updates and marketing information.</li>
                        <li>Monitor and analyze usage to ensure the security and integrity of our platform.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white pt-4">4. Data Sharing and Disclosure</h2>
                    <p>
                        We do not sell your personal information. We may share your information with third-party service providers who perform services for us (like payment processing and hosting), with your instructors to facilitate courses, or if required by law.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">5. Data Security</h2>
                    <p>
                        We implement a variety of security measures to maintain the safety of your personal information. However, no electronic storage is 100% secure, and we cannot guarantee absolute security.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">6. Your Data Rights</h2>
                    <p>
                        Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. You can update your account information through your profile settings or by contacting us.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white pt-4">7. Cookie Policy</h2>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">8. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">9. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@africai.com" className="text-nebula-500 hover:underline">privacy@africai.com</a>.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};

export default PrivacyPolicyPage;