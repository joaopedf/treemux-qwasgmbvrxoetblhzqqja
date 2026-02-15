import { researchAgent } from '@/lib/agents';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nodeId, question } = body as { nodeId?: string; question: string };

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Research the specific question
    const result = await researchAgent(question);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Explore API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
