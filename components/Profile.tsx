import React from 'react';
import type { User, BadgeType, SubPageName } from '../types';
import { StarIcon, ChevronRightIcon, HomeIcon, CogIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, ArrowRightOnRectangleIcon, Squares2X2Icon, PencilIcon, MoonIcon, HeartIcon, SparklesIcon, ShieldCheckIcon, GiftIcon } from './Icons';

type ProfileProps = {
    user: User;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onNavigateToSubPage: (subPage: SubPageName) => void;
};

const badgeConfig: Record<BadgeType, { icon: React.FC<any>; label: string; color: string; }> = {
    BOM_VIZINHO: { icon: HeartIcon, label: 'Bom Vizinho', color: 'bg-red-500' },
    SUPER_AJUDANTE: { icon: SparklesIcon, label: 'Super Ajudante', color: 'bg-yellow-500' },
    CONFIAVEL: { icon: ShieldCheckIcon, label: 'Confiável', color: 'bg-blue-500' },
};

const Badge: React.FC<{type: BadgeType}> = ({ type }) => {
    const { icon: Icon, label, color } = badgeConfig[type];
    return (
        <div className="group relative">
            <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="absolute bottom-full mb-2 w-max bg-neutral-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -translate-x-1/2 left-1/2">
                {label}
                <svg className="absolute text-neutral-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </div>
        </div>
    );
};


const StatBox: React.FC<{ value: string | number; label: string, icon?: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
            <span className="text-3xl font-extrabold text-v-secondary">{value}</span>
            {icon && <span className="ml-1 text-v-warning">{icon}</span>}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</span>
    </div>
);

const MenuItem: React.FC<{ icon: React.FC<any>, label: string, isToggle?: boolean, isToggled?: boolean, onToggle?: () => void }> = ({ icon: Icon, label, isToggle = false, isToggled, onToggle }) => (
    <div className="w-full flex items-center justify-between text-left py-4 px-1">
        <div className="flex items-center">
            <Icon className="w-6 h-6 text-v-neutral dark:text-gray-400 mr-4" />
            <span className="text-v-neutral dark:text-gray-200 font-semibold">{label}</span>
        </div>
        {isToggle ? (
             <button onClick={(e) => { e.stopPropagation(); onToggle?.(); }} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${isToggled ? 'bg-v-primary' : 'bg-gray-200 dark:bg-neutral-600'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isToggled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        ) : (
             <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        )}
    </div>
);


export default function Profile({ user, isDarkMode, onToggleDarkMode, onNavigateToSubPage }: ProfileProps) {
    const menuItems1: { icon: React.FC<any>, label: string, page: SubPageName }[] = [
        { icon: Squares2X2Icon, label: 'Painel', page: 'PAINEL' },
        { icon: PencilIcon, label: 'Editar Perfil', page: 'EDITAR_PERFIL' },
        { icon: HomeIcon, label: 'Editar Endereço', page: 'EDITAR_ENDERECO' },
        { icon: CogIcon, label: 'Configurações', page: 'CONFIGURACOES' },
    ];
    
    const menuItems2: { icon: React.FC<any>, label: string, page: SubPageName }[] = [
        { icon: GiftIcon, label: 'Convidar Vizinhos', page: 'INVITE' },
        { icon: QuestionMarkCircleIcon, label: 'FAQ', page: 'FAQ' },
        { icon: ChatBubbleLeftRightIcon, label: 'Feedback', page: 'FEEDBACK' },
        { icon: DocumentTextIcon, label: 'Termos de Uso', page: 'TERMOS_DE_USO' },
    ];

    if (!user) {
        return <div className="text-center p-8">Usuário não encontrado.</div>
    }

    return (
        <div className="flex flex-col items-center pt-2 pb-4">
            <img src={user.avatarUrl} alt={user.name} className="w-28 h-28 rounded-full border-4 border-white dark:border-neutral-800 shadow-xl mb-4" />
            <h1 className="text-2xl font-bold text-v-neutral dark:text-gray-200 mb-2">{user.name}</h1>
            
            {user.badges && user.badges.length > 0 && (
                <div className="flex space-x-3 mb-4">
                    {user.badges.map(badgeType => <Badge key={badgeType} type={badgeType} />)}
                </div>
            )}

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md w-full p-4 my-4">
                <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-neutral-700">
                    <StatBox value={user.requestsMade} label="Pedidos Feitos" />
                    <StatBox value={user.loansMade} label="Empréstimos" />
                    <StatBox value={user.reputation} label="Reputação" icon={<StarIcon className="w-5 h-5"/>} />
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md w-full p-4 my-2 divide-y divide-gray-100 dark:divide-neutral-700">
                {menuItems1.map(item => (
                    <button key={item.label} onClick={() => onNavigateToSubPage(item.page)} className="w-full text-left hover:bg-gray-50 dark:hover:bg-neutral-700/50 rounded-lg">
                        <MenuItem icon={item.icon} label={item.label} />
                    </button>
                ))}
            </div>

             <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md w-full p-4 my-2">
                 <MenuItem icon={MoonIcon} label="Modo Escuro" isToggle={true} isToggled={isDarkMode} onToggle={onToggleDarkMode} />
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md w-full p-4 my-2 divide-y divide-gray-100 dark:divide-neutral-700">
                {menuItems2.map(item => (
                     <button key={item.label} onClick={() => onNavigateToSubPage(item.page)} className="w-full text-left hover:bg-gray-50 dark:hover:bg-neutral-700/50 rounded-lg">
                        <MenuItem icon={item.icon} label={item.label} />
                    </button>
                ))}
            </div>
        </div>
    );
}