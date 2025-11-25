import React, { useState } from 'react'; // <-- CORRECTED SYNTAX
import { motion } from 'framer-motion';

const RegisterForm = ({ onSubmit, loading, initialRole = 'user' }) => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: initialRole,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const { confirmPassword, ...data } = form;
        onSubmit(data);
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-3">
                
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <input
                        name="username"
                        type="text"
                        required
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-text-light rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
                    />
                </motion.div>
                
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-text-light rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
                    />
                </motion.div>

                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-text-light rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
                    />
                </motion.div>

                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-text-light rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
                    />
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-lg disabled:opacity-50 transition"
                >
                    {loading ? 'Registering...' : 'Register Account'}
                </motion.button>
            </motion.div>
        </form>
    );
};

export default RegisterForm;