import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-v-primary"></div>
    </div>
);

export default LoadingSpinner;