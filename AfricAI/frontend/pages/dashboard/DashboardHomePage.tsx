import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import GlassCard from '../../components/GlassCard';
import { mockTutors } from '../../mockData';

const DashboardHomePage: React.FC = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'tutor':
        return 'Welcome back, Tutor! Ready to inspire some students?';
      case 'admin':
        return 'Welcome, Admin! Here\'s the latest platform overview.';
      default:
        return 'Welcome back! Let\'s continue your learning journey.';
    }
  };

  const getQuickLinks = () => {
    switch(user?.role) {
        case 'tutor':
            return (
                <>
                    <Link to="tutor/create-course"><Button>Create New Course</Button></Link>
                    <Link to="tutor/analytics"><Button variant="secondary">View Analytics</Button></Link>
                </>
            );
        case 'admin':
             return (
                <>
                    <Link to="admin/users"><Button>Manage Users</Button></Link>
                    <Link to="admin/courses"><Button variant="secondary">Manage Courses</Button></Link>
                </>
            );
        default:
             return (
                <>
                    <Link to="my-courses"><Button>Go to My Courses</Button></Link>
                    <Link to="/courses"><Button variant="secondary">Explore New Courses</Button></Link>
                </>
            );
    }
  }

  if (!user) {
    return (
        <GlassCard className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Please log in to see your dashboard.</p>
        </GlassCard>
    );
  }
  
  // Tutor-specific data for the new widget
  const tutorData = user.role === 'tutor' ? mockTutors.find(t => t.id === user.id) : null;
  const upcomingSessions = tutorData?.schedule
    .filter(session => session.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
        <GlassCard className="p-8 text-center">
            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Hello, {user.name}!</h1>
            <p className="text-gray-400 mb-8">{getWelcomeMessage()}</p>
            <div className="flex justify-center gap-4">
                {getQuickLinks()}
            </div>
        </GlassCard>

        {user.role === 'tutor' && (
             <GlassCard className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                    <Link to="tutor/schedule">
                        <Button variant="ghost" size="sm">View Full Schedule</Button>
                    </Link>
                </div>
                {upcomingSessions && upcomingSessions.length > 0 ? (
                    <ul className="space-y-4">
                        {upcomingSessions.map(session => (
                            <li key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white/5 rounded-md">
                                <div>
                                    <p className="font-semibold">{session.title}</p>
                                    <p className="text-sm text-gray-400">
                                        {session.startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {session.startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <Link to={`/live-session/${session.id}`} className="mt-2 sm:mt-0">
                                    <Button size="sm" variant="secondary">Join</Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center py-4">No upcoming sessions scheduled.</p>
                )}
            </GlassCard>
        )}
    </div>
  );
};

export default DashboardHomePage;