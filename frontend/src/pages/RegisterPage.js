import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/Auth/RegisterForm';
import RegisterToggle from '../components/Forms/RegisterToggle'; 
import { registerUser } from '../api/authApi'; 

const RegisterPage = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('user'); // Stores 'user' or 'agent'
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const userData = { ...formData, role: role };

        try {
            // --- CRITICAL: Calling the actual backend API ---
            await registerUser(userData); 
            
            // 1. Show Success Message
            setSuccess(true);
            
            // 2. Wait briefly, then navigate
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1500); // 1.5 second delay to display success message
            
        } catch (err) {
            setError(err.message || 'Registration failed. Check network or if email exists.');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh] pt-24">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-bg-dark-card p-10 rounded-xl shadow-2xl text-text-light"
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-accent">
                    Create Your Account
                </h2>
                
                {/* Animated Role Selector */}
                <RegisterToggle onSelect={setRole} /> 

                {error && (
                    <div className="bg-brand-secondary/20 border-l-4 border-brand-secondary text-white p-3 rounded-md" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-600/20 border-l-4 border-green-600 text-white p-3 rounded-md">
                        <p>✅ Registration successful! Redirecting to Login...</p>
                    </div>
                )}

                <RegisterForm onSubmit={handleRegister} loading={loading} initialRole={role} />

                <div className="text-sm text-center">
                    <p className="font-medium text-text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-accent hover:text-white transition">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;