import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/Common/PageTransition';
// import { fetchPropertyDetails, submitInquiry } from '../api/propertyapi'; // API calls REMOVED
import { useAuth } from '../context/AuthContext'; 

const PropertyDetailPage = () => {
    const { id } = useParams(); 
    const { user } = useAuth(); 
    
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquiryMessage, setInquiryMessage] = useState('');
    const [inquiryStatus, setInquiryStatus] = useState(''); 

    // Dummy image array for gallery simulation
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const dummyImages = [
        'https://picsum.photos/seed/detail1/800/600',
        'https://picsum.photos/seed/detail2/800/600',
    ];

    const nextImage = () => setCurrentImageIndex((prev) => (prev === dummyImages.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? dummyImages.length - 1 : prev - 1));
    const formatPrice = (price) => {
        const num = parseFloat(price);
        if (isNaN(num)) return 'Price on Request';
        if (num >= 100) return `₹${(num / 100).toFixed(1)} Cr`;
        return `₹${num.toFixed(0)} L`;
    };

    useEffect(() => {
        const loadProperty = async () => {
            setLoading(true);
            try {
                 // --- FIX: Using Hardcoded Simulation (DUMMY DATA) ---
                 // This ensures the page loads with details regardless of database state
                setProperty({
                    id: id, location: 'Koramangala, 5th Block', bhk: 3, area: 1800, 
                    price: 155.00, // Price in Lakhs
                    bath: 3, balcony: 2, status: 'Active',
                    amenities: 'Power Backup, Gym, Pool, Security.',
                    image_url: dummyImages[0], 
                    owner: { // DEFAULT OWNER DETAILS
                        name: 'RealEstate AI Agent', 
                        phone: '+91 99999 88888', 
                        email: 'contact@realestateai.com' 
                    }
                });
                setLoading(false);
            } catch (e) {
                setError("Failed to load property details.");
                setLoading(false);
            }
        };

        loadProperty();
    }, [id]); // Only re-run if the 'id' (from URL) changes

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to submit an inquiry.");
            return;
        }
        if (!inquiryMessage.trim()) {
            alert("Please enter a message for your inquiry.");
            return;
        }

        setInquiryStatus('sending');
        
        try {
            // await submitInquiry(property.id, inquiryMessage); // API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setInquiryStatus('sent');
            setInquiryMessage(''); 
            alert("Your inquiry has been sent to the agent!");
        } catch (e) {
            setInquiryStatus('error');
            console.error("Inquiry submission error:", e);
        }
    };


    if (loading) return <PageTransition><div className="text-center py-20 text-brand-accent">Loading Property Details...</div></PageTransition>;
    if (error || !property) return <PageTransition><div className="text-center py-20 text-brand-secondary">{error || "Property not found."}</div></PageTransition>;

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto py-10 px-4 text-text-light pt-28">
                
                {/* Header & Price */}
                <motion.h1 initial={{y: -10, opacity: 0}} animate={{y:0, opacity:1}} className="text-4xl font-extrabold text-brand-accent mb-2">
                    {property.bhk} BHK Apartment in {property.location}
                </motion.h1>
                <motion.p initial={{opacity: 0}} animate={{opacity:1}} transition={{delay: 0.2}} className="text-4xl font-extrabold text-white mb-6">
                    {formatPrice(property.price)}
                </motion.p>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* --- LEFT COLUMN: IMAGE & DESCRIPTION --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <img src={dummyImages[currentImageIndex]} alt={property.location} className="w-full h-auto rounded-xl shadow-2xl object-cover" />
                        
                        <div className="flex p-2 space-x-2 overflow-x-auto custom-scrollbar bg-bg-dark-secondary rounded-xl">
                            {dummyImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index}`}
                                    className={`w-20 h-16 object-cover rounded-md cursor-pointer ${currentImageIndex === index ? 'border-2 border-brand-accent' : 'border-2 border-transparent opacity-70'}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>

                        <div className="bg-bg-dark-card p-6 rounded-xl border-l-4 border-brand-primary">
                            <h2 className="text-2xl font-bold mb-3 text-brand-primary">Key Details</h2>
                            <div className="grid grid-cols-3 gap-4 text-sm text-text-muted">
                                <p>Area: {property.area} sqft</p>
                                <p>Bath: {property.bath}</p>
                                <p>Balconies: {property.balcony}</p>
                                <p>Status: {property.status}</p>
                            </div>
                        </div>

                        <div className="bg-bg-dark-card p-6 rounded-xl">
                            <h2 className="text-2xl font-bold mb-3 text-brand-primary">Amenities</h2>
                            <p className="text-text-muted">{property.amenities}</p>
                        </div>
                    </div>
                    
                    {/* --- RIGHT COLUMN: OWNER CONTACT & ACTIONS --- */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* OWNER CONTACT BOX (Live Data) */}
                        <motion.div initial={{x: 20, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: 0.3}} className="bg-white p-6 rounded-xl shadow-3xl text-text-default">
                            <h2 className="text-xl font-bold mb-4 text-brand-primary">Owner Contact</h2>
                            <p className="font-semibold text-lg mb-2">{property.owner.name}</p>
                            
                            <div className="space-y-3">
                                <p className="flex items-center text-gray-700">
                                    <span className="font-medium mr-2">📞 Phone:</span> {property.owner.phone}
                                </p>
                                <p className="flex items-center text-gray-700">
                                    <span className="font-medium mr-2">📧 Email:</span> {property.owner.email}
                                </p>
                            </div>
                            
                            {/* Inquiry Form */}
                            <form onSubmit={handleInquirySubmit} className="space-y-4 mt-6">
                                <textarea
                                    className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring-brand-accent placeholder-gray-500"
                                    rows="3"
                                    placeholder="Type your inquiry message here..."
                                    value={inquiryMessage}
                                    onChange={(e) => setInquiryMessage(e.g.value)}
                                    required
                                ></textarea>
                                
                                <motion.button 
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    className="w-full py-3 bg-brand-secondary text-white rounded-lg font-bold transition disabled:opacity-50"
                                    disabled={inquiryStatus === 'sending'}
                                >
                                    {inquiryStatus === 'sending' ? 'Sending...' : 
                                     inquiryStatus === 'sent' ? '✅ Inquiry Sent!' : 'Send Inquiry'}
                                </motion.button>
                            </form>
                        </motion.div>
                        
                        {/* Action Box */}
                        <div className="bg-bg-dark-card p-6 rounded-xl text-center border border-gray-700">
                            <Link to="/predict" className="text-brand-accent hover:text-white transition">
                                Re-run AI Price Check for this Location?
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PropertyDetailPage;