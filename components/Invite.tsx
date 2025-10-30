import React, { useState } from 'react';
import type { User } from '../types';
import { ArrowLeftIcon, CheckBadgeIcon } from './Icons';

type InviteProps = {
  user: User;
  allUsers: Record<string, User>;
  onBack: () => void;
};

const InviteHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-30 bg-v-neutral dark:bg-neutral-800 text-white p-4 flex justify-between items-center shadow-md h-16">
            <button onClick={onBack} className="p-2">
                <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Convidar Vizinhos</h1>
            <div className="w-10"></div>
        </header>
    );
};

const UserCard: React.FC<{ user: User, label: string }> = ({ user, label }) => (
    <div className="flex items-center p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
            <p className="font-bold text-v-neutral dark:text-gray-200">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    </div>
);


export default function Invite({ user, allUsers, onBack }: InviteProps) {
    const [copyButtonText, setCopyButtonText] = useState('Copiar Código');
    const usersInvitedByMe = Object.values(allUsers).filter(u => u.invitedBy === user.id);
    const userWhoInvitedMe = user.invitedBy ? allUsers[user.invitedBy] : null;

    const handleCopyCode = () => {
        if (user.inviteCode) {
            navigator.clipboard.writeText(user.inviteCode);
            setCopyButtonText('Copiado!');
            setTimeout(() => setCopyButtonText('Copiar Código'), 2000);
        }
    };

    return (
    <div className="fixed inset-0 max-w-md mx-auto bg-v-light-bg dark:bg-neutral-900 flex flex-col">
      <InviteHeader onBack={onBack} />
      <main className="flex-1 overflow-y-auto pt-20 p-6 space-y-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 text-center">
            <h2 className="text-lg font-semibold text-v-neutral dark:text-gray-200 mb-2">Seu código de convite exclusivo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Compartilhe este código com vizinhos de confiança para que eles entrem na comunidade.</p>
            <div className="my-4 p-3 bg-v-primary/10 rounded-lg border-2 border-dashed border-v-primary">
                 <p className="font-mono text-2xl font-bold text-v-primary tracking-widest">{user.inviteCode || 'N/A'}</p>
            </div>
            <button
                onClick={handleCopyCode}
                className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
                >
                {copyButtonText}
            </button>
        </div>

        {usersInvitedByMe.length > 0 && (
            <div>
                <h3 className="text-lg font-bold text-v-neutral dark:text-gray-200 mb-3">Você Convidou:</h3>
                <div className="space-y-3">
                    {usersInvitedByMe.map(invitedUser => (
                        <UserCard key={invitedUser.id} user={invitedUser} label="Vizinho Ativo ✅" />
                    ))}
                </div>
            </div>
        )}

        {userWhoInvitedMe && (
            <div>
                <h3 className="text-lg font-bold text-v-neutral dark:text-gray-200 mb-3">Sua Rede de Confiança:</h3>
                <UserCard user={userWhoInvitedMe} label="Convidado(a) por" />
            </div>
        )}
      </main>
    </div>
  );
}