import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, MoreVerticalIcon, SendIcon } from './Icons';
import type { ChatMessage, User } from '../types';

type ChatProps = {
    partner: User;
    chatContext: {partnerId: string, requestName: string, requestId: string};
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onBack: () => void;
    loggedInUserId: string;
    onOpenReportNonReturnModal: (requestId: string) => void;
};

const ChatHeader: React.FC<{ partner: User; requestName: string; onBack: () => void; onMoreClick: () => void; }> = ({ partner, requestName, onBack, onMoreClick }) => {
    return (
        <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-20 bg-white dark:bg-neutral-800 shadow-sm p-3 flex items-center justify-between h-20 border-b border-gray-200 dark:border-neutral-700">
            <button onClick={onBack} className="p-2 text-v-neutral dark:text-gray-300">
                <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center">
                <img src={partner.avatarUrl} alt={partner.name} className="w-12 h-12 rounded-full mr-3" />
                <div>
                    <h2 className="font-bold text-lg text-v-neutral dark:text-gray-200">{partner.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sobre: {requestName}</p>
                </div>
            </div>
            <button onClick={onMoreClick} className="p-2 text-v-neutral dark:text-gray-300">
                <MoreVerticalIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

const MessageBubble: React.FC<{ message: ChatMessage; loggedInUserId: string; }> = ({ message, loggedInUserId }) => {
    const isMe = message.userId === loggedInUserId;
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isMe ? 'bg-v-secondary text-white rounded-br-none' : 'bg-v-primary text-white rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-red-100'} text-right`}>{message.timestamp}</p>
            </div>
        </div>
    );
};

export default function Chat({ partner, chatContext, messages, onSendMessage, onBack, loggedInUserId, onOpenReportNonReturnModal }: ChatProps) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSend = () => {
        if(inputValue.trim()){
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    if (!partner) {
        // Fallback in case user data is not available
        return (
            <div className="fixed inset-0 max-w-md mx-auto bg-v-light-bg dark:bg-neutral-900 flex flex-col items-center justify-center">
                <p>Usuário não encontrado.</p>
                <button onClick={onBack} className="mt-4 text-v-primary">Voltar</button>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 max-w-md mx-auto bg-v-light-bg dark:bg-neutral-900 flex flex-col">
            <ChatHeader partner={partner} requestName={chatContext.requestName} onBack={onBack} onMoreClick={() => onOpenReportNonReturnModal(chatContext.requestId)} />
            <div className="flex-1 overflow-y-auto p-4 pt-24 pb-24">
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} loggedInUserId={loggedInUserId} />)}
                <div ref={messagesEndRef} />
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
                <div className="flex items-center">
                    <input 
                        type="text" 
                        placeholder="Digite sua mensagem..." 
                        className="flex-1 bg-gray-100 dark:bg-neutral-700 dark:text-gray-200 rounded-full py-3 px-5 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSend} className="ml-3 bg-v-primary text-white p-3 rounded-full transition-transform transform hover:scale-110">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}