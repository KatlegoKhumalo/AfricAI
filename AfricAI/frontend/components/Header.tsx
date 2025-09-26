

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogInIcon } from './icons/LogInIcon';
import { UserIcon } from './icons/UserIcon';
import { LogOutIcon } from './icons/LogOutIcon';
import { LayoutDashboardIcon } from './icons/LayoutDashboardIcon';
import Button from './Button';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import Logo from './Logo';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const navLinkClassName = "py-2 transition-colors duration-300 text-gray-400 hover:text-white";
    const activeClassName = "text-white font-semibold border-b-2 border-nebula-600";


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
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/40 border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link to="/" aria-label="Home"><Logo className="h-10 w-auto" /></Link>
                <nav className="hidden md:flex items-center gap-8 text-base">
                    <Link to="/courses" className="text-gray-200 hover:text-white">All Courses</Link>
                    <Link to="/tutors" className="text-gray-200 hover:text-white">Find a Tutor</Link>
                    <Link to="/ai-tutor" className="text-gray-200 hover:text-white">AI Tutor</Link>
                    <Link to="/cai" className="text-gray-200 hover:text-white">CAI</Link>
                </nav>
                <div className="relative">
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3">
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                <span className="hidden md:block text-sm text-gray-200">{user.name}</span>
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-black/80 border border-white/10 shadow-xl backdrop-blur">
                                    <div className="px-3 py-2 border-b border-white/10">
                                        <p className="text-sm font-semibold">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                    <ul className="py-2 text-sm">
                                        <li><Link className="block px-3 py-2 text-gray-200 hover:bg-white/10" to="/dashboard" onClick={() => setIsProfileOpen(false)}>Dashboard</Link></li>
                                        <li><Link className="block px-3 py-2 text-gray-200 hover:bg-white/10" to="/dashboard/profile" onClick={() => setIsProfileOpen(false)}>Profile</Link></li>
                                        <li><button className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/10" onClick={handleLogout}>Logout</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-base">Log In</Link>
                            <Link to="/signup" className="px-4 py-2 rounded-md bg-nebula-600 hover:bg-nebula-500 text-base">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900/90 py-4">
                    <nav className="flex flex-col items-center space-y-4">
                        <NavLink to="/courses" className={({ isActive }) => isActive ? `${navLinkClassName} ${activeClassName}` : navLinkClassName} onClick={() => setIsMenuOpen(false)}>All Courses</NavLink>
                        <NavLink to="/tutors" className={({ isActive }) => isActive ? `${navLinkClassName} ${activeClassName}` : navLinkClassName} onClick={() => setIsMenuOpen(false)}>Find a Tutor</NavLink>
                        <NavLink to="/ai-tutor" className={({ isActive }) => isActive ? `${navLinkClassName} ${activeClassName}` : navLinkClassName} onClick={() => setIsMenuOpen(false)}>AI Tutor</NavLink>
                        <NavLink to="/cai" className={({ isActive }) => isActive ? `${navLinkClassName} ${activeClassName}` : navLinkClassName} onClick={() => setIsMenuOpen(false)}>CAI</NavLink>
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