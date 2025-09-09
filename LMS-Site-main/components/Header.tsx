import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogInIcon } from './icons/LogInIcon';
import { UserIcon } from './icons/UserIcon';
import { LogOutIcon } from './icons/LogOutIcon';
import { LayoutDashboardIcon } from './icons/LayoutDashboardIcon';
import Button from './Button';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `py-2 transition-colors duration-300 ${isActive ? 'text-white font-semibold border-b-2 border-nebula-600' : 'text-gray-400 hover:text-white'}`;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileRef]);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    }


    return (
        <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-2xl font-bold">
                        Afric<span className="text-nebula-600">AI</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink to="/courses" className={navLinkClasses}>All Courses</NavLink>
                        <NavLink to="/tutors" className={navLinkClasses}>Find a Tutor</NavLink>
                        <NavLink to="/ai-tutor" className={navLinkClasses}>AI Tutor</NavLink>
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                </button>
                                {isProfileOpen && (
                                     <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-md shadow-lg">
                                        <div className="py-1">
                                            <div className="px-4 py-3 text-sm text-gray-300 border-b border-white/10">
                                                <p className="font-semibold flex items-center gap-1.5">
                                                    {user.name}
                                                    {user.verified && <CheckBadgeIcon className="w-4 h-4 text-blue-400" />}
                                                </p>
                                                <p className="truncate text-xs text-gray-400">{user.email}</p>
                                                {user.role === 'tutor' && <p className="text-xs text-gray-400 mt-1">Tutor ID: {user.publicId}</p>}
                                            </div>
                                            <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                                                <LayoutDashboardIcon className="mr-3 w-4 h-4" /> Dashboard
                                            </Link>
                                            <Link to="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                                                <UserIcon className="mr-3 w-4 h-4" /> Profile
                                            </Link>
                                            <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800">
                                                <LogOutIcon className="mr-3 w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {/* You can use a hamburger icon here */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900/90 py-4">
                    <nav className="flex flex-col items-center space-y-4">
                        <NavLink to="/courses" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>All Courses</NavLink>
                        <NavLink to="/tutors" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Find a Tutor</NavLink>
                        <NavLink to="/ai-tutor" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>AI Tutor</NavLink>
                        <div className="border-t border-white/10 w-full my-2"></div>
                         {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-400">Logout</button>
                            </>
                         ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}><Button variant="ghost" className="w-full">Log In</Button></Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)}><Button variant="primary" className="w-full">Sign Up</Button></Link>
                            </>
                         )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;