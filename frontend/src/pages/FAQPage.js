import React, { useState } from 'react'; // (FIX) Removed unused 'useRef' and 'useEffect'
import { motion, AnimatePresence } from 'framer-motion';
// import PageTransition from '../components/Common/PageTransition'; // Original import

// --- (FIX) Inlined PageTransition component to resolve import error ---
const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
);

// --- (FIX) Moved FAQItem component outside of FAQPage ---
// This prevents re-rendering issues and improves performance.
const FAQItem = ({ item, index, isOpen, onToggle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="border border-gray-600 rounded-lg overflow-hidden mb-4"
    >
        <button
            onClick={onToggle}
            className="w-full p-4 text-left bg-gray-800 hover:bg-gray-700 transition-colors flex justify-between items-center"
        >
            <span className="font-semibold text-white text-lg pr-4">{item.question}</span>
            <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-brand-accent text-xl flex-shrink-0"
            >
                ▼
            </motion.span>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="p-4 bg-gray-900 border-t border-gray-600">
                        <p className="text-text-muted leading-relaxed">{item.answer}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

// --- (REMOVED) ContactForm component was here ---
// As requested, the entire modal form component has been deleted.

// --- MAIN FAQ PAGE COMPONENT ---
const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [openItems, setOpenItems] = useState({});

    // --- (REMOVED) State and Refs for the contact form ---
    // const [showContactForm, setShowContactForm] = useState(false);
    // const [userQuery, setUserQuery] = useState('');
    // const [userEmail, setUserEmail] = useState('');
    // const [querySubmitted, setQuerySubmitted] = useState(false);
    // const emailInputRef = useRef(null);
    // const queryInputRef = useRef(null);

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCallSupport = () => {
        window.open('tel:+918012345678');
    };

    const handleLiveChat = () => {
        window.open('https://wa.me/918012345678?text=Hi%20I%20have%20a%20question%20about%20your%20real%20estate%20services');
    };

    // --- (REMOVED) handleQuerySubmit function ---
    // --- (REMOVED) handleCloseModal function ---
    // --- (REMOVED) useEffect for auto-focus ---
    // --- (REMOVED) useEffect for background scroll lock ---

    const faqData = {
        general: [
            {
                id: 'accuracy',
                question: "How accurate is the price prediction?",
                answer: "Our AI model (XGBoost) is trained on comprehensive historical data from reliable real estate datasets. It provides highly accurate estimates based on multiple factors including Location, BHK configuration, Built-up Area, Amenities, and Market Trends. The model achieves over 90% accuracy in predicting property prices within the trained regions."
            },
            {
                id: 'chatbot',
                question: "How does the Chatbot work?",
                answer: "Our intelligent chatbot leverages Google's Gemini API, specifically trained on real estate domain knowledge. It's contextually aware of our ML models and can provide insights on property valuation, market trends, investment advice, and general real estate queries. The chatbot continuously learns from user interactions to improve responses."
            },
            {
                id: 'data-freshness',
                question: "How frequently is the data updated?",
                answer: "We update our property database weekly with the latest market listings, price trends, and transaction data. Our ML models are retrained monthly to incorporate the most recent market patterns and ensure predictions remain accurate in dynamic market conditions."
            },
            {
                id: 'coverage',
                question: "Which cities and areas do you cover?",
                answer: "Currently, we cover major metropolitan areas including Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Chennai, Pune, and Kolkata. We're continuously expanding to include more cities and suburban areas based on user demand and data availability."
            }
        ],
        technical: [
            {
                id: 'model',
                question: "What technology powers the price predictions?",
                answer: "We use XGBoost (Extreme Gradient Boosting) algorithm, which is renowned for its high accuracy in regression tasks. The model is trained on features like location coordinates, property age, floor number, amenities, proximity to landmarks, and recent sale prices in the area."
            },
            {
                id: 'features',
                question: "What factors are considered in price prediction?",
                answer: "Our model considers 20+ features including: Location & Neighborhood, BHK Configuration, Built-up Area, Property Age, Floor Number, Availability of Lift, Parking Facilities, Proximity to Schools/Hospitals/Metro, View from Property, Furnishing Status, and Market Demand Trends."
            },
            {
                id: 'api',
                question: "Do you provide API access for developers?",
                answer: "Yes, we offer RESTful API access for registered developers and real estate businesses. Our API provides property valuation, market analysis, and neighborhood insights. Contact our business team for API documentation and access credentials."
            },
            {
                id: 'mobile-app',
                question: "Is there a mobile app available?",
                answer: "Our mobile app is currently in development and will be available on both iOS and Android platforms by Q2 2024. The app will include all web features plus push notifications for price alerts and new property matches."
            }
        ],
        buying: [
            {
                id: 'first-time',
                question: "What should first-time home buyers know?",
                answer: "First-time buyers should focus on: Budget planning including hidden costs (registration, stamp duty, GST), Location research considering future development, Home loan pre-approval, Legal document verification, and Resale value potential. Use our EMI calculator and affordability tools to plan your purchase."
            },
            {
                id: 'legal',
                question: "What legal documents should I verify?",
                answer: "Essential documents include: Title Deed, Encumbrance Certificate, Building Approval Plan, RERA Registration, No Objection Certificates (NOCs), Property Tax Receipts, and Occupancy Certificate. Always consult with a legal expert before finalizing any property transaction."
            },
            {
                id: 'loan-process',
                question: "How long does the home loan process take?",
                answer: "Typically, home loan approval takes 7-10 working days after document submission. The entire process from application to disbursement can take 3-4 weeks. Factors affecting timeline include document verification, property valuation, and legal checks."
            },
            {
                id: 'negotiation',
                question: "Any tips for price negotiation?",
                answer: "Research comparable properties in the area, Understand market trends (buyer's/seller's market), Identify property drawbacks for negotiation leverage, Be ready to walk away, Consider asking for additional amenities instead of price reduction, and Time your purchase during festive seasons or year-end for better deals."
            }
        ],
        support: [
            {
                id: 'contact',
                question: "How can I contact customer support?",
                answer: "You can reach our support team via: Email: support@realestateai.com, Phone: +91-80-1234-5678 (9 AM - 6 PM, Mon-Sat), Live Chat: Available on our platform during business hours, or Schedule a callback through our contact form."
            },
            {
                id: 'response-time',
                question: "What is your average response time?",
                answer: "Email queries: Within 4 business hours, Phone support: Immediate during business hours, Live chat: Instant connection, Technical issues: Escalated to our tech team with 24-hour resolution timeline for critical issues."
            },
            {
                id: 'feature-request',
                question: "Can I suggest new features?",
                answer: "Absolutely! We value user feedback. You can submit feature requests through our feedback form, email us directly, or participate in our monthly user feedback sessions. Popular requests are prioritized in our development roadmap."
            },
            {
                id: 'partnership',
                question: "Do you partner with real estate agencies?",
                answer: "Yes, we partner with registered real estate brokers, developers, and agencies. Our partnership programs include API access, white-label solutions, and data analytics services. Contact our business development team for partnership opportunities."
            }
        ]
    };

    const categories = [
        { id: 'general', name: 'General Questions', icon: '❓' },
        { id: 'technical', name: 'Technical', icon: '⚙️' },
        { id: 'buying', name: 'Buying Guide', icon: '🏠' },
        { id: 'support', name: 'Support', icon: '📞' }
    ];

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto py-10 px-4 text-text-light pt-24">
                {/* Header Section */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-extrabold text-brand-accent mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        Find quick answers to common questions about our AI-powered real estate platform, 
                        price predictions, and property buying process.
                    </p>
                </motion.div>

                {/* Category Navigation */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-4 mb-8"
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${
                                activeCategory === category.id
                                    ? 'bg-brand-accent text-white shadow-lg'
                                    : 'bg-gray-800 text-text-muted hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <span className="text-xl">{category.icon}</span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main FAQ Content */}
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-bg-dark-card rounded-xl shadow-2xl border border-gray-700 p-6">
                            <h2 className="text-2xl font-bold text-brand-primary mb-6 flex items-center">
                                <span className="mr-3">
                                    {categories.find(cat => cat.id === activeCategory)?.icon}
                                </span>
                                {categories.find(cat => cat.id === activeCategory)?.name}
                            </h2>
                            <div className="space-y-4">
                                {faqData[activeCategory].map((item, index) => (
                                    // --- (FIX) Passing props to the external component ---
                                    <FAQItem 
                                        key={item.id} 
                                        item={item} 
                                        index={index} 
                                        isOpen={!!openItems[item.id]}
                                        onToggle={() => toggleItem(item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar - Quick Help */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Contact Card */}
                        <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-6 rounded-xl text-white">
                            <h3 className="text-xl font-bold mb-3">Still Need Help?</h3>
                            <p className="text-white/90 mb-4">Can't find what you're looking for? Our team is here to help.</p>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleCallSupport}
                                    className="w-full bg-white text-brand-primary py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    📞 +91-80-1234-5678
                                </button>
                                <button 
                                    onClick={handleLiveChat}
                                    className="w-full bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                                >
                                    💬 WhatsApp Chat
                                </button>
                                {/* --- (REMOVED) Email Query button was here --- */}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-brand-accent mb-4">Platform Stats</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Properties Analyzed</span>
                                    <span className="font-semibold">50,000+</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Prediction Accuracy</span>
                                    <span className="font-semibold text-green-400">92.5%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Active Users</span>
                                    <span className="font-semibold">10,000+</span>
                                D                               </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Cities Covered</span>
                                    <span className="font-semibold">15+</span>
                                </div>
                            </div>
                        </div>

                        {/* Popular Questions */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-brand-accent mb-4">Popular Questions</h3>
                            <div className="space-y-2">
                                {faqData.general.slice(0, 3).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveCategory('general');
                                            // Ensure the item is open after category switch
                                            setOpenItems(prev => ({ ...prev, [item.id]: true }));
                                        }}
                                        className="block w-full text-left text-text-muted hover:text-white text-sm transition-colors py-1"
                                    >
                                        • {item.question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- (REMOVED) Contact Form Modal <AnimatePresence> was here --- */}
                
            </div>
        </PageTransition>
    );
};

export default FAQPage;