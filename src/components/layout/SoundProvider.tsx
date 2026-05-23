import React, { useState, useCallback } from 'react';
import { SoundContext } from '../../context/SoundContext';

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [muted, setMuted] = useState(true);

  const toggleMuted = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  return (
    <SoundContext.Provider value={{ muted, toggleMuted }}>
      {children}
    </SoundContext.Provider>
  );
};