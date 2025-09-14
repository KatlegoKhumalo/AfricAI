

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { mockCourses } from '../mockData';
import PaymentForm from '../components/PaymentForm';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const CheckoutPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const course = mockCourses.find(c => c.id === courseId);
    const [isPaid, setIsPaid] = useState(false);
    const navigate = useNavigate();

    const handlePaymentSuccess = () => {
        // In a real app, you'd handle post-payment logic here.
        setIsPaid(true);
        setTimeout(() => {
            navigate('/dashboard/my-courses');
        }, 3000); // Redirect after 3 seconds
    };

    if (!course) {
        return <div className="text-center py-20">Course not found or invalid ID.</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
            <GlassCard className="max-w-2xl mx-auto p-8">
                {isPaid ? (
                    <div className="text-center py-12">
                        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold">Payment Successful!</h2>
                        <p className="text-gray-300 mt-2">You have successfully enrolled in "{course.title}".</p>
                        <p className="text-gray-400 mt-1">Redirecting you to your courses...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row gap-8">
                            <img src={course.imageUrl} alt={course.title} className="w-full md:w-1/3 h-auto object-cover rounded-lg" />
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold">{course.title}</h2>
                                <p className="text-gray-400 text-sm">By {course.tutor?.name}</p>
                                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-700 to-nebula-500 mt-2">R{course.price.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 my-8"></div>

                        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                        <PaymentForm 
                            onSubmit={handlePaymentSuccess}
                            submitButtonText={`Pay R${course.price.toFixed(2)}`}
                        />
                    </>
                )}
            </GlassCard>
        </div>
    );
};

export default CheckoutPage;