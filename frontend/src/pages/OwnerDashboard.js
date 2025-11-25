import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllQueries, submitReplyToQuery } from '../api/queryApi';
import { useNavigate } from 'react-router-dom';

// --- Inlined Placeholder Components ---
const PageTransition = ({ children }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {children}
    </motion.div>
);

const useAuth = () => {
    const navigate = useNavigate();
    return { 
        user: { username: 'Owner' },
        logout: () => {
            // Clear any auth tokens or user data
            localStorage.removeItem('authToken');
            navigate('/login');
        }
    };
};

const AnimatedCounter = ({ value }) => {
    return <h3 className="text-4xl font-extrabold text-white mt-1">{value}</h3>;
};

// Enhanced Chart Components
const LineChart = ({ data, color = "brand-primary" }) => (
    <div className="relative h-64 w-full">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-text-muted">Performance Chart</p>
            </div>
        </div>
        {/* Simulated chart lines */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-4">
            {[30, 45, 60, 75, 90, 65, 80].map((height, index) => (
                <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className={`w-8 bg-gradient-to-t from-${color} to-${color}/50 rounded-t-lg mx-1`}
                />
            ))}
        </div>
    </div>
);

const PieChart = ({ data, colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"] }) => (
    <div className="relative h-64 w-64 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-text-muted">Distribution</p>
            </div>
        </div>
        {/* Simulated pie chart segments */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors[0]}
                strokeWidth="20"
                strokeDasharray="100 100"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: "40 100" }}
                transition={{ duration: 1 }}
            />
            <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors[1]}
                strokeWidth="20"
                strokeDasharray="100 100"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: "30 100" }}
                transition={{ duration: 1, delay: 0.3 }}
                transform="rotate(144 50 50)"
            />
            <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors[2]}
                strokeWidth="20"
                strokeDasharray="100 100"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: "20 100" }}
                transition={{ duration: 1, delay: 0.6 }}
                transform="rotate(252 50 50)"
            />
        </svg>
    </div>
);

const AnalyticsChart = ({ title, type, data }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-brand-primary transition-all duration-300">
        <h3 className="text-xl font-semibold text-brand-primary mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700">
            {type === 'Line' ? <LineChart data={data} /> : <PieChart data={data} />}
        </div>
    </div>
);

// --- Enhanced StepperForm with Complete Property Addition ---
const StepperForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        propertyType: '', title: '', description: '', address: '', city: '', state: '', 
        pincode: '', landmark: '', bhk: '', bathrooms: '', area: '', areaUnit: 'sqft', 
        furnished: '', price: '', priceUnit: 'Lakhs', maintenance: '', amenities: [], 
        images: [], contactName: '', contactEmail: '', contactPhone: ''
    });

    const steps = [
        { title: 'Basic Info', icon: '📝' },
        { title: 'Location', icon: '📍' },
        { title: 'Details', icon: '🏠' },
        { title: 'Pricing', icon: '💰' },
        { title: 'Amenities', icon: '⭐' },
        { title: 'Media', icon: '🖼️' },
        { title: 'Contact', icon: '📞' }
    ];

    const amenitiesList = [
        'Swimming Pool', 'Gym', 'Park', 'Security', 'Power Backup',
        'Lift', 'Clubhouse', 'Children Play Area', 'Intercom', 'Water Supply',
        'Parking', 'Garden', 'Fire Safety', 'WiFi', 'Air Conditioning'
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    // --- New Image Handler Functions ---
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        
        // Create previews
        const newImages = files.map(file => ({
            file: file, // The actual file object for upload
            preview: URL.createObjectURL(file) // The local preview URL
        }));
        
        setFormData(prev => ({
            ...prev,
            // Add new images to existing ones
            images: [...prev.images, ...newImages]
        }));
    };

    const handleRemoveImage = (indexToRemove) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(formData.images[indexToRemove].preview);
        
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };
    // --- End of New Image Handlers ---

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // In a real app, you'd upload formData.images[i].file here
        alert('Property added successfully!');
        
        // Clean up all object URLs before resetting state
        formData.images.forEach(image => URL.revokeObjectURL(image.preview));

        setCurrentStep(0);
        setFormData({
            propertyType: '', title: '', description: '', address: '', city: '', state: '', 
            pincode: '', landmark: '', bhk: '', bathrooms: '', area: '', areaUnit: 'sqft', 
            furnished: '', price: '', priceUnit: 'Lakhs', maintenance: '', amenities: [], 
            images: [], contactName: '', contactEmail: '', contactPhone: ''
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Property Type</label>
                                <select 
                                    value={formData.propertyType}
                                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                >
                                    <option value="">Select Type</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="plot">Plot</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Title</label>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g., Beautiful 3BHK Apartment"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-muted mb-2">Description</label>
                                <textarea 
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe your property in detail..."
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Location Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-muted mb-2">Full Address</label>
                                <input 
                                    type="text" 
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="Enter complete address"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">City</label>
                                <input 
                                    type="text" 
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder="City"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">State</label>
                                <input 
                                    type="text" 
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    placeholder="State"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Pincode</label>
                                <input 
                                    type="text" 
                                    value={formData.pincode}
                                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                                    placeholder="Pincode"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Landmark</label>
                                <input 
                                    type="text" 
                                    value={formData.landmark}
                                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                                    placeholder="Nearby landmark"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Property Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">BHK</label>
                                <select 
                                    value={formData.bhk}
                                    onChange={(e) => handleInputChange('bhk', e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                >
                                    <option value="">Select</option>
                                    <option value="1">1 BHK</option>
                                    <option value="2">2 BHK</option>
                                    <option value="3">3 BHK</option>
                                    <option value="4">4 BHK</option>
                                    <option value="4+">4+ BHK</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Bathrooms</label>
                                <select 
                                    value={formData.bathrooms}
                                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                >
                                    <option value="">Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4+">4+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Furnishing</label>
                                <select 
                                    value={formData.furnished}
                                    onChange={(e) => handleInputChange('furnished', e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                >
                                    <option value="">Select</option>
                                    <option value="furnished">Furnished</option>
                                    <option value="semi-furnished">Semi-Furnished</option>
                                    <option value="unfurnished">Unfurnished</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-muted mb-2">Area</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="number" 
                                        value={formData.area}
                                        onChange={(e) => handleInputChange('area', e.target.value)}
                                        placeholder="Area"
                                        className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    />
                                    <select 
                                        value={formData.areaUnit}
                                        onChange={(e) => handleInputChange('areaUnit', e.target.value)}
                                        className="w-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    >
                                        <option value="sqft">Sq Ft</option>
                                        <option value="sqm">Sq M</option>
                                        <option value="acre">Acre</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Pricing Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Price</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="number" 
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        placeholder="Enter price"
                                        className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    />
                                    <select 
                                        value={formData.priceUnit}
                                        onChange={(e) => handleInputChange('priceUnit', e.target.value)}
                                        className="w-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    >
                                        <option value="Lakhs">Lakhs</option>
                                        <option value="Crores">Crores</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Maintenance (Monthly)</label>
                                <input 
                                    type="number" 
                                    value={formData.maintenance}
                                    onChange={(e) => handleInputChange('maintenance', e.target.value)}
                                    placeholder="Maintenance charges"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {amenitiesList.map((amenity) => (
                                <motion.label 
                                    key={amenity}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        formData.amenities.includes(amenity)
                                            ? 'border-brand-primary bg-brand-primary/20'
                                            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                        className="hidden"
                                    />
                                    <span className="text-sm font-medium text-white text-center w-full">
                                        {amenity}
                                    </span>
                                </motion.label>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Property Images</h3>
                        
                        {/* --- Functional Uploader --- */}
                        <label className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-brand-primary transition-colors cursor-pointer block">
                            <input 
                                type="file" 
                                multiple
                                accept="image/png, image/jpeg, image/webp"
                                className="hidden"
                                onChange={handleImageUpload} 
                            />
                            <div className="text-4xl mb-4">🖼️</div>
                            <p className="text-text-muted mb-4">Drag & drop images here or click to browse</p>
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold inline-block"
                            >
                                Upload Images
                            </motion.span>
                        </label>
                        <p className="text-sm text-text-muted text-center">
                            Supported formats: JPG, PNG, WEBP (Max 10MB each)
                        </p>

                        {/* --- Image Previews --- */}
                        {formData.images.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6"
                            >
                                <h4 className="text-lg font-semibold text-text-light mb-4">Uploaded Images ({formData.images.length})</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((image, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative group"
                                        >
                                            <img 
                                                src={image.preview} 
                                                alt={`preview ${index + 1}`} 
                                                className="w-full h-32 object-cover rounded-lg border border-gray-700"
                                            />
                                            <motion.button
                                                type="button" // Prevent form submission
                                                onClick={() => handleRemoveImage(index)}
                                                whileHover={{ scale: 1.1, backgroundColor: '#EF4444' }} // red-500
                                                whileTap={{ scale: 0.9 }}
                                                className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-accent mb-6">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Contact Name</label>
                                <input 
                                    type="text" 
                                    value={formData.contactName}
                                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                                    placeholder="Full name"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
                                <input 
                                    type="email" 
                                    value={formData.contactEmail}
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-muted mb-2">Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={formData.contactPhone}
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700"
        >
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-8 relative">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center z-10">
                        <motion.div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold transition-all ${
                                index <= currentStep
                                    ? 'bg-brand-primary border-brand-primary text-white'
                                    : 'bg-gray-700 border-gray-600 text-gray-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                        >
                            {index < currentStep ? '✓' : step.icon}
                        </motion.div>
                        <span className={`text-xs mt-2 font-medium ${
                            index <= currentStep ? 'text-brand-accent' : 'text-text-muted'
                        }`}>
                            {step.title}
                        </span>
                    </div>
                ))}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-700 -z-10">
                    <motion.div 
                        className="h-full bg-brand-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-96">
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                        currentStep === 0 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                    disabled={currentStep === 0}
                >
                    ← Previous
                </motion.button>

                <div className="text-sm text-text-muted">
                    Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                    <motion.button
                        onClick={nextStep}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Next →
                    </motion.button>
                ) : (
                    <motion.button
                        onClick={handleSubmit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        🚀 Submit Property
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

// --- Animation Variants ---
const tabVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};
const statVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// --- Sub-Component Definitions ---

// 1. My Listings Grid
const MyListingsGrid = ({ data, handleMarkSold, handleEdit, handleUpgrade }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h3 className="text-2xl font-semibold text-brand-primary mb-4">My Current Listings ({data.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => (
                <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-brand-primary transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-bold text-brand-accent text-lg group-hover:text-white transition-colors">{item.title}</p>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                            item.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-red-500/20 text-red-400'
                        }`}>
                            {item.status}
                        </span>
                    </div>
                    <p className="text-2xl font-extrabold text-white my-2">{item.price}</p>
                    <p className="text-sm text-text-muted mb-4">Last updated: 2 days ago</p>
                    <div className="flex gap-2 flex-wrap">
                        <motion.button 
                            onClick={() => handleEdit(item.id)} 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="text-xs bg-brand-accent px-4 py-2 rounded-lg text-bg-dark-primary font-semibold transition-all"
                        >
                            ✏️ Edit
                        </motion.button>
                        <motion.button 
                            onClick={() => handleMarkSold(item.id)} 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="text-xs bg-green-600 px-4 py-2 rounded-lg text-white font-semibold transition-all"
                        >
                            ✅ Sold
                        </motion.button>
                        <motion.button 
                            onClick={() => handleUpgrade(item.id)} 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="text-xs bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded-lg text-white font-semibold transition-all"
                        >
                            ⚡ Boost
                        </motion.button>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

// 3. Analytics / Insights Panel
const AnalyticsInsights = ({ data }) => {
    const totalListings = data?.totalListings || 0;
    const totalInquiries = data?.totalInquiries || 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h3 className="text-2xl font-semibold text-brand-primary mb-4">Market & Performance Insights</h3>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                    variants={statVariants} 
                    initial="hidden" 
                    animate="visible" 
                    className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-l-4 border-brand-primary hover:scale-105 transition-transform duration-300"
                >
                    <p className="text-sm font-medium text-text-muted mb-2">Total Listings</p>
                    <AnimatedCounter value={totalListings} />
                    <p className="text-xs text-green-400 mt-2">↑ 12% from last month</p>
                </motion.div>
                
                <motion.div 
                    variants={statVariants} 
                    initial="hidden" 
                    animate="visible" 
                    transition={{ delay: 0.1 }} 
                    className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-l-4 border-brand-secondary hover:scale-105 transition-transform duration-300"
                >
                    <p className="text-sm font-medium text-text-muted mb-2">Active Queries</p>
                    <AnimatedCounter value={totalInquiries} />
                    <p className="text-xs text-green-400 mt-2">↑ 8% from last month</p>
                </motion.div>
                
                <motion.div 
                    variants={statVariants} 
                    initial="hidden" 
                    animate="visible" 
                    transition={{ delay: 0.2 }} 
                    className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-l-4 border-green-500 hover:scale-105 transition-transform duration-300"
                >
                    <p className="text-sm font-medium text-text-muted mb-2">Response Rate</p>
                    <h3 className="text-4xl font-extrabold text-white mt-1">92%</h3>
                    <p className="text-xs text-text-muted mt-2">Query response efficiency</p>
                </motion.div>
                
                <motion.div 
                    variants={statVariants} 
                    initial="hidden" 
                    animate="visible" 
                    transition={{ delay: 0.3 }} 
                    className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-l-4 border-purple-500 hover:scale-105 transition-transform duration-300"
                >
                    <p className="text-sm font-medium text-text-muted mb-2">Hot Search Area</p>
                    <h3 className="text-xl font-bold text-white">{data?.hot_markets[0]?.location || 'N/A'}</h3>
                    <p className="text-xs text-text-muted mt-2">Trending location</p>
                </motion.div>
            </div>

            {/* Enhanced Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart 
                    title="Monthly Performance" 
                    type="Line" 
                    data={[30, 45, 60, 75, 90, 65, 80]}
                />
                <AnalyticsChart 
                    title="Query Distribution" 
                    type="Pie" 
                    data={[40, 30, 20, 10]}
                />
            </div>

            {/* Market Trends */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700"
            >
                <h4 className="text-lg font-semibold text-brand-accent mb-4">Market Trends</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Property Views', value: '1.2K', trend: '+15%' },
                        { label: 'Avg. Response Time', value: '2.4h', trend: '-20%' },
                        { label: 'User Engagement', value: '78%', trend: '+8%' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="p-4 bg-gray-700 rounded-xl text-center hover:bg-gray-600 transition-all"
                        >
                            <p className="text-text-muted text-sm">{stat.label}</p>
                            <p className="text-white font-bold text-xl">{stat.value}</p>
                            <p className="text-green-400 text-xs">{stat.trend}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// 4. Reply Modal Component
const ReplyModal = ({ query, onClose, onReplied }) => {
    const [responseText, setResponseText] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await submitReplyToQuery(query.id, responseText);
            setStatus('sent');
            setTimeout(() => {
                onReplied();
                onClose();
            }, 1500);
        } catch (err) {
            console.error(err);
            setStatus('idle');
            alert("Error: Could not send reply. " + err.message);
        }
    };

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700"
            >
                {status === 'sent' ? (
                    <div className="text-center p-8">
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-6xl text-green-500">✓</motion.div>
                        <h2 className="text-2xl font-bold text-white mt-4">Reply Sent!</h2>
                        <p className="text-text-muted">The user has been notified.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-brand-accent mb-4">Reply to Query</h2>
                        
                        <div className="mb-4 p-4 bg-gray-700 rounded-xl border border-gray-600">
                            <p className="text-sm text-text-muted">From: <span className="font-semibold text-text-light">{query.email}</span></p>
                            <p className="text-sm text-text-muted">Subject: <span className="font-semibold text-text-light">{query.subject}</span></p>
                            <p className="text-text-light mt-2 italic">"{query.query_text}"</p>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                rows="5"
                                placeholder="Your reply..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                className="w-full p-4 bg-gray-700 rounded-xl text-text-light placeholder-text-muted border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <motion.button 
                                type="button" 
                                onClick={onClose} 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                className="py-2 px-5 bg-gray-600 text-white rounded-lg font-semibold transition-all"
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                type="submit" 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                className="py-2 px-5 bg-brand-primary text-white rounded-lg font-semibold transition-all" 
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Reply'}
                            </motion.button>
                        </div>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
};

// 5. View Queries Component
const ViewQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuery, setSelectedQuery] = useState(null);

    const loadQueries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllQueries();
            setQueries(data);
        } catch (err) {
            console.error("Failed to load queries", err);
            setError(err.message || "Failed to fetch queries.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadQueries();
    }, [loadQueries]);

    const handleReplied = () => {
        loadQueries();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-brand-primary">General User Queries</h3>
                <motion.button 
                    onClick={loadQueries} 
                    whileHover={{ scale: 1.05, rotate: 15 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-gray-600"
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : '🔄 Refresh'}
                </motion.button>
            </div>
            
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    <p className="text-text-muted mt-2">Loading queries...</p>
                </div>
            )}
            
            {error && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-center"
                >
                    {error}
                </motion.div>
            )}
            
            {!loading && !error && queries.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl text-center border border-gray-700"
                >
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-text-muted text-lg">No queries found.</p>
                    <p className="text-text-muted text-sm mt-2">User queries will appear here when they contact you.</p>
                </motion.div>
            )}

            <div className="space-y-4">
                {!loading && !error && queries.map((item, index) => (
                    <motion.div 
                        key={item.id} 
                        initial={{ y: 10, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: index * 0.05 }}
                        className={`p-6 rounded-2xl border-l-4 ${
                            item.status === 'pending' ? 'border-brand-accent' : 'border-green-500'
                        } bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-all`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-bold text-brand-accent text-lg">{item.subject}</p>
                                <p className="text-sm text-text-muted mt-1">📧 From: {item.email}</p>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                item.status === 'pending' 
                                    ? 'bg-yellow-500/20 text-yellow-400' 
                                    : 'bg-green-500/20 text-green-500'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                        
                        <p className="text-sm text-text-light p-4 bg-gray-700 rounded-xl border border-gray-600">
                            {item.query_text}
                        </p>
                        
                        {item.response_text && (
                            <div className="mt-4 p-4 bg-gray-900 border-l-4 border-gray-600 rounded-xl">
                                <p className="text-sm font-bold text-text-muted">Your Reply:</p>
                                <p className="text-sm text-text-light italic mt-1">"{item.response_text}"</p>
                            </div>
                        )}

                        {item.status === 'pending' && (
                            <div className="text-right mt-4">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedQuery(item)}
                                    className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg transition-all hover:bg-brand-primary/90"
                                >
                                    📨 Reply
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedQuery && (
                    <ReplyModal 
                        query={selectedQuery}
                        onClose={() => setSelectedQuery(null)}
                        onReplied={handleReplied}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- MAIN COMPONENT DEFINITION ---

const OwnerDashboard = () => {
    // Removed `logout` from destructuring as it's no longer used
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState('insights');
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);

    const fetchAllDashboardData = useCallback(() => {
        setTimeout(() => {
            setAnalytics({
                totalListings: 15,
                totalInquiries: 32,
                popularProperty: '3BHK Whitefield',
                hot_markets: [{ location: 'Sarjapur', count: 45 }, { location: 'Whitefield', count: 30 }],
                listings: [
                    { id: 1, title: '3BHK Whitefield', price: '85L', status: 'Active' },
                    { id: 2, title: '4BHK Koramangala', price: '1.8Cr', status: 'Pending' },
                ]
            });
            setLoading(false);
        }, 800);
    }, []);

    useEffect(() => {
        fetchAllDashboardData();
    }, [fetchAllDashboardData]);
    
    const handleMarkSold = async (listingId) => {
        if (window.confirm(`Mark listing ${listingId} as SOLD?`)) {
            fetchAllDashboardData(); 
        }
    };
    
    const handleEdit = (listingId) => alert(`Opening Edit Modal for Listing ID: ${listingId}`);
    const handleUpgrade = (listingId) => alert(`Simulating Upgrade for Listing ID: ${listingId}`);

    const renderContent = () => {
        switch (activeTab) {
            case 'listings': 
                return <MyListingsGrid 
                    data={analytics?.listings || []} 
                    handleMarkSold={handleMarkSold} 
                    handleEdit={handleEdit} 
                    handleUpgrade={handleUpgrade} 
                />;
            case 'add': 
                return <motion.div key="add" variants={tabVariants} initial="hidden" animate="visible">
                    <StepperForm />
                </motion.div>;
            case 'queries': 
                return <ViewQueries />;
            case 'insights':
            default: 
                return <AnalyticsInsights data={analytics} />; 
        }
    };

    const tabs = [
        { id: 'insights', label: 'Dashboard', icon: '📊' },
        { id: 'listings', label: 'My Listings', icon: '🏠' },
        { id: 'add', label: 'Add Property', icon: '➕' },
        { id: 'queries', label: 'User Queries', icon: '❓' }
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 pt-24">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Logout */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8 relative"
                    >
                        {/* --- LOGOUT BUTTON REMOVED FROM HERE --- */}
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent mb-4">
                            Owner Management Dashboard
                        </h1>
                        <p className="text-text-muted text-lg">
                            Welcome back, <span className="text-brand-accent font-semibold">{user?.username || 'Agent'}</span>. 
                            Manage your listings and handle user queries efficiently.
                        </p>
                    </motion.div>
                    
                    {/* Enhanced Tab Navigation */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 mb-8 p-2 bg-gray-800 rounded-2xl border border-gray-700"
                    >
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`py-3 px-6 capitalize font-semibold rounded-xl transition-all flex items-center gap-2 relative ${
                                    activeTab === tab.id 
                                        ? 'bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-2xl' 
                                        : 'text-text-muted hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div 
                                        layoutId="ownerUnderline" 
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-brand-accent rounded-full"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Main Content */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                            <p className="text-brand-primary text-lg mt-4">Loading Market Data...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    )}
                    
                    {/* Profile Management Footer */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl text-center border border-gray-700 shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-brand-accent mb-4">Profile Management</h3>
                        <p className="text-text-muted mb-6">Complete your profile to get better visibility and more leads</p>
                        
                        {/* Profile Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="bg-gradient-to-r from-brand-primary to-brand-accent h-3 rounded-full"
                            />
                        </div>
                        
                        <div className="flex justify-center gap-4">
                            <motion.button 
                                onClick={() => alert("Navigating to Profile Settings edit form.")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                ✏️ Edit Profile
                            </motion.button>
                            <motion.button 
                                onClick={() => alert("Viewing upgrade options.")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                ⚡ Upgrade Plan
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default OwnerDashboard;