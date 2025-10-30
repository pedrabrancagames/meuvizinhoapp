import React from 'react';
import type { Notification } from '../types';
import { ArrowLeftIcon, HandThumbUpIcon, SparklesIcon, StarIcon, ExclamationTriangleIcon, ChatBubbleLeftEllipsisIcon } from './Icons';

type NotificationsProps = {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onBack: () => void;
};

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    const iconMap: Record<Notification['type'], React.ReactNode> = {
        new_offer: <HandThumbUpIcon className="w-6 h-6 text-white" />,
        new_review: <StarIcon className="w-6 h-6 text-white" />,
        achievement: <SparklesIcon className="w-6 h-6 text-white" />,
        penalty: <ExclamationTriangleIcon className="w-6 h-6 text-white" />,
        new_message: <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-white" />,
    };
    const colorMap: Record<Notification['type'], string> = {
        new_offer: 'bg-blue-400',
        new_review: 'bg-yellow-400',
        achievement: 'bg-purple-400',
        penalty: 'bg-red-500',
        new_message: 'bg-green-500',
    };
    return <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${colorMap[type]}`}>{iconMap[type]}</div>;
};


const NotificationsHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-30 bg-v-neutral dark:bg-neutral-800 text-white p-4 flex justify-between items-center shadow-md h-16">
            <button onClick={onBack} className="p-2">
                <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Notificações</h1>
            <div className="w-10"></div>
        </header>
    );
};

export default function Notifications({ notifications, onMarkAsRead, onMarkAllAsRead, onBack }: NotificationsProps) {
  return (
    <div className="fixed inset-0 max-w-md mx-auto bg-v-light-bg dark:bg-neutral-900 flex flex-col">
        <NotificationsHeader onBack={onBack} />
        <main className="flex-1 overflow-y-auto pt-16">
            <div className="p-4 flex justify-end">
                <button onClick={onMarkAllAsRead} className="text-sm font-semibold text-v-primary hover:underline">
                    Marcar todas como lidas
                </button>
            </div>
            
            {notifications.length > 0 ? (
                 <div className="divide-y divide-gray-200 dark:divide-neutral-700/50">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => onMarkAsRead(notification.id)}
                        className={`w-full text-left flex items-center p-4 transition-colors ${notification.isRead ? 'bg-v-light-bg dark:bg-neutral-900' : 'bg-white dark:bg-neutral-800'}`}
                      >
                        <NotificationIcon type={notification.type} />
                        <div className="flex-1">
                            <p className="text-sm text-v-neutral dark:text-gray-300">{notification.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.createdAt}</p>
                        </div>
                        {!notification.isRead && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full ml-4"></div>
                        )}
                      </button>
                    ))}
                 </div>
            ) : (
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <p className="font-semibold">Nenhuma notificação por aqui.</p>
                    <p className="text-sm mt-2">Suas interações aparecerão aqui.</p>
                </div>
            )}
        </main>
    </div>
  );
}