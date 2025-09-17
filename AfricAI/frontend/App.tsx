

import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CoursesListPage from './pages/CoursesListPage';
import CourseViewPage from './pages/CourseViewPage';
import ChapterViewPage from './pages/ChapterViewPage';
import FindTutorPage from './pages/FindTutorPage';
import TutorProfilePage from './pages/TutorProfilePage';
import AITutorPage from './pages/AITutorPage';
import CAIPage from './pages/CAIPage';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import LiveSessionPage from './pages/LiveSessionPage';
import TutorOnboardingPaymentPage from './pages/TutorOnboardingPaymentPage';
import TestPage from './pages/TestPage';

const AppContent: React.FC = () => {
    const location = useLocation();
    const isLiveSession = location.pathname.startsWith('/live-session');
    const isTestPage = location.pathname.includes('/test');
    const isCAIPage = location.pathname.startsWith('/cai');

    const shouldHideHeaderFooter = isLiveSession || isTestPage || isCAIPage;

    return (
        <div className="flex flex-col min-h-screen text-white font-sans">
            {!shouldHideHeaderFooter && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/courses" element={<CoursesListPage />} />
                    <Route path="/course/:courseId" element={<CourseViewPage />} />
                    <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterViewPage />} />
                    <Route path="/course/:courseId/test" element={<TestPage />} />
                    <Route path="/tutors" element={<FindTutorPage />} />
                    <Route path="/tutor/:tutorId" element={<TutorProfilePage />} />
                    <Route path="/ai-tutor" element={<AITutorPage />} />
                    <Route path="/cai" element={<CAIPage />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/checkout/:courseId" element={<CheckoutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/live-session/:sessionId" element={<LiveSessionPage />} />
                    <Route path="/tutor-onboarding/payment" element={<TutorOnboardingPaymentPage />} />

                    <Route path="/dashboard/*" element={<DashboardLayout />} />
                </Routes>
            </main>
            {!shouldHideHeaderFooter && <Footer />}
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