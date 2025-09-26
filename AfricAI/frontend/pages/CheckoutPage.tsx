

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { mockCourses } from '../mockData';
import PaymentForm from '../components/PaymentForm';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { useAuth } from '../context/AuthContext';
import { formatRand } from '../utils/currency';

const CheckoutPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const course = mockCourses.find(c => c.id === courseId);
    const [isPaid, setIsPaid] = useState(false);
    const navigate = useNavigate();
    const { token, user, updateUser } = useAuth();
    const hasSavedMethod = !!user?.paymentMethod;

    const completeEnrollment = async () => {
        if (!token || !courseId) return;

        try {
            // 1. Tell backend to create the enrollment
            const purchaseResponse = await fetch(`/api/v1/enrollments/purchase/${courseId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!purchaseResponse.ok) {
                throw new Error('Failed to enroll in course');
            }

            // 2. Update user context with the new course
            // Note: The `User` type needs to be updated to include `enrolledCourses`
            // For now, we'll assume the backend doesn't return the updated user object,
            // so we'll just add the course ID to the existing user object.
            const updatedEnrolledCourses = [...(user?.enrolledCourses || []), courseId];
            updateUser({ enrolledCourses: updatedEnrolledCourses });


            setIsPaid(true);
            setTimeout(() => {
                navigate('/dashboard/my-courses');
            }, 1500);
        } catch (error) {
            console.error("Payment success handling failed:", error);
            // Optionally, show an error message to the user
        }
    };

    const handlePaymentSuccess = async () => {
        await completeEnrollment();
    };

    const handlePayClick = async () => {
        if (hasSavedMethod) {
            await completeEnrollment();
        }
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
                                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-700 to-nebula-500 mt-2">{formatRand(course.price)}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 my-8"></div>

                        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                        {hasSavedMethod ? (
                            <div className="space-y-4">
                                <p className="text-gray-300 text-sm">Using saved card ending in **** **** **** {user!.paymentMethod!.cardNumber.slice(-4)}</p>
                                <Button onClick={handlePayClick}>{`Pay ${formatRand(course.price)}`}</Button>
                            </div>
                        ) : (
                            <PaymentForm 
                                onSubmit={handlePaymentSuccess}
                                submitButtonText={`Pay ${formatRand(course.price)}`}
                            />
                        )}
                    </>
                )}
            </GlassCard>
        </div>
    );
};

export default CheckoutPage;