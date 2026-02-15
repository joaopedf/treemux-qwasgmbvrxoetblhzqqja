import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

interface Agent {
  name: string;
  role: string;
  systemPrompt: string;
}

const agents: Agent[] = [
  {
    name: 'Triage Agent',
    role: 'urgency_assessment',
    systemPrompt: `You are a clinical triage specialist. Analyze the conversation and determine:
1. Urgency level (low, medium, high, critical)
2. Any immediate safety concerns
3. Whether emergency services should be contacted

Return ONLY a JSON object with: { "urgency": string, "safetyConcerns": string[], "requiresEmergency": boolean, "reasoning": string }`
  },
  {
    name: 'Clinical Extractor',
    role: 'data_extraction',
    systemPrompt: `You are a clinical data extraction specialist. Extract structured information:
1. Symptoms mentioned
2. Medications discussed (name, dosage, frequency)
3. Vital signs or measurements
4. Medical history references
5. Allergies mentioned

Return ONLY a JSON object with: { "symptoms": string[], "medications": [{"name": string, "dosage": string}], "vitals": {}, "history": string[], "allergies": string[] }`
  },
  {
    name: 'Safety Checker',
    role: 'safety_validation',
    systemPrompt: `You are a medication safety specialist. Identify:
1. Potential drug interactions
2. Dosage concerns
3. Contraindications mentioned
4. Allergy conflicts

Return ONLY a JSON object with: { "flags": [{"type": string, "description": string, "severity": string}] }`
  },
  {
    name: 'Action Coordinator',
    role: 'action_planning',
    systemPrompt: `You are a healthcare workflow coordinator. Determine:
1. Follow-up appointments needed
2. Prescriptions to be filled
3. Lab work required
4. Referrals needed
5. Patient education topics

Return ONLY a JSON object with: { "appointments": [{"type": string, "note": string}], "prescriptions": string[], "labWork": string[], "referrals": string[], "education": string[] }`
  },
  {
    name: 'Summary Generator',
    role: 'clinical_summary',
    systemPrompt: `You are a clinical documentation specialist. Create:
1. A concise clinical summary (2-3 sentences)
2. Key points for EMR documentation
3. Patient concerns expressed

Return ONLY a JSON object with: { "summary": string, "keyPoints": string[], "patientConcerns": string[] }`
  }
];

async function invokeAgent(agent: Agent, transcript: string): Promise<any> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: agent.systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this clinical phone call transcript:\n\n${transcript}`
        }
      ]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`Agent ${agent.name} response:`, content.text);
      return {};
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error(`Error in ${agent.name}:`, error.message);
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const agentPromises = agents.map(agent => invokeAgent(agent, transcript));
    const results = await Promise.all(agentPromises);

    const [triageResult, extractionResult, safetyResult, actionResult, summaryResult] = results;

    const consolidatedInsights = {
      urgency: triageResult.urgency || 'low',
      summary: summaryResult.summary || 'Analysis in progress',

      flags: [
        ...(triageResult.safetyConcerns?.map((concern: string) => ({
          type: 'Safety Concern',
          description: concern,
          severity: 'high'
        })) || []),
        ...(safetyResult.flags || [])
      ],

      medications: extractionResult.medications || [],
      symptoms: extractionResult.symptoms || [],
      vitals: extractionResult.vitals || {},

      appointments: actionResult.appointments || [],
      prescriptions: actionResult.prescriptions || [],
      labWork: actionResult.labWork || [],
      referrals: actionResult.referrals || [],

      keyPoints: summaryResult.keyPoints || [],
      patientConcerns: summaryResult.patientConcerns || [],

      requiresEmergency: triageResult.requiresEmergency || false,

      agentDetails: {
        triage: triageResult,
        extraction: extractionResult,
        safety: safetyResult,
        actions: actionResult,
        summary: summaryResult
      }
    };

    return NextResponse.json(consolidatedInsights);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    );
  }
}
