import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundContext } from '../../context/SoundContext';

const SoundToggle: React.FC = () => {
  const { muted, toggleMuted } = React.useContext(SoundContext);

  return (
    <button
      onClick={toggleMuted}
      className="flex items-center gap-1.5 px-2 py-1 border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all duration-150 font-mono text-xs cursor-pointer select-none"
      title={muted ? 'Enable system sounds' : 'Mute system sounds'}
    >
      {muted ? (
        <>
          <VolumeX size={12} />
          <span className="hidden sm:inline">SOUND: OFF</span>
        </>
      ) : (
        <>
          <Volume2 size={12} />
          <span className="hidden sm:inline">SOUND: ON</span>
        </>
      )}
    </button>
  );
};

export default SoundToggle;