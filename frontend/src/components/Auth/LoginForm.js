import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginForm = ({ onSubmit, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-3">
                
                {/* Email Input */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full p-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-text-light rounded-lg focus:ring-brand-accent focus:border-brand-accent transition"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </motion.div>

                {/* Password Input */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full p-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-text-light rounded-lg focus:ring-brand-accent focus:border-brand-accent transition"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-lg text-bg-dark-primary bg-brand-accent hover:bg-white shadow-lg disabled:opacity-50 transition"
                >
                    {loading ? 'Authenticating...' : 'Sign In'}
                </motion.button>
            </motion.div>
        </form>
    );
};

export default LoginForm;