import type { User, ItemRequest, ChatMessage, CommunityEvent, Notification } from './types';

export const USERS: Record<string, User> = {
  'user-1-uid': {
    id: 'user-1-uid',
    name: 'Marcus Aurelius',
    email: 'marcus@demo.com',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    reputation: 4.8,
    requestsMade: 12,
    loansMade: 25,
    isVerified: true,
    isProfileComplete: true,
    badges: ['BOM_VIZINHO', 'SUPER_AJUDANTE', 'CONFIAVEL'],
    inviteCode: 'MARCUS-4825',
  },
  'user-2-uid': {
    id: 'user-2-uid',
    name: 'José',
    email: 'jose@demo.com',
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    reputation: 4.5,
    requestsMade: 5,
    loansMade: 10,
    isVerified: true,
    isProfileComplete: true,
    badges: ['BOM_VIZINHO'],
    inviteCode: 'JOSE-1122',
  },
  'user-3-uid': {
    id: 'user-3-uid',
    name: 'Camila',
    email: 'camila@demo.com',
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    reputation: 4.9,
    requestsMade: 8,
    loansMade: 15,
    isVerified: true,
    isProfileComplete: true,
    badges: ['BOM_VIZINHO'],
    inviteCode: 'CAMILA-9876',
    invitedBy: 'user-1-uid',
  },
  'user-4-uid': {
    id: 'user-4-uid',
    name: 'Fernando',
    email: 'fernando@demo.com',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    reputation: 4.7,
    requestsMade: 3,
    loansMade: 7,
    isVerified: false,
    isProfileComplete: true,
    inviteCode: 'FER-5543',
  },
  'user-5-uid': {
    id: 'user-5-uid',
    name: 'Ana',
    email: 'ana@demo.com',
    avatarUrl: 'https://picsum.photos/id/1045/200/200',
    reputation: 5.0,
    requestsMade: 20,
    loansMade: 30,
    isVerified: true,
    isProfileComplete: true,
    badges: ['BOM_VIZINHO', 'SUPER_AJUDANTE', 'CONFIAVEL'],
    inviteCode: 'ANA-3141',
    invitedBy: 'user-3-uid',
  }
};

export const CATEGORIES = ['Ferramentas', 'Cozinha', 'Eletrônicos', 'Casa', 'Jardim', 'Esportes', 'Veículos', 'Outros'];
export const EVENT_CATEGORIES = ['Festa', 'Bazar', 'Reunião', 'Esportes', 'Cultural', 'Outros'];


export const INITIAL_REQUESTS: ItemRequest[] = [
  {
    id: 'req-1',
    userId: 'user-1-uid',
    itemName: 'FURADEIRA MEGA POWER',
    description: 'Preciso prender alguns quadros para o trabalho. Alguém?',
    category: 'Ferramentas',
    urgency: 'urgent',
    createdAt: 'May 24',
    distance: '100m',
    status: 'open',
    offers: [
      { id: 'offer-1', userId: 'user-2-uid', message: 'Olá! Vi que precisa de uma furadeira...' },
      { id: 'offer-2', userId: 'user-3-uid', message: 'Eu tenho uma! Posso te emprestar.' },
      { id: 'offer-3', userId: 'user-4-uid', message: 'Opa, vizinho! Tenho uma aqui se precisar.' },
    ],
  },
  {
    id: 'req-2',
    userId: 'user-1-uid',
    itemName: 'ESCADA GRANDE',
    description: 'Preciso trocar uma lâmpada no teto alto da sala.',
    category: 'Casa',
    urgency: 'normal',
    createdAt: 'May 24',
    distance: '100m',
    status: 'open',
    offers: [
        { id: 'offer-4', userId: 'user-2-uid', message: 'Olá! Vi que precisa de uma escada...' },
        { id: 'offer-5', userId: 'user-3-uid', message: 'Ainda precisa? Tenho uma disponível.' },
        { id: 'offer-6', userId: 'user-4-uid', message: 'Posso ajudar com a furadeira se quiser.' },
    ]
  },
  {
    id: 'req-3',
    userId: 'user-5-uid',
    itemName: 'BOMBA DE ENCHER PNEU',
    description: 'A bicicleta da minha filha está com pneu murcho, alguém pode me salvar?',
    category: 'Veículos',
    urgency: 'normal',
    createdAt: 'May 23',
    distance: '350m',
    status: 'open',
  },
  {
    id: 'req-4',
    userId: 'user-4-uid',
    itemName: 'GRILL ELÉTRICO',
    description: 'Queria fazer um churrasco na varanda mas meu grill quebrou.',
    category: 'Cozinha',
    urgency: 'normal',
    createdAt: 'May 22',
    distance: '500m',
    status: 'open',
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg-1', userId: 'user-3-uid', text: 'Olá! Vi que precisa de uma furadeira, eu tenho uma! Posso te emprestar.', timestamp: '10:00' },
    { id: 'msg-2', userId: 'user-1-uid', text: 'Olá Camila, que ótimo! Quando posso pegar?', timestamp: '10:01' },
    { id: 'msg-3', userId: 'user-3-uid', text: 'Pode ser hoje à tarde, depois das 14h. Fica bom para você?', timestamp: '10:02' },
    { id: 'msg-4', userId: 'user-1-uid', text: 'Perfeito! Me passa seu endereço por favor.', timestamp: '10:03' },
    { id: 'msg-5', userId: 'user-3-uid', text: 'Claro, é na Rua das Flores, 123. Apartamento 45.', timestamp: '10:05' },
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    creatorId: 'user-3-uid',
    title: 'Festa Junina do Condomínio',
    description: 'Venha celebrar com a gente! Teremos comidas típicas, música e muita diversão para toda a família. Traga um prato de doce ou salgado para compartilhar.',
    category: 'Festa',
    photoUrl: 'https://picsum.photos/seed/festajunina/800/400',
    eventDate: new Date('2024-06-29T18:00:00'),
    location: 'Salão de Festas',
    interestedUserIds: ['user-2-uid', 'user-4-uid', 'user-5-uid'],
  },
  {
    id: 'evt-2',
    creatorId: 'user-5-uid',
    title: 'Bazar de Trocas de Brinquedos',
    description: 'Vamos ensinar o desapego para as crianças! Traga brinquedos em bom estado para trocar com outros vizinhos. Uma ótima oportunidade para renovar a brincadeira sem gastar nada.',
    category: 'Bazar',
    photoUrl: 'https://picsum.photos/seed/brinquedos/800/400',
    eventDate: new Date('2024-07-06T10:00:00'),
    location: 'Playground',
    interestedUserIds: ['user-3-uid'],
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', userId: 'user-1-uid', type: 'new_offer', text: 'José ofereceu ajuda para o seu pedido de FURADEIRA.', isRead: false, createdAt: 'há 5 min' },
    { id: 'notif-2', userId: 'user-1-uid', type: 'new_offer', text: 'Camila também pode te ajudar com a FURADEIRA.', isRead: false, createdAt: 'há 28 min' },
    { id: 'notif-3', userId: 'user-4-uid', type: 'new_review', text: 'Ana te avaliou com 5 estrelas pelo empréstimo do Grill Elétrico.', isRead: true, createdAt: 'há 2h' },
    { id: 'notif-4', userId: 'user-1-uid', type: 'achievement', text: 'Parabéns! Você ganhou o selo "Bom Vizinho" por 10 empréstimos.', isRead: true, createdAt: 'ontem' },
];