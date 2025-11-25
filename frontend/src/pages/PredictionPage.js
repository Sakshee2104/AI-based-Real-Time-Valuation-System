import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
    AreaChart, Area
} from 'recharts';

// --- Page Components ---
import PageTransition from '../components/Common/PageTransition';
import ListingCard from '../components/Listings/ListingCard';
import EMICalculator from '../components/Common/EMICalculator'; 
import { predictPrice, fetchCMA } from '../api/propertyApi'; 

// --- MAP IMPORTS with FIXES ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fixed Leaflet icon setup
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
});

// Custom icon to avoid issues
const customIcon = new L.Icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- Map Controller Component to handle map operations ---
const MapController = ({ center, zoom }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center && map) {
            // Use setTimeout to ensure map is fully initialized
            const timer = setTimeout(() => {
                map.setView(center, zoom, {
                    animate: true,
                    duration: 1
                });
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [center, zoom, map]);

    return null;
};

// --- Geocoded Data ---
const GEO_LOCATIONS = [
    { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
    { name: 'Koramangala', lat: 12.9351, lng: 77.6244 },
    { name: 'Sarjapur', lat: 12.9121, lng: 77.7800 },
    { name: 'Hebbal', lat: 13.0355, lng: 77.5971 },
    { name: 'Electronic City', lat: 12.8452, lng: 77.6602 },
    { name: 'HSR Layout', lat: 12.9121, lng: 77.6446 },
    { name: 'Yelahanka', lat: 13.1006, lng: 77.5963 },
    { name: 'Marathahalli', lat: 12.9591, lng: 77.7013 }
];

const KNOWN_LOCATIONS = [...GEO_LOCATIONS.map(loc => loc.name), 'Other'];

// --- Sample Data for Enhanced Visualizations ---
const PRICE_TREND_DATA = [
    { month: 'Jan', price: 85, demand: 65 },
    { month: 'Feb', price: 88, demand: 70 },
    { month: 'Mar', price: 92, demand: 75 },
    { month: 'Apr', price: 95, demand: 80 },
    { month: 'May', price: 98, demand: 78 },
    { month: 'Jun', price: 102, demand: 82 }
];

const LOCATION_DISTRIBUTION = [
    { name: 'Whitefield', value: 25 },
    { name: 'Koramangala', value: 20 },
    { name: 'HSR Layout', value: 15 },
    { name: 'Sarjapur', value: 12 },
    { name: 'Electronic City', value: 10 },
    { name: 'Others', value: 18 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// --- Enhanced CMA Section with Graphs ---
const CMASection = ({ predictedPrice, listings, formData }) => {
    const safeListings = listings || [];
    
    // Price comparison data
    const priceComparisonData = [
        { name: 'Your Property', price: predictedPrice },
        { name: 'Area Average', price: predictedPrice * 0.9 },
        { name: 'Premium Properties', price: predictedPrice * 1.2 },
        { name: 'Budget Properties', price: predictedPrice * 0.8 }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-12 space-y-8"
        >
            {/* Main Price Result */}
            <div className="text-center p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-4">AI Price Prediction Result</h2>
                    <div className="flex items-center justify-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="text-4xl"
                        >
                            🏠
                        </motion.div>
                        <div>
                            <p className="text-white/80 text-lg">Estimated Market Value</p>
                            <motion.h3 
                                className="text-5xl font-extrabold text-white mt-2"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7, type: "spring" }}
                            >
                                ₹{predictedPrice}L
                            </motion.h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
                >
                    <h3 className="text-xl font-bold text-brand-primary mb-4">Market Price Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={PRICE_TREND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: 'white'
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#8884d8" 
                                fill="#8884d8" 
                                fillOpacity={0.3}
                                name="Price (Lakhs)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Price Comparison Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
                >
                    <h3 className="text-xl font-bold text-brand-primary mb-4">Price Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={priceComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: 'white'
                                }}
                            />
                            <Bar 
                                dataKey="price" 
                                fill="#00C49F"
                                radius={[4, 4, 0, 0]}
                            >
                                {priceComparisonData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Location Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
                >
                    <h3 className="text-xl font-bold text-brand-primary mb-4">Location Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={LOCATION_DISTRIBUTION}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {LOCATION_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: 'white'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Property Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
                >
                    <h3 className="text-xl font-bold text-brand-primary mb-4">Property Metrics</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Price per Sq Ft', value: `₹${Math.round(predictedPrice * 100000 / formData.area)}`, icon: '📐' },
                            { label: 'Investment Potential', value: 'High', icon: '📈' },
                            { label: 'Rental Yield', value: '3.2%', icon: '💰' },
                            { label: 'Market Demand', value: 'Growing', icon: '🔥' }
                        ].map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 + index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{metric.icon}</span>
                                    <span className="text-text-light">{metric.label}</span>
                                </div>
                                <span className="font-bold text-brand-accent">{metric.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Property Listings */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <h3 className="text-2xl font-bold text-brand-primary mb-6 text-center">
                    Similar Properties in {formData.location}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {safeListings.map((listing, index) => (
                        <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 + index * 0.1 }}
                        >
                            <ListingCard listing={listing} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Property Comparison Component ---
const PropertyComparison = ({ currentProperty, similarProperties }) => {
    const comparisonData = [
        {
            feature: 'Price',
            current: `₹${currentProperty.price}L`,
            comp1: '₹85L',
            comp2: '₹92L'
        },
        {
            feature: 'Area',
            current: `${currentProperty.area} sq ft`,
            comp1: '1200 sq ft',
            comp2: '1400 sq ft'
        },
        {
            feature: 'BHK',
            current: currentProperty.bhk,
            comp1: '2 BHK',
            comp2: '3 BHK'
        },
        {
            feature: 'Price/Sq Ft',
            current: `₹${Math.round(currentProperty.price * 100000 / currentProperty.area)}`,
            comp1: '₹7,083',
            comp2: '₹6,571'
        },
        {
            feature: 'Location Score',
            current: '8.5/10',
            comp1: '7.8/10',
            comp2: '8.2/10'
        },
        {
            feature: 'Amenities',
            current: 'Pool, Gym, Park',
            comp1: 'Gym, Park',
            comp2: 'Pool, Gym, Club'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 bg-gray-800 p-6 rounded-2xl border border-gray-700"
        >
            <h3 className="text-2xl font-bold text-brand-primary mb-6 text-center">
                Property Comparison
            </h3>
            
            <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="text-left p-4 text-text-light font-semibold">Features</th>
                            <th className="text-left p-4 text-brand-accent font-semibold">Your Property</th>
                            <th className="text-left p-4 text-blue-400 font-semibold">Similar Property 1</th>
                            <th className="text-left p-4 text-green-400 font-semibold">Similar Property 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonData.map((row, index) => (
                            <motion.tr 
                                key={row.feature}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="p-4 text-text-light font-medium">{row.feature}</td>
                                <td className="p-4 text-brand-accent font-bold">{row.current}</td>
                                <td className="p-4 text-blue-400">{row.comp1}</td>
                                <td className="p-4 text-green-400">{row.comp2}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Comparison Chart */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-text-light mb-4">Price Comparison Chart</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                        { name: 'Your Property', price: currentProperty.price },
                        { name: 'Similar 1', price: 85 },
                        { name: 'Similar 2', price: 92 }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '0.5rem',
                                color: 'white'
                            }}
                        />
                        <Bar 
                            dataKey="price" 
                            radius={[4, 4, 0, 0]}
                        >
                            <Cell fill="#00C49F" />
                            <Cell fill="#0088FE" />
                            <Cell fill="#FFBB28" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

// --- FIXED Map Component ---
const PredictionMap = ({ locationName }) => {
    const [mapReady, setMapReady] = useState(false);
    const mapRef = useRef();

    const selectedLocation = GEO_LOCATIONS.find(loc => loc.name === locationName);

    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            setMapReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (!selectedLocation) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center text-text-muted p-8 bg-gray-800 rounded-2xl"
            >
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-text-light">Map View Unavailable</h3>
                <p>Detailed map view is not available for 'Other' locations.</p>
            </motion.div>
        );
    }

    const position = [selectedLocation.lat, selectedLocation.lng];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-12"
        >
            <h2 className="text-3xl font-bold text-text-light text-center mb-6">
                📍 Property Location: {locationName}
            </h2>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700">
                {mapReady && (
                    <MapContainer 
                        center={position} 
                        zoom={14} 
                        style={{ height: '50vh', width: '100%', borderRadius: '1rem' }}
                        whenCreated={(mapInstance) => {
                            mapRef.current = mapInstance;
                            // Force a resize after a small delay
                            setTimeout(() => {
                                if (mapInstance) {
                                    mapInstance.invalidateSize();
                                }
                            }, 200);
                        }}
                        className="z-0" // Ensure proper z-index
                    >
                        <MapController center={position} zoom={14} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position} icon={customIcon}>
                            <Popup>
                                <div className="text-black p-2">
                                    <strong className="text-lg">{selectedLocation.name}</strong>
                                    <br />
                                    <span className="text-sm text-gray-600">Prime Location</span>
                                    <br />
                                    <span className="text-sm text-green-600">⭐ Premium Area</span>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                )}
                
                {/* Location Insights */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Connectivity', value: 'Excellent', icon: '🚗' },
                        { label: 'Schools', value: '8+ Nearby', icon: '🏫' },
                        { label: 'Hospitals', value: '5+ Nearby', icon: '🏥' },
                        { label: 'Shopping', value: '10+ Malls', icon: '🛍️' }
                    ].map((insight, index) => (
                        <motion.div
                            key={insight.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-center p-3 bg-gray-700/50 rounded-lg"
                        >
                            <div className="text-2xl mb-2">{insight.icon}</div>
                            <div className="text-sm text-text-light">{insight.label}</div>
                            <div className="font-bold text-brand-accent">{insight.value}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Page Component ---
const PredictionPage = () => {
    const [predictionResult, setPredictionResult] = useState(null);
    const [cmaData, setCmaData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ 
        location: KNOWN_LOCATIONS[0], 
        bhk: 3, 
        area: 1500 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPredictionResult(null);
        setCmaData([]);

        try {
            const predictionData = await predictPrice(formData); 
            const cmaListings = await fetchCMA(formData.location, formData.bhk);
            
            setPredictionResult(predictionData.predicted_price);
            setCmaData(cmaListings);

        } catch (err) {
            console.error("Prediction/CMA Error:", err);
            setError(err.message || "Failed to fetch prediction. Check API connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 pt-24">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Enhanced Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-4">
                            🏠 AI Property Price Predictor
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            Get accurate market predictions, comparative analysis, and investment insights powered by AI
                        </p>
                    </motion.div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
                        {/* Enhanced Prediction Form */}
                        <motion.form 
                            onSubmit={handleSubmit} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 p-8 border border-gray-700 rounded-2xl bg-gray-800/50 backdrop-blur-sm"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Location Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">
                                        📍 Location
                                    </label>
                                    <select 
                                        value={formData.location} 
                                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-text-light placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                        required
                                    >
                                        <option value="" disabled>Select Location</option>
                                        {KNOWN_LOCATIONS.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* BHK Input */}
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">
                                        🏘️ BHK Configuration
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="BHK" 
                                        value={formData.bhk} 
                                        onChange={(e) => setFormData({...formData, bhk: parseInt(e.target.value) || 1})} 
                                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-text-light placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                        required 
                                        min="1"
                                        max="10"
                                    />
                                </div>
                                
                                {/* Area Input */}
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">
                                        📐 Area (sq ft)
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="Area (sq ft)" 
                                        value={formData.area} 
                                        onChange={(e) => setFormData({...formData, area: parseInt(e.target.value) || 100})} 
                                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-text-light placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                        required 
                                        min="100"
                                        max="10000"
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-brand-primary to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Analyzing Market Data...
                                    </>
                                ) : (
                                    <>
                                        <span>🚀 Get AI Prediction & Analysis</span>
                                    </>
                                )}
                            </motion.button>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </motion.form>

                        {/* Results Section */}
                        <AnimatePresence>
                            {predictionResult && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="space-y-8 mt-8"
                                >
                                    <EMICalculator initialLoanAmountLakhs={predictionResult} />
                                    
                                    <PredictionMap locationName={formData.location} />
                                    
                                    <CMASection 
                                        predictedPrice={predictionResult} 
                                        listings={cmaData} 
                                        formData={formData}
                                    />
                                    
                                    <PropertyComparison 
                                        currentProperty={{ ...formData, price: predictionResult }}
                                        similarProperties={cmaData}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PredictionPage;