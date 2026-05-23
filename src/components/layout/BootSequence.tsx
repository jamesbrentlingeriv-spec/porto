import React, { useState, useEffect, useRef } from 'react';
import { useSystemSounds } from '../../hooks/useSystemSounds';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  "BIOS Date 05/22/26 14:02:11 Ver 1.0",
  "CPU: Unknown Retro Processor",
  "Memory Test: 640K OK",
  "Mounting iamjames.lol system assets...",
  "Checking memory limits...",
  "Restoring energy levels 100%...",
  "Initializing iamjames.lol OS...",
  "[OK] System stable."
];

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const sounds = useSystemSounds();
  const beepPlayedRef = useRef(false);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[currentLine]]);
        sounds.bootBlip();
        currentLine++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play boot complete beep once when done
  useEffect(() => {
    if (isDone && !beepPlayedRef.current) {
      beepPlayedRef.current = true;
      sounds.bootBeep();
    }
  }, [isDone, sounds]);

  useEffect(() => {
    const handleKeyDown = () => {
      if (isDone) {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleKeyDown);
    };
  }, [isDone, onComplete]);

  return (
    <div 
      className="w-full h-full bg-black text-[#00FF00] p-8 font-mono text-lg flex flex-col items-start justify-start absolute inset-0 z-50"
      style={{ textShadow: '0 0 2px rgba(0, 255, 0, 0.4), 0 0 8px rgba(0, 255, 0, 0.2)' }}
    >
      {lines.map((line, idx) => (
        <div key={idx} className="mb-2">
          {line}
        </div>
      ))}
      {isDone && (
        <div className="mt-8 flex items-center">
          <span>PRESS ANY KEY TO BOOT</span>
          <span className="w-3 h-5 bg-[#00FF00] ml-2 animate-pulse block" style={{ boxShadow: '0 0 8px rgba(0, 255, 0, 0.6)' }}></span>
        </div>
      )}
    </div>
  );
};

export default BootSequence;