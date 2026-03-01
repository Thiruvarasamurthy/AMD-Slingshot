import React from 'react';
import { templates } from '../utils/templates';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (nodes: any[], edges: any[]) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, onLoadTemplate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-amd-gray border border-gray-700 rounded-lg w-[600px] p-6 text-white shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amd-orange">Pipeline Gallery</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>
        <div className="space-y-4">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-[#121212] border border-gray-800 p-4 rounded-md hover:border-amd-orange transition flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{tpl.name}</h3>
                <p className="text-sm text-gray-400">{tpl.description}</p>
              </div>
              <button 
                onClick={() => {
                  onLoadTemplate(tpl.nodes, tpl.edges);
                  onClose();
                }}
                className="bg-amd-orange hover:bg-orange-600 px-4 py-2 rounded text-sm font-bold"
              >
                Load
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;