import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ element: Element }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="text-center p-10 text-xl font-semibold text-text-muted">Loading authentication...</div>;
    }

    return user ? <Element /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;