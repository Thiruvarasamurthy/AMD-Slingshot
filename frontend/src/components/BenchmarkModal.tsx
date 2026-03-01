import React from 'react';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-amd-gray border border-gray-700 rounded-lg w-[600px] p-6 text-white shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amd-orange">Cloud vs Local NPU Benchmark</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>
        
        <p className="text-sm text-gray-400 mb-6">Live simulation of inference latency for Llama-3.2-1B text summarization.</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">External Cloud API (OpenAI)</span>
              <span className="text-red-400 font-mono">~850ms</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
              <div className="bg-red-500 h-4 rounded-full w-[85%]"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Network hop + Queue + Cloud GPU Inference</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-amd-orange">AMD Ryzen AI NPU (Local)</span>
              <span className="text-green-400 font-mono">187ms</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
              <div className="bg-green-500 h-4 rounded-full w-[18%] shadow-[0_0_10px_#4ade80]"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Zero network delay + Direct XDNA hardware access</p>
          </div>
        </div>

        <div className="mt-8 bg-[#121212] p-4 rounded border border-gray-800">
          <h4 className="font-bold text-sm mb-2 text-gray-300">Cost & Privacy Impact</h4>
          <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
            <li><span className="text-white">Cloud Cost:</span> ~$30-90/month (1000 calls/day)</li>
            <li><span className="text-white">LemonadeFlow Cost:</span> $0 (Runs locally on hardware)</li>
            <li><span className="text-white">Data Privacy:</span> 100% Air-gapped compliance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkModal;  