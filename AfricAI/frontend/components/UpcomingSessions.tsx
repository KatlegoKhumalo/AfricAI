import React from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import { useSchedule } from '../utils/scheduleStore';
import { Link } from 'react-router-dom';

const UpcomingSessions: React.FC = () => {
    const { upcoming } = useSchedule();

    return (
        <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
                <Link to="/dashboard/tutor/schedule"><Button size="sm" variant="secondary">View All</Button></Link>
            </div>
            {upcoming.length === 0 ? (
                <p className="text-sm text-gray-400">No upcoming sessions scheduled.</p>
            ) : (
                <ul className="divide-y divide-white/10">
                    {upcoming.slice(0, 5).map(s => (
                        <li key={s.id} className="py-2 flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-sm">{s.title}</div>
                                <div className="text-xs text-gray-400">{new Date(s.startAt).toLocaleString()}</div>
                            </div>
                            <Link to={`/#/live-session/${encodeURIComponent(s.roomId)}`}>
                                <Button size="sm">Join</Button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </GlassCard>
    );
};

export default UpcomingSessions;


