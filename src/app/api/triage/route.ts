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
  vitalSignsConcerns: z.array(z.string()).optional().describe('Vital signs that should be monitored'),
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

Context: This assessment is for healthcare workers in under-resourced clinic settings where immediate physician access may be limited.

Instructions:
1. Determine urgency level:
   - IMMEDIATE: Life-threatening conditions requiring immediate intervention
     • Severe breathing difficulty or airway obstruction
     • Severe bleeding or shock
     • Chest pain suggesting cardiac event
     • Altered mental status or unconsciousness
     • Severe trauma or injuries
     • Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty)

   - URGENT: Serious conditions requiring prompt care within 1-2 hours
     • Moderate to severe pain
     • High fever with concerning symptoms
     • Persistent vomiting or diarrhea
     • Significant injuries without immediate threat
     • Worsening chronic conditions

   - NON-URGENT: Stable conditions that can wait for routine care
     • Minor injuries
     • Mild symptoms of short duration
     • Chronic condition follow-ups without acute changes
     • Preventive care

2. Extract all key symptoms mentioned
3. Provide a clear clinical summary highlighting primary concern, risk factors, and expected course
4. Give specific, prioritized recommendations for immediate care
5. List possible differential diagnoses to consider
6. Identify vital signs that should be monitored

Focus on patient safety and actionable guidance for resource-limited settings.`,
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
