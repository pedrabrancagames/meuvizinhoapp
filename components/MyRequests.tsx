import React, { useState } from 'react';
import type { ItemRequest, Offer, User } from '../types';
import { ClockIcon, LocationMarkerIcon, ChevronRightIcon, CheckBadgeIcon, EnvelopeIcon, ChatBubbleLeftEllipsisIcon } from './Icons';

type MyRequestsProps = {
    requests: ItemRequest[];
    users: Record<string, User>;
    onStartChat: (partnerId: string, requestName: string, requestId: string) => void;
    onUpdateRequestStatus: (requestId: string, status: ItemRequest['status']) => void;
    loggedInUserId: string;
};

const VerificationBadge: React.FC<{ isVerified: boolean }> = ({ isVerified }) => {
    if (isVerified) {
        return <CheckBadgeIcon className="w-6 h-6 text-v-accent absolute -bottom-1 -right-1" title="Email verificado" />;
    }
    return <EnvelopeIcon className="w-5 h-5 p-0.5 bg-white dark:bg-neutral-700 rounded-full text-gray-400 dark:text-gray-500 absolute -bottom-1 -right-1" title="Apenas email" />;
};

const OfferListItem: React.FC<{ offer: Offer; user: User; onStartChat: () => void; }> = ({ offer, user, onStartChat }) => (
    <button onClick={onStartChat} className="w-full text-left flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-neutral-700/50 rounded-lg px-2 -mx-2 transition-colors">
        <div className="flex items-center">
            <div className="relative mr-3">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full"/>
                <VerificationBadge isVerified={user.isVerified} />
            </div>
            <div>
                <p className="font-bold text-v-neutral dark:text-gray-200">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{offer.message}</p>
            </div>
        </div>
        <div className="flex items-center text-sm text-gray-400">
            <span>a {Math.floor(Math.random() * 5 + 1)}km</span>
            <ChevronRightIcon className="w-5 h-5 ml-1"/>
        </div>
    </button>
);

const StatusBadge: React.FC<{ status: ItemRequest['status'] }> = ({ status }) => {
    if (status === 'completed') {
        return <div className="absolute top-4 right-4 bg-v-accent/80 text-white text-xs font-bold py-1 px-3 rounded-full backdrop-blur-sm">Concluído</div>;
    }
    if (status === 'cancelled') {
        return <div className="absolute top-4 right-4 bg-v-primary/80 text-white text-xs font-bold py-1 px-3 rounded-full backdrop-blur-sm">Cancelado</div>;
    }
    return null;
};

const MyRequestCard: React.FC<{ request: ItemRequest; user: User; users: Record<string, User>; onStartChat: (partnerId: string, requestName: string, requestId: string) => void; onUpdateRequestStatus: (requestId: string, status: ItemRequest['status']) => void; }> = ({ request, user, users, onStartChat, onUpdateRequestStatus }) => {
    const isArchived = request.status === 'completed' || request.status === 'cancelled';
    
    return (
        <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-5 mb-6 relative overflow-hidden ${isArchived ? 'opacity-70' : ''}`}>
             <StatusBadge status={request.status} />
            <div className="relative flex justify-center items-center mb-4">
                <div className="absolute flex justify-between w-full top-0">
                    <div className="flex items-center bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-v-neutral dark:text-gray-300 font-medium">
                        <ClockIcon className="w-4 h-4 mr-1.5" />
                        <span>{request.createdAt}</span>
                    </div>
                    <div className="flex items-center bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-v-neutral dark:text-gray-300 font-medium">
                        <LocationMarkerIcon className="w-4 h-4 mr-1.5 text-v-accent" />
                        <span>{request.distance}</span>
                    </div>
                </div>
                 <div className="relative">
                    <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-4 border-white dark:border-neutral-800 shadow-lg" />
                     <VerificationBadge isVerified={user.isVerified} />
                </div>
            </div>

            <div className="text-center mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Você precisa de um(a)</p>
                <h2 className="text-2xl font-extrabold text-v-primary my-1 tracking-tight">{request.itemName}</h2>
            </div>
            
            <div className="space-y-1 mb-5 divide-y divide-gray-100 dark:divide-neutral-700">
                {request.offers && request.offers.length > 0 ? (
                    request.offers?.map(offer => {
                        const offeringUser = users[offer.userId];
                        if (!offeringUser) return null;
                        return <OfferListItem key={offer.id} offer={offer} user={offeringUser} onStartChat={() => onStartChat(offer.userId, request.itemName, request.id)} />
                    })
                ) : (
                    <p className="text-center text-sm text-gray-400 py-4">Nenhuma oferta recebida ainda.</p>
                )}
            </div>

            <div className="flex justify-center space-x-3">
                <button 
                    onClick={() => onUpdateRequestStatus(request.id, 'completed')}
                    disabled={isArchived}
                    className="bg-v-accent text-white font-bold py-3 px-6 rounded-xl w-full hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-neutral-600 disabled:scale-100 disabled:cursor-not-allowed">
                        Já consegui
                </button>
                <button 
                    onClick={() => onUpdateRequestStatus(request.id, 'cancelled')}
                    disabled={isArchived}
                    className="bg-v-tertiary dark:bg-neutral-700 text-v-neutral dark:text-gray-300 font-bold py-3 px-6 rounded-xl w-full hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-neutral-600 disabled:scale-100 disabled:cursor-not-allowed">
                        Cancelar pedido
                </button>
            </div>
        </div>
    );
};

const MyLoanCard: React.FC<{ request: ItemRequest; borrower: User; onStartChat: () => void; }> = ({ request, borrower, onStartChat }) => {
    const isArchived = request.status === 'completed' || request.status === 'cancelled';
    return (
        <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-5 mb-6 relative ${isArchived ? 'opacity-70' : ''}`}>
            <StatusBadge status={request.status} />
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                     <div className="relative mr-3">
                        <img src={borrower.avatarUrl} alt={borrower.name} className="w-12 h-12 rounded-full" />
                        <VerificationBadge isVerified={borrower.isVerified} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Você ofereceu ajuda para</p>
                        <p className="font-bold text-v-neutral dark:text-gray-200">{borrower.name}</p>
                    </div>
                </div>
            </div>
            <div className="my-4 bg-v-light-gray dark:bg-neutral-700/50 p-3 rounded-lg text-center">
                <p className="font-bold text-v-primary">{request.itemName}</p>
            </div>
            <button
                onClick={onStartChat}
                className="w-full bg-v-secondary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-transform transform hover:scale-105 flex items-center justify-center"
            >
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2" />
                <span>Ver Conversa</span>
            </button>
        </div>
    );
};

export default function MyRequests({ requests, users, onStartChat, onUpdateRequestStatus, loggedInUserId }: MyRequestsProps) {
    const [activeTab, setActiveTab] = useState<'requests' | 'loans' | 'history'>('requests');

    const myRequests = requests.filter(req => req.userId === loggedInUserId);
    const myLoans = requests.filter(req => req.offers?.some(offer => offer.userId === loggedInUserId));
    
    const activeMyRequests = myRequests.filter(r => r.status === 'open');
    const activeMyLoans = myLoans.filter(r => r.status === 'open');
    const historyTransactions = requests
        .filter(r => (r.userId === loggedInUserId || r.offers?.some(o => o.userId === loggedInUserId)) && r.status !== 'open')
        .sort((a, b) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any));

    const currentUser = users[loggedInUserId];

    if (!currentUser) {
        return <div className="text-center p-8">Usuário não encontrado.</div>
    }
    
    const renderContent = () => {
        switch(activeTab) {
            case 'requests':
                return (
                    <>
                        {activeMyRequests.length > 0 ? (
                            activeMyRequests.map(request => (
                                <MyRequestCard key={request.id} request={request} user={currentUser} users={users} onStartChat={onStartChat} onUpdateRequestStatus={onUpdateRequestStatus} />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
                                <p className="font-semibold">Você não tem pedidos ativos.</p>
                                <p className="text-sm mt-2">Clique em "+ Pedir Item" na tela inicial para começar!</p>
                            </div>
                        )}
                    </>
                );
            case 'loans':
                 return (
                    <>
                        {activeMyLoans.length > 0 ? (
                            activeMyLoans.map(request => {
                                const borrower = users[request.userId];
                                if (!borrower) return null;
                                return (
                                    <MyLoanCard
                                        key={`loan-${request.id}`}
                                        request={request}
                                        borrower={borrower}
                                        onStartChat={() => onStartChat(borrower.id, request.itemName, request.id)}
                                    />
                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
                                <p className="font-semibold">Você não tem empréstimos ativos.</p>
                                <p className="text-sm mt-2">Explore a tela inicial para encontrar vizinhos que precisam de ajuda!</p>
                            </div>
                        )}
                    </>
                );
            case 'history':
                return (
                     <>
                        {historyTransactions.length > 0 ? (
                            historyTransactions.map(request => {
                                const isMyRequest = request.userId === loggedInUserId;
                                if (isMyRequest) {
                                    return <MyRequestCard key={`hist-req-${request.id}`} request={request} user={currentUser} users={users} onStartChat={onStartChat} onUpdateRequestStatus={onUpdateRequestStatus} />;
                                } else {
                                    const borrower = users[request.userId];
                                    if (!borrower) return null;
                                    return <MyLoanCard key={`hist-loan-${request.id}`} request={request} borrower={borrower} onStartChat={() => onStartChat(borrower.id, request.itemName, request.id)} />;
                                }
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
                                <p className="font-semibold">Seu histórico está vazio.</p>
                                <p className="text-sm mt-2">Transações concluídas ou canceladas aparecerão aqui.</p>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex border-b border-gray-200 dark:border-neutral-700 mb-4 sticky top-16 bg-v-light-bg dark:bg-neutral-900 z-10">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${activeTab === 'requests' ? 'border-b-2 border-v-primary text-v-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Meus Pedidos ({activeMyRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('loans')}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${activeTab === 'loans' ? 'border-b-2 border-v-primary text-v-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Meus Empréstimos ({activeMyLoans.length})
                </button>
                 <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${activeTab === 'history' ? 'border-b-2 border-v-primary text-v-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Histórico
                </button>
            </div>
            
            {renderContent()}

        </div>
    );
}