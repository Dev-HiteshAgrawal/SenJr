import { motion } from 'framer-motion';

// Common entrance animations
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideUp = ({ children, delay = 0, duration = 0.6, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
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
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={`bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#f97316]/10 transition-shadow border border-gray-100 cursor-pointer ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const PrimaryButton = ({ children, className = '', onClick, disabled }) => (
  <motion.button
    whileHover={disabled ? {} : { scale: 1.03 }}
    whileTap={disabled ? {} : { scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={`bg-gray-900 text-white font-bold px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

export const AccentButton = ({ children, className = '', onClick, disabled }) => (
  <motion.button
    whileHover={disabled ? {} : { scale: 1.03, filter: 'brightness(1.05)' }}
    whileTap={disabled ? {} : { scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={`bg-[#f97316] text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

// Gamification Components
export const AnimatedProgressBar = ({ percent, colorClass = "bg-[#10b981]" }) => (
  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
      transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
      className={`h-full rounded-full ${colorClass}`}
    />
  </div>
);

export const XpPopup = ({ amount, isVisible, onComplete }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0.5 }}
    animate={isVisible ? { opacity: [0, 1, 1, 0], y: -50, scale: [0.5, 1.2, 1, 0.8] } : { opacity: 0 }}
    transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
    onAnimationComplete={() => { if (isVisible && onComplete) onComplete() }}
    className="absolute pointer-events-none z-50 font-black text-xl text-[#f97316]"
    style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}
  >
    +{amount} XP
  </motion.div>
);
