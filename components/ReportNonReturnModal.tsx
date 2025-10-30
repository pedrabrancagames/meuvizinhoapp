import React from 'react';
import type { ItemRequest, User } from '../types';
import { XMarkIcon, ExclamationTriangleIcon } from './Icons';

type ReportNonReturnModalProps = {
  request: ItemRequest;
  borrower: User;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ReportNonReturnModal({ request, borrower, onClose, onConfirm }: ReportNonReturnModalProps) {
  if (!borrower) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-bold text-v-primary flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
            Reportar Item Não Devolvido
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </header>

        <div className="p-6 space-y-4">
            <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                    Você confirma que <span className="font-bold text-v-neutral dark:text-gray-200">{borrower.name}</span> não devolveu o item:
                </p>
                <div className="mt-4 bg-v-light-gray dark:bg-neutral-700/50 p-3 rounded-lg">
                    <p className="font-bold text-v-primary text-lg">{request.itemName}</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                   Ao confirmar, uma penalidade será aplicada à reputação de {borrower.name} e o pedido será encerrado.
                </p>
            </div>
        </div>
        
        <footer className="p-4 mt-auto flex space-x-3 border-t border-gray-200 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="w-full bg-v-tertiary dark:bg-neutral-700 text-v-neutral dark:text-gray-300 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
          >
            Confirmar Reporte
          </button>
        </footer>
      </div>
    </div>
  );
}