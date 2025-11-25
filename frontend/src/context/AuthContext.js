import React, { createContext, useState, useEffect, useContext } from 'react';
// Assuming authApi.js is correctly located
import { verifyToken } from '../api/authApi'; 

// 1. Create the context with a default value
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); // Start as true

    // On initial app load, check if a token exists and verify it
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Call the backend API to verify the token
                    const { user: userData } = await verifyToken(token);
                    setUser(userData); // Set user if token is valid
                } catch (error) {
                    console.error("Token verification failed:", error);
                    localStorage.removeItem('token'); // Clear bad token
                    setUser(null);
                }
            }
            setIsLoading(false); // Stop loading once check is complete
        };
        checkAuth();
    }, []);

    // Function to set user state and store token on successful login
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    // Function to clear user state and remove token on logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // 3. Define the value to be passed to consumers
    // This value object must always be defined, even if user is null
    const value = { user, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Create the custom hook for easy consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    // CRITICAL: Check if context is null (which caused the error)
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};