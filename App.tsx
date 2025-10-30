import React, { useState, useEffect, useMemo } from 'react';
import type { Screen, ItemRequest, ChatMessage, Offer, CommunityEvent, Review, User, Notification, BadgeType, SubPageName, EditableUser } from './types';
import { HomeIcon, ListIcon, UserIcon, BellIcon, MenuIcon, CalendarDaysIcon, PlusIcon } from './components/Icons';
import Home from './components/Home';
import MyRequests from './components/MyRequests';
import Chat from './components/Chat';
import Profile from './components/Profile';
import CreateRequestModal from './components/CreateRequestModal';
import CreateEventModal from './components/CreateEventModal';
import ReviewModal from './components/ReviewModal';
import DenounceModal from './components/DenounceModal';
import ReportNonReturnModal from './components/ReportNonReturnModal';
import Events from './components/Events';
import Notifications from './components/Notifications';
import SubPage from './components/SubPage';
import EditProfile from './components/EditProfile';
import Invite from './components/Invite';
import { INITIAL_REQUESTS, INITIAL_CHAT_MESSAGES, USERS as INITIAL_USERS, INITIAL_EVENTS, INITIAL_NOTIFICATIONS } from './constants';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';

const TopHeader: React.FC<{ screen: Screen, onMenuClick: () => void, onNotificationsClick: () => void, unreadCount: number }> = ({ screen, onMenuClick, onNotificationsClick, unreadCount }) => {
    const titleMap: Record<Screen, string> = {
        HOME: 'MeuVizinhoApp',
        MY_REQUESTS: 'Meus Pedidos',
        EVENTS: 'Eventos da Comunidade',
        CHAT: 'Chat',
        PROFILE: 'Perfil',
        NOTIFICATIONS: 'Notificações',
    };

    const isNavScreen = ['HOME', 'MY_REQUESTS', 'EVENTS', 'PROFILE'].includes(screen);

    return (
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-30 bg-v-neutral dark:bg-neutral-800 text-white p-4 flex justify-between items-center shadow-md h-16">
            {isNavScreen ? (
                 <button onClick={onMenuClick} className="p-2">
                    <MenuIcon className="h-6 w-6" />
                </button>
            ) : (
                 <div className="w-10"></div> // Placeholder for alignment
            )}
           
            <h1 className="text-xl font-bold">{titleMap[screen]}</h1>
            
            {isNavScreen ? (
                <button onClick={onNotificationsClick} className="relative p-2">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                         <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-v-primary text-white text-xs flex items-center justify-center">{unreadCount}</span>
                    )}
                </button>
            ) : (
                <div className="w-10"></div> // Placeholder for alignment
            )}
        </header>
    );
};

const BottomNav: React.FC<{ activeScreen: Screen; setScreen: (screen: Screen) => void }> = ({ activeScreen, setScreen }) => {
    const navItems = [
        { screen: 'HOME' as Screen, icon: HomeIcon, label: 'Início' },
        { screen: 'MY_REQUESTS' as Screen, icon: ListIcon, label: 'Pedidos' },
        { screen: 'EVENTS' as Screen, icon: CalendarDaysIcon, label: 'Eventos' },
        { screen: 'PROFILE' as Screen, icon: UserIcon, label: 'Perfil' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-neutral-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.5)] flex justify-around items-center h-20 rounded-t-2xl z-30 border-t border-gray-200 dark:border-neutral-700">
            {navItems.map(({ screen, icon: Icon, label }) => (
                <button
                    key={screen}
                    onClick={() => setScreen(screen)}
                    className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 w-full h-full ${activeScreen === screen ? 'text-v-primary' : 'text-gray-400 dark:text-gray-500'}`}
                >
                    <Icon className="h-7 w-7" />
                    <span className="text-xs font-medium">{label}</span>
                </button>
            ))}
        </nav>
    );
};

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-v-primary"></div>
    </div>
);


export default function App() {
    const [loggedInUserId, setLoggedInUserId] = useState<string>('user-1-uid');
    const [activeScreen, setActiveScreen] = useState<Screen>('HOME');
    const [previousScreen, setPreviousScreen] = useState<Screen>('HOME');
    const [activeSubPage, setActiveSubPage] = useState<SubPageName | null>(null);
    
    // Estados para dados do Firebase - começam com dados iniciais como fallback
    const [requests, setRequests] = useState<ItemRequest[]>(INITIAL_REQUESTS);
    const [users, setUsers] = useState<Record<string, User>>(INITIAL_USERS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isDenounceModalOpen, setIsDenounceModalOpen] = useState(false);
    const [isReportNonReturnModalOpen, setIsReportNonReturnModalOpen] = useState(false);
    const [requestToReport, setRequestToReport] = useState<ItemRequest | null>(null);
    const [requestToDenounce, setRequestToDenounce] = useState<ItemRequest | null>(null);
    const [denouncedRequestIds, setDenouncedRequestIds] = useState<Set<string>>(new Set());
    const [dismissedRequestIds, setDismissedRequestIds] = useState<Set<string>>(new Set());
    const [showToast, setShowToast] = useState(false);
    const [transactionToReview, setTransactionToReview] = useState<{ request: ItemRequest, lender: User } | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
    const [selectedChatContext, setSelectedChatContext] = useState<{partnerId: string, requestName: string, requestId: string} | null>(null);
    const [events, setEvents] = useState<CommunityEvent[]>(INITIAL_EVENTS);
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

    // Efeito para autenticar usuário com Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedInUserId(user.uid);
            } else {
                // Para fins de demonstração, manter usuário padrão
                // Em produção, redirecionaria para tela de login
                setLoggedInUserId('user-1-uid');
            }
        });

        return () => unsubscribe();
    }, []);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('meuvizinho-dark-mode') === 'true';
        }
        return false;
    });

    const userNotifications = useMemo(() => 
        notifications.filter(n => n.userId === loggedInUserId)
    , [notifications, loggedInUserId]);

    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    const activeUserRequestsCount = useMemo(() => 
        requests.filter(r => r.userId === loggedInUserId && r.status === 'open').length
    , [requests, loggedInUserId]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('meuvizinho-dark-mode', 'true');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('meuvizinho-dark-mode', 'false');
        }
    }, [isDarkMode]);
    
    // Efeito para carregar dados do Firebase (exemplo básico)
    useEffect(() => {
        const loadFirebaseData = async () => {
            try {
                // Exemplo de como carregar pedidos do Firestore
                // const requestsQuery = query(collection(db, 'requests'), where('active', '==', true));
                // const requestsSnapshot = await getDocs(requestsQuery);
                // const requestsData = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ItemRequest));
                // setRequests(requestsData);
            } catch (error) {
                console.error('Erro ao carregar dados do Firebase:', error);
                // Continuar com dados estáticos em caso de erro
            }
        };

        loadFirebaseData();
    }, []);
    
    const handleSetScreen = (screen: Screen) => {
        if (screen !== activeScreen) {
            setPreviousScreen(activeScreen);
            setActiveScreen(screen);
            setActiveSubPage(null);
        }
    };

    const handleNavigateToSubPage = (subPage: SubPageName) => {
        setActiveSubPage(subPage);
    };

    const handleBackFromSubPage = () => {
        setActiveSubPage(null);
    };

    const handleOpenNotifications = () => {
        handleSetScreen('NOTIFICATIONS');
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
    };

    const handleMarkAllAsRead = () => {
        if (!loggedInUserId) return;
        setNotifications(prev => prev.map(n => (n.userId === loggedInUserId ? { ...n, isRead: true } : n)));
    };


    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const handleCreateRequest = async (newRequestData: Omit<ItemRequest, 'id' | 'userId' | 'createdAt' | 'distance' | 'offers' | 'status'>) => {
        if (!loggedInUserId) return;
        const newRequest: ItemRequest = {
            id: `req-${Date.now()}`,
            userId: loggedInUserId,
            createdAt: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date()),
            distance: '100m', // Mock distance
            status: 'open',
            ...newRequestData,
        };
        
        try {
            // Salvar no Firebase
            // const docRef = await addDoc(collection(db, 'requests'), newRequest);
            // console.log('Documento salvo com ID:', docRef.id);
            
            // Por enquanto, continuar usando estado local até que o Firebase esteja totalmente integrado
            setRequests(prev => [newRequest, ...prev]);
            setIsCreateModalOpen(false);
            setActiveScreen('MY_REQUESTS');
        } catch (error) {
            console.error('Erro ao salvar pedido no Firebase:', error);
            // Fallback para estado local
            setRequests(prev => [newRequest, ...prev]);
            setIsCreateModalOpen(false);
            setActiveScreen('MY_REQUESTS');
        }
    };

    const handleCreateEvent = async (newEventData: Omit<CommunityEvent, 'id' | 'creatorId' | 'interestedUserIds'>) => {
        if (!loggedInUserId) return;
        const newEvent: CommunityEvent = {
            id: `evt-${Date.now()}`,
            creatorId: loggedInUserId,
            interestedUserIds: [],
            ...newEventData,
        };
        
        try {
            // Salvar no Firebase
            // const docRef = await addDoc(collection(db, 'events'), newEvent);
            // console.log('Evento salvo com ID:', docRef.id);
            
            // Por enquanto, continuar usando estado local até que o Firebase esteja totalmente integrado
            setEvents(prev => [newEvent, ...prev]);
            setIsCreateEventModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar evento no Firebase:', error);
            // Fallback para estado local
            setEvents(prev => [newEvent, ...prev]);
            setIsCreateEventModalOpen(false);
        }
    };
    
    const handleSubmitReview = (review: Review) => {
        if (!loggedInUserId || !transactionToReview) return;
        const reviewer = users[loggedInUserId];
        const reviewedUser = users[review.reviewedUserId];
        if (!reviewer || !reviewedUser) return;

        const newNotifications: Notification[] = [];
        
        const reviewNotification: Notification = {
            id: `notif-${Date.now()}`,
            userId: review.reviewedUserId,
            type: 'new_review',
            text: `${reviewer.name} te avaliou com ${review.rating} estrelas pelo empréstimo do item ${transactionToReview.request.itemName}.`,
            isRead: false,
            createdAt: 'agora',
        };
        newNotifications.push(reviewNotification);

        const totalLoans = reviewedUser.loansMade + 1;
        const newReputation = ((reviewedUser.reputation * reviewedUser.loansMade) + review.rating) / totalLoans;

        let updatedUser: User = {
            ...reviewedUser,
            reputation: Math.round(newReputation * 10) / 10,
            loansMade: totalLoans,
        };
        
        const badgeChecks: { loans: number, badge: BadgeType, text: string }[] = [
            { loans: 10, badge: 'BOM_VIZINHO', text: 'Parabéns! Você ganhou o selo "Bom Vizinho" por realizar 10 empréstimos.' },
        ];

        badgeChecks.forEach(check => {
            if (updatedUser.loansMade >= check.loans && !updatedUser.badges?.includes(check.badge)) {
                updatedUser.badges = [...(updatedUser.badges || []), check.badge];
                const achievementNotification: Notification = {
                    id: `notif-${Date.now()}-${check.badge}`,
                    userId: review.reviewedUserId,
                    type: 'achievement',
                    text: check.text,
                    isRead: false,
                    createdAt: 'agora',
                };
                newNotifications.push(achievementNotification);
            }
        });

        setUsers(prevUsers => ({
            ...prevUsers,
            [review.reviewedUserId]: updatedUser,
        }));

        if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev]);
        }
        
        setIsReviewModalOpen(false);
        setTransactionToReview(null);
    };

    const handleStartChat = (partnerId: string, requestName: string, requestId: string) => {
        setSelectedChatContext({ partnerId, requestName, requestId });
        handleSetScreen('CHAT');
    };
    
    const handleSendMessage = (text: string) => {
        if (!selectedChatContext || !loggedInUserId) return;
        const { partnerId, requestName } = selectedChatContext;

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            userId: loggedInUserId,
            text,
            timestamp: new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()),
        };
        setChatMessages(prev => [...prev, newMessage]);

        const sender = users[loggedInUserId];
        if (sender) {
            const messageNotification: Notification = {
                id: `notif-${Date.now()}-msg`,
                userId: partnerId,
                type: 'new_message',
                text: `${sender.name} te enviou uma mensagem sobre '${requestName}'.`,
                isRead: false,
                createdAt: 'agora',
            };
            setNotifications(prev => [messageNotification, ...prev]);
        }
    };

    const handleBackFromChat = () => {
        setSelectedChatContext(null);
        setActiveScreen(previousScreen);
    };

    const handleOfferHelp = (requestId: string, requestOwnerId: string, requestName: string) => {
        if (!loggedInUserId) return;
        
        const offeringUser = users[loggedInUserId];
        if (offeringUser) {
            const newOfferNotification: Notification = {
                id: `notif-${Date.now()}`,
                userId: requestOwnerId,
                type: 'new_offer',
                text: `${offeringUser.name} ofereceu ajuda para o seu pedido de ${requestName}.`,
                isRead: false,
                createdAt: 'agora',
            };
            setNotifications(prev => [newOfferNotification, ...prev]);
        }
        
        setRequests(prevRequests => {
            const newRequests = [...prevRequests];
            const requestIndex = newRequests.findIndex(r => r.id === requestId);
            if (requestIndex === -1) return prevRequests;

            const request = newRequests[requestIndex];
            const existingOffer = request.offers?.find(o => o.userId === loggedInUserId);

            if (!existingOffer) {
                const newOffer: Offer = {
                    id: `offer-${Date.now()}`,
                    userId: loggedInUserId,
                    message: `Olá! Eu posso te ajudar com ${requestName.toLowerCase()}.`,
                };
                if (request.offers) {
                    request.offers.push(newOffer);
                } else {
                    request.offers = [newOffer];
                }
            }
            return newRequests;
        });

        handleStartChat(requestOwnerId, requestName, requestId);
    };

    const handleUpdateRequestStatus = (requestId: string, status: ItemRequest['status']) => {
        const request = requests.find(req => req.id === requestId);
        if (!request) return;

        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status } : req
            )
        );

        if (status === 'completed' && request.offers && request.offers.length > 0) {
            const lender = users[request.offers[0].userId]; 
            if (lender) {
                setTransactionToReview({ request, lender });
                setIsReviewModalOpen(true);
            }
        }
    };
    
    const handleToggleEventInterest = (eventId: string) => {
        if (!loggedInUserId) return;
        setEvents(prevEvents => {
            return prevEvents.map(event => {
                if (event.id === eventId) {
                    const interested = event.interestedUserIds.includes(loggedInUserId);
                    if (interested) {
                        return {
                            ...event,
                            interestedUserIds: event.interestedUserIds.filter(id => id !== loggedInUserId)
                        };
                    } else {
                        return {
                            ...event,
                            interestedUserIds: [...event.interestedUserIds, loggedInUserId]
                        };
                    }
                }
                return event;
            });
        });
    };
    
    const handleOpenDenounceModal = (requestId: string) => {
        const request = requests.find(r => r.id === requestId);
        if (request) {
            setRequestToDenounce(request);
            setIsDenounceModalOpen(true);
        }
    };
    
    const handleConfirmDenounce = () => {
        if (requestToDenounce) {
            setDenouncedRequestIds(prev => new Set(prev).add(requestToDenounce.id));
            setIsDenounceModalOpen(false);
            setRequestToDenounce(null);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleDismissRequest = (requestId: string) => {
        setDismissedRequestIds(prev => new Set(prev).add(requestId));
    };

    const handleUpdateProfile = (updatedData: EditableUser) => {
        if (!loggedInUserId) return;
        setUsers(prevUsers => {
            const currentUser = prevUsers[loggedInUserId];
            if (!currentUser) return prevUsers;

            const updatedUser = {
                ...currentUser,
                ...updatedData,
            };

            return {
                ...prevUsers,
                [loggedInUserId]: updatedUser,
            };
        });
        setActiveSubPage(null);
    };

    const handleOpenReportNonReturnModal = (requestId: string) => {
        const request = requests.find(r => r.id === requestId);
        if (request) {
            setRequestToReport(request);
            setIsReportNonReturnModalOpen(true);
        }
    };

    const handleConfirmReportNonReturn = () => {
        if (!requestToReport || !loggedInUserId) return;
        
        const borrowerId = requestToReport.userId;
        const borrower = users[borrowerId];
        const lender = users[loggedInUserId];

        if (!borrower || !lender) return;

        setUsers(prev => ({
            ...prev,
            [borrowerId]: {
                ...borrower,
                reputation: Math.max(1, borrower.reputation - 2.0),
            }
        }));

        handleUpdateRequestStatus(requestToReport.id, 'cancelled');

        const penaltyNotification: Notification = {
            id: `notif-${Date.now()}-penalty`,
            userId: borrowerId,
            type: 'penalty',
            text: `Uma penalidade foi aplicada à sua reputação por não devolver o item: ${requestToReport.itemName}.`,
            isRead: false,
            createdAt: 'agora',
        };
         const confirmationNotification: Notification = {
            id: `notif-${Date.now()}-confirm`,
            userId: loggedInUserId,
            type: 'penalty',
            text: `Registramos sua denúncia sobre o item ${requestToReport.itemName} não ter sido devolvido por ${borrower.name}.`,
            isRead: false,
            createdAt: 'agora',
        };
        setNotifications(prev => [penaltyNotification, confirmationNotification, ...prev]);
        
        setIsReportNonReturnModalOpen(false);
        setRequestToReport(null);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const currentUser = users[loggedInUserId];
    if (!currentUser) return <LoadingSpinner />;
    
    const requestLimit = currentUser.isVerified ? 5 : 3;
    const isRequestLimitReached = activeUserRequestsCount >= requestLimit;

    const subPageTitleMap: Record<SubPageName, string> = {
        PAINEL: 'Painel',
        EDITAR_PERFIL: 'Editar Perfil',
        EDITAR_ENDERECO: 'Editar Endereço',
        CONFIGURACOES: 'Configurações',
        FAQ: 'FAQ',
        FEEDBACK: 'Feedback',
        TERMOS_DE_USO: 'Termos de Uso',
        INVITE: 'Convidar Vizinhos',
    };

    const renderScreen = () => {
        if (activeSubPage) {
            switch (activeSubPage) {
                case 'EDITAR_PERFIL':
                    return <EditProfile user={currentUser} onSave={handleUpdateProfile} onBack={handleBackFromSubPage} />;
                case 'INVITE':
                    return <Invite user={currentUser} allUsers={users} onBack={handleBackFromSubPage} />;
                default:
                    return <SubPage title={subPageTitleMap[activeSubPage]} onBack={handleBackFromSubPage} />;
            }
        }
        
        switch (activeScreen) {
            case 'HOME':
                const visibleRequests = requests.filter(r => !denouncedRequestIds.has(r.id) && !dismissedRequestIds.has(r.id));
                return <Home requests={visibleRequests} users={users} onOfferHelp={handleOfferHelp} onDenounce={handleOpenDenounceModal} onDismiss={handleDismissRequest} loggedInUserId={loggedInUserId} />;
            case 'MY_REQUESTS':
                return <MyRequests requests={requests} users={users} onStartChat={handleStartChat} onUpdateRequestStatus={handleUpdateRequestStatus} loggedInUserId={loggedInUserId} />;
            case 'EVENTS':
                return <Events events={events} onToggleInterest={handleToggleEventInterest} loggedInUserId={loggedInUserId} users={users} onOpenCreateEventModal={() => setIsCreateEventModalOpen(true)} />;
            case 'NOTIFICATIONS':
                return <Notifications notifications={userNotifications} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onBack={() => handleSetScreen(previousScreen)} />;
            case 'CHAT':
                if (!selectedChatContext) {
                     setActiveScreen('HOME');
                     const visibleRequests = requests.filter(r => !denouncedRequestIds.has(r.id) && !dismissedRequestIds.has(r.id));
                     return <Home requests={visibleRequests} users={users} onOfferHelp={handleOfferHelp} onDenounce={handleOpenDenounceModal} onDismiss={handleDismissRequest} loggedInUserId={loggedInUserId} />;
                }
                const chatPartner = users[selectedChatContext.partnerId];
                return (
                    <Chat 
                        partner={chatPartner}
                        chatContext={selectedChatContext}
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        onBack={handleBackFromChat}
                        loggedInUserId={loggedInUserId}
                        onOpenReportNonReturnModal={handleOpenReportNonReturnModal}
                    />
                );
            case 'PROFILE':
                return <Profile user={currentUser} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} onNavigateToSubPage={handleNavigateToSubPage} />;
            default:
                 const defaultVisibleRequests = requests.filter(r => !denouncedRequestIds.has(r.id) && !dismissedRequestIds.has(r.id));
                return <Home requests={defaultVisibleRequests} users={users} onOfferHelp={handleOfferHelp} onDenounce={handleOpenDenounceModal} onDismiss={handleDismissRequest} loggedInUserId={loggedInUserId} />;
        }
    };
    
    const showHeader = activeScreen !== 'CHAT' && activeScreen !== 'NOTIFICATIONS' && !activeSubPage;
    const showNav = activeScreen !== 'CHAT' && activeScreen !== 'NOTIFICATIONS' && !activeSubPage;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-v-light-bg dark:bg-neutral-900 text-v-neutral dark:text-gray-300 relative pb-20 pt-16">
            {showHeader && <TopHeader screen={activeScreen} onMenuClick={() => handleSetScreen('PROFILE')} onNotificationsClick={handleOpenNotifications} unreadCount={unreadCount}/>}
            <main className={activeScreen === 'CHAT' || activeSubPage ? "" : "px-4 py-2"}>
                {renderScreen()}
            </main>
            {activeScreen === 'HOME' && (
                 <div className="relative group">
                    <button 
                        onClick={() => !isRequestLimitReached && setIsCreateModalOpen(true)}
                        disabled={isRequestLimitReached}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-v-primary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200 z-20 disabled:bg-gray-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed"
                    >
                        + Pedir Item
                    </button>
                    {isRequestLimitReached && (
                        <div className="fixed bottom-[150px] left-1/2 -translate-x-1/2 w-max max-w-[90%] text-center bg-neutral-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            Você atingiu o limite de {requestLimit} pedidos ativos.
                        </div>
                    )}
                </div>
            )}
            {activeScreen === 'EVENTS' && (
                 <button 
                    onClick={() => setIsCreateEventModalOpen(true)}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-v-secondary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200 z-20 flex items-center"
                  >
                    <PlusIcon className="w-6 h-6 mr-2" />
                    <span>Criar Evento</span>
                </button>
            )}
            {showNav && <BottomNav activeScreen={activeScreen} setScreen={handleSetScreen} />}

            {isCreateModalOpen && (
                <CreateRequestModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreateRequest={handleCreateRequest}
                    activeUserRequestsCount={activeUserRequestsCount}
                    userIsVerified={currentUser.isVerified}
                />
            )}
            {isCreateEventModalOpen && (
                <CreateEventModal
                    onClose={() => setIsCreateEventModalOpen(false)}
                    onCreateEvent={handleCreateEvent}
                />
            )}
            {isReviewModalOpen && transactionToReview && (
                <ReviewModal
                    transaction={transactionToReview}
                    onClose={() => setIsReviewModalOpen(false)}
                    onSubmit={handleSubmitReview}
                />
            )}
             {isDenounceModalOpen && requestToDenounce && (
                <DenounceModal
                    request={requestToDenounce}
                    user={users[requestToDenounce.userId]}
                    onClose={() => setIsDenounceModalOpen(false)}
                    onConfirm={handleConfirmDenounce}
                />
            )}
            {isReportNonReturnModalOpen && requestToReport && (
                <ReportNonReturnModal
                    request={requestToReport}
                    borrower={users[requestToReport.userId]}
                    onClose={() => setIsReportNonReturnModalOpen(false)}
                    onConfirm={handleConfirmReportNonReturn}
                />
            )}
            {showToast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-sm py-2 px-4 rounded-full shadow-lg z-50 animate-fade-in-out">
                    Ação registrada. Agradecemos sua colaboração!
                </div>
            )}
        </div>
    );
}