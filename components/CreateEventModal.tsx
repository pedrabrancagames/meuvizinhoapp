import React, { useState, ChangeEvent } from 'react';
import type { CommunityEvent } from '../types';
import { XMarkIcon, CameraIcon } from './Icons';
import { EVENT_CATEGORIES } from '../constants';

type CreateEventModalProps = {
  onClose: () => void;
  onCreateEvent: (event: Omit<CommunityEvent, 'id' | 'creatorId' | 'interestedUserIds'>) => void;
};

export default function CreateEventModal({ onClose, onCreateEvent }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(EVENT_CATEGORIES[0]);
  const [photoUrl, setPhotoUrl] = useState('https://picsum.photos/seed/newevent/800/400'); // Default photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(photoUrl);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !eventDate || !location) return;
    onCreateEvent({ 
        title, 
        description, 
        eventDate: new Date(eventDate),
        location,
        category, 
        photoUrl 
    });
  };

  const isFormValid = title.trim() !== '' && description.trim() !== '' && eventDate.trim() !== '' && location.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-bold text-v-neutral dark:text-gray-200">Criar Novo Evento</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título do Evento</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Festa Junina do Condomínio"
              className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o evento, o que levar, etc."
              rows={3}
              className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data e Hora</label>
                <input
                  type="datetime-local"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
                  required
                />
              </div>
               <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Salão de Festas"
                  className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
                  required
                />
              </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
            >
              {EVENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto de Capa</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-neutral-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="mx-auto h-24 w-auto rounded-lg object-cover" />
                    ) : (
                        <CameraIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    )}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-neutral-800 rounded-md font-medium text-v-primary hover:text-v-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-v-primary">
                            <span>Carregar uma foto</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                    </div>
                </div>
            </div>
          </div>
        </form>
        
        <footer className="p-4 mt-auto border-t border-gray-200 dark:border-neutral-700">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full bg-v-secondary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed"
          >
            Publicar Evento
          </button>
        </footer>
      </div>
    </div>
  );
}