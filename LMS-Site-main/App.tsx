import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CoursesListPage from './pages/CoursesListPage';
import CourseViewPage from './pages/CourseViewPage';
import FindTutorPage from './pages/FindTutorPage';
import TutorProfilePage from './pages/TutorProfilePage';
import AITutorPage from './pages/AITutorPage';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import MyCoursesPage from './pages/dashboard/MyCoursesPage';
import LearnerAnalyticsPage from './pages/dashboard/learner/LearnerAnalyticsPage';
import TeacherCourseCreatePage from './pages/dashboard/TeacherCourseCreatePage';
import TutorAnalyticsPage from './pages/dashboard/tutor/TutorAnalyticsPage';
import SchedulePage from './pages/dashboard/tutor/SchedulePage';
import MyStudentsPage from './pages/dashboard/tutor/MyStudentsPage';
import EarningsPage from './pages/dashboard/tutor/EarningsPage';
import BillingPage from './pages/dashboard/tutor/BillingPage';
import AdminAnalyticsPage from './pages/dashboard/admin/AdminAnalyticsPage';
import UserManagementPage from './pages/dashboard/admin/UserManagementPage';
import CourseManagementPage from './pages/dashboard/admin/CourseManagementPage';
import LiveSessionPage from './pages/LiveSessionPage';
import TutorOnboardingPaymentPage from './pages/TutorOnboardingPaymentPage';
import TransactionsPage from './pages/dashboard/admin/TransactionsPage';

const AppContent: React.FC = () => {
    const location = useLocation();
    const isLiveSession = location.pathname.startsWith('/live-session');

    return (
        <div className="flex flex-col min-h-screen text-white font-sans">
            {!isLiveSession && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/courses" element={<CoursesListPage />} />
                    <Route path="/course/:courseId" element={<CourseViewPage />} />
                    <Route path="/tutors" element={<FindTutorPage />} />
                    <Route path="/tutor/:tutorId" element={<TutorProfilePage />} />
                    <Route path="/ai-tutor" element={<AITutorPage />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/checkout/:courseId" element={<CheckoutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/live-session/:sessionId" element={<LiveSessionPage />} />
                    <Route path="/tutor-onboarding/payment" element={<TutorOnboardingPaymentPage />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHomePage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        {/* Learner */}
                        <Route path="my-courses" element={<MyCoursesPage />} />
                        <Route path="analytics" element={<LearnerAnalyticsPage />} />
                        {/* Tutor */}
                        <Route path="tutor/analytics" element={<TutorAnalyticsPage />} />
                        <Route path="tutor/create-course" element={<TeacherCourseCreatePage />} />
                        <Route path="tutor/schedule" element={<SchedulePage />} />
                        <Route path="tutor/students" element={<MyStudentsPage />} />
                        <Route path="tutor/earnings" element={<EarningsPage />} />
                        <Route path="tutor/billing" element={<BillingPage />} />
                        {/* Admin */}
                        <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
                        <Route path="admin/users" element={<UserManagementPage />} />
                        <Route path="admin/courses" element={<CourseManagementPage />} />
                        <Route path="admin/transactions" element={<TransactionsPage />} />
                    </Route>
                </Routes>
            </main>
            {!isLiveSession && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
            <AppContent />
        </Router>
    </AuthProvider>
  );
};

export default App;