import React from 'react';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, backendType: string, label: string, sublabel: string, icon: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/backendType', backendType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.setData('application/reactflow/sublabel', sublabel);
    event.dataTransfer.setData('application/reactflow/icon', icon);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-amd-black border-r border-gray-800 p-4 flex flex-col gap-4 text-white overflow-y-auto z-10">
      <div className="text-amd-orange font-bold text-xl mb-2 flex items-center gap-2">
        🍋 LemonadeFlow
      </div>

      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Triggers</div>
      <div className="bg-amd-gray border border-blue-500/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'trigger', 'gmail_trigger', 'Gmail Trigger', 'OAuth Polling', '📧')} draggable>
        📧 Gmail Trigger
      </div>
      <div className="bg-amd-gray border border-blue-500/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'trigger', 'voice_trigger', 'Voice Trigger', 'Whisper-V3', '🎤')} draggable>
        🎤 Voice Trigger
      </div>
      <div className="bg-amd-gray border border-blue-500/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'trigger', 'file_watcher', 'File Watcher', 'Auto-route', '📁')} draggable>
        📁 File Watcher
      </div>

      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-4">AI Actions (NPU)</div>
      <div className="bg-amd-gray border border-amd-red/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'action', 'llama_summarize', 'Llama Summarize', 'Llama-3.2-1B', '🤖')} draggable>
        🤖 Llama Summarize
      </div>
      <div className="bg-amd-gray border border-amd-red/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'action', 'entity_extract', 'Entity Extract', 'JSON Output', '📋')} draggable>
        📋 Entity Extract
      </div>
      <div className="bg-amd-gray border border-amd-red/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'action', 'auto_draft', 'Auto-Draft', 'Smart Reply', '📝')} draggable>
        📝 Auto-Draft Reply
      </div>
      <div className="bg-amd-gray border border-amd-red/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'action', 'smart_file_router', 'Smart Router', 'Classification', '🗂️')} draggable>
        🗂️ Smart File Router
      </div>

      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-4">Outputs</div>
      <div className="bg-amd-gray border border-green-500/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'output', 'kokoro_tts', 'Kokoro TTS', 'Voice: af_sky', '🔊')} draggable>
        🔊 Kokoro TTS
      </div>
      <div className="bg-amd-gray border border-green-500/30 p-3 rounded cursor-grab hover:bg-gray-800 transition" onDragStart={(e) => onDragStart(e, 'output', 'jira_post', 'Jira Task', 'REST API', '📌')} draggable>
        📌 Jira Create Task
      </div>
    </aside>
  );
};

export default Sidebar;