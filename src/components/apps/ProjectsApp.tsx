import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Terminal,
  Layout,
  Gamepad2,
  Globe,
  Cpu,
  ExternalLink,
  GitBranch,
  Activity,
  ShieldAlert,
  BookOpen,
  RefreshCw,
  Box,
  GraduationCap,
  BarChart3,
  Book,
  X,
} from "lucide-react";
import { projects } from "../../data/projectsData";
import type { ProjectData } from "../../data/projectsData";

const ICONS = {
  Terminal: Terminal,
  Layout: Layout,
  Gamepad2: Gamepad2,
  Globe: Globe,
  Cpu: Cpu,
  Activity: Activity,
  ShieldAlert: ShieldAlert,
  BookOpen: BookOpen,
  RefreshCw: RefreshCw,
  Box: Box,
  GraduationCap: GraduationCap,
  BarChart3: BarChart3,
  Book: Book,
};

interface ProjectsAppProps {
  selectedProject?: ProjectData | null;
}

const ProjectsApp: React.FC<ProjectsAppProps> = ({
  selectedProject: initialSelectedProject,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    initialSelectedProject || null,
  );
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [viewingWebsite, setViewingWebsite] = useState<string | null>(null);
  const [viewingEpub, setViewingEpub] = useState<string | null>(null);
  const epubContainerRef = useRef<HTMLDivElement>(null);
  const epubInstanceRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (viewingEpub && epubContainerRef.current && !epubInstanceRef.current) {
      import('epubjs').then(({ default: ePub }) => {
        const reader = ePub(viewingEpub);
        reader.renderTo(epubContainerRef.current!, {
          width: '100%',
          height: '100%',
        });
        epubInstanceRef.current = reader;
      });
    }
    return () => {
      if (epubInstanceRef.current) {
        epubInstanceRef.current.destroy();
        epubInstanceRef.current = null;
      }
    };
  }, [viewingEpub]);

  if (selectedProject) {
    const IconComponent = ICONS[selectedProject.iconName] || Terminal;

    return (
      <div className="flex flex-col h-full font-mono text-sm overflow-hidden animate-in fade-in duration-200">
        {/* Detail View Header */}
        <div className="flex items-center gap-4 border-b-2 border-white pb-2 mb-4 shrink-0">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-1 hover:bg-white hover:text-black px-2 py-1 transition-colors border border-transparent hover:border-black"
          >
            <ChevronLeft size={16} /> BACK
          </button>
          <span className="font-bold truncate">
            C:\PROJECTS\{selectedProject.title}
          </span>
        </div>

        {/* Detail View Content */}
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 pb-4">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              {selectedProject.customIconUrl ? (
                <img
                  src={selectedProject.customIconUrl}
                  alt=""
                  className="w-6 h-6 shrink-0"
                  draggable={false}
                />
              ) : (
                <IconComponent size={24} />
              )}
              <h2 className="text-2xl font-bold text-[#00FF00]">
                {selectedProject.title.replace(/\.[^/.]+$/, "")}
              </h2>
            </div>

            {/* Demo Video (autoplaying screenshot) */}
            {selectedProject.videoUrl && (
              <div className="border-2 border-gray-700 overflow-hidden bg-black my-3">
                <video
                  src={selectedProject.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto object-contain"
                  draggable={false}
                />
              </div>
            )}

            {/* Screenshots / Additional Media */}
            {selectedProject.screenshots &&
              selectedProject.screenshots.length > 0 && (
                <div className="my-3 flex flex-col gap-3">
                  {selectedProject.screenshots.map((src, idx) =>
                    src.endsWith(".mp4") ? (
                      <video
                        key={idx}
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="border-2 border-gray-700 w-full h-auto object-contain bg-black"
                        draggable={false}
                      />
                    ) : (
                      <img
                        key={idx}
                        src={src}
                        alt={`${selectedProject.title} screenshot ${idx + 1}`}
                        className="border-2 border-gray-700 w-full h-auto object-contain bg-black"
                        draggable={false}
                      />
                    ),
                  )}
                </div>
              )}

            <div className="flex gap-4 text-xs text-gray-400 mb-2 border-b border-gray-700 pb-2">
              <span>TYPE: {selectedProject.type}</span>
              <span>SIZE: {selectedProject.size}</span>
              <span>MODIFIED: {selectedProject.date}</span>
            </div>
            <p className="text-lg leading-snug text-[#00FF00]">
              {selectedProject.description}
            </p>
          </div>

          {/* System Overview */}
          <div>
            <h3 className="font-bold mb-2 bg-white text-black inline-block px-1">
              :: SYSTEM_OVERVIEW
            </h3>
            <p className="leading-relaxed text-gray-300">
              {selectedProject.systemOverview}
            </p>
          </div>

          {/* Technical Specs */}
          <div>
            <h3 className="font-bold mb-2 bg-white text-black inline-block px-1">
              :: CORE_TECH (DEPENDENCIES)
            </h3>
            <div className="mb-2 text-gray-400">
              ROLE: <span className="text-white">{selectedProject.role}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProject.tags.map((t) => (
                <span
                  key={t}
                  className="bg-gray-800 text-white px-2 py-1 text-xs border border-gray-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

{/* External Links */}
            <div className="mt-auto pt-4 border-t-2 border-gray-800 shrink-0 flex gap-4">
              {selectedProject.launchUrl && (
                selectedProject.launchUrl.endsWith('.pdf') ? (
                  <button
                    onClick={() => setViewingPdf(selectedProject.launchUrl!)}
                    className="flex-1 bg-white text-black font-bold py-2 hover:bg-gray-300 active:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    VIEW_DOCUMENT.pdf
                  </button>
                ) : selectedProject.launchUrl.endsWith('.epub') ? (
                  <button
                    onClick={() => setViewingEpub(selectedProject.launchUrl!)}
                    className="flex-1 bg-white text-black font-bold py-2 hover:bg-gray-300 active:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Book size={16} />
                    READ_EBOOK.epub
                  </button>
                ) : (
                  <a
                    href={selectedProject.launchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white text-black font-bold py-2 hover:bg-gray-300 active:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    LAUNCH_APP.exe
                  </a>
                )
              )}

             {selectedProject.sourceUrl ? (
               <button
                 onClick={() => setViewingWebsite(selectedProject.sourceUrl!)}
                 className="w-full border-2 border-white text-white font-bold py-2 hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
               >
                 <GitBranch size={16} />
                 VISIT_
                 {selectedProject.sourceUrl
                   .replace(/^https?:\/\//, "")
                   .replace(/\/$/, "")
                   .toUpperCase()
                   .replace(/\./g, "_")}
               </button>
             ) : (
               <div className="w-full text-center py-2 font-bold text-yellow-400 border-2 border-yellow-400">
                 PROPRIETARY
               </div>
             )}
           </div>
         </div>

{/* PDF Overlay */}
          {viewingPdf && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
                <span className="text-white font-bold">PDF Viewer</span>
                <button onClick={() => setViewingPdf(null)} className="text-white hover:text-gray-300">
                  <X size={24} />
                </button>
              </div>
              <iframe
                src={viewingPdf}
                className="flex-1 w-full"
                title="PDF Viewer"
              />
            </div>
          )}

          {/* EPUB Overlay */}
          {viewingEpub && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
                <span className="text-white font-bold">EPUB Reader</span>
                <button onClick={() => setViewingEpub(null)} className="text-white hover:text-gray-300">
                  <X size={24} />
                </button>
              </div>
              <div ref={epubContainerRef} className="flex-1 w-full" />
            </div>
          )}

         {/* Website Overlay */}
         {viewingWebsite && (
           <div className="fixed inset-0 bg-black z-50 flex flex-col">
             <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
               <span className="text-white font-bold truncate">{viewingWebsite}</span>
               <button onClick={() => setViewingWebsite(null)} className="text-white hover:text-gray-300 ml-2">
                 <X size={24} />
               </button>
             </div>
             <iframe
               src={viewingWebsite}
               className="flex-1 w-full"
               title="Website Viewer"
               sandbox="allow-scripts allow-same-origin allow-forms"
             />
           </div>
         )}
       </div>
     );
   }

  return (
    <div className="flex flex-col h-full font-mono text-sm select-none">
      {/* Directory Header */}
      <div className="flex items-center justify-between border-b-2 border-white pb-2 mb-2 shrink-0">
        <div className="font-bold">C:\PROJECTS{">"} dir</div>
        <div className="text-gray-400">{projects.length} File(s)</div>
      </div>

      {/* List Header */}
      <div className="grid grid-cols-12 gap-2 font-bold border-b border-gray-600 pb-1 mb-2 text-gray-400 shrink-0 px-2">
        <div className="col-span-6">Name</div>
        <div className="col-span-3 text-right">Size</div>
        <div className="col-span-3 text-right">Date</div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {projects.map((proj) => {
          const Icon = ICONS[proj.iconName] || Terminal;
          return (
            <div
              key={proj.id}
              onDoubleClick={() => setSelectedProject(proj)}
              className="grid grid-cols-12 gap-2 items-center cursor-pointer hover:bg-white hover:text-black px-2 py-1 transition-colors group"
            >
              <div className="col-span-6 flex items-center gap-2 truncate">
                {proj.customIconUrl ? (
                  <img
                    src={proj.customIconUrl}
                    alt=""
                    className="w-4 h-4 shrink-0"
                    draggable={false}
                  />
                ) : (
                  <Icon
                    size={14}
                    className="text-gray-400 group-hover:text-black shrink-0"
                  />
                )}
                <span className="truncate text-[#00FF00]">{proj.title}</span>
              </div>
              <div className="col-span-3 text-right text-gray-400 group-hover:text-black truncate">
                {proj.size}
              </div>
              <div className="col-span-3 text-right text-gray-400 group-hover:text-black truncate">
                {proj.date}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-500 shrink-0">
        Double-click a file to execute.
      </div>
    </div>
  );
};

export default ProjectsApp;
