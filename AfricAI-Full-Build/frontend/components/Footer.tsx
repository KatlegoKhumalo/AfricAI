import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/20 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Logo className="h-14 w-auto mb-4" />
            <p className="text-gray-400 text-sm">Empowering the next generation of AI innovators.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-400 hover:text-white text-sm">All Courses</Link></li>
              <li><Link to="/tutors" className="text-gray-400 hover:text-white text-sm">Find a Tutor</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">LinkedIn</a></li>
               <li><a href="#" className="text-gray-400 hover:text-white text-sm">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AfricAI. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;