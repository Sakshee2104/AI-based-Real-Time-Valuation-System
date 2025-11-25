import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/Auth/LoginForm'; 
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/authApi'; 

const LoginPage = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine login role from URL query parameter (e.g., /login?role=agent)
    const isAgentLogin = location.search.includes('role=agent');
    const roleText = isAgentLogin ? 'Owner/Agent' : 'User/Buyer';

    const handleLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            // CRITICAL: Call the actual backend API to verify credentials
            const data = await loginUser(credentials); 
            
            // Call the context function to save the user object and token
            login(data.user, data.access_token);
            
            // --- FIX: Immediate and correct redirection based on the role returned by the backend ---
            if (data.user.role === 'agent') {
                navigate('/agent-dashboard', { replace: true }); // OWNER DASHBOARD
            } else {
                navigate('/dashboard', { replace: true }); // USER DASHBOARD
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh] pt-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-bg-dark-card p-10 rounded-xl shadow-2xl text-text-light"
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-accent">
                    Sign in as {roleText}
                </h2>
                
                {error && (
                    <div className="bg-brand-secondary/20 border-l-4 border-brand-secondary text-white p-3 rounded-md" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                <LoginForm onSubmit={handleLogin} loading={loading} />

                <div className="text-sm text-center">
                    <p className="font-medium text-text-muted">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-accent hover:text-white transition">
                            Register Here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;