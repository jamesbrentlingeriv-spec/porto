import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: LucideIcon | string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onDoubleClick }) => {
  const isStringIcon = typeof icon === 'string';
  const IconComponent = !isStringIcon ? (icon as LucideIcon) : null;

  return (
    <div
      className="flex flex-col items-center justify-center w-24 h-24 m-2 cursor-pointer group"
      onDoubleClick={onDoubleClick}
    >
      <div className="p-3 bg-transparent border-2 border-transparent group-hover:border-white transition-colors duration-200">
        {isStringIcon ? (
          <img src={icon as string} alt={label} className="w-10 h-10 object-contain" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4))' }} />
        ) : (
          IconComponent && <IconComponent className="w-10 h-10 text-white" strokeWidth={1.5} />
        )}
      </div>
      <span className="mt-2 text-xs font-mono text-white bg-black/50 px-1 py-0.5 group-hover:bg-white group-hover:text-black transition-colors duration-200 text-center">
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;