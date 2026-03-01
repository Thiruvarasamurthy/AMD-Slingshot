import React, { useState, useCallback, useRef } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    Connection,
    Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ExecutionLog from './components/ExecutionLog';
import { nodeTypes } from './components/CustomNodes';

let id = 0;
const getId = () => `node_${id++}`;

const App = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);

    const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const backendType = event.dataTransfer.getData('application/reactflow/backendType');
            const label = event.dataTransfer.getData('application/reactflow/label');
            const sublabel = event.dataTransfer.getData('application/reactflow/sublabel');
            const icon = event.dataTransfer.getData('application/reactflow/icon');

            if (typeof type === 'undefined' || !type) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label, sublabel, icon },
                // We store backendType inside the root type for the executor to read
                ...{ type: backendType }
            };

            // @ts-ignore
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const runPipeline = async () => {
        if (nodes.length === 0) return;
        setIsRunning(true);
        setLogs([]);

        try {
            // Step 1: Save the pipeline to DB first
            const saveRes = await axios.post('/api/pipelines', {
                name: `Hackathon_Run_${Date.now()}`,
                description: "Execution triggered from canvas",
                nodes_json: JSON.stringify(nodes),
                edges_json: JSON.stringify(edges)
            });

            const pipelineId = saveRes.data.id;

            // Step 2: Execute it
            const execRes = await axios.post(`/api/pipelines/${pipelineId}/execute`);

            if (execRes.data.status === 'success') {
                setLogs(execRes.data.log);
            }
        } catch (error: any) {
            console.error("Execution failed:", error);
            setLogs([{
                node_id: "system",
                node_type: "error",
                message: "Pipeline execution failed.",
                payload: error.response?.data || error.message
            }]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-[#050505] overflow-hidden">
            <TopBar onRun={runPipeline} isRunning={isRunning} />

            <div className="flex flex-row flex-1 overflow-hidden relative">
                <Sidebar />

                <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            nodeTypes={nodeTypes}
                            fitView
                            colorMode="dark"
                        >
                            <Background color="#333" gap={16} />
                            <Controls className="bg-amd-gray border-gray-700 fill-white" />
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>

                <ExecutionLog logs={logs} />
            </div>
        </div>
    );
};

export default App; 