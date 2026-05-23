import React, { useState } from "react";
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

const DOCK_APPS = ["about", "projects", "music", "guestbook"]; // Apps that appear in the dock

const MobileLayout: React.FC = () => {
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  ); // Added selected project state
  const [activeTab, setActiveTab] = useState<"apps" | "projects">("apps"); // Added tab state
  const sounds = useSystemSounds();

  const openAppHandler = (id: string) => {
    setOpenApp(id);
    sounds.openChime();
  };

  const closeAppHandler = () => {
    sounds.closeChime();
    setOpenApp(null);
  };

  const openProjectHandler = (project: ProjectData) => {
    // Set the selected project and open the Projects app
    setSelectedProject(project);
    setOpenApp("projects");
    sounds.openChime();
  };

  const renderCurrentApp = () => {
    if (!openApp) return null;

    const app = MOBILE_APPS.find((a) => a.id === openApp);
    if (!app) return null;

    // Special handling for ProjectsApp to pass selected project
    if (app.id === "projects") {
      const AppContent = app.component as React.ComponentType<{
        selectedProject?: ProjectData | null;
      }>;
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          {/* App Header */}
          <div className="flex items-center justify-between p-4 bg-white text-black">
            <button
              onClick={closeAppHandler}
              className="text-lg font-bold px-3 py-1 bg-black text-white"
            >
              ×
            </button>
            <div className="font-bold text-center flex-1">{app.title}</div>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* App Content with selected project */}
          <div className="flex-1 overflow-auto p-2">
            <AppContent selectedProject={selectedProject} />
          </div>
        </motion.div>
      );
    }

    const AppContent = app.component;

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* App Header */}
        <div className="flex items-center justify-between p-4 bg-white text-black">
          <button
            onClick={closeAppHandler}
            className="text-lg font-bold px-3 py-1 bg-black text-white"
          >
            ×
          </button>
          <div className="font-bold text-center flex-1">{app.title}</div>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-auto p-2">
          <AppContent />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-screen bg-linear-to-b from-blue-400 to-blue-600 relative overflow-hidden touch-none">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 text-white font-bold text-center">
        <div className="text-sm">9:41</div>
      </div>

      {/* Tab Selector */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 flex bg-white/30 backdrop-blur-sm rounded-full p-1">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "apps" ? "bg-white text-blue-600" : "text-white"
          }`}
          onClick={() => setActiveTab("apps")}
        >
          Apps
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "projects" ? "bg-white text-blue-600" : "text-white"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
      </div>

      {/* App/Project Grid - 4x4 layout */}
      <div className="grid grid-cols-4 grid-rows-4 h-[calc(100%-100px)] pt-16 pb-24 px-4 gap-4 place-items-center">
        {activeTab === "apps"
          ? // Render App Icons
            MOBILE_APPS.map((app) => (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => openAppHandler(app.id)}
                className="flex flex-col items-center justify-center w-16 h-16"
              >
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-1 border-2 border-white/30">
                  {typeof app.icon === "string" ? (
                    <img
                      src={app.icon}
                      alt={app.title}
                      className="w-8 h-8 object-contain"
                      draggable={false}
                    />
                  ) : (
                    <app.icon className="w-8 h-8 text-white" />
                  )}
                </div>
                <span className="text-xs text-white font-medium text-center bg-black/30 px-1 rounded">
                  {app.title}
                </span>
              </motion.button>
            ))
          : // Render Project Icons using the ProjectIcon component
            projects.map((project) => {
              return (
                <ProjectIcon
                  key={project.id}
                  project={project}
                  onClick={() => openProjectHandler(project)}
                />
              );
            })}
      </div>

      {/* Dock - Fixed at bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-3 border border-white/30">
          <div className="flex justify-around">
            {DOCK_APPS.map((appId) => {
              const app = MOBILE_APPS.find((a) => a.id === appId);
              if (!app) return null;

              return (
                <motion.button
                  key={app.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openAppHandler(app.id)}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                    {typeof app.icon === "string" ? (
                      <img
                        src={app.icon}
                        alt={app.title}
                        className="w-6 h-6 object-contain"
                        draggable={false}
                      />
                    ) : (
                      <app.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render open app */}
      <AnimatePresence>{renderCurrentApp()}</AnimatePresence>
    </div>
  );
};

export default MobileLayout;
