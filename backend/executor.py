import json
from typing import List, Dict, Any
from nodes.registry import NodeRegistry

class PipelineExecutor:
    def __init__(self, nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]):
        self.nodes = {node["id"]: node for node in nodes}
        self.edges = edges
        
        # Build adjacency list and in-degree counts for topological sort
        self.adj_list = {node["id"]: [] for node in nodes}
        self.in_degree = {node["id"]: 0 for node in nodes}
        
        for edge in edges:
            src = edge["source"]
            dst = edge["target"]
            if src in self.adj_list and dst in self.in_degree:
                self.adj_list[src].append(dst)
                self.in_degree[dst] += 1

    def topological_sort(self) -> List[Dict[str, Any]]:
        # Kahn's Algorithm to sort nodes from trigger to output
        queue = [n_id for n_id, deg in self.in_degree.items() if deg == 0]
        sorted_nodes = []
        
        while queue:
            curr = queue.pop(0)
            sorted_nodes.append(self.nodes[curr])
            for neighbor in self.adj_list[curr]:
                self.in_degree[neighbor] -= 1
                if self.in_degree[neighbor] == 0:
                    queue.append(neighbor)
                    
        if len(sorted_nodes) != len(self.nodes):
            raise ValueError("Cycle detected in the pipeline. Workflows must be directed acyclic graphs (DAGs).")
            
        return sorted_nodes

    async def execute(self, initial_payload: Any = None) -> Dict[str, Any]:
        sorted_nodes = self.topological_sort()
        execution_log = []
        current_payload = initial_payload or {}
        
        for node in sorted_nodes:
            # Determine the node type (mapping frontend ReactFlow types to backend registry types)
            node_type = node.get("type", "unknown")
            node_id = node.get("id")
            node_data = node.get("data", {})
            
            # PHASE 3: Execute the AI logic via the NodeRegistry
            current_payload = await NodeRegistry.execute(node_type, node_data, current_payload)
            
            # Format log entry for the frontend execution log panel
            meta = current_payload.get("_metadata", {})
            exec_ms = meta.get("execution_time_ms", 0)
            backend_used = meta.get("backend", "UNKNOWN")
            
            log_entry = {
                "node_id": node_id,
                "node_type": node_type,
                "message": f"[{backend_used}]: Completed in {exec_ms}ms",
                "payload": current_payload
            }
            execution_log.append(log_entry)
            
        return {
            "status": "success",
            "log": execution_log,
            "final_output": current_payload
        }   