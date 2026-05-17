import React from 'react';
import { motion } from 'framer-motion';

// Common entrance animations
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideUp = ({ children, delay = 0, duration = 0.6, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '' }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.1, 0.25, 1], duration: 0.5 } }
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
};

// Reusable microinteractions
export const HoverCard = ({ children, className = '', onClick }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={`bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-shadow border border-gray-100 ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const PrimaryButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    className={`bg-gray-900 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export const AccentButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
    whileTap={{ scale: 0.95 }}
    className={`bg-primary-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary-500/30 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);
