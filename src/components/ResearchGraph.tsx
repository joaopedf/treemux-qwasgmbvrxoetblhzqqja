'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Panel,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import type { ResearchNode } from '@/lib/agents';

type FlowNode = Node<ResearchNode>;

interface ResearchGraphProps {
  initialNodes?: FlowNode[];
  initialEdges?: Edge[];
  onNodeClick?: (node: FlowNode) => void;
}

const nodeColor = (type: string) => {
  switch (type) {
    case 'question':
      return '#3b82f6'; // blue
    case 'finding':
      return '#10b981'; // green
    case 'insight':
      return '#f59e0b'; // amber
    case 'gap':
      return '#ef4444'; // red
    case 'source':
      return '#8b5cf6'; // purple
    default:
      return '#6b7280'; // gray
  }
};

export default function ResearchGraph({
  initialNodes = [],
  initialEdges = [],
  onNodeClick,
}: ResearchGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => nodeColor(node.data?.type || 'question')}
          nodeStrokeWidth={3}
        />
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-sm font-semibold mb-2">Legend</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Question</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Finding</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Insight</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Gap</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
