import { NextRequest, NextResponse } from 'next/server';
import { analyzeIndividualThreat, correlateThreats, coordinateResponse, ThreatEvent } from '@/lib/agents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { event, relatedEvents } = await req.json();

    // Step 1: Individual threat analysis
    const assessment = await analyzeIndividualThreat(event as ThreatEvent);

    // Step 2: Correlation analysis if related events exist
    let correlation = null;
    if (relatedEvents && relatedEvents.length > 0) {
      const allEvents = [event, ...relatedEvents];
      const allAssessments = [assessment]; // In real system, would fetch other assessments
      correlation = await correlateThreats(allEvents, allAssessments);
    }

    // Step 3: Response coordination
    const availableResources = [
      'Security Team Alpha',
      'Technical Response Unit',
      'Command Center',
      'Perimeter Patrol',
      'Cyber Defense Team',
    ];

    const response = await coordinateResponse(
      assessment,
      correlation || { coordinatedThreat: false, riskScore: assessment.confidence, patterns: [] },
      availableResources
    );

    return NextResponse.json({
      assessment,
      correlation,
      response,
      status: 'complete',
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze threat', details: error.message },
      { status: 500 }
    );
  }
}
