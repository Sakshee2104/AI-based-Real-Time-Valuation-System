// FeatureExtraction.js (Conceptual Component - For Search Page Enhancement)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Data Simulation: Real-world market features extracted from the backend dataset ---
const fetchMarketFeatures = async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return {
        // Features derived from all active listings data
        popularBHKs: ['2 BHK', '3 BHK', '4 BHK'],
        trendingLocalities: [
            { name: 'Whitefield', count: 120, avgPrice: 95 }, 
            { name: 'Koramangala', count: 80, avgPrice: 160 },
            { name: 'Sarjapur', count: 150, avgPrice: 75 }
        ],
        recentPriceIndices: [1.2, 0.8, 1.5], // Quarterly price change index
    };
};

const FeatureExtraction = ({ onFeatureSelect }) => {
    const [features, setFeatures] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMarketFeatures().then(data => {
            setFeatures(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <p className="text-center text-text-muted">Analyzing Market Trends...</p>;
    if (!features) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-bg-dark-card rounded-xl shadow-lg mb-6 border border-brand-accent/30">
            <h4 className="text-xl font-bold text-brand-accent mb-3">🔥 Data-Driven Market Insights</h4>
            
            {/* Intelligent BHK Filters */}
            <div className="mb-3">
                <p className="text-sm font-medium text-text-muted mb-1">Popular Configurations:</p>
                <div className="flex flex-wrap gap-2">
                    {features.popularBHKs.map(bhk => (
                        <motion.button
                            key={bhk}
                            onClick={() => onFeatureSelect('bhk', bhk)}
                            whileHover={{ scale: 1.05 }}
                            className="text-xs bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full font-semibold border border-brand-primary hover:bg-brand-primary hover:text-white transition"
                        >
                            {bhk}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Trending Localities */}
            <div>
                <p className="text-sm font-medium text-text-muted mb-1">Trending Localities:</p>
                <div className="space-y-1">
                    {features.trendingLocalities.slice(0, 3).map(loc => (
                        <div key={loc.name} className="flex justify-between text-sm text-text-light hover:text-white cursor-pointer" onClick={() => onFeatureSelect('location', loc.name)}>
                            <span>{loc.name} ({loc.count} listings)</span>
                            <span className="text-green-400 font-semibold">Avg: ₹{loc.avgPrice} L</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureExtraction;