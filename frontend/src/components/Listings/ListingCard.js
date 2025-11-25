import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Helper function to format the price (₹80 L or ₹1.2 Cr)
const formatPriceDisplay = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return 'Price on Request';
    
    if (num >= 100) {
        return `₹${(num / 100).toFixed(1)} Cr`;
    }
    return `₹${num.toFixed(0)} L`;
};


const ListingCard = ({ listing }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { 
        scale: 1.05, 
        boxShadow: '0 10px 20px rgba(224, 184, 79, 0.4)', // Gold shadow
        transition: { type: "spring", stiffness: 300 }
    }
  };
  
  // Use the image_url from the dummy data
  const imageUrl = listing.image_url || "https://picsum.photos/seed/house/300/180";
  const displayPrice = formatPriceDisplay(listing.price); // Use the formatter

  return (
    // Link to the dynamic Property Detail Page using the DUMMY ID
    <Link to={`/property/${listing.id}`}> 
        <motion.div
            variants={cardVariants}
            whileHover="hover"
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
                <p className="text-xl font-extrabold text-brand-accent mb-1">{displayPrice}</p> 
                
                <p className="text-md font-semibold">{listing.bhk} BHK | {listing.area} sqft</p>
                <p className="text-xs text-text-muted mt-1">{listing.location}</p>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="mt-3 block w-full text-center py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    View Details
                </motion.button>
            </div>
        </motion.div>
    </Link>
  );
};

export default ListingCard;