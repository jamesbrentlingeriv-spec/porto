import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Lock, Unlock } from 'lucide-react';
import { useDragLock } from '../../context/DragLockContext';

const COLORS = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(2);
  const { locked, setLocked } = useDragLock();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    // Lock window when starting to draw
    setLocked(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Unlock window when drawing stops
    setLocked(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col h-full font-mono gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-gray-900 p-2 border-2 border-white">
        <div className="flex gap-1">
          {COLORS.map(c => (
            <button
              key={c}
              className={`w-6 h-6 border-2 ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="h-6 w-px bg-white mx-2" />
        <div className="flex items-center gap-2 text-sm">
          <span>SIZE:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-white cursor-pointer"
          />
        </div>
        <div className="h-6 w-px bg-white mx-2" />
        <button onClick={clearCanvas} className="p-1 hover:bg-white hover:text-black flex items-center gap-1 text-sm border border-transparent hover:border-black">
          <Eraser size={14} /> CLEAR
        </button>
        <div className="h-6 w-px bg-white mx-2" />
        <button
          onClick={(e) => { e.stopPropagation(); setLocked(!locked); }}
          className={`flex items-center gap-1 text-xs p-1 border ${locked ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-400 hover:border-white'}`}
        >
          {locked ? <Lock size={12} /> : <Unlock size={12} />}
          <span className="hidden sm:inline">{locked ? 'LOCKED' : 'LOCK'}</span>
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-black border-2 border-white overflow-hidden relative" style={{ cursor: locked ? 'crosshair' : 'default' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full object-contain touch-none"
        />
      </div>
    </div>
  );
};

export default PaintApp;