import React from 'react';
import type { ProjectData } from '../../data/projectsData';

interface ProjectIconProps {
  project: ProjectData;
  onClick: () => void;
  size?: 'normal' | 'large';
}

const ProjectIcon: React.FC<ProjectIconProps> = ({ project, onClick, size = 'normal' }) => {
  const displayName = project.title
    .replace('.exe', '')
    .replace('.epub', '')
    .split('_').slice(0, 2).join(' ');

  const isLarge = size === 'large';
  
  return (
    <div
      className={`flex flex-col items-center justify-center cursor-pointer ${isLarge ? 'w-24 h-28' : 'w-16 h-16'}`}
      onClick={onClick}
    >
      <div className={`mb-2 flex items-center justify-center ${isLarge ? 'w-20 h-20' : 'w-14 h-14'}`}>
        {project.customIconUrl ? (
          <img 
            src={project.customIconUrl} 
            alt={project.title} 
            className={`${isLarge ? 'w-20 h-20' : 'w-14 h-14'} object-contain drop-shadow-md`}
            draggable={false}
          />
        ) : (
          <div className={`text-white flex items-center justify-center font-bold ${isLarge ? 'text-3xl w-20 h-20' : 'w-14 h-14'}`}>
            {project.title.charAt(0)}
          </div>
        )}
      </div>
      <span className={`text-white font-medium text-center bg-black/30 rounded max-w-${isLarge ? '24' : '16'} truncate px-1 ${isLarge ? 'text-sm' : 'text-xs'}`}>
        {displayName}
      </span>
    </div>
  );
};

export default ProjectIcon;