import React from 'react';
import { motion } from 'framer-motion';

const Screensaver: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-9990 bg-black pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <img
        src="/screensaver.gif"
        alt="Screensaver"
        className="w-full h-full object-contain"
        draggable={false}
      />
    </motion.div>
  );
};

export default Screensaver;