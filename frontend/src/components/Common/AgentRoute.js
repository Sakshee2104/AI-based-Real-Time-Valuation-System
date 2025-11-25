import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AgentRoute = ({ element: Element }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="text-center p-10 text-xl font-semibold text-text-muted">Loading authentication...</div>;
    }

    if (!user) {
        // Not logged in: Redirect to login page
        return <Navigate to="/login" replace />;
    }

    // CRITICAL FIX: Ensure the user's stored role is 'agent'
    if (user.role !== 'agent') {
        console.warn(`User ${user.username} has role '${user.role}' and was denied agent access. Redirecting.`);
        return (
            <Navigate to="/dashboard" replace />
        );
    }

    // If user.role IS 'agent', render the OwnerDashboard component (Element)
    return <Element />;
};

export default AgentRoute;