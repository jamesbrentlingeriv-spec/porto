import React from 'react';
import type { ProjectData } from '../../data/projectsData';

interface ProjectIconProps {
  project: ProjectData;
  onClick: () => void;
}

const ProjectIcon: React.FC<ProjectIconProps> = ({ project, onClick }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-16 h-16 cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-1 border-2 border-white/30 group-hover:border-white transition-colors duration-200">
        {project.customIconUrl ? (
          <img 
            src={project.customIconUrl} 
            alt={project.title} 
            className="w-8 h-8 object-contain"
            draggable={false}
          />
        ) : (
          <div className="text-white w-8 h-8 flex items-center justify-center font-bold">
            {project.title.charAt(0)}
          </div>
        )}
      </div>
      <span className="text-xs text-white font-medium text-center bg-black/30 px-1 rounded max-w-12.5 truncate">
        {project.title.split('_')[0]}
      </span>
    </div>
  );
};

export default ProjectIcon;