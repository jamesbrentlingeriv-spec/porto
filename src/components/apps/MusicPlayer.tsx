import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
} from "lucide-react";

const TRACKS = [
  "Dead and Gone (And So's Her Nagging).mp3",
  "Death.mp3",
  "Entre Pasillos.mp3",
  "Grace in the Feedback.mp3",
  "I'll live for him.mp3",
  "Last Breath Glass.mp3",
  "Never Say You're Scared.mp3",
  "One Last Goodbye (Remastered) (Remix) (Remix).mp3",
  "Pal Optical.mp3",
  "Stone And Fire.mp3",
  "Take You Home.mp3",
  "by and by.mp3",
  "whyd you have to go.mp3",
];

// Deterministic bar heights that give a "random" visualizer look
const BAR_HEIGHTS = [85, 45, 70, 30, 95, 55, 40, 80, 65, 25, 90, 60];

// Static visualizer heights for paused state
const STATIC_VISUALIZER_HEIGHTS = BAR_HEIGHTS.map((height) => height * 0.5);

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(() =>
    BAR_HEIGHTS.map((height) => height * (0.5 + Math.random() * 0.5)),
  );

  // Store the initial random heights to revert to when paused
  const initialHeights = useRef<number[]>([]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `/music/${TRACKS[currentTrack]}`;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.log("Audio play error:", error));
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update visualizer heights when playing state changes
  useEffect(() => {
    let interval: number;

    if (isPlaying) {
      // Store the current heights before starting animation
      initialHeights.current = [...STATIC_VISUALIZER_HEIGHTS];
      
      // Update heights periodically to create animation effect
      interval = window.setInterval(() => {
        setVisualizerHeights((prevHeights) =>
          prevHeights.map(
            (height) =>
              BAR_HEIGHTS[prevHeights.indexOf(height)] *
              (0.5 + Math.random() * 0.5),
          ),
        );
      }, 150); // Update every 150ms for animation effect
    } else {
      // When not playing, set static visualizer heights using a timeout to avoid sync state update
      setTimeout(() => {
        setVisualizerHeights(STATIC_VISUALIZER_HEIGHTS);
      }, 0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => console.log("Audio play error:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleEnded = () => {
    handleNext();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full font-mono bg-gray-900 text-white p-4 border-2 border-white">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={`/music/${TRACKS[currentTrack]}`}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onEnded={handleEnded}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
      />

      {/* Track Info */}
      <div className="mb-4 text-center">
        <div className="text-lg font-bold truncate">
          {TRACKS[currentTrack].replace(".mp3", "")}
        </div>
        <div className="text-sm opacity-75">Now Playing</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>{formatTime(progress)}</span>
          <span>{duration ? formatTime(duration) : "0:00"}</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex-1 flex items-end justify-between gap-1 mb-4 px-2">
        {BAR_HEIGHTS.map((_height, i) => (
          <div
            key={i}
            className="w-full bg-white transition-all duration-150"
            style={{
              height: `${Math.max(visualizerHeights[i], 5)}%`,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="p-2 border border-white hover:bg-white hover:text-black transition-colors"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 border border-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
            style={{ width: "36px", height: "36px" }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={handleNext}
            className="p-2 border border-white hover:bg-white hover:text-black transition-colors"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="p-1">
            {isMuted || volume === 0 ? (
              <VolumeX size={16} />
            ) : (
              <Volume2 size={16} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
};
