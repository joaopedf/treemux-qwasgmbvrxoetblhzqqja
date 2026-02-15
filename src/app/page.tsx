'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ResearchPanel from '@/components/ResearchPanel';
import type { ResearchNode } from '@/lib/agents';

// Dynamically import React Flow to avoid SSR issues
const ResearchGraph = dynamic(() => import('@/components/ResearchGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-gray-400">Loading graph...</div>
    </div>
  ),
});

export default function Home() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<ResearchNode | null>(null);

  const handleResearchComplete = (data: any) => {
    // This would parse the research data and update the graph
    console.log('Research complete:', data);
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node.data);
  };

  return (
    <main className="h-screen flex">
      {/* Left Panel - Research Interface */}
      <div className="w-96 border-r shadow-lg z-10">
        <ResearchPanel onResearchComplete={handleResearchComplete} />
      </div>

      {/* Right Panel - Knowledge Graph */}
      <div className="flex-1 relative">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center max-w-md px-6">
              <div className="text-6xl mb-4">🧠</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Interactive Knowledge Graphs
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Watch as AI agents break down your research question, explore
                multiple angles, and synthesize findings into an interactive
                knowledge network.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-600 mb-1">
                    Multi-Agent System
                  </div>
                  <div className="text-gray-600">
                    Coordinator, Research, Synthesis, and Fact-Check agents
                    working together
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-green-600 mb-1">
                    Real-Time Updates
                  </div>
                  <div className="text-gray-600">
                    Graph evolves as agents discover new information and insights
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-amber-600 mb-1">
                    Smart Synthesis
                  </div>
                  <div className="text-gray-600">
                    AI identifies patterns, connections, and knowledge gaps
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-purple-600 mb-1">
                    Interactive Exploration
                  </div>
                  <div className="text-gray-600">
                    Click any node to dive deeper or branch into new directions
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ResearchGraph
            initialNodes={nodes}
            initialEdges={edges}
            onNodeClick={handleNodeClick}
          />
        )}

        {/* Selected Node Detail */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 uppercase">
                {selectedNode.type}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <h3 className="text-lg font-bold mb-2">{selectedNode.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {selectedNode.content}
            </p>
            {selectedNode.confidence && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Confidence</span>
                  <span className="font-semibold">
                    {Math.round(selectedNode.confidence * 100)}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${selectedNode.confidence * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
