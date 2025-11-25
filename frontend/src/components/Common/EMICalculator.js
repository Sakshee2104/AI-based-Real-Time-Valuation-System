import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

// Helper to format currency
const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

// Reusable EMI Calculator Component with Enhanced Visuals
const EMICalculator = ({ initialLoanAmountLakhs }) => {
    // We convert the prop (in Lakhs) to the full currency amount
    const [loanAmount, setLoanAmount] = useState(initialLoanAmountLakhs * 100000);
    const [interestRate, setInterestRate] = useState(8.5);  // Default 8.5%
    const [loanTenure, setLoanTenure] = useState(20);      // Default 20 years
    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    // EMI breakdown data for charts
    const [emiBreakdown, setEmiBreakdown] = useState([]);
    const [yearlyBreakdown, setYearlyBreakdown] = useState([]);

    const calculateEmi = () => {
        const P = loanAmount;
        const R = interestRate / 100 / 12; // Monthly Interest Rate
        const N = loanTenure * 12;        // Total Months

        if (P > 0 && R > 0 && N > 0) {
            // EMI Formula
            const emiValue = P * R * (Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1));
            const roundedEmi = Math.round(emiValue);
            setEmi(roundedEmi);
            
            // Calculate total amounts
            const total = roundedEmi * N;
            const totalInt = total - P;
            setTotalInterest(totalInt);
            setTotalPayment(total);

            // Generate EMI breakdown for chart
            generateEmiBreakdown(P, R, N, roundedEmi);
            generateYearlyBreakdown(P, R, N, roundedEmi);
        } else {
            setEmi(0);
            setTotalInterest(0);
            setTotalPayment(0);
            setEmiBreakdown([]);
            setYearlyBreakdown([]);
        }
    };

    const generateEmiBreakdown = (principal, monthlyRate, months, monthlyEmi) => {
        const breakdown = [
            { name: 'Principal', value: principal, color: '#00C49F' },
            { name: 'Total Interest', value: monthlyEmi * months - principal, color: '#FF8042' }
        ];
        setEmiBreakdown(breakdown);
    };

    const generateYearlyBreakdown = (principal, monthlyRate, months, monthlyEmi) => {
        let balance = principal;
        const yearlyData = [];
        
        for (let year = 1; year <= loanTenure; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;
            
            for (let month = 1; month <= 12; month++) {
                if (balance <= 0) break;
                
                const interest = balance * monthlyRate;
                const principalPaid = monthlyEmi - interest;
                
                yearlyInterest += interest;
                yearlyPrincipal += principalPaid;
                balance -= principalPaid;
            }
            
            yearlyData.push({
                year: `Year ${year}`,
                principal: Math.round(yearlyPrincipal),
                interest: Math.round(yearlyInterest),
                balance: Math.max(0, Math.round(balance))
            });
        }
        
        setYearlyBreakdown(yearlyData.slice(0, 10)); // Show first 10 years
    };

    // Recalculate EMI whenever inputs change
    useEffect(() => {
        calculateEmi();
    }, [loanAmount, interestRate, loanTenure]);

    // Update internal loan amount if the property price (prop) changes
    useEffect(() => {
        setLoanAmount(initialLoanAmountLakhs * 100000);
    }, [initialLoanAmountLakhs]);

    const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-2xl shadow-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 mt-8"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <motion.h3 
                    className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    🏦 EMI Calculator
                </motion.h3>
                <motion.p 
                    className="text-gray-300 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{
                        scale: 1.05,
                        color: "#ffffff",
                        transition: { duration: 0.2 }
                    }}
                >
                    Calculate your monthly payments and interest breakdown
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Inputs and Results */}
                <div className="space-y-6">
                    {/* EMI Result Display */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
                        <div className="relative z-10">
                            <motion.p 
                                className="text-sm font-medium mb-2 text-gray-300"
                                whileHover={{
                                    scale: 1.05,
                                    color: "#ffffff",
                                    textShadow: "0px 0px 8px rgba(255,255,255,0.5)"
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                Estimated Monthly EMI
                            </motion.p>
                            <motion.p 
                                key={emi}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl font-extrabold text-green-400 mb-4"
                            >
                                {formatCurrency(emi)}
                            </motion.p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <motion.div 
                                    className="text-center p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: "rgba(55, 65, 81, 0.7)",
                                        borderColor: "#4B5563"
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.p 
                                        className="text-gray-300"
                                        whileHover={{ color: "#ffffff" }}
                                    >
                                        Loan Amount
                                    </motion.p>
                                    <p className="font-bold text-white">{formatCurrency(loanAmount)}</p>
                                </motion.div>
                                <motion.div 
                                    className="text-center p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: "rgba(55, 65, 81, 0.7)",
                                        borderColor: "#4B5563"
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.p 
                                        className="text-gray-300"
                                        whileHover={{ color: "#ffffff" }}
                                    >
                                        Total Interest
                                    </motion.p>
                                    <p className="font-bold text-red-400">{formatCurrency(totalInterest)}</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Input Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700"
                    >
                        {/* Loan Amount */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <motion.label 
                                    className="block text-sm font-medium text-gray-300"
                                    whileHover={{
                                        color: "#ffffff",
                                        scale: 1.02,
                                        textShadow: "0px 0px 6px rgba(255,255,255,0.4)"
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    💰 Loan Amount
                                </motion.label>
                                <span className="text-brand-accent font-bold text-lg">
                                    {formatCurrency(loanAmount)}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min={initialLoanAmountLakhs * 50000} // 50% of price
                                max={initialLoanAmountLakhs * 100000} // 100% of price
                                step="100000" 
                                value={loanAmount} 
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-gradient"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>50%</motion.span>
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>75%</motion.span>
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>100%</motion.span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <motion.label 
                                    className="block text-sm font-medium text-gray-300"
                                    whileHover={{
                                        color: "#ffffff",
                                        scale: 1.02,
                                        textShadow: "0px 0px 6px rgba(255,255,255,0.4)"
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    📈 Interest Rate
                                </motion.label>
                                <span className="text-red-400 font-bold text-lg">
                                    {interestRate}%
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="6.0" max="14.0" step="0.1" 
                                value={interestRate} 
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-gradient"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>6%</motion.span>
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>10%</motion.span>
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>14%</motion.span>
                            </div>
                        </div>

                        {/* Loan Tenure */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <motion.label 
                                    className="block text-sm font-medium text-gray-300"
                                    whileHover={{
                                        color: "#ffffff",
                                        scale: 1.02,
                                        textShadow: "0px 0px 6px rgba(255,255,255,0.4)"
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    ⏰ Loan Tenure
                                </motion.label>
                                <span className="text-blue-400 font-bold text-lg">
                                    {loanTenure} Years
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="5" max="30" step="1" 
                                value={loanTenure} 
                                onChange={(e) => setLoanTenure(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-gradient"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>5Y</motion.span>
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>15Y</motion.span>
                                <motion.span whileHover={{ color: "#ffffff", scale: 1.1 }}>30Y</motion.span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <motion.div 
                            className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/30"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.2)"
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-2xl mb-2">💰</div>
                            <motion.p 
                                className="text-sm text-gray-300 mb-1"
                                whileHover={{ color: "#ffffff" }}
                            >
                                Total Payment
                            </motion.p>
                            <p className="font-bold text-green-400">{formatCurrency(totalPayment)}</p>
                        </motion.div>
                        <motion.div 
                            className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/30"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.2)"
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-2xl mb-2">📊</div>
                            <motion.p 
                                className="text-sm text-gray-300 mb-1"
                                whileHover={{ color: "#ffffff" }}
                            >
                                Total Interest
                            </motion.p>
                            <p className="font-bold text-red-400">{formatCurrency(totalInterest)}</p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Column - Charts and Visualizations */}
                <div className="space-y-6">
                    {/* EMI Breakdown Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 bg-gray-800/50 rounded-xl border border-gray-700"
                    >
                        <motion.h4 
                            className="text-lg font-semibold mb-4 text-center text-gray-200"
                            whileHover={{
                                color: "#ffffff",
                                scale: 1.02,
                                textShadow: "0px 0px 8px rgba(255,255,255,0.3)"
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            💸 Payment Breakdown
                        </motion.h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={emiBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {emiBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), 'Amount']}
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

                    {/* Yearly Breakdown Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="p-6 bg-gray-800/50 rounded-xl border border-gray-700"
                    >
                        <motion.h4 
                            className="text-lg font-semibold mb-4 text-center text-gray-200"
                            whileHover={{
                                color: "#ffffff",
                                scale: 1.02,
                                textShadow: "0px 0px 8px rgba(255,255,255,0.3)"
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            📅 Yearly Payment Split
                        </motion.h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={yearlyBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), 'Amount']}
                                    contentStyle={{ 
                                        backgroundColor: '#1F2937', 
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="principal" fill="#00C49F" name="Principal" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="interest" fill="#FF8042" name="Interest" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Interest vs Principal Over Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="p-6 bg-gray-800/50 rounded-xl border border-gray-700"
                    >
                        <motion.h4 
                            className="text-lg font-semibold mb-4 text-center text-gray-200"
                            whileHover={{
                                color: "#ffffff",
                                scale: 1.02,
                                textShadow: "0px 0px 8px rgba(255,255,255,0.3)"
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            📊 Interest vs Principal Trend
                        </motion.h4>
                        <ResponsiveContainer width="100%" height={150}>
                            <AreaChart data={yearlyBreakdown}>
                                <defs>
                                    <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#00C49F" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#FF8042" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="year" stroke="#9CA3AF" fontSize={10} />
                                <YAxis stroke="#9CA3AF" fontSize={10} />
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), 'Amount']}
                                    contentStyle={{ 
                                        backgroundColor: '#1F2937', 
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                />
                                <Area type="monotone" dataKey="principal" stroke="#00C49F" fill="url(#principalGradient)" name="Principal" />
                                <Area type="monotone" dataKey="interest" stroke="#FF8042" fill="url(#interestGradient)" name="Interest" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </div>

            {/* Additional Insights */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/30"
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-xl mb-2">🎯</div>
                    <motion.p 
                        className="text-sm text-gray-300 mb-1"
                        whileHover={{ color: "#ffffff" }}
                    >
                        Interest to Principal Ratio
                    </motion.p>
                    <p className="font-bold text-blue-400">
                        {totalInterest > 0 ? ((totalInterest / loanAmount) * 100).toFixed(1) : 0}%
                    </p>
                </motion.div>
                <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/30"
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-xl mb-2">⚡</div>
                    <motion.p 
                        className="text-sm text-gray-300 mb-1"
                        whileHover={{ color: "#ffffff" }}
                    >
                        Avg. Monthly Interest
                    </motion.p>
                    <p className="font-bold text-purple-400">
                        {formatCurrency(Math.round(totalInterest / (loanTenure * 12)))}
                    </p>
                </motion.div>
                <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/30"
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-xl mb-2">💰</div>
                    <motion.p 
                        className="text-sm text-gray-300 mb-1"
                        whileHover={{ color: "#ffffff" }}
                    >
                        Loan to Value Ratio
                    </motion.p>
                    <p className="font-bold text-orange-400">
                        {((loanAmount / (initialLoanAmountLakhs * 100000)) * 100).toFixed(0)}%
                    </p>
                </motion.div>
            </motion.div>

            {/* CSS for gradient slider */}
            <style jsx>{`
                .slider-gradient {
                    background: linear-gradient(to right, #6366F1, #8B5CF6, #EC4899);
                }
                .slider-gradient::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #00C49F;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 10px rgba(0, 196, 159, 0.3);
                }
                .slider-gradient::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #00C49F;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    boxShadow: 0 2px 10px rgba(0, 196, 159, 0.3);
                }
            `}</style>
        </motion.div>
    );
};

export default EMICalculator;