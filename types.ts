export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  avatarUrl: string;
  reputation: number;
  requestsMade: number;
  loansMade: number;
  isVerified: boolean; // Phone verification (future)
  isProfileComplete: boolean;
  badges?: BadgeType[];
  inviteCode?: string;
  invitedBy?: string;
}

export type BadgeType = 'BOM_VIZINHO' | 'SUPER_AJUDANTE' | 'CONFIAVEL';

export interface ItemRequest {
  id: string;
  userId: string;
  itemName: string;
  description: string;
  category: string;
  urgency: 'normal' | 'urgent';
  createdAt: string;
  distance: string;
  status: 'open' | 'completed' | 'cancelled';
  offers?: Offer[];
  photoUrl?: string;
}

export interface Offer {
  id: string;
  userId: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface CommunityEvent {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  photoUrl: string;
  eventDate: Date;
  location: string;
  interestedUserIds: string[];
}

export interface Review {
    rating: number;
    comment?: string;
    reviewedUserId: string;
    requestId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new_offer' | 'new_review' | 'achievement' | 'penalty' | 'new_message';
  text: string;
  isRead: boolean;
  createdAt: string;
}

export type Screen = 'HOME' | 'MY_REQUESTS' | 'CHAT' | 'PROFILE' | 'EVENTS' | 'NOTIFICATIONS';

export type SubPageName = 'PAINEL' | 'EDITAR_PERFIL' | 'EDITAR_ENDERECO' | 'CONFIGURACOES' | 'FAQ' | 'FEEDBACK' | 'TERMOS_DE_USO' | 'INVITE';

export type EditableUser = Pick<User, 'name' | 'avatarUrl'>;