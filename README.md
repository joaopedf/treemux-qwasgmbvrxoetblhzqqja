# 🛡️ Sentinel AI

**AI-Native Defense Operations Platform**

Sentinel AI reimagines PagerDuty for physical security and defense operations. Built for TreeHacks 2026, this multi-agent system uses OpenAI GPT-4o to provide intelligent threat assessment, pattern correlation, and automated response coordination.

## 🎯 What It Does

Sentinel AI is a real-time defense operations platform that:

- **Monitors Live Threats**: Simulates real-time sensor feeds from motion, audio, network, perimeter, and access control systems
- **Multi-Agent Analysis**: Uses 5 specialized AI agents to assess threats, correlate patterns, coordinate responses, generate SITREPs, and assist operators
- **Intelligent Response**: Automatically determines threat levels, assigns response teams, and creates action plans
- **Operator Interface**: Conversational AI assistant that can answer questions and provide recommendations

## 🏆 Prize Categories

This project targets:
- TreeHacks Grand Prize (innovation + functionality + execution)
- OpenAI AI Track (creative use of GPT-4o multi-agent system)
- Y Combinator Challenge (reimagining PagerDuty for defense with AI)
- Best Hardware Hack (designed for sensor integration)
- Greylock Multi-turn Agent Prize (complex reasoning across agents)
- Most Technically Complex

## 🚀 Quick Start

### Prerequisites

- Bun installed
- OpenAI API key

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
echo "OPENAI_API_KEY=your_key_here" > .env.local

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

### Build for Production

```bash
bun run build
bun start
```

## 🏗️ Architecture

### Multi-Agent System

1. **Intelligence Analyst Agent** - Assesses individual threats with confidence scoring
2. **Correlation Agent** - Identifies patterns across multiple events
3. **Response Coordinator Agent** - Determines optimal response strategy
4. **Situation Report Agent** - Generates executive summaries
5. **Operator Chat Agent** - Conversational interface with contextual awareness

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **AI**: OpenAI GPT-4o, Vercel AI SDK
- **Runtime**: Bun
- **Deployment**: Vercel-ready

## 🎮 How to Use

1. **Monitor Live Feed**: Watch real-time threat events appear in the left panel
2. **Analyze Threats**: Click any event to trigger multi-agent analysis
3. **Review Assessment**: See AI reasoning, confidence levels, and recommended actions
4. **View Response Plan**: Check assigned teams, action items, and escalation status
5. **Chat with AI**: Ask questions about threats or get operational recommendations
6. **Generate SITREP**: Create executive situation reports for command

## 💡 Real-World Application

While this demo uses simulated sensors, Sentinel AI is designed to integrate with:
- Physical security systems (cameras, motion detectors, access control)
- Network monitoring tools (IDS/IPS, SIEM)
- Edge devices (NVIDIA Jetson for local inference)
- Defense infrastructure (perimeter sensors, surveillance systems)

## 🔐 Security Note

This is a demonstration platform. In production deployments:
- All sensor data would be encrypted
- AI decisions require human oversight for critical actions
- Audit logs track all system activities
- Role-based access control restricts operations

## 👨‍💻 Author

Built by Forge, an MS&E and ME student with hardware systems and defense products experience, incoming Hardware Engineer at Anduril Industries.

## 📄 License

MIT License - Built for TreeHacks 2026
