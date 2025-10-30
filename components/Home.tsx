import React, { useEffect, useRef, useState } from 'react';
import type { ItemRequest, User } from '../types';
import { ClockIcon, LocationMarkerIcon, CheckBadgeIcon, EnvelopeIcon, AdjustmentsHorizontalIcon } from './Icons';
import FilterModal from './FilterModal';


// HACK: Leaflet é carregado via CDN, então precisamos informar ao TypeScript sobre ele.
declare const L: any;

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null); // Para guardar a instância do mapa
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Obter localização
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocalização não é suportada pelo seu navegador.');
            setLocation({ lat: 37.7749, lng: -122.4194 }); // Padrão para SF
            setIsLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsLoading(false);
            },
            () => {
                setError('Não foi possível obter sua localização. Mostrando localização padrão.');
                setLocation({ lat: 37.7749, lng: -122.4194 }); // Padrão para SF
                setIsLoading(false);
            },
            { timeout: 5000 }
        );
    }, []); // Executa uma vez

    // 2. Inicializar o mapa quando a localização estiver disponível e o container pronto
    useEffect(() => {
        if (mapRef.current || !location || !mapContainerRef.current) {
            return;
        }

        const map = L.map(mapContainerRef.current).setView([location.lat, location.lng], 14);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker([location.lat, location.lng]).addTo(map);
        
        // Invalida o tamanho após um pequeno atraso para garantir a renderização correta
        setTimeout(() => {
            map.invalidateSize();
        }, 100);


        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [location]);

    return (
        <div className="h-40 bg-v-light-gray dark:bg-neutral-800 rounded-2xl mb-6 shadow-md overflow-hidden relative flex items-center justify-center">
            {isLoading && <div className="text-gray-500 dark:text-gray-400">Carregando mapa...</div>}
            {error && <div className="absolute top-2 left-2 bg-v-warning/80 text-white text-xs p-2 rounded z-10 backdrop-blur-sm shadow">{error}</div>}
            <div ref={mapContainerRef} className={`w-full h-full ${isLoading ? 'invisible' : 'visible'}`} style={{zIndex: 0}}></div>
        </div>
    );
};

const VerificationBadge: React.FC<{ isVerified: boolean }> = ({ isVerified }) => {
    if (isVerified) {
        return <CheckBadgeIcon className="w-6 h-6 text-v-accent absolute -bottom-1 -right-1" title="Email verificado" />;
    }
    return <EnvelopeIcon className="w-5 h-5 p-0.5 bg-white dark:bg-neutral-700 rounded-full text-gray-400 dark:text-gray-500 absolute -bottom-1 -right-1" title="Apenas email" />;
};


const RequestCard: React.FC<{ request: ItemRequest; user: User; onOfferHelp: (requestId: string, requestOwnerId: string, requestName: string) => void; onDenounce: (requestId: string) => void; onDismiss: (requestId: string) => void; }> = ({ request, user, onOfferHelp, onDenounce, onDismiss }) => {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-5 mb-6">
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

            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.name} precisa de um(a)</p>
                <h2 className="text-2xl font-extrabold text-v-primary my-1 tracking-tight">{request.itemName}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">{request.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button onClick={() => onOfferHelp(request.id, request.userId, request.itemName)} className="bg-v-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-transform transform hover:scale-105 text-sm">Ajudar</button>
                <button onClick={() => onDismiss(request.id)} className="bg-v-secondary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-transform transform hover:scale-105 text-sm">Não Posso</button>
                <button onClick={() => onDenounce(request.id)} className="bg-v-tertiary dark:bg-neutral-700 text-v-neutral dark:text-gray-300 font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 dark:hover:bg-opacity-80 transition-transform transform hover:scale-105 text-sm">Denunciar</button>
            </div>
        </div>
    );
};

type AdvancedFilters = {
    distance: 'all' | '1km' | '3km';
    onlyVerified: boolean;
    category: string;
};

export default function Home({ requests, users, onOfferHelp, onDenounce, onDismiss, loggedInUserId }: { requests: ItemRequest[]; users: Record<string, User>; onOfferHelp: (requestId: string, requestOwnerId: string, requestName: string) => void; onDenounce: (requestId: string) => void; onDismiss: (requestId: string) => void; loggedInUserId: string; }) {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
        distance: 'all',
        onlyVerified: false,
        category: 'Todos'
    });
    
    const otherRequests = requests.filter(req => req.userId !== loggedInUserId);

    const filteredRequests = otherRequests.filter(request => {
        const user = users[request.userId];
        if (!user) return false;

        const categoryMatch = advancedFilters.category === 'Todos' ? true : request.category === advancedFilters.category;
        const verifiedMatch = advancedFilters.onlyVerified ? user.isVerified : true;
        
        const distanceMatch = () => {
            if (advancedFilters.distance === 'all') return true;
            const distanceValue = parseInt(request.distance.replace('m', ''));
            const filterLimit = parseInt(advancedFilters.distance.replace('km', '000'));
            return distanceValue <= filterLimit;
        };
        
        return categoryMatch && verifiedMatch && distanceMatch();
    });

    const handleApplyFilters = (filters: AdvancedFilters) => {
        setAdvancedFilters(filters);
        setIsFilterModalOpen(false);
    };

    const activeFilterCount = (advancedFilters.distance !== 'all' ? 1 : 0) + (advancedFilters.onlyVerified ? 1 : 0) + (advancedFilters.category !== 'Todos' ? 1 : 0);

    return (
        <div className="space-y-4">
            <MapComponent />
            <div className="pb-4">
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="relative w-full flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-sm bg-white dark:bg-neutral-800 text-v-neutral dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 shadow-sm border border-gray-200 dark:border-neutral-700"
                >
                    <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                    <span>Filtros</span>
                    {activeFilterCount > 0 && (
                        <span className="ml-2 block h-6 w-6 rounded-full bg-v-primary text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
                    )}
                </button>
            </div>

            {filteredRequests.length > 0 ? (
                 filteredRequests.map(request => {
                    const user = users[request.userId];
                    if (!user) return null;
                    return <RequestCard key={request.id} request={request} user={user} onOfferHelp={onOfferHelp} onDenounce={onDenounce} onDismiss={onDismiss} />;
                })
            ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-800 rounded-2xl shadow-md">
                    <p className="font-semibold">Nenhum pedido encontrado.</p>
                    <p className="text-sm mt-2">Tente ajustar seus filtros ou volte mais tarde!</p>
                </div>
            )}
            
            {isFilterModalOpen && (
                <FilterModal
                    currentFilters={advancedFilters}
                    onClose={() => setIsFilterModalOpen(false)}
                    onApply={handleApplyFilters}
                />
            )}
        </div>
    );
}