import React from 'react';

interface LogEntry {
  node_id: string;
  node_type: string;
  message: string;
  payload: any;
}

interface ExecutionLogProps {
  logs: LogEntry[];
}

const ExecutionLog: React.FC<ExecutionLogProps> = ({ logs }) => {
  return (
    <aside className="w-80 bg-amd-black border-l border-gray-800 p-4 flex flex-col text-white z-10">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
        Terminal Log
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs">
        {logs.length === 0 && (
          <div className="text-gray-600 italic">Waiting for pipeline execution...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="bg-amd-gray border border-gray-800 p-2 rounded">
            <div className="text-green-400 font-bold mb-1">✓ [{log.node_type.toUpperCase()}]</div>
            <div className="text-gray-300 mb-1">{log.message}</div>
            <div className="text-gray-500 bg-black/50 p-1 rounded overflow-x-auto whitespace-pre">
              {JSON.stringify(log.payload, null, 2)}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ExecutionLog;