import type { ResearchNode } from './agents';
import type { Node, Edge } from 'reactflow';

export function generateDemoGraph(): { nodes: Node<ResearchNode>[]; edges: Edge[] } {
  const nodes: Node<ResearchNode>[] = [
    {
      id: 'root',
      type: 'custom',
      position: { x: 250, y: 0 },
      data: {
        id: 'root',
        type: 'question',
        title: 'How does CRISPR work?',
        content: 'Understanding the mechanism and applications of CRISPR gene editing technology',
        confidence: 0.95,
      },
    },
    {
      id: 'sub-1',
      type: 'custom',
      position: { x: 50, y: 150 },
      data: {
        id: 'sub-1',
        type: 'finding',
        title: 'CRISPR Mechanism',
        content: 'CRISPR uses Cas9 protein guided by RNA to target and cut specific DNA sequences, allowing precise genetic modifications.',
        confidence: 0.92,
        parentId: 'root',
      },
    },
    {
      id: 'sub-2',
      type: 'custom',
      position: { x: 250, y: 150 },
      data: {
        id: 'sub-2',
        type: 'finding',
        title: 'Medical Applications',
        content: 'Being used to treat genetic diseases like sickle cell anemia, with clinical trials showing promising results.',
        confidence: 0.88,
        parentId: 'root',
      },
    },
    {
      id: 'sub-3',
      type: 'custom',
      position: { x: 450, y: 150 },
      data: {
        id: 'sub-3',
        type: 'finding',
        title: 'Agricultural Uses',
        content: 'Developing drought-resistant crops and improving nutritional content of staple foods.',
        confidence: 0.85,
        parentId: 'root',
      },
    },
    {
      id: 'insight-1',
      type: 'custom',
      position: { x: 150, y: 300 },
      data: {
        id: 'insight-1',
        type: 'insight',
        title: 'Revolutionary Precision',
        content: 'CRISPR offers unprecedented precision compared to previous gene editing techniques, with 95%+ accuracy.',
        confidence: 0.90,
      },
    },
    {
      id: 'insight-2',
      type: 'custom',
      position: { x: 350, y: 300 },
      data: {
        id: 'insight-2',
        type: 'insight',
        title: 'Ethical Considerations',
        content: 'Wide applicability raises important ethical questions about human germline editing and accessibility.',
        confidence: 0.80,
      },
    },
    {
      id: 'gap-1',
      type: 'custom',
      position: { x: 250, y: 450 },
      data: {
        id: 'gap-1',
        type: 'gap',
        title: 'Long-term Effects',
        content: 'Need more research on long-term effects and potential off-target mutations in human applications.',
        confidence: 0.60,
      },
    },
  ];

  const edges: Edge[] = [
    { id: 'e-root-sub1', source: 'root', target: 'sub-1', animated: true },
    { id: 'e-root-sub2', source: 'root', target: 'sub-2', animated: true },
    { id: 'e-root-sub3', source: 'root', target: 'sub-3', animated: true },
    { id: 'e-sub1-insight1', source: 'sub-1', target: 'insight-1' },
    { id: 'e-sub2-insight1', source: 'sub-2', target: 'insight-1' },
    { id: 'e-sub2-insight2', source: 'sub-2', target: 'insight-2' },
    { id: 'e-sub3-insight2', source: 'sub-3', target: 'insight-2' },
    { id: 'e-insight1-gap1', source: 'insight-1', target: 'gap-1' },
    { id: 'e-insight2-gap1', source: 'insight-2', target: 'gap-1' },
  ];

  return { nodes, edges };
}
