'use client';

import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface ResearchPanelProps {
  onResearchComplete?: (data: any) => void;
}

export default function ResearchPanel({ onResearchComplete }: ResearchPanelProps) {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsResearching(true);
    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Research failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          aiResponse += chunk;
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);

      if (onResearchComplete) {
        onResearchComplete({ query, response: aiResponse });
      }
    } catch (error) {
      console.error('Research error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred during research.' },
      ]);
    } finally {
      setIsResearching(false);
      setQuery('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          ResearchFlow
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          AI-powered research with interactive knowledge graphs
        </p>
      </div>

      {/* Search Input */}
      <div className="p-6 border-b">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                setQuery(input.value);
              }}
              placeholder="Ask a research question..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isResearching}
            />
          </div>
          <button
            type="submit"
            disabled={isResearching || !query.trim()}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Start Research
              </>
            )}
          </button>
        </form>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start Your Research Journey
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Ask any research question and watch as AI agents build an interactive
              knowledge graph in real-time.
            </p>
            <div className="mt-8 space-y-2 text-left max-w-md mx-auto">
              <p className="text-xs font-semibold text-gray-700">Try asking:</p>
              <button
                onClick={() =>
                  setQuery('How does CRISPR gene editing work and what are its applications?')
                }
                className="block w-full text-left text-sm text-blue-600 hover:bg-blue-50 p-3 rounded-lg"
              >
                How does CRISPR gene editing work?
              </button>
              <button
                onClick={() =>
                  setQuery('What are the latest developments in quantum computing?')
                }
                className="block w-full text-left text-sm text-blue-600 hover:bg-blue-50 p-3 rounded-lg"
              >
                What are the latest developments in quantum computing?
              </button>
              <button
                onClick={() => setQuery('Explain the economic impact of AI automation')}
                className="block w-full text-left text-sm text-blue-600 hover:bg-blue-50 p-3 rounded-lg"
              >
                Explain the economic impact of AI automation
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-50 ml-8'
                  : 'bg-gray-50 mr-8'
              }`}
            >
              <div className="text-xs font-semibold text-gray-600 mb-1">
                {message.role === 'user' ? 'You' : 'ResearchFlow AI'}
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
