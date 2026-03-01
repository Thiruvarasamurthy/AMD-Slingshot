import React from 'react';

interface TopBarProps {
  onRun: () => void;
  isRunning: boolean;
  onOpenGallery: () => void;
  onOpenBenchmark: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onRun, isRunning, onOpenGallery, onOpenBenchmark }) => {
  return (
    <div className="h-14 bg-amd-black border-b border-gray-800 flex items-center justify-between px-4 text-white z-10 shrink-0">
      <div className="flex gap-2">
        <button className="px-3 py-1.5 bg-amd-gray hover:bg-gray-700 text-sm rounded border border-gray-700 transition">💾 Save</button>
        <button className="px-3 py-1.5 bg-amd-gray hover:bg-gray-700 text-sm rounded border border-gray-700 transition">📂 Load</button>
        <button onClick={onOpenGallery} className="px-3 py-1.5 bg-amd-gray hover:bg-gray-700 text-sm rounded border border-gray-700 transition text-amd-orange border-amd-orange/30 hover:border-amd-orange">🖼️ Gallery</button>
        <button onClick={onOpenBenchmark} className="px-3 py-1.5 bg-amd-gray hover:bg-gray-700 text-sm rounded border border-gray-700 transition text-green-400 border-green-500/30 hover:border-green-400">⚡ Benchmark</button>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 text-xs bg-gray-900 px-3 py-1.5 rounded border border-gray-800">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>AMD Lemonade Runtime: <strong className="text-green-400">ONLINE</strong></span>
        </div>
        
        <button 
          onClick={onRun}
          disabled={isRunning}
          className={`px-6 py-1.5 font-bold rounded transition flex items-center gap-2 ${isRunning ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-amd-orange hover:bg-orange-600 text-white'}`}
        >
          {isRunning ? '⏳ Running...' : '▶ RUN PIPELINE'}
        </button>
      </div>
    </div>
  );
};

export default TopBar;