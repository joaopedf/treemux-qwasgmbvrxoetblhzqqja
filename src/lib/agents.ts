import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export type ResearchNode = {
  id: string;
  type: 'question' | 'finding' | 'source' | 'insight' | 'gap';
  title: string;
  content: string;
  parentId?: string;
  sources?: string[];
  confidence?: number;
};

export type AgentResponse = {
  node: ResearchNode;
  children?: ResearchNode[];
  reasoning?: string;
};

// Research Coordinator Agent - orchestrates the research workflow
export async function coordinatorAgent(query: string): Promise<AgentResponse> {
  const prompt = `You are a Research Coordinator AI. Your job is to analyze a research question and break it down into key sub-questions that need to be explored.

Research Question: "${query}"

Analyze this question and identify:
1. 3-5 key sub-questions or aspects that should be explored
2. What type of information is needed (facts, analysis, comparisons, etc.)
3. Any potential knowledge gaps or areas of uncertainty

Respond in JSON format:
{
  "mainQuestion": {
    "title": "Brief title for the main question",
    "content": "Refined/clarified version of the question",
    "confidence": 0.9
  },
  "subQuestions": [
    {
      "title": "Sub-question title",
      "content": "Detailed sub-question",
      "type": "finding"
    }
  ],
  "reasoning": "Brief explanation of your analysis approach"
}`;

  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    prompt,
    temperature: 0.7,
  });

  const response = JSON.parse(text);

  const mainNode: ResearchNode = {
    id: 'root',
    type: 'question',
    title: response.mainQuestion.title,
    content: response.mainQuestion.content,
    confidence: response.mainQuestion.confidence,
  };

  const children: ResearchNode[] = response.subQuestions.map((sq: any, idx: number) => ({
    id: `sub-${idx}`,
    type: sq.type || 'finding',
    title: sq.title,
    content: sq.content,
    parentId: 'root',
  }));

  return {
    node: mainNode,
    children,
    reasoning: response.reasoning,
  };
}

// Research Agent - uses Perplexity to find information
export async function researchAgent(question: string): Promise<AgentResponse> {
  const prompt = `Research the following question and provide a comprehensive answer with sources:

Question: "${question}"

Provide your findings in a clear, structured format with key insights and sources.`;

  try {
    // Using OpenAI as fallback since Perplexity API requires specific setup
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt,
      temperature: 0.5,
    });

    const node: ResearchNode = {
      id: `research-${Date.now()}`,
      type: 'finding',
      title: question.slice(0, 50),
      content: text,
      confidence: 0.8,
    };

    return { node };
  } catch (error) {
    // Fallback to Claude
    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
      temperature: 0.5,
    });

    const node: ResearchNode = {
      id: `research-${Date.now()}`,
      type: 'finding',
      title: question.slice(0, 50),
      content: text,
      confidence: 0.7,
    };

    return { node };
  }
}

// Synthesis Agent - combines findings and identifies patterns
export async function synthesisAgent(findings: ResearchNode[]): Promise<AgentResponse> {
  const prompt = `You are a Synthesis AI. Analyze the following research findings and identify key insights, patterns, and connections.

Findings:
${findings.map((f, idx) => `${idx + 1}. ${f.title}\n${f.content}\n`).join('\n')}

Provide:
1. Key insights that emerge from these findings
2. Patterns or themes you notice
3. Connections between different findings
4. Any contradictions or knowledge gaps

Respond in JSON format:
{
  "insights": [
    {
      "title": "Insight title",
      "content": "Detailed explanation",
      "connectedFindings": [0, 2]
    }
  ],
  "gaps": [
    {
      "title": "Knowledge gap title",
      "content": "Description of what's missing"
    }
  ]
}`;

  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    prompt,
    temperature: 0.6,
  });

  const response = JSON.parse(text);

  const insightNodes: ResearchNode[] = response.insights.map((insight: any, idx: number) => ({
    id: `insight-${idx}`,
    type: 'insight' as const,
    title: insight.title,
    content: insight.content,
    confidence: 0.85,
  }));

  const gapNodes: ResearchNode[] = response.gaps.map((gap: any, idx: number) => ({
    id: `gap-${idx}`,
    type: 'gap' as const,
    title: gap.title,
    content: gap.content,
    confidence: 0.5,
  }));

  return {
    node: insightNodes[0],
    children: [...insightNodes.slice(1), ...gapNodes],
  };
}

// Fact-Check Agent - validates claims and assesses confidence
export async function factCheckAgent(claim: string): Promise<{ confidence: number; reasoning: string }> {
  const prompt = `You are a Fact-Checking AI. Evaluate the following claim and assess its confidence level.

Claim: "${claim}"

Consider:
1. Is this claim verifiable?
2. What evidence supports or contradicts it?
3. Are there any caveats or nuances?

Respond in JSON format:
{
  "confidence": 0.85,
  "reasoning": "Brief explanation of your assessment"
}`;

  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    prompt,
    temperature: 0.3,
  });

  return JSON.parse(text);
}
