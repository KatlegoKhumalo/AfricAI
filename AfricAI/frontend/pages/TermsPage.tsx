import React from 'react';
import GlassCard from '../components/GlassCard';

const TermsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <GlassCard className="p-8 md:p-12">
                <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-6">
                    <p className="text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>

                    <p>Welcome to AfricAI. These Terms of Service ("Terms") govern your use of our website, courses, and services (collectively, the "Services"). Please read them carefully.</p>

                    <h2 className="text-2xl font-semibold text-white pt-4">1. Acceptance of Terms</h2>
                    <p>
                        By creating an account, enrolling in a course, or otherwise using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you may not use our Services.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white pt-4">2. User Accounts</h2>
                    <p>
                        To access most features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">3. Course Enrollment and Access</h2>
                    <p>
                        When you enroll in a course, you are granted a limited, non-exclusive, non-transferable license to access and view the course content for your personal, non-commercial, educational purposes. You may not reproduce, redistribute, transmit, assign, sell, broadcast, rent, share, lend, modify, or otherwise transfer any course unless we give you explicit permission to do so.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">4. Payments, Credits, and Refunds</h2>
                    <p>
                        You agree to pay the fees for courses that you purchase. All payments are processed through our third-party payment processors. We offer a 30-day money-back guarantee for course purchases. If you are not satisfied with a course, you may request a refund within 30 days of your purchase.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">5. Code of Conduct</h2>
                    <p>
                        You agree to use the Services for lawful purposes only. You will not post or transmit any material that is defamatory, obscene, or otherwise objectionable. You will not harass, abuse, or harm another person. We reserve the right to terminate the accounts of users who violate this Code of Conduct.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white pt-4">6. Intellectual Property</h2>
                    <p>
                        The Services and all of their original content, features, and functionality are and will remain the exclusive property of AfricAI and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent. Content you post remains your own, but you grant us a license to use and distribute it in connection with our Services.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-white pt-4">7. Termination</h2>
                    <p>
                        We may terminate or suspend your account at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">8. Disclaimers and Limitation of Liability</h2>
                    <p>
                        The Services are provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation of our Services or the information, content, or materials included. In no event shall AfricAI be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Services.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">9. Governing Law</h2>
                    <p>
                        These Terms shall be governed by the laws of the jurisdiction in which AfricAI is established, without regard to its conflict of law provisions.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">10. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
                    </p>

                    <h2 className="text-2xl font-semibold text-white pt-4">11. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:legal@africai.com" className="text-nebula-500 hover:underline">legal@africai.com</a>.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};

export default TermsPage;