import { coordinatorAgent, researchAgent, synthesisAgent } from '@/lib/agents';
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, mode } = body as { query: string; mode?: string };

    if (!query) {
      return new Response('Query is required', { status: 400 });
    }

    // Stream the research process
    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: `You are ResearchFlow, an AI research assistant that creates interactive knowledge graphs.

When given a research question, you:
1. Break it down into sub-questions
2. Research each aspect thoroughly
3. Synthesize findings into insights
4. Identify knowledge gaps

Respond in a structured JSON format that can be visualized as a graph.`,
      prompt: `Research question: "${query}"

Please provide a comprehensive research plan with:
1. Main question analysis
2. 3-5 sub-questions to explore
3. Expected information types needed
4. Potential sources or approaches

Format your response as JSON with this structure:
{
  "mainQuestion": { "title": "...", "summary": "..." },
  "subQuestions": [
    { "id": "1", "question": "...", "rationale": "..." }
  ],
  "methodology": "...",
  "expectedOutputs": ["..."]
}`,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Research API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
