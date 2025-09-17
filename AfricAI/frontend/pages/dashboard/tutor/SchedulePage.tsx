import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import GlassCard from '../../../components/GlassCard';
import Button from '../../../components/Button';
import { mockTutors, generateUniqueId } from '../../../mockData';
import { PlusCircleIcon } from '../../../components/icons/PlusCircleIcon';
import SessionModal from '../../../components/SessionModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import type { LiveSession } from '../../../types';

const SchedulePage: React.FC = () => {
    const { user } = useAuth();
    const tutorData = mockTutors.find(t => t.id === user?.id);

    // State for managing schedule, modals, and session data
    const [schedule, setSchedule] = useState<LiveSession[]>(tutorData?.schedule || []);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
    const [sessionToDelete, setSessionToDelete] = useState<LiveSession | null>(null);

    // Handlers for opening modals
    const handleAddNew = () => {
        setSelectedSession(null);
        setIsSessionModalOpen(true);
    };

    const handleEdit = (session: LiveSession) => {
        setSelectedSession(session);
        setIsSessionModalOpen(true);
    };

    const handleDeleteClick = (session: LiveSession) => {
        setSessionToDelete(session);
        setIsDeleteModalOpen(true);
    };

    // Handler for saving a session (create or update)
    const handleSaveSession = (sessionData: LiveSession) => {
        if (selectedSession) {
            // Update existing session
            setSchedule(schedule.map(s => s.id === sessionData.id ? sessionData : s));
        } else {
            // Add new session
            setSchedule([...schedule, { ...sessionData, id: generateUniqueId() }]);
        }
    };
    
    // Handler for confirming deletion
    const confirmDelete = () => {
        if (sessionToDelete) {
            setSchedule(schedule.filter(s => s.id !== sessionToDelete.id));
            setSessionToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-bold">My Schedule</h1>
                <Button onClick={handleAddNew}>
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Add New Session
                </Button>
            </div>
            
            <GlassCard className="p-6">
                <h2 className="text-2xl font-bold mb-4">Upcoming Live Sessions</h2>
                {schedule.length > 0 ? (
                     <ul className="space-y-4">
                        {schedule.sort((a,b) => a.startTime.getTime() - b.startTime.getTime()).map(session => (
                             <li key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-white/5">
                                <div>
                                    <p className="font-semibold">{session.title}</p>
                                    <p className="text-sm text-gray-400">
                                        {session.startTime.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })} ({session.timezone})
                                    </p>
                                    <p className="text-sm font-bold text-nebula-600 mt-1">
                                        {session.bookedStudents.length} / {session.capacity} students booked
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                                     <Button variant="secondary" size="sm" onClick={() => handleEdit(session)}>Edit</Button>
                                     <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20" onClick={() => handleDeleteClick(session)}>Delete</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center py-8">You have no upcoming sessions scheduled.</p>
                )}
            </GlassCard>

            <SessionModal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                onSave={handleSaveSession}
                session={selectedSession}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Session"
                message={`Are you sure you want to delete the session "${sessionToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default SchedulePage;