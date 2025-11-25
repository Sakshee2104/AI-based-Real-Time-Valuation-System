import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { submitGeneralQuery, fetchUserQueries } from '../api/queryApi'; 
import { predictPrice, fetchCMA } from '../api/propertyApi';

// --- Enhanced Placeholder Components ---
const PageTransition = ({ children }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

const ListingCard = ({ listing, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden cursor-pointer group"
        onClick={onClick}
    >
        <div className="relative overflow-hidden">
            <img 
                src={listing.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"} 
                alt={listing.location || "Property"} 
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
                }}
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-xs font-bold text-white">⭐</span>
            </div>
            <motion.div 
                className="absolute bottom-3 left-3 bg-gradient-to-r from-brand-primary to-purple-600 rounded-full px-3 py-1"
                whileHover={{ scale: 1.1 }}
            >
                <span className="text-xs font-bold text-white">Featured</span>
            </motion.div>
        </div>
        <div className="p-4">
            <p className="text-xl font-bold text-brand-primary mb-1">{listing.price}</p>
            <p className="text-sm text-text-light mb-2">{listing.bhk} BHK in {listing.location}</p>
            <p className="text-xs text-text-muted">{listing.area} sqft • {listing.date}</p>
            
            {/* Progress bar for property interest */}
            <div className="mt-3">
                <div className="flex justify-between text-xs text-text-muted mb-1">
                    <span>Interest Level</span>
                    <span>85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                        className="bg-gradient-to-r from-green-400 to-brand-accent h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />
                </div>
            </div>
        </div>
    </motion.div>
);

const useAuth = () => {
    return { user: { username: 'Buyer', uid: 'mock-user-123' } };
};

// --- Enhanced Animation Variants ---
const cardVariants = { 
    hidden: { opacity: 0, y: 30, scale: 0.9 }, 
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { 
            duration: 0.6, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
        } 
    } 
};

const statVariants = { 
    hidden: { y: 40, opacity: 0, scale: 0.8 },
    visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: { 
            duration: 0.8,
            type: "spring",
            stiffness: 80
        }
    } 
};

const listItemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: (i) => ({
        x: 0,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
        }
    })
};

const expandVariants = {
    collapsed: { 
        opacity: 0, 
        height: 0,
        marginTop: 0
    },
    open: { 
        opacity: 1, 
        height: "auto",
        marginTop: "16px",
        transition: {
            duration: 0.4,
            ease: "easeInOut"
        }
    }
};

const floatingVariants = {
    float: {
        y: [0, -15, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const pulseVariants = {
    pulse: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// --- Simulation Data with High-Quality Images ---
const dummyUserStats = { predictions: 12, inquiries: 8, favorites: 15 };
const dummyHistory = [
    { id: 1, location: 'Hebbal', bhk: 2, price: 72.00, area: 1200, date: '2024-01-15' },
    { id: 2, location: 'Whitefield', bhk: 3, price: 85.50, area: 1600, date: '2024-01-14' },
    { id: 3, location: 'Koramangala', bhk: 2, price: 95.75, area: 1100, date: '2024-01-12' },
    { id: 4, location: 'Sarjapur', bhk: 4, price: 120.25, area: 2100, date: '2024-01-10' }
];

// Enhanced dummy inquiries with better visuals
const dummyInquiries = [
    {
        id: 1,
        subject: "Property Valuation Query",
        message: "I would like to get a detailed valuation for my 3BHK apartment in Whitefield. The property is 5 years old and has premium amenities.",
        status: "Replied",
        reply: "Thank you for your inquiry! Based on current market trends in Whitefield, your 3BHK apartment is valued at approximately ₹1.2Cr - ₹1.4Cr. Our expert will contact you within 24 hours for a detailed assessment.",
        createdAt: { seconds: 1705104000 }
    },
    {
        id: 2,
        subject: "Home Loan Assistance",
        message: "Need information about home loan options and eligibility criteria for a property worth ₹85L. What documents are required?",
        status: "Pending",
        reply: null,
        createdAt: { seconds: 1705017600 }
    },
    {
        id: 3,
        subject: "Property Registration Process",
        message: "Can you guide me through the property registration process in Bangalore? What are the current stamp duty rates?",
        status: "Replied",
        reply: "The current stamp duty rate in Bangalore is 5% + 2% registration fee. We recommend completing registration within 4 months of agreement. Our legal team can assist you with the entire process.",
        createdAt: { seconds: 1704931200 }
    }
];

// Updated with high-quality Unsplash images that will load properly
const dummyFavorites = [
    { 
        id: 1, 
        price: '₹98L', 
        location: 'Sarjapur', 
        bhk: 3, 
        area: 1300, 
        imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTI2YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        date: '2 days ago'
    },
    { 
        id: 2, 
        price: '₹1.2Cr', 
        location: 'Whitefield', 
        bhk: 4, 
        area: 1800, 
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        date: '1 week ago'
    },
    { 
        id: 3, 
        price: '₹75L', 
        location: 'Hebbal', 
        bhk: 2, 
        area: 950, 
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        date: '3 days ago'
    },
    { 
        id: 4, 
        price: '₹2.1Cr', 
        location: 'Koramangala', 
        bhk: 5, 
        area: 2400, 
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        date: 'Just now'
    }
];

export const UserDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('history');
    const [loading, setLoading] = useState(true);
    const [history] = useState(dummyHistory);
    const [inquiries, setInquiries] = useState([]);
    const [favorites] = useState(dummyFavorites);
    const [stats] = useState(dummyUserStats);
    const [showQueryModal, setShowQueryModal] = useState(false);

    // Enhanced loading effect with staggered animation
    useEffect(() => {
        const loadUserQueries = async () => {
            if (user?.uid) {
                setLoading(true);
                try {
                    // Simulate API delay for better UX
                    await new Promise(resolve => setTimeout(resolve, 1200));
                    const fetchedInquiries = await fetchUserQueries(user.uid);
                    // Use dummy data if no inquiries found
                    setInquiries(fetchedInquiries.length > 0 ? fetchedInquiries : dummyInquiries);
                } catch (error) {
                    console.error("Error fetching user queries:", error);
                    // Fallback to dummy data
                    setInquiries(dummyInquiries);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadUserQueries();
    }, [user?.uid]);

    const renderContent = () => {
        switch (activeTab) {
            case 'history': return <PredictionHistoryLayout data={history} />;
            case 'inquiries': return <MyInquiriesList data={inquiries} loading={loading} />;
            case 'favorites': return <SavedPropertiesGrid data={favorites} />;
            default: return <PredictionHistoryLayout data={history} />;
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 pt-24">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-4 h-4 bg-brand-primary rounded-full"
                        variants={floatingVariants}
                        animate="float"
                    />
                    <motion.div
                        className="absolute top-3/4 right-1/3 w-6 h-6 bg-brand-accent rounded-full"
                        variants={floatingVariants}
                        animate="float"
                        transition={{ delay: 1 }}
                    />
                    <motion.div
                        className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-purple-500 rounded-full"
                        variants={floatingVariants}
                        animate="float"
                        transition={{ delay: 2 }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Enhanced Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            variants={pulseVariants}
                            animate="pulse"
                            className="inline-block mb-4"
                        >
                            <div className="text-6xl">👋</div>
                        </motion.div>
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-4">
                            Welcome Back, {user?.username || 'Buyer'}!
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            Your personal real estate hub. Track predictions, manage inquiries, and explore your favorite properties.
                        </p>
                    </motion.div>

                    {/* Enhanced Stats Cards & Loan CTA */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', duration: 1, delay: 0.1 }}
                            className="col-span-1 p-8 bg-gradient-to-r from-brand-secondary to-purple-600 rounded-2xl shadow-2xl flex flex-col justify-center items-center text-center group hover:shadow-3xl transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <motion.div 
                                className="text-4xl mb-4 group-hover:scale-110 transition-transform"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                🏦
                            </motion.div>
                            <p className="text-xl font-bold text-white mb-4">Check Your Loan Power</p>
                            <Link to="/loan-calculator">
                                <motion.button 
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-brand-secondary font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl relative overflow-hidden"
                                >
                                    <span className="relative z-10">Start Calculator</span>
                                </motion.button>
                            </Link>
                        </motion.div>
                        
                        {[
                            { label: 'Predictions Made', value: stats.predictions, color: 'from-blue-500 to-cyan-400', icon: '📊' },
                            { label: 'Inquiries Sent', value: stats.inquiries, color: 'from-purple-500 to-pink-500', icon: '📨' },
                            { label: 'Favorites', value: stats.favorites, color: 'from-orange-400 to-red-500', icon: '⭐' }
                        ].map((stat, index) => (
                            <motion.div 
                                key={stat.label}
                                variants={statVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className={`p-8 rounded-2xl shadow-2xl bg-gradient-to-br ${stat.color} hover:scale-105 transition-transform duration-300 group relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/80 mb-2">{stat.label}</p>
                                        <h3 className="text-5xl font-extrabold text-white mt-1">{stat.value}</h3>
                                    </div>
                                    <motion.div 
                                        className="text-3xl opacity-90 group-hover:scale-110 transition-transform"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                    >
                                        {stat.icon}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Enhanced Tab Navigation */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 p-6 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="flex flex-wrap gap-4 relative z-10">
                            {[
                                { id: 'history', label: 'Prediction History', icon: '📈', color: 'from-blue-500 to-cyan-500' },
                                { id: 'inquiries', label: 'My Inquiries', icon: '📨', color: 'from-purple-500 to-pink-500' },
                                { id: 'favorites', label: 'Saved Properties', icon: '⭐', color: 'from-orange-400 to-red-500' }
                            ].map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`py-4 px-6 capitalize font-semibold rounded-xl transition-all flex items-center gap-3 relative group ${
                                        activeTab === tab.id 
                                            ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl` 
                                            : 'text-text-muted hover:text-white hover:bg-gray-700/50'
                                    }`}
                                >
                                    <motion.span 
                                        className="text-xl"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        {tab.icon}
                                    </motion.span>
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div 
                                            layoutId="userUnderline" 
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                        
                        <motion.button 
                            onClick={() => setShowQueryModal(true)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-brand-accent to-yellow-500 text-bg-dark-primary font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <motion.span 
                                className="text-xl group-hover:scale-110 transition-transform relative z-10"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                💬
                            </motion.span>
                            <span className="relative z-10">Ask a Query</span>
                        </motion.button>
                    </motion.div>

                    {/* Enhanced Loading State */}
                    {loading ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 1, repeat: Infinity }
                                }}
                                className="inline-block w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full mb-4"
                            />
                            <p className="text-brand-primary text-xl font-semibold">Loading Your Dashboard...</p>
                            <p className="text-text-muted mt-2">Preparing your personalized experience</p>
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Enhanced Query Modal */}
                <AnimatePresence>
                    {showQueryModal && (
                        <EnhancedQueryModal 
                            onClose={() => setShowQueryModal(false)} 
                            onSubmit={submitGeneralQuery}
                        />
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

// --- Enhanced Sub-Components ---

const PredictionHistoryLayout = ({ data }) => (
    <motion.div 
        key="history" 
        variants={cardVariants} 
        initial="hidden" 
        animate="visible" 
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
    >
        {/* New Analysis Card */}
        <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 flex flex-col justify-between group relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative z-10">
                <motion.div 
                    className="text-6xl mb-4 group-hover:scale-110 transition-transform"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    🚀
                </motion.div>
                <h3 className="text-3xl font-bold text-brand-primary mb-4">Run a New Analysis</h3>
                <p className="text-lg text-text-muted mb-6">Instantly calculate the market value of any property with our AI-powered prediction engine.</p>
            </div>
            <Link to="/predict" className="w-full relative z-10">
                <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-brand-primary to-blue-600 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
                >
                    <span>Start Prediction</span>
                    <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        →
                    </motion.span>
                </motion.button>
            </Link>
        </motion.div>

        {/* Prediction History Table */}
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-brand-primary">Your Prediction History</h3>
                    <motion.div 
                        className="text-2xl"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        📊
                    </motion.div>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                    <table className="min-w-full">
                        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                            <tr>
                                {['Location', 'Area (sqft)', 'Predicted Price', 'Date'].map((header, index) => (
                                    <th key={header} className="px-6 py-4 text-left text-sm font-bold text-brand-accent uppercase tracking-wider">
                                        <motion.span
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {header}
                                        </motion.span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            <AnimatePresence>
                            {data.map((item, index) => (
                                <motion.tr 
                                    key={item.id} 
                                    custom={index}
                                    variants={listItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                    className="transition-colors duration-200 group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <motion.div 
                                                className="w-2 h-2 bg-green-500 rounded-full"
                                                whileHover={{ scale: 1.5 }}
                                            ></motion.div>
                                            <span className="font-medium text-text-light group-hover:text-white">{item.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light group-hover:text-white">{item.area.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <motion.span 
                                            className="text-lg font-bold text-green-400 group-hover:text-green-300"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            ₹{item.price}L
                                        </motion.span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-muted text-sm group-hover:text-text-light">
                                        {new Date(item.date).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                </motion.tr>
                            ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const MyInquiriesList = ({ data, loading }) => {
    const [selectedId, setSelectedId] = useState(null);

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <motion.div
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                    }}
                    className="inline-block w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full mb-4"
                />
                <p className="text-brand-primary text-xl font-semibold">Loading Your Inquiries</p>
                <p className="text-text-muted mt-2">Fetching your conversation history</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            key="inquiries" 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible" 
            className="space-y-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-brand-primary">My Sent Inquiries</h3>
                <motion.div 
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    📨
                </motion.div>
            </div>
            
            {data.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
                    <motion.div 
                        className="text-6xl mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        📭
                    </motion.div>
                    <h4 className="text-xl font-semibold text-text-light mb-2">No Inquiries Yet</h4>
                    <p className="text-text-muted max-w-md mx-auto mb-6">
                        You haven't sent any inquiries yet. Start by asking a question to our support team!
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold"
                        onClick={() => document.querySelector('button[onClick*="setShowQueryModal"]')?.click()}
                    >
                        Send Your First Query
                    </motion.button>
                </motion.div>
            ) : (
                data.map((item, index) => {
                    const isSelected = selectedId === item.id;
                    const hasReply = item.status === 'Replied' && item.reply;
                    const statusColor = hasReply ? 'from-green-500 to-emerald-400' : 'from-yellow-500 to-orange-400';
                    
                    return (
                        <motion.div 
                            key={item.id} 
                            custom={index}
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ y: -2 }}
                            className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-l-4 shadow-xl hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden ${
                                hasReply ? 'border-green-500' : 'border-yellow-500'
                            }`}
                            onClick={() => setSelectedId(isSelected ? null : item.id)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            
                            {/* Header */}
                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="font-bold text-xl text-brand-accent group-hover:text-white transition-colors">
                                            {item.subject}
                                        </p>
                                        <motion.span 
                                            className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${statusColor} text-white`}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {item.status}
                                        </motion.span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Sent: {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                                    </p>
                                </div>
                                <motion.div 
                                    animate={{ rotate: isSelected ? 90 : 0 }}
                                    className="text-text-muted text-xl group-hover:text-white transition-colors"
                                >
                                    ▶
                                </motion.div>
                            </div>

                            {/* Expandable Content */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        variants={expandVariants}
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        className="border-t border-gray-700 pt-4 relative z-10"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-text-muted font-semibold mb-2 flex items-center gap-2">
                                                    <motion.span
                                                        animate={{ rotate: [0, 360] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        💭
                                                    </motion.span>
                                                    Your Message:
                                                </p>
                                                <p className="text-text-light whitespace-pre-wrap bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                                                    {item.message}
                                                </p>
                                            </div>
                                            
                                            {hasReply ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <p className="text-green-500 font-semibold mb-2 flex items-center gap-2">
                                                        <motion.span
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                        >
                                                            ✅
                                                        </motion.span>
                                                        Support Reply:
                                                    </p>
                                                    <p className="text-text-light whitespace-pre-wrap bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/30">
                                                        {item.reply}
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30"
                                                >
                                                    <motion.span 
                                                        className="text-2xl"
                                                        animate={{ rotate: [0, 180, 360] }}
                                                        transition={{ duration: 3, repeat: Infinity }}
                                                    >
                                                        ⏳
                                                    </motion.span>
                                                    <div>
                                                        <p className="text-yellow-400 font-semibold">Pending Response</p>
                                                        <p className="text-text-muted text-sm">A support agent will review your query and reply soon.</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })
            )}
        </motion.div>
    );
};

const SavedPropertiesGrid = ({ data }) => (
    <motion.div 
        key="favorites" 
        variants={cardVariants} 
        initial="hidden" 
        animate="visible" 
        className="space-y-6"
    >
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-brand-primary">Saved Properties</h3>
            <motion.div 
                className="text-2xl"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                ⭐
            </motion.div>
        </div>
        
        {data.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent"></div>
                <motion.div 
                    className="text-6xl mb-4"
                    animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    💔
                </motion.div>
                <h4 className="text-xl font-semibold text-text-light mb-2">No Favorites Yet</h4>
                <p className="text-text-muted">Start exploring properties and add them to your wishlist!</p>
            </motion.div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {data.map((item, index) => (
                    <motion.div
                        key={item.id}
                        custom={index}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -5 }}
                    >
                        <ListingCard 
                            listing={item} 
                            onClick={() => console.log('Open Property Details:', item.id)}
                        />
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
);

// Enhanced Query Modal
const EnhancedQueryModal = ({ onClose, onSubmit }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle');
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user?.uid) {
            alert("Error: You must be logged in to send a query.");
            return;
        }

        setStatus('sending');
        try {
            await onSubmit(subject, message, user.uid);
            setStatus('sent');
            setTimeout(onClose, 1500);
        } catch (err) {
            console.error(err);
            setStatus('idle');
            alert("Error: Could not send query. Please try again.");
        }
    };

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700 mx-4 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-accent/10"></div>
                
                {status === 'sent' ? (
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-8 relative z-10"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="text-8xl text-green-500 mb-6"
                        >
                            ✅
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-4">Query Sent Successfully!</h2>
                        <p className="text-text-muted text-lg">We'll get back to you within 24 hours via email.</p>
                        
                        <motion.button
                            onClick={onClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg"
                        >
                            Close
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.form 
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="text-center mb-6">
                            <motion.div 
                                className="text-6xl mb-4"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                💬
                            </motion.div>
                            <h2 className="text-3xl font-bold text-brand-accent mb-2">Ask a Question</h2>
                            <p className="text-text-muted">Our support team is here to help you 24/7</p>
                        </div>
                        
                        <div className="space-y-6">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Subject
                                </label>
                                <input 
                                    type="text"
                                    placeholder="What would you like to know?"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full p-4 bg-gray-700 rounded-xl text-text-light placeholder-text-muted border border-gray-600 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    required
                                    disabled={status === 'sending'}
                                />
                            </motion.div>
                            
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    rows="6"
                                    placeholder="Describe your question in detail..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-4 bg-gray-700 rounded-xl text-text-light placeholder-text-muted border border-gray-600 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all resize-none"
                                    required
                                    disabled={status === 'sending'}
                                />
                            </motion.div>
                        </div>
                        
                        <motion.div 
                            className="flex justify-end gap-4 mt-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button 
                                type="button" 
                                onClick={onClose}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="py-3 px-6 bg-gray-600 text-white rounded-xl font-semibold transition-all hover:bg-gray-500 shadow-lg"
                                disabled={status === 'sending'}
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                type="submit"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="py-3 px-8 bg-gradient-to-r from-brand-primary to-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Sending...
                                    </>
                                ) : (
                                    'Submit Query'
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.form>
                )}
            </motion.div>
        </motion.div>
    );
};

export default UserDashboard;