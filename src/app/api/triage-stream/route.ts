import { NextRequest } from 'next/server';
import { streamObject } from 'ai';
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
      return new Response('Invalid input', { status: 400 });
    }

    const result = streamObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: triageSchema,
      prompt: `You are an experienced emergency medicine physician conducting a preliminary triage assessment in a resource-limited clinic setting.

Analyze the following patient presentation and provide a structured triage assessment:

Patient Information:
${input}

Context: This assessment is being used by healthcare workers in an under-resourced clinic where immediate physician access may be limited. Your assessment will help them prioritize care and make critical decisions.

Instructions:
1. Determine urgency level:
   - IMMEDIATE: Life-threatening conditions requiring immediate intervention
     • Severe breathing difficulty, choking, or airway obstruction
     • Severe bleeding or shock
     • Chest pain suggesting cardiac event
     • Altered mental status, unconsciousness, or seizures
     • Severe trauma or injuries
     • Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty)

   - URGENT: Serious conditions requiring prompt care within 1-2 hours
     • Moderate to severe pain
     • High fever with concerning symptoms
     • Persistent vomiting or diarrhea with dehydration
     • Significant injuries without immediate threat
     • Worsening chronic conditions

   - NON-URGENT: Stable conditions that can wait for routine care
     • Minor injuries (small cuts, bruises)
     • Mild symptoms of short duration
     • Chronic condition follow-ups without acute changes
     • Prescription refills
     • Preventive care

2. Extract all key symptoms and signs mentioned
3. Provide a clear clinical summary highlighting:
   - Primary concern
   - Risk factors or red flags
   - Expected clinical course
   - When to escalate care

4. Give specific, prioritized recommendations:
   - Immediate actions needed
   - Monitoring parameters
   - Warning signs to watch for
   - When to transfer or escalate

5. List possible differential diagnoses to consider
6. Identify vital signs that should be monitored

Focus on patient safety, appropriate resource utilization, and empowering healthcare workers with actionable information.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Streaming triage analysis error:', error);
    return new Response('Failed to analyze patient data', { status: 500 });
  }
}
