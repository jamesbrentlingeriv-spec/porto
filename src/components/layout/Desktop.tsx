import React, { useState, useEffect } from 'react';
import DesktopIcon from '../desktop/DesktopIcon';
import Window from './Window';
import Screensaver from './Screensaver';
import SoundToggle from './SoundToggle';
import { useSystemSounds } from '../../hooks/useSystemSounds';
import type { AppConfig } from '../../data/appsConfig';

// Apps
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import { MusicPlayer } from '../apps/MusicPlayer';
import PaintApp from '../apps/PaintApp';
import Guestbook from '../apps/Guestbook';

const WALLPAPERS = ['/wallpaper/wall1.png', '/wallpaper/wall2.png', '/wallpaper/wall3.png'];

const APPS: AppConfig[] = [
  { id: 'about', title: 'IamJames', icon: '/desktopicon/aboutme.png', component: AboutApp, defaultSize: { width: 500, height: 400 } },
  { id: 'projects', title: 'My Projects', icon: '/desktopicon/projects.png', component: ProjectsApp, defaultSize: { width: 680, height: 520 } },
  { id: 'music', title: 'My Music', icon: '/desktopicon/musicplayer.png', component: MusicPlayer, defaultSize: { width: 350, height: 200 } },
  { id: 'paint', title: 'Paint', icon: '/desktopicon/paint.png', component: PaintApp, defaultSize: { width: 600, height: 500 } },
  { id: 'guestbook', title: 'Guestbook', icon: '/desktopicon/guestbook.png', component: Guestbook, defaultSize: { width: 450, height: 550 } },
];

const Desktop: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({});
  const [baseZIndex, setBaseZIndex] = useState(10);
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const sounds = useSystemSounds();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const resetTimer = () => {
      setIsScreensaverActive(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScreensaverActive(true), 60000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, []);

  // Cycle wallpaper every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWallpaperIndex(prev => (prev + 1) % WALLPAPERS.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const openApp = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows(prev => [...prev, id]);
      sounds.openChime();
    }
    focusWindow(id);
  };

  const closeApp = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w !== id));
    sounds.closeChime();
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const focusWindow = (id: string) => {
    setActiveWindow(id);
    const nextZIndex = baseZIndex + 1;
    setBaseZIndex(nextZIndex);
    setWindowZIndices(prev => ({ ...prev, [id]: nextZIndex }));
  };

  return (
    <div
      className="w-full h-full relative p-4 flex flex-col flex-wrap content-start gap-2 bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${WALLPAPERS[wallpaperIndex]})` }}
    >
      {/* Screensaver */}
      {isScreensaverActive && <Screensaver />}

      {/* Desktop Icons */}
      {APPS.map((app) => (
        <DesktopIcon
          key={app.id}
          id={app.id}
          label={app.title}
          icon={app.icon}
          onDoubleClick={() => openApp(app.id)}
        />
      ))}

      {/* Taskbar area at bottom */}
      <div className="absolute bottom-2 right-2 z-100">
        <SoundToggle />
      </div>

      {/* Open Windows */}
      {openWindows.map((id, index) => {
        const app = APPS.find(a => a.id === id);
        if (!app) return null;
        
        const AppContent = app.component;

        return (
          <Window
            key={id}
            id={id}
            title={app.title}
            isActive={activeWindow === id}
            zIndex={windowZIndices[id] || 10}
            onClose={() => closeApp(id)}
            onFocus={() => focusWindow(id)}
            defaultSize={app.defaultSize}
            defaultPosition={{ x: 50 + index * 20, y: 50 + index * 20 }}
          >
            <AppContent />
          </Window>
        );
      })}
    </div>
  );
};

export default Desktop;