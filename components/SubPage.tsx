import React from 'react';
import { ArrowLeftIcon } from './Icons';

type SubPageProps = {
  title: string;
  onBack: () => void;
};

const SubPageHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => {
    return (
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-30 bg-v-neutral dark:bg-neutral-800 text-white p-4 flex justify-between items-center shadow-md h-16">
            <button onClick={onBack} className="p-2">
                <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="w-10"></div>
        </header>
    );
};

export default function SubPage({ title, onBack }: SubPageProps) {
  return (
    <div className="fixed inset-0 max-w-md mx-auto bg-v-light-bg dark:bg-neutral-900 flex flex-col">
      <SubPageHeader title={title} onBack={onBack} />
      <main className="flex-1 overflow-y-auto pt-20 p-6 text-center">
        <h2 className="text-2xl font-bold text-v-neutral dark:text-gray-200 mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Esta funcionalidade será implementada em breve.
        </p>
      </main>
    </div>
  );
}