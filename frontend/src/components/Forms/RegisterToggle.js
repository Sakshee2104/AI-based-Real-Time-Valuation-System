import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RegisterToggle = ({ onSelect }) => {
  // Roles for the animated toggle switch
  const [role, setRole] = useState('Buyer');
  const roles = ['Buyer', 'Owner']; 

  const handleToggle = (newRole) => {
    setRole(newRole);
    // CRITICAL: Map 'Owner' (UI) to 'agent' (Backend DB role)
    if (newRole === 'Buyer') {
        onSelect('user');
    } else {
        onSelect('agent'); // This correctly assigns the agent role in the DB
    }
  };

  return (
    <div className="relative flex p-1 bg-bg-dark-primary rounded-full w-full max-w-sm mx-auto shadow-xl border border-gray-700">
      {roles.map((r) => (
        <motion.button
          key={r}
          onClick={() => handleToggle(r)}
          className={`flex-1 py-2 text-sm font-semibold relative z-10 transition duration-300 ${
            role === r ? 'text-bg-dark-primary' : 'text-text-muted'
          }`}
        >
          {r}
          {role === r && (
            // --- Framer Motion Animated Slider (The Bubble Effect) ---
            <motion.div
              layoutId="roleToggle" // Unique ID for layout animation
              className="absolute inset-0 bg-brand-accent rounded-full shadow-md"
              transition={{ type: 'spring', damping: 15, stiffness: 250 }} // Smooth, springy animation
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default RegisterToggle;