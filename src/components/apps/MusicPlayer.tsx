import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Home, Search, Library, Plus, Heart, Menu
} from 'lucide-react';

// Actual tracks from public/music folder
const TRACKS = [
  { src: "Dead and Gone (And So's Her Nagging).mp3", title: "Dead and Gone", artist: "James", album: "Unknown", duration: "3:45", color: "from-purple-600 to-blue-600" },
  { src: "Death.mp3", title: "Death", artist: "James", album: "Unknown", duration: "4:12", color: "from-red-600 to-orange-600" },
  { src: "Entre Pasillos.mp3", title: "Entre Pasillos", artist: "James", album: "Unknown", duration: "2:58", color: "from-blue-600 to-teal-600" },
  { src: "Grace in the Feedback.mp3", title: "Grace in the Feedback", artist: "James", album: "Unknown", duration: "3:20", color: "from-green-600 to-emerald-600" },
  { src: "I'll live for him.mp3", title: "I'll Live For Him", artist: "James", album: "Unknown", duration: "4:05", color: "from-yellow-600 to-amber-600" },
  { src: "Last Breath Glass.mp3", title: "Last Breath Glass", artist: "James", album: "Unknown", duration: "3:30", color: "from-pink-600 to-rose-600" },
  { src: "Never Say You're Scared.mp3", title: "Never Say You're Scared", artist: "James", album: "Unknown", duration: "3:55", color: "from-indigo-600 to-violet-600" },
  { src: "One Last Goodbye (Remastered) (Remix) (Remix).mp3", title: "One Last Goodbye", artist: "James", album: "Unknown", duration: "4:15", color: "from-cyan-600 to-sky-600" },
  { src: "Pal Optical.mp3", title: "Pal Optical", artist: "James", album: "Unknown", duration: "3:40", color: "from-fuchsia-600 to-purple-600" },
  { src: "Stone And Fire.mp3", title: "Stone And Fire", artist: "James", album: "Unknown", duration: "4:20", color: "from-slate-600 to-gray-600" },
  { src: "Take You Home.mp3", title: "Take You Home", artist: "James", album: "Unknown", duration: "3:50", color: "from-emerald-600 to-teal-600" },
  { src: "by and by.mp3", title: "By And By", artist: "James", album: "Unknown", duration: "3:10", color: "from-orange-600 to-red-600" },
  { src: "whyd you have to go.mp3", title: "Whyd You Have To Go", artist: "James", album: "Unknown", duration: "3:25", color: "from-violet-600 to-indigo-600" },
];

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);

  const currentTrackData = TRACKS[currentTrack];

  // Load audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      const expectedPath = `/music/${currentTrackData.src}`;
      if (audioRef.current.src !== expectedPath) {
        audioRef.current.src = expectedPath;
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    }
  }, [currentTrack, currentTrackData.src, isPlaying]);

  // Set up time update listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredTracks = TRACKS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#09090b] text-[#f4f4f5] font-sans overflow-hidden select-none">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#000000] p-6 flex flex-col justify-between border-r border-[#18181b]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xl tracking-wider px-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>MuseShell</span>
          </div>

          <nav className="space-y-3">
            <button 
              onClick={() => setShowLibrary(false)}
              className={`flex items-center gap-4 w-full text-left transition px-2 py-1.5 rounded-md ${
                !showLibrary ? 'text-zinc-200 bg-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Home size={20} /> Home
            </button>
            <button 
              onClick={() => setShowLibrary(true)}
              className={`flex items-center gap-4 w-full text-left transition px-2 py-1.5 rounded-md ${
                showLibrary ? 'text-zinc-200 bg-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Library size={20} /> Your Library
            </button>
          </nav>

          <hr className="border-zinc-800" />

          <div className="space-y-3">
            <button className="flex items-center gap-3 w-full text-zinc-400 hover:text-white text-sm transition font-medium px-2 py-1">
              <div className="bg-zinc-800 p-1 rounded-sm"><Plus size={16} /></div>
              Create Playlist
            </button>
            <button className="flex items-center gap-3 w-full text-zinc-400 hover:text-white text-sm transition font-medium px-2 py-1">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-400 p-1 rounded-sm text-white"><Heart size={16} fill="white" /></div>
              Liked Songs
            </button>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-900">
          <span className="text-xs text-zinc-500 font-semibold tracking-wider block mb-3 uppercase">Queue Preview</span>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {TRACKS.map((track, idx) => (
              <button 
                key={track.src}
                onClick={() => setCurrentTrack(idx)}
                className={`w-full flex items-center gap-3 p-2 rounded-md cursor-pointer transition text-left ${
                  idx === currentTrack ? 'bg-zinc-900 text-red-400' : 'hover:bg-zinc-950 text-zinc-400'
                }`}
              >
                <div className={`w-8 h-8 rounded bg-gradient-to-br ${track.color} flex-shrink-0`} />
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                  <p className="font-medium truncate text-zinc-200">{track.title}</p>
                  <p className="truncate text-zinc-500">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col relative bg-[#0a0a0a]">
        
        {showLibrary ? (
          /* Library View */
          <div className="flex flex-col h-full p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setShowLibrary(false)} className="p-2 hover:bg-white/10 rounded-full">
                <Menu size={20} />
              </button>
              <h2 className="text-lg font-semibold">Your Library</h2>
              <div className="w-10" />
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:bg-white/20 transition-colors"
              />
            </div>

            {/* Track list */}
            <div className="flex-1 overflow-y-auto pr-2">
              {filteredTracks.map((track) => {
                const idx = TRACKS.findIndex(t => t.src === track.src);
                return (
                  <button
                    key={track.src}
                    onClick={() => {
                      setCurrentTrack(idx);
                      setShowLibrary(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded bg-gradient-to-br ${track.color} flex-shrink-0`} />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium truncate">{track.title}</div>
                      <div className="text-sm opacity-60 truncate">{track.artist}</div>
                    </div>
                    <div className="text-xs opacity-50">{track.duration}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Now Playing View */
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
            {/* Album Art */}
            <div className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${currentTrackData.color} shadow-2xl mb-8 flex items-center justify-center`}>
              <div className="w-48 h-48 rounded-xl bg-black/20 backdrop-blur-sm" />
            </div>
            
            {/* Track Info */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{currentTrackData.title}</h1>
              <p className="text-lg opacity-70">{currentTrackData.artist}</p>
              <p className="text-sm opacity-50">{currentTrackData.album}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md mb-8 px-4">
              <div 
                className="h-1 bg-white/20 rounded-full overflow-hidden mb-2 cursor-pointer"
                onClick={(e) => {
                  if (!audioRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newTime = (clickX / rect.width) * duration;
                  audioRef.current.currentTime = newTime;
                  setProgress(newTime);
                }}
              >
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs opacity-60">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mb-8">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <SkipBack size={24} fill="white" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black hover:scale-105 transition-transform flex items-center justify-center"
              >
                {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
              </button>
              
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <SkipForward size={24} fill="white" />
              </button>
            </div>

            {/* Volume */}
            <div className="w-full max-w-md px-4 flex items-center gap-3">
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-white/10 rounded-full">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </main>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleNext}
        crossOrigin="anonymous"
      />
    </div>
  );
};