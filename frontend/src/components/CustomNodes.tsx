import { Handle, Position } from '@xyflow/react';

const nodeBaseStyle = "px-4 py-3 shadow-md rounded-md border-2 bg-amd-gray text-white min-w-[150px]";

export const TriggerNode = ({ data }: any) => (
  <div className={`${nodeBaseStyle} border-blue-500`}>
    <div className="flex items-center">
      <div className="text-lg mr-2">{data.icon}</div>
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs text-gray-400">{data.sublabel}</div>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
  </div>
);

export const ActionNode = ({ data }: any) => (
  <div className={`${nodeBaseStyle} border-amd-red`}>
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-amd-red" />
    <div className="flex items-center">
      <div className="text-lg mr-2">{data.icon}</div>
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs text-gray-400">{data.sublabel}</div>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-amd-red" />
  </div>
);

export const OutputNode = ({ data }: any) => (
  <div className={`${nodeBaseStyle} border-green-500`}>
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500" />
    <div className="flex items-center">
      <div className="text-lg mr-2">{data.icon}</div>
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs text-gray-400">{data.sublabel}</div>
      </div>
    </div>
  </div>
);

// Map ALL backend types to their visual ReactFlow component
export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  output: OutputNode,
  gmail_trigger: TriggerNode,
  voice_trigger: TriggerNode,
  file_watcher: TriggerNode,
  llama_summarize: ActionNode,
  entity_extract: ActionNode,
  auto_draft: ActionNode,
  smart_file_router: ActionNode,
  kokoro_tts: OutputNode,
  jira_post: OutputNode
};