import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Always redirect to login before Navbar unmounts
  const handleLogout = async () => {
    try {
      navigate('/login', { replace: true });
      setTimeout(async () => {
        await logout();
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login', { replace: true });
    }
  };

  // ✅ Prevent redirect from register or login pages
  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    if (!isLoading && !user && !publicPaths.includes(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate]);

  const dashboardPath = user?.role === 'agent' ? '/agent-dashboard' : '/dashboard';

  const handleResourcesEnter = () => setIsResourcesOpen(true);
  const handleResourcesLeave = (e) => {
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) return;
    setIsResourcesOpen(false);
  };
  const handleDropdownEnter = () => setIsResourcesOpen(true);
  const handleDropdownLeave = (e) => {
    if (e.relatedTarget && e.relatedTarget.closest('button')) return;
    setIsResourcesOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="bg-bg-dark-secondary shadow-lg w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold text-brand-accent">
              RealEstateAI
            </Link>
          </div>

          {/* CORE NAVIGATION LINKS */}
          <div className="hidden md:flex space-x-6 items-center">
            {/* Conditional links for non-agents */}
            {(!user || user.role !== 'agent') && (
              <>
                <Link to="/predict" className="text-text-muted hover:text-brand-accent transition">
                  Prediction
                </Link>
                <Link to="/properties" className="text-text-muted hover:text-brand-accent transition">
                  Properties
                </Link>
                <Link to="/map" className="text-text-muted hover:text-brand-accent transition">
                  Map View
                </Link>

                {/* Resources Dropdown */}
                <div className="relative" onMouseLeave={handleResourcesLeave}>
                  <button
                    onMouseEnter={handleResourcesEnter}
                    className="text-text-muted hover:text-brand-accent transition flex items-center"
                  >
                    Resources <span className="ml-1 text-sm">▼</span>
                  </button>

                  <AnimatePresence>
                    {isResourcesOpen && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                        className="absolute top-full mt-2 w-48 bg-bg-dark-card rounded-lg shadow-xl border border-gray-700 z-50"
                      >
                        <Link
                          to="/loan-calculator"
                          className="block px-4 py-2 text-sm text-text-muted hover:bg-gray-800 hover:text-brand-accent transition"
                          onClick={() => setIsResourcesOpen(false)}
                        >
                          EMI Calculator
                        </Link>
                        <Link
                          to="/area-converter"
                          className="block px-4 py-2 text-sm text-text-muted hover:bg-gray-800 hover:text-brand-accent transition"
                          onClick={() => setIsResourcesOpen(false)}
                        >
                          Area Converter
                        </Link>
                        <Link
                          to="/articles"
                          className="block px-4 py-2 text-sm text-text-muted hover:bg-gray-800 hover:text-brand-accent transition"
                          onClick={() => setIsResourcesOpen(false)}
                        >
                          Articles &amp; News
                        </Link>
                        <Link
                          to="/guides"
                          className="block px-4 py-2 text-sm text-text-muted hover:bg-gray-800 hover:text-brand-accent transition"
                          onClick={() => setIsResourcesOpen(false)}
                        >
                          Buying Guides
                        </Link>
                        <Link
                          to="/faq"
                          className="block px-4 py-2 text-sm text-text-muted hover:bg-gray-800 hover:text-brand-accent transition"
                          onClick={() => setIsResourcesOpen(false)}
                        >
                          FAQ
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Dashboard link for all users */}
            {!isLoading && user && (
              <Link
                to={dashboardPath}
                className="text-text-muted hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* === Auth/User Actions === */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-700 animate-pulse rounded-full"></div>
            ) : user ? (
              <>
                <span className="text-text-muted text-sm hidden sm:block">
                  Hi, {user.username} ({user.role})
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login?role=user"
                    className="text-text-light hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Login
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(249,115,22,0.5)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="bg-brand-secondary hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  >
                    Post Property
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Placeholder */}
      <div className="md:hidden">{/* ... mobile menu content ... */}</div>
    </motion.nav>
  );
};

export default Navbar;