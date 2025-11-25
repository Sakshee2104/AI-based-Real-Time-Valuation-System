import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['Details', 'Configuration', 'Pricing', 'Photos', 'Review'];

// --- Input Field Helper (Reusable component) ---
const InputField = ({ name, value, onChange, placeholder, type = 'text', required = false }) => (
    <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-text-light placeholder-gray-500 mb-4 focus:ring-brand-accent focus:border-brand-accent transition" 
        required={required}
    />
);

// --- Step Content Components ---

const StepDetails = ({ formData, handleChange }) => (
    <>
        <InputField name="location" value={formData.location} onChange={handleChange} placeholder="City / Location (e.g., Whitefield)" required />
        <InputField name="area" value={formData.area} onChange={handleChange} placeholder="Total Area (sq ft)" type="number" required />
        
        {/* CRITICAL FIX: CONTACT INFO INPUT */}
        <InputField 
            name="contact_info" 
            value={formData.contact_info} 
            onChange={handleChange} 
            placeholder="Contact Phone Number (For Buyers)" 
            type="text" 
            required 
        />
    </>
);

const StepConfiguration = ({ formData, handleChange }) => (
    <>
        {/* BHK, BATH, BALCONY inputs */}
        <InputField name="bhk" value={formData.bhk} onChange={handleChange} placeholder="Number of BHK" type="number" required />
        <InputField name="bath" value={formData.bath} onChange={handleChange} placeholder="Number of Bathrooms" type="number" required />
        <InputField name="balcony" value={formData.balcony} onChange={handleChange} placeholder="Number of Balconies" type="number" />
    </>
);

const StepPricing = ({ formData, handleChange }) => (
    <>
        <InputField name="price" value={formData.price} onChange={handleChange} placeholder="Listing Price (Lakhs)" type="number" required />
        <textarea
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="Key Amenities (e.g., Gym, Pool, Security)" 
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-text-light placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent transition" 
            rows="3"
        />
    </>
);

const StepReview = ({ formData }) => (
    <div className="text-left p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h4 className="text-xl font-bold text-brand-accent mb-3">Confirm Listing Details</h4>
        <p className="text-sm text-text-muted">Location: <span className="text-white">{formData.location || 'N/A'}</span></p>
        <p className="text-sm text-text-muted">Area: <span className="text-white">{formData.area || 'N/A'} sq ft</span></p>
        <p className="text-sm text-text-muted">BHK/Bath: {formData.bhk}/{formData.bath}</p>
        <p className="text-sm font-extrabold text-white">Price: ₹{formData.price || 'N/A'} Lakhs</p>
        <p className="text-sm text-text-muted">Contact: <span className="text-white">{formData.contact_info || 'N/A'}</span></p>
        <textarea 
            placeholder="Description / Key Amenities..." 
            className="mt-4 w-full p-3 bg-gray-700 border border-gray-600 rounded text-text-light placeholder-gray-500"
            rows="3"
            value={formData.amenities}
            readOnly
        />
    </div>
);
// --- End Step Content Components ---


const StepperForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ 
    location: '', area: '', price: '', bhk: 2, bath: 2, balcony: 1, amenities: '', contact_info: '' 
  });
  const [submitStatus, setSubmitStatus] = useState(''); // success, error, submitting

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderStepContent = () => {
    switch (currentStep) {
        case 0: return <StepDetails formData={formData} handleChange={handleChange} />;
        case 1: return <StepConfiguration formData={formData} handleChange={handleChange} />;
        case 2: return <StepPricing formData={formData} handleChange={handleChange} />;
        case 3: return <p className="text-text-muted text-center">Image Upload fields go here.</p>;
        case 4: return <StepReview formData={formData} />;
        default: return null;
    }
  };

  const handleSubmit = async () => {
    // --- FINAL SUBMIT LOGIC ---
    setSubmitStatus('submitting');
    console.log("Submitting final data:", formData);

    try {
        // Data structure required by backend:
        const dataToSend = {
             ...formData,
             bhk: parseInt(formData.bhk),
             area: parseFloat(formData.area),
             price: parseFloat(formData.price),
             bath: parseInt(formData.bath),
        };

        // NOTE: Replace with actual API call: await addProperty(dataToSend); 
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setSubmitStatus('success');
        
        // Reset form state after success
        setCurrentStep(0); 
        setFormData({ location: '', area: '', price: '', bhk: 2, bath: 2, balcony: 1, amenities: '', contact_info: '' });
    } catch (error) {
        setSubmitStatus('error');
        console.error("Submission failed:", error);
    }
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));


  return (
    <div className="max-w-xl mx-auto p-6 bg-bg-dark-card rounded-xl shadow-2xl text-text-light">
      
      {/* Animated Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-700 rounded-full">
          <motion.div
            className="h-full bg-brand-accent rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <p className="text-sm mt-2 font-medium text-brand-accent">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </p>
      </div>

      {/* Animated Step Content Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="p-4 border border-gray-700 bg-bg-dark-primary rounded-lg min-h-[300px] flex flex-col justify-center"
        >
          <h3 className="text-xl font-bold mb-4 text-brand-accent">{steps[currentStep]}</h3>
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Submission Status Message */}
      <AnimatePresence>
        {submitStatus === 'submitting' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-center text-brand-accent">Processing listing...</motion.p>
        )}
        {submitStatus === 'success' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-center text-green-500 font-bold">✅ Listing Submitted Successfully!</motion.p>
        )}
        {submitStatus === 'error' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-center text-brand-secondary">❌ Submission Failed. Check console.</motion.p>
        )}
      </AnimatePresence>


      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <motion.button
          onClick={handleBack}
          disabled={currentStep === 0 || submitStatus === 'submitting'}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-gray-700 text-text-light rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
        >
          Back
        </motion.button>
        {currentStep < steps.length - 1 ? (
          <motion.button
            onClick={handleNext}
            disabled={submitStatus === 'submitting'}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-brand-accent text-bg-dark-primary rounded-lg font-semibold hover:bg-white transition"
          >
            Next Step
          </motion.button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            disabled={submitStatus === 'submitting'}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Listing'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default StepperForm;