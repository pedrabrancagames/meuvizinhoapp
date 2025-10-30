import React from 'react';
import type { CommunityEvent, User } from '../types';
import { CalendarDaysIcon, LocationMarkerIcon, PlusIcon } from './Icons';

const EventCard: React.FC<{ event: CommunityEvent; onToggleInterest: (eventId: string) => void; loggedInUserId: string; users: Record<string, User>; }> = ({ event, onToggleInterest, loggedInUserId, users }) => {
    const creator = users[event.creatorId];
    
    const eventDate = event.eventDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
    });
    const eventTime = event.eventDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isInterested = event.interestedUserIds.includes(loggedInUserId);
    const interestedUsers = event.interestedUserIds.map(id => users[id]).filter(Boolean);
    const interestedCount = interestedUsers.length;

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md overflow-hidden mb-6">
            <img src={event.photoUrl} alt={event.title} className="w-full h-32 object-cover" />
            <div className="p-5">
                <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                        <span>{eventDate} às {eventTime}</span>
                    </div>
                    <div className="flex items-center">
                        <LocationMarkerIcon className="w-4 h-4 mr-1.5 text-v-accent" />
                        <span>{event.location}</span>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-v-neutral dark:text-gray-200 mb-2">{event.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center -space-x-2">
                        {interestedUsers.slice(0, 3).map(user => (
                            <img key={user.id} src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-800" />
                        ))}
                        {interestedCount > 3 && (
                            <div className="w-8 h-8 rounded-full bg-v-light-gray dark:bg-neutral-700 flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-neutral-800">
                                +{interestedCount - 3}
                            </div>
                        )}
                    </div>
                     <button 
                        onClick={() => onToggleInterest(event.id)}
                        className={`font-bold py-2 px-5 rounded-xl transition-all transform hover:scale-105 text-sm ${
                            isInterested 
                                ? 'bg-v-accent text-white' 
                                : 'bg-v-secondary text-white hover:bg-opacity-90'
                        }`}
                    >
                        {isInterested ? 'Interessado ✓' : 'Tenho Interesse'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Events({ events, onToggleInterest, loggedInUserId, users, onOpenCreateEventModal }: { events: CommunityEvent[]; onToggleInterest: (eventId: string) => void; loggedInUserId: string; users: Record<string, User>; onOpenCreateEventModal: () => void; }) {
    return (
        <div className="space-y-4">
            {events.map(event => (
                <EventCard key={event.id} event={event} onToggleInterest={onToggleInterest} loggedInUserId={loggedInUserId} users={users} />
            ))}
        </div>
    );
}