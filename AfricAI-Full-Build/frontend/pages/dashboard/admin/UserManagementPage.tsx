import React, { useState, useMemo } from 'react';
import Table from '../shared/Table';
import Button from '../../../components/Button';
import UserModal from '../../../components/UserModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Pill from '../../../components/Pill';
import { mockTutors, mockLearnerUser, generateRandomPastDate } from '../../../mockData';
import type { User } from '../../../types';
import { SearchIcon } from '../../../components/icons/SearchIcon';
// FIX: Import GlassCard component
import GlassCard from '../../../components/GlassCard';

// Combine and create a more diverse user list for management
const generateMockUsers = (): User[] => {
    const tutorsAsUsers: User[] = mockTutors.map(tutor => ({
        id: tutor.id,
        publicId: tutor.publicId,
        name: tutor.name,
        email: `${tutor.name.toLowerCase().replace(/\s/g, '.')}@africai.com`,
        avatarUrl: tutor.avatarUrl,
        role: 'tutor',
        bio: tutor.bio,
        verified: tutor.verified,
        joinDate: tutor.joinDate,
    }));
    
    const learners: User[] = Array.from({ length: 15 }, (_, i) => ({
        id: `learner${i}`,
        publicId: (1000000 + i).toString(),
        name: `Learner ${i+1}`,
        email: `learner${i+1}@example.com`,
        avatarUrl: `https://i.pravatar.cc/150?u=learner${i+1}`,
        role: 'learner',
        verified: i % 5 === 0,
        joinDate: generateRandomPastDate(),
    }));

    return [mockLearnerUser, ...tutorsAsUsers, ...learners].sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime());
}


const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(generateMockUsers());
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleSaveUser = (userData: User) => {
        setUsers(users.map(u => (u.id === userData.id ? userData : u)));
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const tableHeaders = ['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'];

    const tableData = filteredUsers.map(user => [
        <div className="flex items-center gap-3">
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
            <span className="font-semibold">{user.name}</span>
        </div>,
        user.email,
        <Pill color={user.role === 'admin' ? 'primary' : user.role === 'tutor' ? 'yellow' : 'secondary'}>{user.role}</Pill>,
        user.verified ? <Pill color="green">Verified</Pill> : <Pill>Standard</Pill>,
        user.joinDate.toLocaleDateString(),
        <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleEdit(user)}>Edit</Button>
            <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20" onClick={() => handleDeleteClick(user)}>Delete</Button>
        </div>
    ]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-bold">User Management</h1>
                <div className="flex gap-4">
                     <div className="relative">
                        <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
            
            <Table title={`All Users (${filteredUsers.length})`} headers={tableHeaders} data={tableData} />
            
            {filteredUsers.length === 0 && (
                <GlassCard className="p-8 text-center text-gray-400">
                    No users found matching your search.
                </GlassCard>
            )}

            <UserModal 
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSave={handleSaveUser}
                user={selectedUser}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default UserManagementPage;