import React, { useState } from 'react';
import { XMarkIcon } from './Icons';
import { CATEGORIES } from '../constants';

type AdvancedFilters = {
  distance: 'all' | '1km' | '3km';
  onlyVerified: boolean;
  category: string;
};

type FilterModalProps = {
  currentFilters: AdvancedFilters;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
};

export default function FilterModal({ currentFilters, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<AdvancedFilters>(currentFilters);

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    const clearedFilters = { 
      distance: 'all' as 'all', 
      onlyVerified: false, 
      category: 'Todos' 
    };
    setFilters(clearedFilters);
    onApply(clearedFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-bold text-v-neutral dark:text-gray-200">Filtros</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
                <div className="flex space-x-2 whitespace-nowrap">
                    {(['Todos', ...CATEGORIES]).map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFilters(f => ({ ...f, category: cat }))}
                            className={`py-2 px-4 rounded-lg border-2 transition-colors text-sm ${
                                filters.category === cat
                                    ? 'bg-v-primary/20 border-v-primary text-v-primary font-semibold'
                                    : 'border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Distância</label>
            <div className="grid grid-cols-3 gap-2">
              {(['all', '1km', '3km'] as const).map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, distance: dist }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    filters.distance === dist
                      ? 'bg-v-secondary/20 border-v-secondary text-v-secondary font-semibold'
                      : 'border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  {dist === 'all' ? 'Todos' : `Até ${dist}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confiança</label>
              <button
                onClick={() => setFilters(f => ({ ...f, onlyVerified: !f.onlyVerified }))}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${
                  filters.onlyVerified ? 'bg-v-primary' : 'bg-gray-200 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                    filters.onlyVerified ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mostrar apenas pedidos de usuários verificados.</p>
          </div>
        </div>
        
        <footer className="p-4 mt-auto flex space-x-3 border-t border-gray-200 dark:border-neutral-700">
          <button
            onClick={handleClear}
            className="w-full bg-v-tertiary dark:bg-neutral-700 text-v-neutral dark:text-gray-300 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
          >
            Limpar Filtros
          </button>
          <button
            onClick={handleApply}
            className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
          >
            Aplicar Filtros
          </button>
        </footer>
      </div>
    </div>
  );
}