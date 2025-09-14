import React from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { CheckBadgeIcon } from '../../components/icons/CheckBadgeIcon';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">My Profile</h1>
      <GlassCard className="p-8">
        <form className="space-y-6">
          <div className="flex items-center space-x-6">
            <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full" />
            <Button variant="secondary" type="button">Change Avatar</Button>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative">
                 <input type="text" id="name" defaultValue={user.name} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                 {user.verified && <CheckBadgeIcon className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-blue-400" />}
            </div>
          </div>
          
           {user.role !== 'admin' && (
             <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Your Bio</label>
                <textarea id="bio" rows={4} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" defaultValue={user.bio || 'A passionate educator specializing in AI.'}></textarea>
             </div>
           )}
          <div className="pt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-8">
        <h2 className="text-2xl font-bold mb-4">Account Details</h2>
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Email Address</label>
              <p className="text-base">{user.email}</p>
            </div>
            {user.role === 'tutor' && (
               <div>
                <label className="block text-sm font-medium text-gray-400">Tutor ID</label>
                <p className="text-base">{user.publicId}</p>
               </div>
            )}
             <div>
              <label className="block text-sm font-medium text-gray-400">Join Date</label>
              <p className="text-base">{user.joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;