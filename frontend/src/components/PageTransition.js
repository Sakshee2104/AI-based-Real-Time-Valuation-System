import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  // Define initial state (start below screen, invisible)
  initial: { opacity: 0, y: 15 },
  // Define final state (on screen, fully visible)
  animate: { opacity: 1, y: 0 },
  // Define exit state (for when page leaves)
  exit: { opacity: 0, y: 15 },
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

export default PageTransition;