import React, { useState, ChangeEvent } from 'react';
import type { ItemRequest } from '../types';
import { XMarkIcon, CameraIcon } from './Icons';
import { CATEGORIES } from '../constants';

type CreateRequestModalProps = {
  onClose: () => void;
  onCreateRequest: (request: Omit<ItemRequest, 'id' | 'userId' | 'createdAt' | 'distance' | 'offers' | 'status'>) => void;
  activeUserRequestsCount: number;
  userIsVerified: boolean;
};

export default function CreateRequestModal({ onClose, onCreateRequest, activeUserRequestsCount, userIsVerified }: CreateRequestModalProps) {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const requestLimit = userIsVerified ? 5 : 3;
  const isRequestLimitReached = activeUserRequestsCount >= requestLimit;

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
    if (!itemName || !description || isRequestLimitReached) return;
    onCreateRequest({ itemName, category, description, urgency, photoUrl });
  };

  const isFormValid = itemName.trim() !== '' && description.trim() !== '' && !isRequestLimitReached;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-bold text-v-neutral dark:text-gray-200">Criar Novo Pedido</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do item</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex: Furadeira, liquidificador..."
              className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição detalhada</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva por que você precisa do item."
              rows={4}
              className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
              maxLength={500}
              required
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Urgência</span>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUrgency('normal')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${urgency === 'normal' ? 'bg-v-secondary/20 border-v-secondary text-v-secondary' : 'border-gray-300 dark:border-neutral-600'}`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${urgency === 'urgent' ? 'bg-v-primary/20 border-v-primary text-v-primary' : 'border-gray-300 dark:border-neutral-600'}`}
              >
                Urgente
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto (opcional)</label>
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
                        <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF até 10MB</p>
                </div>
            </div>
          </div>

        </form>
        
        <footer className="p-4 border-t border-gray-200 dark:border-neutral-700">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed"
          >
            Publicar Pedido
          </button>
          {isRequestLimitReached && (
            <p className="text-center text-xs text-red-500 dark:text-red-400 mt-2">
              Você atingiu o limite de {requestLimit} pedidos ativos para usuários {userIsVerified ? 'verificados' : 'não verificados'}.
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}