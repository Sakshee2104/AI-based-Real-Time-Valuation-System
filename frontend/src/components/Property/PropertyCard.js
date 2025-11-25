import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// NOTE: Assuming the casing fix 'propertyapi' is resolved via your final setup
import { contactAgent } from '../../api/propertyApi'; 

const ListingCard = ({ listing }) => {
  // NOTE: Handler moved directly into JSX, eliminating unused variable warning.
  
  const imageUrl = listing.imageUrl || "https://picsum.photos/seed/house/300/180";

  const handleContactClick = (e) => {
    e.stopPropagation(); // Prevents card link navigation
    const message = prompt(`Enter your message for Agent ${listing.agentName} regarding the property at ${listing.location}:`);
    
    if (message) {
        // NOTE: In a real app, call contactAgent(listing.id, message)
        alert(`Inquiry sent to Agent for ${listing.location}! (Simulated)`);
    }
  };


  return (
    // CRITICAL FIX: Wrap the entire card in a Router Link
    <Link to={`/property/${listing.id}`}> 
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 10px 20px rgba(224, 184, 79, 0.4)',
                transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-bg-dark-card rounded-xl shadow-lg overflow-hidden cursor-pointer w-full text-text-light transition duration-300 border border-gray-800"
        >
            <div className="relative h-40">
                <img src={imageUrl} alt={listing.location} className="w-full h-full object-cover" />
                
                {/* Animated Wishlist Button */}
                <motion.button 
                    whileTap={{ scale: 1.4, color: '#EF4444' }} 
                    className="absolute top-2 right-2 p-2 bg-bg-dark-secondary/80 rounded-full shadow-md text-text-muted hover:text-brand-secondary transition"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log('Toggle Favorite'); }}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </motion.button>
            </div>
            
            <div className="p-4 text-left">
                <p className="text-xl font-extrabold text-brand-accent mb-1">{listing.price}</p>
                <p className="text-md font-medium text-text-light">{listing.bhk} BHK in {listing.location}</p>
                <p className="text-xs text-text-muted mt-1">Area: {listing.area} sqft</p> 
                
                {/* Contact Button (Now triggers the handler) */}
                <button
                    onClick={handleContactClick} 
                    className="mt-3 block w-full text-center py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Contact Agent
                </button>
            </div>
        </motion.div>
    </Link>
  );
};

export default ListingCard;