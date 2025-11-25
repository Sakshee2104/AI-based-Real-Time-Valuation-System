import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/Common/PageTransition';

const BuyingGuidesPage = () => {
    const [activeGuide, setActiveGuide] = useState('how-to-buy');

    const guides = {
        'how-to-buy': {
            title: "How to Buy Property",
            steps: [
                {
                    number: "01",
                    title: "Financial Planning",
                    description: "Determine your budget using our EMI calculator, arrange for down payment (typically 20-30%), and get pre-approved for home loans.",
                    tips: ["Check your credit score", "Calculate EMI affordability", "Plan for additional costs"]
                },
                {
                    number: "02",
                    title: "Location Research",
                    description: "Shortlist neighborhoods based on your budget, commute time, amenities, and future development plans.",
                    tips: ["Consider proximity to workplace", "Check infrastructure projects", "Research property appreciation trends"]
                },
                {
                    number: "03",
                    title: "Property Search & Shortlisting",
                    description: "Use our platform to find properties, schedule site visits, and compare options based on your requirements.",
                    tips: ["Visit multiple properties", "Check builder reputation", "Verify amenities promised"]
                },
                {
                    number: "04",
                    title: "Legal Verification",
                    description: "Verify all property documents including title deed, encumbrance certificate, building approvals, and RERA registration.",
                    tips: ["Hire a legal expert", "Verify seller ownership", "Check for pending loans on property"]
                },
                {
                    number: "05",
                    title: "Price Negotiation & Booking",
                    description: "Negotiate the final price, pay booking amount, and sign the initial agreement with all terms clearly mentioned.",
                    tips: ["Research market rates", "Negotiate additional amenities", "Get everything in writing"]
                },
                {
                    number: "06",
                    title: "Loan Processing & Documentation",
                    description: "Submit loan application with required documents, complete property valuation, and get loan sanction.",
                    tips: ["Compare loan offers", "Keep documents ready", "Understand loan terms"]
                },
                {
                    number: "07",
                    title: "Registration & Possession",
                    description: "Execute sale deed, pay stamp duty and registration charges, and take possession of the property.",
                    tips: ["Verify all documents before registration", "Keep copies of all documents", "Do final inspection before possession"]
                }
            ]
        },
        'when-to-buy': {
            title: "When to Buy Property",
            factors: [
                {
                    title: "Market Conditions",
                    description: "Look for buyer's markets with ample inventory and competitive pricing.",
                    bestTime: "During economic slowdowns or when inventory is high",
                    indicators: ["High property listings", "Price stagnation", "Developer discounts"]
                },
                {
                    title: "Interest Rates",
                    description: "Lower interest rates make home loans more affordable.",
                    bestTime: "When RBI reduces repo rates",
                    indicators: ["Falling interest rates", "Bank offers on processing fees", "Festival season schemes"]
                },
                {
                    title: "Seasonal Factors",
                    description: "Certain times of year offer better deals and negotiating power.",
                    bestTime: "Festival seasons (Oct-Dec) and year-end (Mar)",
                    indicators: ["Developer offers during festivals", "Year-end sales targets", "Monsoon season (less competition)"]
                },
                {
                    title: "Personal Readiness",
                    description: "Your financial stability and life stage are crucial factors.",
                    bestTime: "When you have stable income and adequate savings",
                    indicators: ["Job stability", "Adequate emergency fund", "Future life plans aligned"]
                }
            ]
        },
        'what-to-check': {
            title: "What to Check Before Buying",
            checklist: [
                {
                    category: "Legal Documents",
                    items: [
                        "Title Deed and ownership history",
                        "Encumbrance Certificate (last 30 years)",
                        "Building Approval Plans",
                        "RERA Registration Number",
                        "No Objection Certificates (NOCs)",
                        "Property Tax Receipts"
                    ]
                },
                {
                    category: "Property Quality",
                    items: [
                        "Construction quality and materials",
                        "Plumbing and electrical work",
                        "Water pressure and supply",
                        "Ventilation and natural light",
                        "Flooring and finishing quality",
                        "Paint and waterproofing"
                    ]
                },
                {
                    category: "Amenities & Infrastructure",
                    items: [
                        "Water supply source and backup",
                        "Power backup capacity",
                        "Security systems",
                        "Parking facilities",
                        "Lift maintenance (if applicable)",
                        "Common area maintenance"
                    ]
                },
                {
                    category: "Location & Neighborhood",
                    items: [
                        "Proximity to schools, hospitals, markets",
                        "Public transportation access",
                        "Road width and connectivity",
                        "Future development plans in area",
                        "Neighborhood safety and community",
                        "Drainage and waste management"
                    ]
                }
            ]
        }
    };

    const GuideStep = ({ step, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6 mb-4 border-l-4 border-brand-accent"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-text-muted mb-3">{step.description}</p>
                    {step.tips && (
                        <div className="bg-gray-700 rounded p-3">
                            <h4 className="text-brand-primary font-semibold mb-2">Quick Tips:</h4>
                            <ul className="text-text-muted text-sm space-y-1">
                                {step.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex}>• {tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const renderGuideContent = () => {
        const guide = guides[activeGuide];

        switch (activeGuide) {
            case 'how-to-buy':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-brand-accent mb-6">{guide.title}</h2>
                        <div className="space-y-4">
                            {guide.steps.map((step, index) => (
                                <GuideStep key={index} step={step} index={index} />
                            ))}
                        </div>
                    </div>
                );

            case 'when-to-buy':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-brand-accent mb-6">{guide.title}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {guide.factors.map((factor, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800 rounded-lg p-6 border border-gray-600"
                                >
                                    <h3 className="text-xl font-bold text-brand-primary mb-3">{factor.title}</h3>
                                    <p className="text-text-muted mb-4">{factor.description}</p>
                                    <div className="bg-green-900/20 border border-green-800 rounded p-3 mb-3">
                                        <h4 className="text-green-400 font-semibold text-sm mb-1">Best Time:</h4>
                                        <p className="text-green-300 text-sm">{factor.bestTime}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-brand-primary font-semibold text-sm mb-2">Indicators to Watch:</h4>
                                        <ul className="text-text-muted text-sm space-y-1">
                                            {factor.indicators.map((indicator, idx) => (
                                                <li key={idx}>• {indicator}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            case 'what-to-check':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-brand-accent mb-6">{guide.title}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {guide.checklist.map((category, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800 rounded-lg p-6 border border-gray-600"
                                >
                                    <h3 className="text-xl font-bold text-brand-primary mb-4">{category.category}</h3>
                                    <ul className="space-y-3">
                                        {category.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-start space-x-3">
                                                <div className="w-5 h-5 bg-brand-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-text-muted">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto py-10 px-4 text-text-light pt-24">
                <motion.h1 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl font-extrabold text-brand-accent mb-2 text-center"
                >
                    Complete Home Buying Guide
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-muted text-center mb-8 text-lg"
                >
                    Your step-by-step roadmap to making the right property investment
                </motion.p>

                {/* Guide Navigation */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-8"
                >
                    {Object.keys(guides).map((guideKey) => (
                        <button
                            key={guideKey}
                            onClick={() => setActiveGuide(guideKey)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeGuide === guideKey
                                    ? 'bg-brand-accent text-white shadow-lg'
                                    : 'bg-gray-800 text-text-muted hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {guides[guideKey].title}
                        </button>
                    ))}
                </motion.div>

                {/* Main Content */}
                <motion.div 
                    key={activeGuide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-bg-dark-card p-8 rounded-xl shadow-2xl border border-gray-700"
                >
                    {renderGuideContent()}
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                >
                    {[
                        { label: "Avg. Down Payment", value: "20-30%" },
                        { label: "Loan Tenure", value: "15-20 yrs" },
                        { label: "Registration Cost", value: "5-7%" },
                        { label: "RERA Protection", value: "All Projects" }
                    ].map((stat, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-brand-accent">{stat.value}</div>
                            <div className="text-text-muted text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default BuyingGuidesPage;