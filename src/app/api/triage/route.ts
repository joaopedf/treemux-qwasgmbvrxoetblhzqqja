import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const triageSchema = z.object({
  urgency: z.enum(['immediate', 'urgent', 'non-urgent']).describe('The urgency level of the patient case'),
  symptoms: z.array(z.string()).describe('List of key symptoms identified'),
  summary: z.string().describe('A concise clinical summary for healthcare workers'),
  recommendations: z.array(z.string()).describe('Specific actionable recommendations for immediate care'),
  differentialDiagnosis: z.array(z.string()).optional().describe('Possible conditions to consider'),
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: triageSchema,
      prompt: `You are an experienced emergency medicine physician conducting a preliminary triage assessment.

Analyze the following patient presentation and provide a structured triage assessment:

Patient Information:
${input}

Instructions:
1. Determine urgency level:
   - IMMEDIATE: Life-threatening conditions requiring immediate intervention (severe bleeding, chest pain, difficulty breathing, altered consciousness, severe trauma)
   - URGENT: Serious conditions requiring prompt care within 1-2 hours (moderate pain, infection signs, persistent symptoms)
   - NON-URGENT: Stable conditions that can wait for routine care (minor injuries, chronic condition follow-ups, mild symptoms)

2. Extract and list all key symptoms mentioned
3. Provide a clear, concise clinical summary suitable for healthcare workers
4. Give specific, actionable recommendations for immediate care
5. Consider possible differential diagnoses if applicable

Be thorough but concise. Focus on patient safety and appropriate care prioritization.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('Triage analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze patient data' },
      { status: 500 }
    );
  }
}
