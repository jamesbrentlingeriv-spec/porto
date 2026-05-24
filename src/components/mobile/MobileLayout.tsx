import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AppConfig } from "../../data/appsConfig";
import type { ProjectData } from "../../data/projectsData";
import { projects } from "../../data/projectsData";
import { useSystemSounds } from "../../hooks/useSystemSounds";
import ProjectIcon from "./ProjectIcon";

// Apps
import AboutApp from "../apps/AboutApp";
import ProjectsApp from "../apps/ProjectsApp";
import { MusicPlayer } from "../apps/MusicPlayer";
import PaintApp from "../apps/PaintApp";
import Guestbook from "../apps/Guestbook";

const MOBILE_APPS: AppConfig[] = [
  {
    id: "about",
    title: "About",
    icon: "/desktopicon/aboutme.png",
    component: AboutApp,
    defaultSize: { width: 350, height: 500 },
  },
  {
    id: "projects",
    title: "Projects",
    icon: "/desktopicon/projects.png",
    component: ProjectsApp,
    defaultSize: { width: 350, height: 500 },
  },
  {
    id: "music",
    title: "Music",
    icon: "/desktopicon/musicplayer.png",
    component: MusicPlayer,
    defaultSize: { width: 300, height: 250 },
  },
  {
    id: "paint",
    title: "Paint",
    icon: "/desktopicon/paint.png",
    component: PaintApp,
    defaultSize: { width: 350, height: 500 },
  },
  {
    id: "guestbook",
    title: "Guestbook",
    icon: "/desktopicon/guestbook.png",
    component: Guestbook,
    defaultSize: { width: 350, height: 500 },
  },
];

const DOCK_APPS = ["about", "projects", "music", "paint", "guestbook"];

const MobileLayout: React.FC = () => {
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );
  const [isWide, setIsWide] = useState(false);
  const [time, setTime] = useState("");
  const sounds = useSystemSounds();

  useEffect(() => {
    const checkWidth = () => {
      setIsWide(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    
    // Update time
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => {
      window.removeEventListener("resize", checkWidth);
      clearInterval(interval);
    };
  }, []);

  const openAppHandler = (id: string) => {
    setOpenApp(id);
    sounds.openChime();
  };

  const closeAppHandler = () => {
    sounds.closeChime();
    setOpenApp(null);
  };

  const openProjectHandler = (project: ProjectData) => {
    setSelectedProject(project);
    setOpenApp("projects");
    sounds.openChime();
  };

  const renderCurrentApp = () => {
    if (!openApp) return null;

    const app = MOBILE_APPS.find((a) => a.id === openApp);
    if (!app) return null;

    if (app.id === "projects") {
      const AppContent = app.component as React.ComponentType<{
        selectedProject?: ProjectData | null;
      }>;
      return (
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-[#0F1729] flex flex-col overflow-hidden"
        >
          {/* iOS-like Home Indicator Area / Status Bar space */}
          <div className="pt-8 bg-black">
            <div className="flex items-center justify-between p-3 text-white">
              <button
                onClick={closeAppHandler}
                className="text-white hover:text-gray-300 px-2 flex items-center"
              >
                <span className="text-2xl leading-none">&lsaquo;</span>
                <span className="text-sm ml-1 font-medium">Home</span>
              </button>
              <div className="font-semibold text-center flex-1 pr-12">{app.title}</div>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-black relative">
            <AppContent selectedProject={selectedProject} />
          </div>
          {/* Bottom safe area */}
          <div className="h-6 bg-black w-full" />
        </motion.div>
      );
    }

    const AppContent = app.component;

    // Special case for Music Player: it provides its own top bar or is completely immersive
    const isMusic = app.id === "music";

    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
      >
        {!isMusic && (
          <div className="pt-8 bg-black">
            <div className="flex items-center justify-between p-3 text-white">
              <button
                onClick={closeAppHandler}
                className="text-white hover:text-gray-300 px-2 flex items-center"
              >
                <span className="text-2xl leading-none">&lsaquo;</span>
                <span className="text-sm ml-1 font-medium">Home</span>
              </button>
              <div className="font-semibold text-center flex-1 pr-12">{app.title}</div>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden relative">
          <AppContent />
          {/* For music, add a subtle back button overlay if it covers the whole screen */}
          {isMusic && (
            <button
               onClick={closeAppHandler}
               className="absolute top-8 left-4 z-50 w-10 h-10 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
            >
              <span className="text-2xl leading-none">&lsaquo;</span>
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/wallpaper/wall1.png')" }}>
      {/* Dark overlay for better icon visibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-2 text-white font-semibold flex justify-between items-center text-sm md:text-base drop-shadow-md">
        <div>{time}</div>
        <div className="flex gap-2 items-center">
          {/* Mock icons for battery/wifi */}
          <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>
          <div className="w-6 h-3 border border-white rounded-sm relative"><div className="absolute inset-[1px] right-1 bg-white"></div></div>
        </div>
      </div>

      {isWide ? (
        // TABLET / DESKTOP LANDSCAPE MODE - iPad style 4x4 grid
        <div className="flex flex-col h-full pt-12 pb-28 px-6 relative z-10">
          {/* Date/Time Widget at top */}
          <div className="px-4 mb-6">
            <div className="text-white text-4xl font-light drop-shadow-md">{time}</div>
            <div className="text-white/80 text-lg drop-shadow-md">Today</div>
          </div>
          
          {/* 4x4 Project Grid - iPad home screen style */}
<div className="grid grid-cols-4 gap-6 place-items-center flex-1 px-4 pb-10 overflow-y-auto">
             {projects.slice(0, 16).map((project) => (
               <div key={project.id} className="w-full flex justify-center">
                <ProjectIcon
                  project={project}
                  onClick={() => openProjectHandler(project)}
                  size="large"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // MOBILE PHONE PORTRAIT MODE
        <div className="flex flex-col h-full pt-16 pb-32 px-4 gap-6 relative z-10">
          {/* Weather / Date Widget Mockup */}
          <div className="px-2 py-4">
             <div className="text-white text-4xl font-light drop-shadow-md">{time}</div>
             <div className="text-white/80 text-lg font-medium drop-shadow-md">Today</div>
          </div>
          
          <div className="grid grid-cols-4 gap-x-4 gap-y-8 place-items-center overflow-y-auto content-start flex-1 pb-10 hide-scrollbar">
            {projects.map((project) => (
              <ProjectIcon
                key={project.id}
                project={project}
                onClick={() => openProjectHandler(project)}
              />
            ))}
          </div>
        </div>
      )}

      {/* DOCK */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 ${isWide ? 'w-max px-6' : 'w-[92%] max-w-md'}`}>
        <div className="bg-white/20 backdrop-blur-2xl rounded-[2rem] p-3 md:p-4 border border-white/30 shadow-2xl">
          <div className={`flex items-center gap-4 ${isWide ? 'justify-center' : 'justify-around'}`}>
            {DOCK_APPS.map((appId) => {
              const app = MOBILE_APPS.find((a) => a.id === appId);
              if (!app) return null;

              return (
                <motion.button
                  key={app.id}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => openAppHandler(app.id)}
                  className="flex flex-col items-center group"
                >
                  <div className={`flex items-center justify-center bg-white/10 rounded-2xl group-hover:bg-white/20 transition-colors shadow-sm
                    ${isWide ? 'w-16 h-16 md:w-20 md:h-20' : 'w-14 h-14'}`}>
                    {typeof app.icon === "string" ? (
                      <img
                        src={app.icon}
                        alt={app.title}
                        className={`${isWide ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8'} object-contain drop-shadow-md`}
                        draggable={false}
                      />
                    ) : (
                      <app.icon className={`${isWide ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8'} text-white drop-shadow-md`} />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>{renderCurrentApp()}</AnimatePresence>
      
      {/* Hide scrollbar styles for cleaner mobile look */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default MobileLayout;