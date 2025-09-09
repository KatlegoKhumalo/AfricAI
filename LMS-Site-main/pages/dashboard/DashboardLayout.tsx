import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
import Button from '../../components/Button';
import { LogOutIcon } from '../../components/icons/LogOutIcon';


const commonLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
    { to: 'profile', label: 'Profile', icon: UserIcon },
    { to: 'settings', label: 'Settings', icon: SettingsIcon },
];

const learnerLinks = [
    { to: 'my-courses', label: 'My Courses', icon: BookOpenIcon },
    { to: 'analytics', label: 'My Progress', icon: BarChartIcon },
];

const tutorLinks = [
    { to: 'tutor/analytics', label: 'Analytics', icon: BarChartIcon },
    { to: 'tutor/create-course', label: 'Create Course', icon: PlusCircleIcon },
    { to: 'tutor/schedule', label: 'My Schedule', icon: CalendarIcon },
    { to: 'tutor/students', label: 'My Students', icon: UsersIcon },
    { to: 'tutor/earnings', label: 'Earnings', icon: DollarSignIcon },
    { to: 'tutor/billing', label: 'Billing', icon: CreditCardIcon },
];

const adminLinks = [
    { to: 'admin/analytics', label: 'Platform Analytics', icon: BarChartIcon },
    { to: 'admin/users', label: 'User Management', icon: UsersIcon },
    { to: 'admin/courses', label: 'Course Management', icon: BookOpenIcon },
    { to: 'admin/transactions', label: 'Transactions', icon: ReceiptIcon },
];

const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gradient-to-r from-nebula-700 to-nebula-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10'}`;

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
                             {links.map(({ to, label, icon: Icon }) => (
                                <NavLink to={to} key={to} end={to === '/dashboard'} className={navLinkClasses}>
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
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;