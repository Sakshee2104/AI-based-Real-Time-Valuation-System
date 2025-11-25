import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

// Component for smooth count-up effect on KPI cards
const AnimatedCounter = ({ value, duration = 1 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
      // Formats the number for large display
      return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    const animation = animate(count, value, { duration: duration });
    return animation.stop;
  }, [value, duration, count]); 

  return <motion.span className="text-4xl font-extrabold text-white">{rounded}</motion.span>;
};

export default AnimatedCounter;