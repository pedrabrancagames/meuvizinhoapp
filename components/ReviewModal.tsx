import React, { useState } from 'react';
import type { ItemRequest, Review, User } from '../types';
import { XMarkIcon, StarIcon } from './Icons';

type ReviewModalProps = {
  transaction: {
    request: ItemRequest;
    lender: User;
  };
  onClose: () => void;
  onSubmit: (review: Review) => void;
};

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          className="focus:outline-none"
        >
          <StarIcon
            className={`w-10 h-10 transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-neutral-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function ReviewModal({ transaction, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({
      rating,
      comment,
      reviewedUserId: transaction.lender.id,
      requestId: transaction.request.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-bold text-v-neutral dark:text-gray-200">Avaliar Empréstimo</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="text-center">
            <img src={transaction.lender.avatarUrl} alt={transaction.lender.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white dark:border-neutral-700" />
            <p className="text-gray-600 dark:text-gray-400">Como foi sua experiência com</p>
            <p className="font-bold text-lg text-v-neutral dark:text-gray-200">{transaction.lender.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">sobre o item <span className="font-semibold text-v-primary">{transaction.request.itemName}</span>?</p>
          </div>

          <div className="py-4">
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comentário (opcional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Deixe um elogio ou sugestão..."
              rows={3}
              className="w-full border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-v-primary focus:border-v-primary"
              maxLength={200}
            />
          </div>
        </form>
        
        <footer className="p-4 border-t border-gray-200 dark:border-neutral-700">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all disabled:bg-gray-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed"
          >
            Enviar Avaliação
          </button>
        </footer>
      </div>
    </div>
  );
}