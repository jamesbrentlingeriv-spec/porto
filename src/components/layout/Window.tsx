import React, { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { X, Minus, Square, Lock, Unlock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DragLockContext } from '../../context/DragLockContext';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  isActive,
  zIndex,
  onClose,
  onFocus,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 }
}) => {
  const [maximized, setMaximized] = useState(false);
  const [savedSize, setSavedSize] = useState(defaultSize);
  const [savedPos, setSavedPos] = useState(defaultPosition);
  const [dragLocked, setDragLocked] = useState(false);

  const x = useMotionValue(defaultPosition.x);
  const y = useMotionValue(defaultPosition.y);

  const toggleMaximize = () => {
    if (maximized) {
      // Restore
      setMaximized(false);
      x.set(savedPos.x);
      y.set(savedPos.y);
    } else {
      // Save current position, then maximize
      setSavedPos({ x: x.get(), y: y.get() });
      setSavedSize({ width: defaultSize.width, height: defaultSize.height });
      setMaximized(true);
      x.set(0);
      y.set(0);
    }
  };

  const currentWidth = maximized ? '100vw' : savedSize.width;
  const currentHeight = maximized ? '100vh' : savedSize.height;

  return (
    <DragLockContext.Provider value={{ locked: dragLocked, setLocked: setDragLocked }}>
      <motion.div
        drag={!dragLocked && !maximized}
        dragMomentum={false}
        initial={defaultPosition}
        style={{ x, y, zIndex, width: currentWidth, height: currentHeight }}
        onMouseDown={onFocus}
        className={twMerge(
          clsx(
            "absolute flex flex-col bg-black",
            maximized ? "border-0" : "border-2 shadow-2xl",
            isActive ? (maximized ? "" : "border-white") : (maximized ? "" : "border-gray-500")
          )
        )}
      >
        {/* Title Bar */}
        <div
          className={twMerge(
            clsx(
              "flex items-center justify-between px-2 py-1",
              dragLocked || maximized ? "cursor-default" : "cursor-grab active:cursor-grabbing",
              isActive ? "bg-white text-[#0F1729]" : "bg-gray-500 text-[#0F1729]"
            )
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-wide select-none">{title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setDragLocked(!dragLocked); }}
              className={twMerge(
                "p-0.5 transition-colors",
                dragLocked ? "text-green-500" : "text-gray-400 hover:text-white"
              )}
              title={dragLocked ? "Unlock window position" : "Lock window position"}
            >
              {dragLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>
          </div>
          <div className="flex gap-1">
            <button className="p-0.5 hover:bg-black/20" aria-label="Minimize">
              <Minus size={14} strokeWidth={3} />
            </button>
            <button
              className="p-0.5 hover:bg-black/20"
              onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
              aria-label={maximized ? "Restore" : "Maximize"}
            >
              <Square size={12} strokeWidth={3} />
            </button>
            <button className="p-0.5 hover:bg-red-500 hover:text-white" onClick={onClose} aria-label="Close">
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-black text-white p-4 relative">
          {children}
        </div>
      </motion.div>
    </DragLockContext.Provider>
  );
};

export default Window;