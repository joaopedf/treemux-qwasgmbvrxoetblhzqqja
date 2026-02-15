import { synthesisAgent } from '@/lib/agents';
import type { ResearchNode } from '@/lib/agents';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { findings } = body as { findings: ResearchNode[] };

    if (!findings || !Array.isArray(findings)) {
      return NextResponse.json({ error: 'Findings array is required' }, { status: 400 });
    }

    // Synthesize the findings
    const result = await synthesisAgent(findings as ResearchNode[]);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Synthesize API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
