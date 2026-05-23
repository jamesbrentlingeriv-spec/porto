import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
      animate={{
        x: position.x - 10,
        y: position.y - 10,
        scale: clicked ? 0.8 : 1,
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
    >
      <div className="relative w-5 h-5">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2" />
        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white -translate-x-1/2" />
      </div>
    </motion.div>
  );
};

export default CustomCursor;
