

import React from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpenIcon } from '../../components/icons/BookOpenIcon';
import { LayoutDashboardIcon } from '../../components/icons/LayoutDashboardIcon';
import { UserIcon } from '../../components/icons/UserIcon';
import { SettingsIcon } from '../../components/icons/SettingsIcon';
import { PlusCircleIcon } from '../../components/icons/PlusCircleIcon';
import { UsersIcon } from '../../components/icons/UsersIcon';
import { DollarSignIcon } from '../../components/icons/DollarSignIcon';
import { BarChartIcon } from '../../components/icons/BarChartIcon';
import { CreditCardIcon } from '../../components/icons/CreditCardIcon';
import { CalendarIcon } from '../../components/icons/CalendarIcon';
import { ReceiptIcon } from '../../components/icons/ReceiptIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import Button from '../../components/Button';
import { LogOutIcon } from '../../components/icons/LogOutIcon';

import DashboardHomePage from './DashboardHomePage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import MyCoursesPage from './MyCoursesPage';
import LearnerAnalyticsPage from './learner/LearnerAnalyticsPage';
import TeacherCourseCreatePage from './TeacherCourseCreatePage';
import TutorAnalyticsPage from './tutor/TutorAnalyticsPage';
import SchedulePage from './tutor/SchedulePage';
import MyStudentsPage from './tutor/MyStudentsPage';
import EarningsPage from './tutor/EarningsPage';
import BillingPage from './tutor/BillingPage';
import AdminAnalyticsPage from './admin/AdminAnalyticsPage';
import UserManagementPage from './admin/UserManagementPage';
import CourseManagementPage from './admin/CourseManagementPage';
import TransactionsPage from './admin/TransactionsPage';
import AdminTestResultsPage from './admin/AdminTestResultsPage';


const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const navLinkClass = `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-white/10`;
    const activeNavLinkClass = `bg-gradient-to-r from-nebula-700 to-nebula-600 text-white shadow-lg`;
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`;

    const commonLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, end: true },
        { to: '/dashboard/profile', label: 'Profile', icon: UserIcon },
        { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
    ];
    
    const learnerLinks = [
        { to: '/dashboard/my-courses', label: 'My Courses', icon: BookOpenIcon },
        { to: '/dashboard/analytics', label: 'My Progress', icon: BarChartIcon },
    ];
    
    const tutorLinks = [
        { to: '/dashboard/tutor/analytics', label: 'Analytics', icon: BarChartIcon },
        { to: '/dashboard/tutor/create-course', label: 'Create Course', icon: PlusCircleIcon },
        { to: '/dashboard/tutor/schedule', label: 'My Schedule', icon: CalendarIcon },
        { to: '/dashboard/tutor/students', label: 'My Students', icon: UsersIcon },
        { to: '/dashboard/tutor/earnings', label: 'Earnings', icon: DollarSignIcon },
        { to: '/dashboard/tutor/billing', label: 'Billing', icon: CreditCardIcon },
    ];
    
    const adminLinks = [
        { to: '/dashboard/admin/analytics', label: 'Platform Analytics', icon: BarChartIcon },
        { to: '/dashboard/admin/users', label: 'User Management', icon: UsersIcon },
        { to: '/dashboard/admin/courses', label: 'Course Management', icon: BookOpenIcon },
        { to: '/dashboard/admin/transactions', label: 'Transactions', icon: ReceiptIcon },
        { to: '/dashboard/admin/results', label: 'Test Results', icon: CheckCircleIcon },
    ];

    let links = [...commonLinks];
    if (user?.role === 'learner') links = [...links, ...learnerLinks];
    if (user?.role === 'tutor') links = [...links, ...tutorLinks];
    if (user?.role === 'admin') links = [...links, ...adminLinks];

    const handleLogoutAndRedirect = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-64 flex-shrink-0">
                    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 sticky top-28">
                        <nav className="space-y-2">
                             {links.map(({ to, label, icon: Icon, end }) => (
                                <NavLink to={to} key={label} end={end} className={getNavLinkClass}>
                                    <Icon className="w-5 h-5 mr-3" />
                                    {label}
                                </NavLink>
                            ))}
                        </nav>
                        
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <button onClick={handleLogoutAndRedirect} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 rounded-lg">
                               <LogOutIcon className="w-5 h-5 mr-3" /> Logout to switch role
                            </button>
                        </div>
                    </div>
                </aside>
                <main className="flex-1">
                    <Routes>
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
                        <Route path="admin/results" element={<AdminTestResultsPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;