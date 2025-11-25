import React from 'react';
import { motion } from 'framer-motion';

// --- Mocks ---
const MOCK_PageTransition = ({ children }) => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{children}</motion.div>;
const MOCK_PredictionForm = () => (
    <div className="p-6 bg-gray-700 rounded-xl border border-gray-600">
        <h3 className="text-xl font-bold text-white mb-3">Property Input Form</h3>
        <p className="text-sm text-gray-300">Form to collect Location, BHK, Area, etc. to send to the ML backend.</p>
    </div>
);

const CMASection = ({ predictionData }) => {
    const predictedPrice = predictionData?.price || '95.00'; // Mock result
    const comparableProperties = predictionData?.comparables || [
        { id: 1, location: 'Whitefield East', price: 92.5, diff: '-2.5L' },
        { id: 2, location: 'Whitefield Central', price: 98.0, diff: '+3.0L' },
        { id: 3, location: 'Varthur Road', price: 88.0, diff: '-7.0L' },
    ];

    return (
        <MOCK_PageTransition>
            <div className="max-w-4xl mx-auto py-12 px-4 text-gray-200">
                <h1 className="text-4xl font-extrabold text-orange-500 mb-6">Price Prediction Result 📈</h1>
                
                <div className="p-8 bg-gray-800 rounded-xl shadow-lg border-l-8 border-orange-500 mb-8">
                    <p className="text-xl text-gray-400 mb-2">Predicted Market Value:</p>
                    <h2 className="text-6xl font-extrabold text-green-500">
                        ₹{predictedPrice} <span className="text-3xl text-green-500">Lakhs</span>
                    </h2>
                    <p className="text-gray-500 mt-2">Based on analysis of similar properties and the ML model.</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Comparative Market Analysis (CMA)</h3>
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700/50">
                            <tr>
                                {['Property', 'Price (L)', 'Difference'].map((header) => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {comparableProperties.map(item => (
                                <tr key={item.id} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-md font-bold text-white">₹{item.price}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.diff.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{item.diff}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MOCK_PageTransition>
    );
};

export default CMASection;
