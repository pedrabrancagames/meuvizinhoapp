// Exemplo de como usar o Firebase em outros componentes
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';

// Exemplo de função para obter todos os pedidos de um usuário
export const getUserRequests = async (userId: string) => {
  try {
    const requestsQuery = query(
      collection(db, 'requests'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(requestsQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao obter pedidos do usuário:', error);
    return [];
  }
};

// Exemplo de função para adicionar uma nova notificação
export const addNotification = async (notificationData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    console.log('Notificação adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar notificação:', error);
    return null;
  }
};

// Exemplo de função para atualizar o status de um pedido
export const updateRequestStatus = async (requestId: string, newStatus: string) => {
  try {
    const requestDoc = doc(db, 'requests', requestId);
    await updateDoc(requestDoc, { status: newStatus });
    console.log('Status do pedido atualizado');
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
  }
};