import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- Imports (All paths are synchronized) ---
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import PrivateRoute from './components/Common/PrivateRoute';
import AgentRoute from './components/Common/AgentRoute';
import ChatbotWidget from './components/Common/ChatbotWidget';
import PageTransition from './components/Common/PageTransition'; 

// Pages 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import PredictionPage from './pages/PredictionPage'; 
// --- THIS IS THE FIX ---
// Changed from 'UserDashboard' to '{ UserDashboard }' to match the named export
import { UserDashboard } from './pages/UserDashboard';
// --- END OF FIX ---
import OwnerDashboard from './pages/OwnerDashboard'; 
import PropertiesPage from './pages/PropertiesPage'; 
import PropertyDetailPage from './pages/PropertyDetailPage'; 
import WishlistPage from './pages/Buyer/WishlistPage'; 
import LoanCalculatorPage from './pages/LoanCalculatorPage';
import AreaConverterPage from './pages/AreaConverterPage';
import ArticlesPage from './pages/ArticlesPage';
import BuyingGuidesPage from './pages/BuyingGuidesPage';
import FAQPage from './pages/FAQPage';
import MapPage from './pages/MapPage'; // <-- NEW IMPORT


const RootContent = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen bg-bg-dark-primary text-text-light"> 
            <Navbar />
            
            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        
                        {/* Public/General Routes */}
                        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
                        
                        {/* Core Listing Routes */}
                        <Route path="/predict" element={<PageTransition><PredictionPage /></PageTransition>} />
                        <Route path="/properties" element={<PageTransition><PropertiesPage /></PageTransition>} />
                        <Route path="/property/:id" element={<PageTransition><PropertyDetailPage /></PageTransition>} />
                        <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
                        
                        {/* Utility Routes */}
                        <Route path="/loan-calculator" element={<PageTransition><LoanCalculatorPage /></PageTransition>} />
                        <Route path="/area-converter" element={<PageTransition><AreaConverterPage /></PageTransition>} />
                        <Route path="/articles" element={<PageTransition><ArticlesPage /></PageTransition>} />
                        <Route path="/guides" element={<PageTransition><BuyingGuidesPage /></PageTransition>} />
                        <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
                        
                        {/* NEW MAP ROUTE */}
                        <Route path="/map" element={<PageTransition><MapPage /></PageTransition>} />

                        {/* Protected Routes (Role-Based Access) */}
                        <Route path="/dashboard" element={<PrivateRoute element={UserDashboard} />} />         
                        <Route path="/agent-dashboard" element={<AgentRoute element={OwnerDashboard} />} />   
                        
                        {/* 404 Fallback */}
                        <Route path="*" element={<h1 className="text-center text-3xl mt-10">404 - Page Not Found</h1>} />
                    </Routes>
                </AnimatePresence>
            </main>
            
            <Footer />
            <ChatbotWidget />
        </div>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <RootContent />
        </AuthProvider>
    </Router>
);

export default App;