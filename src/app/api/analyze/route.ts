import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AnalysisResult, ActionItem, Decision } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multi-agent system: Each agent has a specific role
async function extractActionItems(transcript: string): Promise<ActionItem[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an AI agent specialized in extracting action items from meeting transcripts.
Identify tasks that need to be done, who should do them, and any mentioned deadlines.
Return a JSON array of action items with: task, assignee (optional), priority (high/medium/low), dueDate (optional).`
      },
      {
        role: 'user',
        content: `Extract action items from this transcript:\n\n${transcript}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{"actionItems":[]}');
  return (result.actionItems || []).map((item: any, idx: number) => ({
    id: `action-${Date.now()}-${idx}`,
    task: item.task,
    assignee: item.assignee,
    dueDate: item.dueDate,
    priority: item.priority || 'medium',
    completed: false,
  }));
}

async function extractDecisions(transcript: string): Promise<Decision[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an AI agent specialized in identifying key decisions made during meetings.
Focus on important choices, agreements, or conclusions reached.
Return a JSON array of decisions with: decision, context.`
      },
      {
        role: 'user',
        content: `Extract decisions from this transcript:\n\n${transcript}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{"decisions":[]}');
  return (result.decisions || []).map((item: any, idx: number) => ({
    id: `decision-${Date.now()}-${idx}`,
    decision: item.decision,
    context: item.context,
    timestamp: Date.now(),
  }));
}

async function extractKeyPoints(transcript: string): Promise<string[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an AI agent specialized in summarizing key discussion points from meetings.
Extract the most important topics, insights, and takeaways.
Return a JSON array of key points as strings.`
      },
      {
        role: 'user',
        content: `Extract key points from this transcript:\n\n${transcript}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{"keyPoints":[]}');
  return result.keyPoints || [];
}

async function analyzeSentiment(transcript: string): Promise<'positive' | 'neutral' | 'negative'> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an AI agent specialized in sentiment analysis of meeting conversations.
Analyze the overall tone and sentiment. Return JSON with a "sentiment" field: "positive", "neutral", or "negative".`
      },
      {
        role: 'user',
        content: `Analyze sentiment of this transcript:\n\n${transcript}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{"sentiment":"neutral"}');
  return result.sentiment || 'neutral';
}

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || transcript.trim().length < 10) {
      return NextResponse.json(
        { error: 'Transcript is too short or empty' },
        { status: 400 }
      );
    }

    // Run all agents in parallel for efficiency
    const [actionItems, decisions, keyPoints, sentiment] = await Promise.all([
      extractActionItems(transcript),
      extractDecisions(transcript),
      extractKeyPoints(transcript),
      analyzeSentiment(transcript),
    ]);

    const result: AnalysisResult = {
      actionItems,
      decisions,
      keyPoints,
      sentiment,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;
