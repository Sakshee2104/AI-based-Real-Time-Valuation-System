import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/Common/PageTransition';
import ListingCard from '../components/Listings/ListingCard';

// --- Enhanced DUMMY DATA SET with Contact Details ---
const allDummyListings = [
    { 
        id: 101, 
        location: 'Whitefield', 
        bhk: 2, 
        area: 1200, 
        price: 80.00, 
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop', 
        description: 'Near IT hub with great connectivity. This beautiful 2BHK apartment offers modern amenities and is located in the heart of Whitefield.',
        amenities: ['Park', 'Gym', 'Security', 'Power Backup', 'Swimming Pool'],
        postedDate: '2024-01-15',
        contact: {
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            email: 'rajesh.kumar@example.com',
            company: 'Elite Properties'
        },
        details: {
            furnished: 'Semi-Furnished',
            parking: '2 Wheeler',
            facing: 'East',
            age: '2 years'
        }
    },
    { 
        id: 102, 
        location: 'Indiranagar', 
        bhk: 3, 
        area: 1500, 
        price: 120.00, 
        image_url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=250&fit=crop', 
        description: 'Luxury apartment in posh area with premium finishes. Perfect for families looking for comfort and style.',
        amenities: ['Pool', 'Gym', 'Parking', 'Security', 'Clubhouse', 'Landscaped Garden'],
        postedDate: '2024-01-14',
        contact: {
            name: 'Priya Sharma',
            phone: '+91 87654 32109',
            email: 'priya.sharma@example.com',
            company: 'Luxury Homes'
        },
        details: {
            furnished: 'Fully-Furnished',
            parking: 'Car + 2 Wheeler',
            facing: 'North',
            age: 'New Construction'
        }
    },
    { 
        id: 103, 
        location: 'Hebbal', 
        bhk: 4, 
        area: 2400, 
        price: 180.00, 
        image_url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=250&fit=crop', 
        description: 'Spacious villa near Airport road with private garden. Ideal for large families seeking privacy and space.',
        amenities: ['Garden', 'Parking', 'Security', 'Power Backup', 'Modular Kitchen'],
        postedDate: '2024-01-12',
        contact: {
            name: 'Arun Patel',
            phone: '+91 76543 21098',
            email: 'arun.patel@example.com',
            company: 'Prime Villas'
        },
        details: {
            furnished: 'Unfurnished',
            parking: '2 Cars',
            facing: 'West',
            age: '5 years'
        }
    },
    { 
        id: 104, 
        location: 'Koramangala', 
        bhk: 2, 
        area: 1000, 
        price: 65.00, 
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop', 
        description: 'Affordable housing with great amenities in the bustling Koramangala area.',
        amenities: ['Security', 'Water Supply', 'Lift', '24/7 Water'],
        postedDate: '2024-01-10',
        contact: {
            name: 'Sneha Reddy',
            phone: '+91 65432 10987',
            email: 'sneha.reddy@example.com',
            company: 'Budget Homes'
        },
        details: {
            furnished: 'Semi-Furnished',
            parking: '1 Wheeler',
            facing: 'South',
            age: '3 years'
        }
    },
    { 
        id: 105, 
        location: 'Whitefield', 
        bhk: 3, 
        area: 1600, 
        price: 95.00, 
        image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=250&fit=crop', 
        description: 'New Construction with modern design and energy-efficient features.',
        amenities: ['Pool', 'Gym', 'Clubhouse', 'Security', 'Children Play Area'],
        postedDate: '2024-01-08',
        contact: {
            name: 'Vikram Singh',
            phone: '+91 94321 09876',
            email: 'vikram.singh@example.com',
            company: 'Modern Living'
        },
        details: {
            furnished: 'Fully-Furnished',
            parking: 'Car Parking',
            facing: 'East',
            age: 'New Construction'
        }
    },
    { 
        id: 106, 
        location: 'Sarjapur', 
        bhk: 1, 
        area: 650, 
        price: 35.00, 
        image_url: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=400&h=250&fit=crop', 
        description: 'Budget Friendly studio apartment perfect for students and young professionals.',
        amenities: ['Security', 'Water Supply', 'WiFi', 'Housekeeping'],
        postedDate: '2024-01-05',
        contact: {
            name: 'Anita Desai',
            phone: '+91 83210 98765',
            email: 'anita.desai@example.com',
            company: 'Student Homes'
        },
        details: {
            furnished: 'Fully-Furnished',
            parking: 'No Parking',
            facing: 'North',
            age: '1 year'
        }
    },
    { 
        id: 107, 
        location: 'Marathahalli', 
        bhk: 2, 
        area: 1100, 
        price: 75.00, 
        image_url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=250&fit=crop', 
        description: 'Well connected to IT corridors with easy access to metro and shopping malls.',
        amenities: ['Park', 'Security', 'Power Backup', 'Lift'],
        postedDate: '2024-01-03',
        contact: {
            name: 'Rahul Mehta',
            phone: '+91 72109 87654',
            email: 'rahul.mehta@example.com',
            company: 'Connect Homes'
        },
        details: {
            furnished: 'Semi-Furnished',
            parking: '1 Car',
            facing: 'West',
            age: '4 years'
        }
    },
    { 
        id: 108, 
        location: 'HSR Layout', 
        bhk: 3, 
        area: 1400, 
        price: 110.00, 
        image_url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&h=250&fit=crop', 
        description: 'Premium residential area with top-notch amenities and peaceful surroundings.',
        amenities: ['Pool', 'Gym', 'Park', 'Security', 'Clubhouse', 'Jogging Track'],
        postedDate: '2024-01-01',
        contact: {
            name: 'Neha Gupta',
            phone: '+91 61098 76543',
            email: 'neha.gupta@example.com',
            company: 'Premium Properties'
        },
        details: {
            furnished: 'Fully-Furnished',
            parking: '2 Cars',
            facing: 'South',
            age: '2 years'
        }
    },
];

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const filterVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            delay: 0.2
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

// Contact Support Numbers
const supportContacts = [
    { type: 'Sales', number: '+91 98000 12345', icon: '📞' },
    { type: 'Support', number: '+91 98000 54321', icon: '🛟' },
    { type: 'WhatsApp', number: '+91 98000 67890', icon: '💬' }
];

const PropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        location: '',
        min_price: '',
        max_price: '',
        bhk: '',
    });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);

    // Enhanced filter function with search and sort
    const loadProperties = useCallback((currentFilters) => {
        setLoading(true);
        
        let filtered = allDummyListings;
        
        const minPrice = parseFloat(currentFilters.min_price);
        const maxPrice = parseFloat(currentFilters.max_price);
        const bhkFilter = parseInt(currentFilters.bhk);

        // Price filters
        if (!isNaN(minPrice)) {
            filtered = filtered.filter(p => p.price >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            filtered = filtered.filter(p => p.price <= maxPrice);
        }
        
        // BHK filter
        if (!isNaN(bhkFilter) && bhkFilter > 0) {
            filtered = filtered.filter(p => p.bhk === bhkFilter);
        }
        
        // Location filter
        if (currentFilters.location) {
            const loc = currentFilters.location.toLowerCase();
            filtered = filtered.filter(p => p.location.toLowerCase().includes(loc));
        }
        
        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.location.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }
        
        // Sort functionality
        switch (sortBy) {
            case 'price_low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
                break;
            case 'area':
                filtered.sort((a, b) => b.area - a.area);
                break;
            default:
                break;
        }
        
        // Simulate API delay with better loading experience
        setTimeout(() => {
            setProperties(filtered);
            setLoading(false);
        }, 500);
    }, [searchQuery, sortBy]); 

    useEffect(() => {
        loadProperties(filters);
    }, [filters, loadProperties]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        loadProperties(filters);
    };

    const handleClear = () => {
        setFilters({ location: '', min_price: '', max_price: '', bhk: '' });
        setSearchQuery('');
        setSortBy('newest');
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleViewDetails = (property) => {
        setSelectedProperty(property);
    };

    const handleContactSupport = () => {
        setShowContactModal(true);
    };

    const handleCallNumber = (number) => {
        window.open(`tel:${number}`, '_self');
    };

    const handleWhatsApp = (number) => {
        const message = "Hi, I'm interested in knowing more about properties on your website.";
        window.open(`https://wa.me/${number.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 pt-28">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-4">
                            Discover Your Dream Home
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            Explore {allDummyListings.length}+ carefully curated properties. Find the perfect match for your lifestyle.
                        </p>
                    </motion.div>

                    {/* Enhanced Search and Filter Section */}
                    <motion.div
                        variants={filterVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 mb-12"
                    >
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by location or description..."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    className="w-full p-4 pl-12 rounded-xl bg-gray-700 border border-gray-600 text-text-light placeholder-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted">
                                    🔍
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => loadProperties(filters)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-primary text-white px-6 py-2 rounded-lg font-semibold transition-all"
                                >
                                    Search
                                </motion.button>
                            </div>
                        </div>

                        <form onSubmit={handleSearch}>
                            {/* Filter Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">📍 Location</label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        placeholder="Enter locality..." 
                                        value={filters.location} 
                                        onChange={handleFilterChange} 
                                        className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-text-light placeholder-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">💰 Min Price (L)</label>
                                    <input 
                                        type="number" 
                                        name="min_price" 
                                        placeholder="Min" 
                                        value={filters.min_price} 
                                        onChange={handleFilterChange} 
                                        className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-text-light placeholder-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">💰 Max Price (L)</label>
                                    <input 
                                        type="number" 
                                        name="max_price" 
                                        placeholder="Max" 
                                        value={filters.max_price} 
                                        onChange={handleFilterChange} 
                                        className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-text-light placeholder-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">🏠 BHK Type</label>
                                    <select 
                                        name="bhk" 
                                        value={filters.bhk} 
                                        onChange={handleFilterChange} 
                                        className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-text-light focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    >
                                        <option value="">Any BHK</option>
                                        <option value="1">1 BHK</option>
                                        <option value="2">2 BHK</option>
                                        <option value="3">3 BHK</option>
                                        <option value="4">4+ BHK</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">📊 Sort By</label>
                                    <select 
                                        value={sortBy} 
                                        onChange={handleSortChange}
                                        className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-text-light focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="area">Largest Area</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <motion.button 
                                    type="button" 
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClear} 
                                    className="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <span>🔄</span>
                                    Clear All
                                </motion.button>
                                
                                <motion.button 
                                    type="submit" 
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 bg-gradient-to-r from-brand-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all shadow-lg flex items-center gap-2"
                                >
                                    <span>🚀</span>
                                    Apply Filters
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Results Summary */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-brand-primary mb-2">
                                {properties.length} Properties Found
                            </h3>
                            <p className="text-text-muted">
                                {filters.location && `in ${filters.location} • `}
                                {filters.bhk && `${filters.bhk} BHK • `}
                                {filters.min_price && `From ₹${filters.min_price}L`}
                                {filters.max_price && ` to ₹${filters.max_price}L`}
                            </p>
                        </div>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="mt-4 sm:mt-0 px-4 py-2 bg-brand-primary/20 rounded-full border border-brand-primary/30"
                        >
                            <span className="text-brand-accent text-sm font-semibold">
                                Sorted by: {sortBy.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Property Listings Grid */}
                    {loading ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 1.5, repeat: Infinity }
                                }}
                                className="inline-block w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full mb-4"
                            />
                            <p className="text-brand-primary text-xl font-semibold">Discovering Amazing Properties...</p>
                            <p className="text-text-muted mt-2">Loading the best matches for you</p>
                        </motion.div>
                    ) : properties.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700"
                        >
                            <div className="text-8xl mb-6">🏠</div>
                            <h3 className="text-2xl font-bold text-text-light mb-4">No Properties Found</h3>
                            <p className="text-text-muted max-w-md mx-auto mb-6">
                                We couldn't find any properties matching your current filters. Try adjusting your search criteria.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClear}
                                className="bg-brand-primary text-white px-8 py-3 rounded-xl font-semibold transition-all"
                            >
                                Clear Filters & Show All
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            layout
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            <AnimatePresence mode="wait">
                                {properties.map((property, index) => (
                                    <motion.div 
                                        key={property.id} 
                                        layout
                                        custom={index}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="cursor-pointer"
                                    >
                                        <ListingCard 
                                            listing={property} 
                                            onViewDetails={() => handleViewDetails(property)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Enhanced Footer */}
                    {properties.length > 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-center mt-16 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700"
                        >
                            <h3 className="text-xl font-bold text-brand-accent mb-4">
                                Can't Find What You're Looking For?
                            </h3>
                            <p className="text-text-muted mb-6 max-w-2xl mx-auto">
                                Our property database is updated daily. Check back soon or contact our support team for personalized assistance.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClear}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                                >
                                    Show All Properties
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleContactSupport}
                                    className="px-6 py-3 bg-gradient-to-r from-brand-secondary to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2"
                                >
                                    <span>📞</span>
                                    Contact Support
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Property Details Modal */}
                <AnimatePresence>
                    {selectedProperty && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProperty(null)}
                        >
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700"
                            >
                                <div className="relative">
                                    <img 
                                        src={selectedProperty.image_url} 
                                        alt={selectedProperty.location}
                                        className="w-full h-64 object-cover rounded-t-3xl"
                                    />
                                    <button
                                        onClick={() => setSelectedProperty(null)}
                                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-brand-primary mb-2">
                                                {selectedProperty.bhk} BHK in {selectedProperty.location}
                                            </h2>
                                            <p className="text-2xl font-bold text-green-400 mb-2">
                                                ₹{selectedProperty.price} Lakhs
                                            </p>
                                            <p className="text-text-muted">{selectedProperty.area} sqft</p>
                                        </div>
                                        <div className="mt-4 lg:mt-0 bg-brand-primary/20 px-4 py-2 rounded-full border border-brand-primary/30">
                                            <span className="text-brand-accent font-semibold">
                                                Posted: {new Date(selectedProperty.postedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Property Details */}
                                        <div>
                                            <h3 className="text-xl font-semibold text-brand-accent mb-4">Property Details</h3>
                                            <p className="text-text-light mb-6 leading-relaxed">{selectedProperty.description}</p>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                                    <p className="text-text-muted text-sm">Furnishing</p>
                                                    <p className="text-text-light font-semibold">{selectedProperty.details.furnished}</p>
                                                </div>
                                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                                    <p className="text-text-muted text-sm">Parking</p>
                                                    <p className="text-text-light font-semibold">{selectedProperty.details.parking}</p>
                                                </div>
                                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                                    <p className="text-text-muted text-sm">Facing</p>
                                                    <p className="text-text-light font-semibold">{selectedProperty.details.facing}</p>
                                                </div>
                                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                                    <p className="text-text-muted text-sm">Property Age</p>
                                                    <p className="text-text-light font-semibold">{selectedProperty.details.age}</p>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="text-lg font-semibold text-brand-accent mb-3">Amenities</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProperty.amenities.map((amenity, index) => (
                                                        <span 
                                                            key={index}
                                                            className="px-3 py-1 bg-brand-primary/20 text-brand-accent rounded-full text-sm border border-brand-primary/30"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div>
                                            <h3 className="text-xl font-semibold text-brand-accent mb-4">Contact Agent</h3>
                                            <div className="bg-gray-700/30 p-6 rounded-2xl border border-gray-600 mb-6">
                                                <div className="text-center mb-4">
                                                    <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                                        {selectedProperty.contact.name.charAt(0)}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white">{selectedProperty.contact.name}</h4>
                                                    <p className="text-text-muted">{selectedProperty.contact.company}</p>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 bg-gray-600/50 rounded-lg">
                                                        <span className="text-text-light">📞 Phone</span>
                                                        <span className="text-brand-accent font-semibold">{selectedProperty.contact.phone}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-gray-600/50 rounded-lg">
                                                        <span className="text-text-light">📧 Email</span>
                                                        <span className="text-brand-accent font-semibold">{selectedProperty.contact.email}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 mt-6">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCallNumber(selectedProperty.contact.phone)}
                                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <span>📞</span>
                                                        Call Now
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleWhatsApp(selectedProperty.contact.phone)}
                                                        className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <span>💬</span>
                                                        WhatsApp
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Contact Support Modal */}
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
                                        <h2 className="text-2xl font-bold text-brand-accent mb-2">Contact Support</h2>
                                        <p className="text-text-muted">Get in touch with our team for assistance</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {supportContacts.map((contact, index) => (
                                            <motion.div
                                                key={contact.type}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-brand-primary/50 transition-all cursor-pointer group"
                                                onClick={() => handleCallNumber(contact.number)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{contact.icon}</span>
                                                    <div>
                                                        <p className="text-text-light font-semibold">{contact.type}</p>
                                                        <p className="text-brand-accent">{contact.number}</p>
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
                                            Available 24/7 for your convenience
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowContactModal(false)}
                                            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                                        >
                                            Close
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default PropertiesPage;