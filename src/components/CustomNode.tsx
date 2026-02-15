'use client';

import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { ResearchNode } from '@/lib/agents';
import { Sparkles, FileText, Lightbulb, AlertCircle, Link as LinkIcon } from 'lucide-react';

export default function CustomNode({ data }: NodeProps<ResearchNode>) {
  const getIcon = () => {
    switch (data.type) {
      case 'question':
        return <Sparkles className="w-4 h-4" />;
      case 'finding':
        return <FileText className="w-4 h-4" />;
      case 'insight':
        return <Lightbulb className="w-4 h-4" />;
      case 'gap':
        return <AlertCircle className="w-4 h-4" />;
      case 'source':
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (data.type) {
      case 'question':
        return 'bg-blue-500';
      case 'finding':
        return 'bg-green-500';
      case 'insight':
        return 'bg-amber-500';
      case 'gap':
        return 'bg-red-500';
      case 'source':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 ${getColor().replace('bg-', 'border-')} min-w-[200px] max-w-[300px]`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-start gap-2">
        <div className={`${getColor()} text-white p-2 rounded-md flex-shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
            {data.title}
          </div>
          <div className="text-xs text-gray-600 line-clamp-2">
            {data.content}
          </div>
          {data.confidence && (
            <div className="mt-2 flex items-center gap-1">
              <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getColor()}`}
                  style={{ width: `${data.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round(data.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
