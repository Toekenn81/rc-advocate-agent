# Max — RC Advocate Agent

Max is an autonomous AI agent built to serve as RevenueCat's Agentic AI Developer & Growth Advocate. Max can independently produce technical content, design growth experiments, and deliver structured product feedback — all tailored to RevenueCat's developer ecosystem.

## What It Does

**Content Creation** — Takes a topic brief and produces publish-ready developer blog posts with working code examples, RevenueCat SDK references, and actionable takeaways.

**Growth Experiments** — Generates structured experiment briefs with hypotheses, A/B test designs, success metrics, implementation plans using RevenueCat features (Experiments, Paywalls, Charts API), and risk assessments.

**Product Feedback** — Analyzes RevenueCat features from a developer and growth marketer perspective, identifying friction points, competitive gaps, and specific improvement recommendations ranked by impact.

## Architecture

```
┌─────────────────────────────────────────────┐
│              Agent Interface                 │
│        (React Dashboard / CLI / API)         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            Orchestration Layer               │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Content  │ │  Growth  │ │   Product    │ │
│  │  Engine  │ │  Engine  │ │   Feedback   │ │
│  │          │ │          │ │   Engine     │ │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       │             │              │         │
│  ┌────▼─────────────▼──────────────▼───────┐ │
│  │       RevenueCat Context Layer          │ │
│  │  (Docs, SDK, API, Blog, Changelog)      │ │
│  └─────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Claude API (Sonnet 4)              │
│         + Web Search + Tool Use              │
└─────────────────────────────────────────────┘
```

## Stack

- **LLM**: Claude Sonnet 4 (Anthropic API)
- **Frontend**: React with Tailwind CSS
- **Context**: RevenueCat documentation, SDK reference, REST API, blog archive
- **Capabilities**: Web search, API interaction, structured output generation

## Running Locally

```bash
# Clone the repo
git clone https://github.com/Toekenn81/rc-advocate-agent.git
cd rc-advocate-agent

# The agent interface is a single React component
# It can be rendered in any React environment that supports the Anthropic API
```

The agent prototype (`revenuecat-agent.jsx`) is a self-contained React component that calls the Anthropic API directly. It includes:

- Three operating modes (Content, Growth, Product Feedback)
- RevenueCat-specific system prompts with deep product context
- Status logging for transparency into the agent's process
- Markdown rendering for formatted output
- Session history tracking
- Sample briefs for quick demonstrations

## Weekly Output Targets

| Deliverable | Target | Format |
|---|---|---|
| Technical content | 2+ pieces/week | Blog posts, tutorials, code samples, case studies |
| Growth experiments | 1+ per week | Structured briefs with hypothesis, metrics, timeline |
| Community interactions | 50+ per week | X, GitHub, Discord, forums |
| Product feedback | 3+ submissions/week | Structured reports to product team |
| Team check-in | Weekly | Activity report with metrics and learnings |

## Operator

Max is operated by Elijah Rubalcada (Nevada, US). All public-facing content undergoes human review before publication. The operator is accountable for Max's output and undergoes standard background checks.

## License

MIT
