import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/Common/PageTransition';

// Conversion factors (relative to 1 Sq Ft)
const CONVERSIONS = {
    sqft: 1,
    sqmeter: 0.092903,
    sqyard: 0.111111,
    acre: 0.0000229568,
    bigha: 0.000036,
    hectare: 0.0000092903,
};

const AreaConverterPage = () => {
    const [values, setValues] = useState({
        sqft: 1000,
        sqmeter: 92.90,
        sqyard: 111.11,
        acre: 0.023,
        bigha: 0.036,
        hectare: 0.0093,
    });

    const [activeUnit, setActiveUnit] = useState('sqft');
    const [visualScale, setVisualScale] = useState(1);

    // Visual representation data
    const [visualData, setVisualData] = useState([]);

    const updateVisualData = (baseValue) => {
        const data = [
            { unit: 'Square Feet', value: baseValue, color: '#3B82F6', conversion: 1 },
            { unit: 'Square Meter', value: baseValue * CONVERSIONS.sqmeter, color: '#10B981', conversion: CONVERSIONS.sqmeter },
            { unit: 'Square Yard', value: baseValue * CONVERSIONS.sqyard, color: '#F59E0B', conversion: CONVERSIONS.sqyard },
            { unit: 'Acre', value: baseValue * CONVERSIONS.acre, color: '#EF4444', conversion: CONVERSIONS.acre },
            { unit: 'Bigha', value: baseValue * CONVERSIONS.bigha, color: '#8B5CF6', conversion: CONVERSIONS.bigha },
            { unit: 'Hectare', value: baseValue * CONVERSIONS.hectare, color: '#06B6D4', conversion: CONVERSIONS.hectare },
        ];
        setVisualData(data);
    };

    const handleConversion = (e) => {
        const { name, value } = e.target;
        const inputVal = parseFloat(value) || 0;
        let baseSqFt = inputVal;

        // Convert input to base (sq ft)
        switch (name) {
            case 'sqmeter':
                baseSqFt = inputVal / CONVERSIONS.sqmeter;
                break;
            case 'sqyard':
                baseSqFt = inputVal / CONVERSIONS.sqyard;
                break;
            case 'acre':
                baseSqFt = inputVal / CONVERSIONS.acre;
                break;
            case 'bigha':
                baseSqFt = inputVal / CONVERSIONS.bigha;
                break;
            case 'hectare':
                baseSqFt = inputVal / CONVERSIONS.hectare;
                break;
            default:
                baseSqFt = inputVal;
        }

        setActiveUnit(name);
        setValues({
            sqft: parseFloat(baseSqFt.toFixed(2)),
            sqmeter: parseFloat((baseSqFt * CONVERSIONS.sqmeter).toFixed(2)),
            sqyard: parseFloat((baseSqFt * CONVERSIONS.sqyard).toFixed(2)),
            acre: parseFloat((baseSqFt * CONVERSIONS.acre).toFixed(4)),
            bigha: parseFloat((baseSqFt * CONVERSIONS.bigha).toFixed(4)),
            hectare: parseFloat((baseSqFt * CONVERSIONS.hectare).toFixed(4)),
        });

        updateVisualData(baseSqFt);
        setVisualScale(Math.min(baseSqFt / 1000, 2)); // Scale for visualization
    };

    useEffect(() => {
        updateVisualData(values.sqft);
    }, []);

    // Visual Comparison Chart Component
    const ComparisonChart = () => {
        const maxValue = Math.max(...visualData.map(item => item.value));
        
        return (
            <div className="space-y-3">
                {visualData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-muted">{item.unit}</span>
                                <span className="font-semibold">{item.value.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Unit Card Component
    const UnitCard = ({ unit, value, label, isActive, color }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isActive 
                    ? 'border-brand-accent bg-gray-800' 
                    : 'border-gray-600 bg-gray-900 hover:border-gray-500'
            }`}
            onClick={() => {
                const input = document.querySelector(`input[name="${unit}"]`);
                if (input) input.focus();
            }}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-muted">{label}</span>
                <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-text-muted mt-1">
                {unit.toUpperCase()}
            </div>
        </motion.div>
    );

    // Visual Area Representation
    const AreaVisualization = () => {
        const baseSize = 80;
        const scaleFactor = visualScale;

        return (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl">
                <h3 className="text-lg font-bold text-brand-accent mb-4">Area Visualization</h3>
                <div className="relative flex items-center justify-center">
                    {/* Square Feet (Base) */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: scaleFactor }}
                        transition={{ duration: 0.5 }}
                        className="absolute border-2 border-blue-500 bg-blue-500/20 rounded"
                        style={{ width: baseSize, height: baseSize }}
                    />
                    
                    {/* Comparative sizes */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: scaleFactor * Math.sqrt(CONVERSIONS.sqmeter) }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute border-2 border-green-500 bg-green-500/20 rounded"
                        style={{ width: baseSize, height: baseSize }}
                    />
                    
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: scaleFactor * Math.sqrt(CONVERSIONS.sqyard) }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute border-2 border-yellow-500 bg-yellow-500/20 rounded"
                        style={{ width: baseSize, height: baseSize }}
                    />
                </div>
                
                <div className="mt-8 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 mr-1 rounded"></div>
                        <span>Sq Ft</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 mr-1 rounded"></div>
                        <span>Sq M</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 mr-1 rounded"></div>
                        <span>Sq Yd</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto py-10 px-4 text-text-light pt-24">
                <motion.h1 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl font-extrabold text-brand-primary mb-2 text-center"
                >
                    Area Unit Converter
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-muted text-center mb-8"
                >
                    Convert between different area measurement units with visual comparisons
                </motion.p>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Input & Unit Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Converter Card */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700"
                        >
                            <h3 className="text-2xl font-bold text-brand-accent mb-6">Convert Area Units</h3>
                            
                            {/* Input Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {Object.entries({
                                    sqft: 'Square Feet',
                                    sqmeter: 'Square Meter', 
                                    sqyard: 'Square Yard',
                                    acre: 'Acre',
                                    bigha: 'Bigha',
                                    hectare: 'Hectare'
                                }).map(([unit, label]) => (
                                    <div key={unit} className="relative">
                                        <label className="block text-sm font-medium text-text-muted mb-2">
                                            {label}
                                        </label>
                                        <input 
                                            type="number" 
                                            name={unit} 
                                            value={values[unit]} 
                                            onChange={handleConversion}
                                            className={`w-full p-3 bg-gray-800 rounded-lg text-text-light border-2 transition-all ${
                                                activeUnit === unit 
                                                    ? 'border-brand-accent bg-gray-700' 
                                                    : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Unit Cards Grid */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {visualData.map((item, index) => (
                                <UnitCard
                                    key={item.unit}
                                    unit={Object.keys(CONVERSIONS)[index]}
                                    value={values[Object.keys(CONVERSIONS)[index]]}
                                    label={item.unit}
                                    isActive={activeUnit === Object.keys(CONVERSIONS)[index]}
                                    color={item.color}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Column - Visualizations */}
                    <div className="space-y-6">
                        {/* Comparison Chart */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700"
                        >
                            <h3 className="text-xl font-bold text-brand-accent mb-4">Unit Comparison</h3>
                            <ComparisonChart />
                        </motion.div>

                        {/* Area Visualization */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <AreaVisualization />
                        </motion.div>

                        {/* Quick Reference */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gray-800 p-4 rounded-lg"
                        >
                            <h4 className="font-semibold text-brand-accent mb-2">Quick Reference</h4>
                            <div className="text-xs text-text-muted space-y-1">
                                <div>1 Sq Ft = 0.0929 Sq M</div>
                                <div>1 Sq M = 10.7639 Sq Ft</div>
                                <div>1 Acre = 43,560 Sq Ft</div>
                                <div>1 Hectare = 2.471 Acres</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default AreaConverterPage;