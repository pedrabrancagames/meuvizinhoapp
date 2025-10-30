import React, { useState } from 'react';
import type { User, EditableUser } from '../types';
import { ArrowLeftIcon } from './Icons';

type EditProfileProps = {
  user: User;
  onSave: (updatedData: EditableUser) => void;
  onBack: () => void;
};

const availableAvatars = [
  'https://picsum.photos/id/1005/200/200',
  'https://picsum.photos/id/1011/200/200',
  'https://picsum.photos/id/1025/200/200',
  'https://picsum.photos/id/1027/200/200',
  'https://picsum.photos/id/1045/200/200',
  'https://picsum.photos/id/1062/200/200',
  'https://picsum.photos/id/1074/200/200',
  'https://picsum.photos/id/1084/200/200',
];

const EditProfileHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-30 bg-v-neutral dark:bg-neutral-800 text-white p-4 flex justify-between items-center shadow-md h-16">
            <button onClick={onBack} className="p-2">
                <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Editar Perfil</h1>
            <div className="w-10"></div>
        </header>
    );
};


export default function EditProfile({ user, onSave, onBack }: EditProfileProps) {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const handleSave = () => {
    onSave({ name, avatarUrl });
  };

  return (
    <div className="fixed inset-0 max-w-md mx-auto bg-v-light-bg dark:bg-neutral-900 flex flex-col">
      <EditProfileHeader onBack={onBack} />
      <main className="flex-1 overflow-y-auto pt-20 p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Escolha seu avatar
          </label>
          <div className="grid grid-cols-4 gap-4">
            {availableAvatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setAvatarUrl(avatar)}
                className={`rounded-full overflow-hidden transition-all duration-200 ${
                  avatarUrl === avatar ? 'ring-4 ring-v-primary ring-offset-2 dark:ring-offset-neutral-900' : 'hover:scale-105'
                }`}
              >
                <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </main>
      <footer className="p-4 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 mt-auto">
        <button
          onClick={handleSave}
          className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
        >
          Salvar Alterações
        </button>
      </footer>
    </div>
  );
}