import { NextRequest, NextResponse } from 'next/server';
import { generateSitRep } from '@/lib/agents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { events, assessments, responses } = await req.json();

    const sitrep = await generateSitRep(events, assessments, responses);

    return NextResponse.json({
      sitrep,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('SITREP error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SITREP', details: error.message },
      { status: 500 }
    );
  }
}
