import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export interface ThreatEvent {
  id: string;
  timestamp: Date;
  source: string;
  type: 'motion' | 'audio' | 'network' | 'perimeter' | 'access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  rawData: Record<string, any>;
  description: string;
}

export interface ThreatAssessment {
  eventId: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  reasoning: string;
  recommendedActions: string[];
  relatedEvents: string[];
  timestamp: Date;
}

// Intelligence Analyst Agent - Assesses individual threats
export async function analyzeIndividualThreat(event: ThreatEvent): Promise<ThreatAssessment> {
  const prompt = `You are an intelligence analyst for a defense operations platform. Analyze this security event:

Event ID: ${event.id}
Type: ${event.type}
Location: ${event.location}
Initial Severity: ${event.severity}
Description: ${event.description}
Raw Data: ${JSON.stringify(event.rawData, null, 2)}

Provide a detailed threat assessment including:
1. Assessed threat level (low/medium/high/critical)
2. Confidence level (0-100)
3. Clear reasoning for your assessment
4. Recommended immediate actions
5. Potential related threat indicators

Respond in JSON format with keys: threatLevel, confidence, reasoning, recommendedActions (array), relatedIndicators (array)`;

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
    temperature: 0.3,
  });

  const parsed = JSON.parse(text);

  return {
    eventId: event.id,
    threatLevel: parsed.threatLevel,
    confidence: parsed.confidence,
    reasoning: parsed.reasoning,
    recommendedActions: parsed.recommendedActions,
    relatedEvents: parsed.relatedIndicators || [],
    timestamp: new Date(),
  };
}

// Correlation Agent - Identifies patterns across multiple events
export async function correlateThreats(
  events: ThreatEvent[],
  assessments: ThreatAssessment[]
): Promise<{
  patterns: string[];
  coordinatedThreat: boolean;
  riskScore: number;
  analysis: string;
}> {
  const prompt = `You are a threat correlation specialist. Analyze these security events and their assessments to identify patterns:

Events:
${events.map(e => `- [${e.id}] ${e.type} at ${e.location}: ${e.description}`).join('\n')}

Assessments:
${assessments.map(a => `- [${a.eventId}] ${a.threatLevel} threat (${a.confidence}% confidence): ${a.reasoning}`).join('\n')}

Identify:
1. Patterns suggesting coordinated activity
2. Whether this appears to be a coordinated threat
3. Overall risk score (0-100)
4. Detailed analysis of threat landscape

Respond in JSON format with keys: patterns (array), coordinatedThreat (boolean), riskScore (number), analysis (string)`;

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
    temperature: 0.2,
  });

  return JSON.parse(text);
}

// Response Coordinator Agent - Determines optimal response strategy
export async function coordinateResponse(
  assessment: ThreatAssessment,
  correlation: any,
  availableResources: string[]
): Promise<{
  priority: number;
  responseTeam: string[];
  actions: Array<{ action: string; assignedTo: string; deadline: string }>;
  escalation: boolean;
  reasoning: string;
}> {
  const prompt = `You are a defense operations response coordinator. Plan the optimal response:

Threat Assessment:
- Event: ${assessment.eventId}
- Level: ${assessment.threatLevel}
- Confidence: ${assessment.confidence}%
- Reasoning: ${assessment.reasoning}

Correlation Analysis:
- Coordinated Threat: ${correlation.coordinatedThreat}
- Risk Score: ${correlation.riskScore}
- Patterns: ${correlation.patterns.join(', ')}

Available Resources: ${availableResources.join(', ')}

Provide a response plan including:
1. Priority level (1-10, 10 highest)
2. Response team composition
3. Specific actions with assignments and deadlines
4. Whether to escalate to command
5. Strategic reasoning

Respond in JSON format with keys: priority (number), responseTeam (array), actions (array of objects with action, assignedTo, deadline), escalation (boolean), reasoning (string)`;

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
    temperature: 0.3,
  });

  return JSON.parse(text);
}

// Situation Report Agent - Generates executive summaries
export async function generateSitRep(
  events: ThreatEvent[],
  assessments: ThreatAssessment[],
  responses: any[]
): Promise<string> {
  const prompt = `You are a defense operations officer generating a situation report (SITREP) for command.

Current Events: ${events.length}
Threat Assessments: ${assessments.length}
Active Responses: ${responses.length}

Events Summary:
${events.slice(0, 5).map(e => `- ${e.type} threat at ${e.location} (${e.severity})`).join('\n')}

Top Assessments:
${assessments.slice(0, 3).map(a => `- Event ${a.eventId}: ${a.threatLevel} threat, ${a.confidence}% confidence`).join('\n')}

Generate a concise executive SITREP covering:
1. Current operational status
2. Active threats and severity
3. Response actions taken
4. Recommendations for command

Keep it professional, concise, and actionable (300-400 words).`;

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
    temperature: 0.4,
  });

  return text;
}

// Multi-turn conversation agent for operators
export async function operatorChat(
  message: string,
  context: {
    events: ThreatEvent[];
    assessments: ThreatAssessment[];
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
  }
): Promise<string> {
  const systemPrompt = `You are an AI operations assistant for Sentinel AI defense platform. You have access to current threat data and can help operators understand and respond to security events.

Current Context:
- Active Events: ${context.events.length}
- Recent Assessments: ${context.assessments.length}

Recent High-Priority Events:
${context.events.slice(0, 3).map(e => `- [${e.id}] ${e.type} at ${e.location}: ${e.description}`).join('\n')}

Provide clear, actionable responses to operator queries. Be professional and concise.`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...context.history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user' as const, content: message },
  ];

  const { text } = await generateText({
    model: openai('gpt-4o'),
    messages,
    temperature: 0.5,
  });

  return text;
}
