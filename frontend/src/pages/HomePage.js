import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();
    const [showContactModal, setShowContactModal] = useState(false);

    const handleGetStarted = () => {
        navigate('/predict');
    };

    const handleBrowseProperties = () => {
        navigate('/properties');
    };

    const handleContactSupport = () => {
        navigate('/contact');
    };

    const handleQuickContact = () => {
        setShowContactModal(true);
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.2,
                duration: 0.6,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -10,
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const heroVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2
            }
        }
    };

    const supportContacts = [
        { 
            type: 'Sales & General Inquiries', 
            number: '+91 98000 12345', 
            icon: '📞', 
            hours: '24/7',
            description: 'Get information about properties and pricing'
        },
        { 
            type: 'Customer Support', 
            number: '+91 98000 54321', 
            icon: '🛟', 
            hours: '24/7',
            description: 'Assistance with bookings and reservations'
        },
        { 
            type: 'WhatsApp Support', 
            number: '+91 98000 67890', 
            icon: '💬', 
            hours: '24/7',
            description: 'Quick chat support via WhatsApp'
        },
        { 
            type: 'Technical Support', 
            number: '+91 98000 98765', 
            icon: '🔧', 
            hours: '9 AM - 6 PM',
            description: 'Website and app technical issues'
        }
    ];

    const handleCallNumber = (number) => {
        window.open(`tel:${number}`, '_self');
    };

    const handleWhatsApp = (number) => {
        const message = "Hi, I'm interested in knowing more about your properties and services from the DreamHome website.";
        window.open(`https://wa.me/${number.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen text-text-light bg-gradient-to-br from-gray-900 to-gray-800">
            
            {/* --- 1. Enhanced Hero Section --- */}
            {/* (FIX) Added pt-20 (padding-top) to this container to push content below the overlapping nav bar */}
            <div className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 bg-hero-house bg-center bg-cover bg-fixed">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                </div>
                
                {/* Hero Content */}
                <motion.div 
                    className="relative z-10 text-center p-8 max-w-4xl mx-4"
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 
                        className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Find Your Next <span className="text-brand-accent">Dream Home</span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Discover perfect properties with AI-powered price predictions and smart search tools
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <motion.button 
                            onClick={handleGetStarted}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-brand-accent text-bg-dark-primary py-4 px-10 rounded-xl font-bold text-lg cursor-pointer 
                                        shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
                        >
                            <span>🚀</span>
                            Start Price Prediction
                        </motion.button>
                        
                        <motion.button 
                            onClick={handleBrowseProperties}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="border-2 border-white text-white py-4 px-10 rounded-xl font-bold text-lg cursor-pointer 
                                        hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-3"
                        >
                            <span>🏠</span>
                            Browse Properties
                        </motion.button>

                        <motion.button 
                            onClick={handleQuickContact}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="border-2 border-brand-primary text-brand-primary py-4 px-10 rounded-xl font-bold text-lg cursor-pointer 
                                        hover:bg-brand-primary hover:text-white transition-all duration-300 flex items-center gap-3"
                        >
                            <span>📞</span>
                            Quick Contact
                        </motion.button>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        {[
                            { number: '5000+', label: 'Properties' },
                            { number: '95%', label: 'Accuracy' },
                            { number: '24/7', label: 'Support' },
                            { number: '50+', label: 'Locations' }
                        ].map((stat, index) => (
                            <motion.div 
                                key={stat.label}
                                className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                                whileHover={{ scale: 1.05 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-2xl md:text-3xl font-bold text-brand-accent mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-300">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Quick Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-2xl mx-auto"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-center sm:text-left">
                                <p className="text-white font-semibold mb-1">Need Immediate Assistance?</p>
                                <p className="text-text-muted text-sm">Call us now for instant support</p>
                            </div>
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={() => handleCallNumber('+91 98000 12345')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                                >
                                    <span>📞</span>
                                    Call Now
                                </motion.button>
                                <motion.button
                                    onClick={() => handleWhatsApp('+91 98000 67890')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
                                >
                                    <span>💬</span>
                                    WhatsApp
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="text-white text-2xl">↓</div>
                </motion.div>
            </div>

            {/* --- 2. Enhanced Featured Content Section --- */}
            <div className="w-full max-w-7xl mx-auto py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-extrabold text-white mb-4">
                        Featured Property Insights
                    </h2>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Discover trending properties and market insights to make informed decisions
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            id: 1,
                            price: '₹95 Lakhs',
                            type: '3 BHK, Whitefield',
                            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop',
                            description: 'Modern apartment with premium amenities',
                            link: '/properties?location=Whitefield&bhk=3'
                        },
                        {
                            id: 2,
                            price: '₹1.5 Cr',
                            type: '4 BHK, Koramangala',
                            image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=250&fit=crop',
                            description: 'Luxury villa in prime location',
                            link: '/properties?location=Koramangala&bhk=4'
                        },
                        {
                            id: 3,
                            price: '2,300+',
                            type: 'New Projects',
                            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
                            description: 'Latest construction projects',
                            link: '/properties?sort=newest'
                        },
                        {
                            id: 4,
                            price: '895 Homes',
                            type: 'Budget Options',
                            image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=250&fit=crop',
                            description: 'Affordable housing solutions',
                            link: '/properties?max_price=50'
                        }
                    ].map((card, index) => (
                        <motion.div
                            key={card.id}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <Link to={card.link}>
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 hover:border-brand-primary/50 transition-all duration-300">
                                    <div className="relative overflow-hidden">
                                        <img 
                                            src={card.image} 
                                            alt={card.type} 
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                                        <div className="absolute top-4 right-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Featured
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-2xl font-bold text-brand-accent mb-2">{card.price}</p>
                                        <p className="text-lg font-semibold text-white mb-2">{card.type}</p>
                                        <p className="text-text-muted text-sm mb-4">{card.description}</p>
                                        <motion.div 
                                            className="flex items-center text-brand-primary font-semibold text-sm"
                                            whileHover={{ x: 5 }}
                                        >
                                            View Details 
                                            <span className="ml-1">→</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-to-r from-brand-primary to-blue-600 rounded-2xl p-12 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Ready to Find Your Perfect Home?
                        </h3>
                        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who found their dream home through our platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                onClick={handleGetStarted}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-gray-900 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
                            >
                                Get Started Today
                            </motion.button>
                            <motion.button
                                onClick={handleBrowseProperties}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-white text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all"
                            >
                                Explore All Properties
                            </motion.button>
                            <motion.button
                                onClick={handleQuickContact}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-brand-accent text-brand-accent py-4 px-8 rounded-xl font-bold text-lg hover:bg-brand-accent hover:text-white transition-all"
                            >
                                📞 Contact Us
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- 3. Quick Links Section --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full bg-gray-800/50 py-16"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '📊',
                                title: 'Price Predictor',
                                description: 'Get accurate price estimates for any property',
                                link: '/predict',
                                buttonText: 'Predict Price'
                            },
                            {
                                icon: '🏠',
                                title: 'Property Listings',
                                description: 'Browse through our extensive property database',
                                link: '/properties',
                                buttonText: 'View Listings'
                            },
                            {
                                icon: '📞',
                                title: 'Expert Support',
                                description: '24/7 customer support for all your queries',
                                link: '/contact',
                                buttonText: 'Get Help'
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-brand-primary/50 transition-all duration-300"
                            >
                                <div className="text-5xl mb-4">{service.icon}</div>
                                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                                <p className="text-text-muted mb-6">{service.description}</p>
                                <Link to={service.link}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-brand-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-all"
                                    >
                                        {service.buttonText}
                                    </motion.button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* --- 4. Contact Information Footer --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 py-16 border-t border-gray-700"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <h3 className="text-2xl font-bold text-brand-accent mb-4">DreamHome Properties</h3>
                            <p className="text-text-muted mb-4">
                                Your trusted partner in finding the perfect home with AI-powered insights and expert guidance.
                            </p>
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCallNumber('+91 98000 12345')}
                                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all"
                                >
                                    📞
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleWhatsApp('+91 98000 67890')}
                                    className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all"
                                >
                                    💬
                                </motion.button>
                            </div>
                        </div>

                        {/* Quick Contact */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Quick Contact</h4>
                            <div className="space-y-2">
                                <p className="text-text-muted">📞 +91 98000 12345</p>
                                <p className="text-text-muted">📧 support@dreamhome.com</p>
                                <p className="text-text-muted">📍 Bangalore, Karnataka</p>
                                <p className="text-text-muted">🕒 24/7 Support Available</p>
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Our Services</h4>
                            <div className="space-y-2">
                                <p className="text-text-muted">🏠 Property Search</p>
                                <p className="text-text-muted">📊 Price Prediction</p>
                                <p className="text-text-muted">💰 Loan Calculator</p>
                                <p className="text-text-muted">🔍 Market Analysis</p>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                            <h4 className="text-lg font-semibold text-white mb-2">🚨 Emergency</h4>
                            <p className="text-text-muted text-sm mb-3">Urgent property issues</p>
                            <motion.button
                                onClick={() => handleCallNumber('+91 98000 11111')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-all"
                            >
                                Call Emergency
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowContactModal(false)}
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700"
                        >
                            <div className="p-8">
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">📞</div>
                                    <h2 className="text-2xl font-bold text-brand-accent mb-2">Quick Contact</h2>
                                    <p className="text-text-muted">Choose how you'd like to reach us</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {supportContacts.map((contact, index) => (
                                        <motion.div
                                            key={contact.type}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-brand-primary/50 transition-all cursor-pointer group"
                                            onClick={() => contact.type.includes('WhatsApp') ? handleWhatsApp(contact.number) : handleCallNumber(contact.number)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{contact.icon}</span>
                                                <div>
                                                    <p className="text-text-light font-semibold">{contact.type}</p>
                                                    <p className="text-brand-accent text-sm">{contact.number}</p>
                                                </div>
                                            </div>
                                            <motion.span
                                                whileHover={{ scale: 1.2 }}
                                                className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                →
                                            </motion.span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="text-center">
                                    <p className="text-text-muted text-sm mb-4">
                                        Prefer to visit our contact page for more options?
                                    </p>
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowContactModal(false)}
                                            className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                                        >
                                            Close
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleContactSupport}
                                            className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all"
                                        >
                                            Full Contact Page
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomePage;