import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/Common/PageTransition';

const LoanCalculatorPage = () => {
    // State for inputs
    const [loanAmount, setLoanAmount] = useState(5000000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [loanTenure, setLoanTenure] = useState(20);
    const [monthlyIncome, setMonthlyIncome] = useState(100000);
    
    // State for outputs
    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [affordabilityStatus, setAffordabilityStatus] = useState('');
    const [chartData, setChartData] = useState([]);

    // Helper to format currency
    const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    // Calculate EMI and other metrics
    const calculateEmi = () => {
        const P = loanAmount;
        const R = interestRate / 100 / 12;
        const N = loanTenure * 12;

        if (P > 0 && R > 0 && N > 0) {
            const emiValue = P * R * (Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1));
            const totalPaymentValue = emiValue * N;
            const totalInterestValue = totalPaymentValue - P;
            
            setEmi(Math.round(emiValue));
            setTotalPayment(Math.round(totalPaymentValue));
            setTotalInterest(Math.round(totalInterestValue));
            checkAffordability(emiValue);
            generateChartData(P, totalInterestValue);
        }
    };

    const checkAffordability = (monthlyPayment) => {
        const maxAffordableEmi = monthlyIncome * 0.40;
        const emiPercentage = (monthlyPayment / monthlyIncome) * 100;
        
        if (emiPercentage <= 40) {
            setAffordabilityStatus(`Affordable (${emiPercentage.toFixed(1)}% of income)`);
        } else if (emiPercentage <= 60) {
            setAffordabilityStatus(`Moderate (${emiPercentage.toFixed(1)}% of income)`);
        } else {
            setAffordabilityStatus(`Stretched (${emiPercentage.toFixed(1)}% of income)`);
        }
    };

    const generateChartData = (principal, interest) => {
        setChartData([
            { name: 'Principal', value: principal, color: '#3B82F6' },
            { name: 'Interest', value: interest, color: '#EF4444' }
        ]);
    };

    useEffect(() => {
        calculateEmi();
    }, [loanAmount, interestRate, loanTenure, monthlyIncome]);

    // Pie Chart Component
    const PieChart = ({ data, size = 120 }) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let accumulatedAngle = 0;

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {data.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    const x1 = size/2 + (size/2) * Math.cos(accumulatedAngle * Math.PI / 180);
                    const y1 = size/2 + (size/2) * Math.sin(accumulatedAngle * Math.PI / 180);
                    
                    accumulatedAngle += angle;
                    
                    const x2 = size/2 + (size/2) * Math.cos(accumulatedAngle * Math.PI / 180);
                    const y2 = size/2 + (size/2) * Math.sin(accumulatedAngle * Math.PI / 180);

                    return (
                        <path
                            key={index}
                            d={`M ${size/2} ${size/2} L ${x1} ${y1} A ${size/2} ${size/2} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={item.color}
                            stroke="#1F2937"
                            strokeWidth="2"
                        />
                    );
                })}
                <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle" 
                      className="text-xs font-bold fill-white">
                    Total
                </text>
            </svg>
        );
    };

    // Progress Bar Component
    const ProgressBar = ({ percentage, label, color }) => (
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">{label}</span>
                <span className="font-semibold">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-2 rounded-full ${color}`}
                />
            </div>
        </div>
    );

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto py-10 px-4 text-text-light pt-24">
                <motion.h1 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl font-extrabold text-brand-primary mb-8 text-center"
                >
                    EMI & Home Loan Affordability Predictor
                </motion.h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT SIDE: INPUT FORM --- */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="lg:col-span-1 bg-bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700"
                    >
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Calculate Your EMI</h3>
                        
                        {/* Loan Amount */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-text-muted">Loan Amount</label>
                                <span className="text-brand-accent font-bold">{formatCurrency(loanAmount)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1000000" 
                                max="20000000" 
                                step="500000" 
                                value={loanAmount} 
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full accent-brand-accent"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-1">
                                <span>10L</span>
                                <span>2Cr</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-text-muted">Interest Rate</label>
                                <span className="text-brand-accent font-bold">{interestRate}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="6.0" 
                                max="14.0" 
                                step="0.1" 
                                value={interestRate} 
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full accent-brand-accent"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-1">
                                <span>6%</span>
                                <span>14%</span>
                            </div>
                        </div>

                        {/* Loan Tenure */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-text-muted">Loan Tenure</label>
                                <span className="text-brand-accent font-bold">{loanTenure} Years</span>
                            </div>
                            <input 
                                type="range" 
                                min="5" 
                                max="30" 
                                step="1" 
                                value={loanTenure} 
                                onChange={(e) => setLoanTenure(Number(e.target.value))}
                                className="w-full accent-brand-accent"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-1">
                                <span>5Y</span>
                                <span>30Y</span>
                            </div>
                        </div>
                        
                        {/* Monthly Income */}
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-brand-primary mb-4">Affordability Check</h3>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-text-muted">Monthly Income</label>
                                <span className="text-brand-accent font-bold">{formatCurrency(monthlyIncome)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="25000" 
                                max="500000" 
                                step="5000" 
                                value={monthlyIncome} 
                                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                className="w-full accent-green-500"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-1">
                                <span>25K</span>
                                <span>5L</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- MIDDLE: RESULTS & CHARTS --- */}
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Main Results Card */}
                        <div className="bg-bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* EMI Display */}
                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                    <p className="text-sm font-medium text-text-muted mb-2">Monthly EMI</p>
                                    <motion.p 
                                        key={emi}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-3xl font-extrabold text-green-500"
                                    >
                                        {formatCurrency(emi)}
                                    </motion.p>
                                </div>

                                {/* Total Interest */}
                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                    <p className="text-sm font-medium text-text-muted mb-2">Total Interest</p>
                                    <motion.p 
                                        key={totalInterest}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-2xl font-bold text-red-400"
                                    >
                                        {formatCurrency(totalInterest)}
                                    </motion.p>
                                </div>

                                {/* Total Payment */}
                                <div className="text-center p-4 bg-gray-800 rounded-lg">
                                    <p className="text-sm font-medium text-text-muted mb-2">Total Payment</p>
                                    <motion.p 
                                        key={totalPayment}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-2xl font-bold text-blue-400"
                                    >
                                        {formatCurrency(totalPayment)}
                                    </motion.p>
                                </div>
                            </div>

                            {/* Affordability Status */}
                            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-text-muted mb-2">Affordability Status</p>
                                <p className={`text-xl font-bold ${
                                    affordabilityStatus.includes('Affordable') ? 'text-green-500' : 
                                    affordabilityStatus.includes('Moderate') ? 'text-yellow-500' : 'text-red-500'
                                }`}>
                                    {affordabilityStatus}
                                </p>
                                <ProgressBar 
                                    percentage={Math.min((emi / monthlyIncome) * 100, 100)} 
                                    label="EMI as % of Income" 
                                    color={
                                        (emi / monthlyIncome) * 100 <= 40 ? 'bg-green-500' : 
                                        (emi / monthlyIncome) * 100 <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }
                                />
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Pie Chart Card */}
                            <div className="bg-bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                                <h3 className="text-xl font-bold text-brand-accent mb-4">Payment Breakdown</h3>
                                <div className="flex items-center justify-center">
                                    <PieChart data={chartData} size={140} />
                                </div>
                                <div className="mt-4 space-y-2">
                                    {chartData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div 
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm text-text-muted">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Yearly Breakdown */}
                            <div className="bg-bg-dark-card p-6 rounded-xl shadow-2xl border border-gray-700">
                                <h3 className="text-xl font-bold text-brand-accent mb-4">Yearly Overview</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted">Principal Amount</span>
                                        <span className="font-semibold text-blue-400">{formatCurrency(loanAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted">Interest Payable</span>
                                        <span className="font-semibold text-red-400">{formatCurrency(totalInterest)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-600 pt-2">
                                        <span className="text-text-muted font-semibold">Total Payment</span>
                                        <span className="font-bold text-white">{formatCurrency(totalPayment)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted">Loan Tenure</span>
                                        <span className="font-semibold">{loanTenure} years</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default LoanCalculatorPage;