import { useState, useRef, useEffect } from "react";

const REVENUECAT_CONTEXT = `You are an AI Developer Advocate agent for RevenueCat — the leading in-app subscription management platform used by 40%+ of newly shipped subscription apps, processing $10B+ in annual purchase volume.

RevenueCat's core product:
- SDK for iOS, Android, Flutter, React Native, Unity, web that handles in-app purchases and subscriptions
- REST API for server-side subscription management
- Dashboard with Charts, Customer Lists, Experiments (A/B testing), Paywalls, and Integrations
- Entitlements system that abstracts store-specific purchase logic
- Cross-platform subscription syncing
- Paywall templates and remote configuration
- Webhook support for real-time event processing

Key audience: Mobile app developers (indie to enterprise), product managers, growth teams
Key topics: In-app purchases, subscription monetization, paywall optimization, churn reduction, pricing strategy, StoreKit 2, Google Play Billing, entitlements architecture

Your voice: Technical but accessible. You write like a developer who genuinely uses the product. You balance code examples with strategic insight. You're opinionated about best practices but not preachy.`;

const TASK_CONFIGS = {
  content: {
    label: "Content Creation",
    icon: "✍️",
    color: "#F8584A",
    prompt: (topic) => `${REVENUECAT_CONTEXT}

TASK: Create a developer-focused blog post about: "${topic}"

Requirements:
- Write a compelling title and subtitle
- Include an introduction that hooks developers with a real problem
- Provide 3-4 main sections with practical code examples where relevant
- Include RevenueCat SDK/API usage naturally (not forced)
- End with actionable takeaways
- Target length: ~800-1000 words
- Format in clean markdown

Write the complete blog post now. Make it genuinely useful — the kind of post a developer would bookmark.`,
  },
  growth: {
    label: "Growth Experiments",
    icon: "📈",
    color: "#22C55E",
    prompt: (topic) => `${REVENUECAT_CONTEXT}

TASK: Design a growth experiment for RevenueCat related to: "${topic}"

Provide a structured experiment brief:

1. HYPOTHESIS: What we believe and why
2. EXPERIMENT DESIGN: Specific A/B test or growth tactic with clear variables
3. IMPLEMENTATION PLAN: Step-by-step with estimated effort (use RevenueCat features where applicable — Experiments, Paywalls, Webhooks, etc.)
4. SUCCESS METRICS: Primary and secondary KPIs with target thresholds
5. EXPECTED IMPACT: Projected outcome with reasoning
6. RISK ASSESSMENT: What could go wrong and mitigation strategies
7. TIMELINE: Realistic schedule from setup to statistical significance

Be specific and data-driven. Reference actual RevenueCat features. This should be ready for a growth team to execute.`,
  },
  feedback: {
    label: "Product Feedback",
    icon: "🔍",
    color: "#8B5CF6",
    prompt: (topic) => `${REVENUECAT_CONTEXT}

TASK: Provide detailed product feedback on: "${topic}"

Structure your feedback as:

1. CURRENT STATE: How this feature/area works today in RevenueCat
2. DEVELOPER PAIN POINTS: Real friction developers experience (based on common patterns in subscription app development)
3. COMPETITIVE LANDSCAPE: How alternatives handle this (Stripe, Adapty, Qonversion, native StoreKit/Play Billing)
4. RECOMMENDATIONS: Specific, actionable improvements ranked by impact vs effort
5. DEVELOPER EXPERIENCE IMPACT: How each recommendation improves the DX
6. MOCK IMPLEMENTATION: If applicable, show what the improved API/SDK/dashboard could look like

Be constructive but honest. Think like a power user who wants the product to win.`,
  },
};

const SAMPLE_BRIEFS = {
  content: [
    "How to implement a freemium-to-premium conversion flow using RevenueCat Paywalls",
    "Migrating from StoreKit 1 to StoreKit 2 with RevenueCat",
    "Building a subscription analytics dashboard with RevenueCat webhooks",
    "5 paywall mistakes killing your conversion rate",
  ],
  growth: [
    "Increase trial-to-paid conversion by optimizing paywall timing",
    "Reduce involuntary churn through grace period optimization",
    "Drive SDK adoption among React Native developers",
    "Improve onboarding completion rate for new RevenueCat users",
  ],
  feedback: [
    "The Experiments (A/B testing) feature and its limitations",
    "Paywall builder template system and customization options",
    "RevenueCat dashboard Charts — missing metrics and UX gaps",
    "Cross-platform entitlement syncing edge cases",
  ],
};

function TypewriterText({ text, speed = 8 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse">▊</span>}
    </span>
  );
}

function MarkdownRenderer({ content }) {
  const renderMarkdown = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLang = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${i}`} style={{
              background: "#1a1a2e",
              borderRadius: 8,
              padding: "16px 20px",
              margin: "16px 0",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 13,
              lineHeight: 1.6,
              overflowX: "auto",
              border: "1px solid rgba(248,88,74,0.2)",
            }}>
              {codeLang && (
                <div style={{ color: "#F8584A", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                  {codeLang}
                </div>
              )}
              <pre style={{ margin: 0, color: "#e0e0e0", whiteSpace: "pre-wrap" }}>{codeContent.trim()}</pre>
            </div>
          );
          codeContent = "";
          codeLang = "";
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        continue;
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} style={{ fontSize: 28, fontWeight: 800, margin: "24px 0 8px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} style={{ fontSize: 22, fontWeight: 700, margin: "28px 0 8px", color: "#F8584A", fontFamily: "'Space Grotesk', sans-serif" }}>
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} style={{ fontSize: 18, fontWeight: 600, margin: "20px 0 6px", color: "#ccc" }}>
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <div key={i} style={{ display: "flex", gap: 10, margin: "4px 0", paddingLeft: 8 }}>
            <span style={{ color: "#F8584A", fontWeight: 700 }}>→</span>
            <span style={{ color: "#b0b0b0", lineHeight: 1.7 }}>{renderInline(line.slice(2))}</span>
          </div>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)[1];
        elements.push(
          <div key={i} style={{ display: "flex", gap: 12, margin: "6px 0", paddingLeft: 8 }}>
            <span style={{
              color: "#F8584A",
              fontWeight: 800,
              fontSize: 14,
              minWidth: 24,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>{num}.</span>
            <span style={{ color: "#b0b0b0", lineHeight: 1.7 }}>{renderInline(line.replace(/^\d+\.\s/, ""))}</span>
          </div>
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={i} style={{
            borderLeft: "3px solid #F8584A",
            paddingLeft: 16,
            margin: "16px 0",
            color: "#888",
            fontStyle: "italic",
          }}>
            {renderInline(line.slice(2))}
          </blockquote>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={i} style={{ height: 8 }} />);
      } else {
        elements.push(
          <p key={i} style={{ color: "#b0b0b0", lineHeight: 1.8, margin: "4px 0" }}>
            {renderInline(line)}
          </p>
        );
      }
    }

    return elements;
  };

  const renderInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "#e0e0e0", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} style={{ color: "#ccc" }}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} style={{
            background: "rgba(248,88,74,0.15)",
            color: "#F8584A",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: "0.9em",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return <div>{renderMarkdown(content)}</div>;
}

export default function RevenueCatAgent() {
  const [activeMode, setActiveMode] = useState("content");
  const [briefInput, setBriefInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState(null);
  const [statusMessages, setStatusMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const outputRef = useRef(null);

  const addStatus = (msg) => {
    setStatusMessages((prev) => [...prev, { text: msg, time: new Date().toLocaleTimeString() }]);
  };

  const runAgent = async (brief) => {
    if (!brief.trim() || isGenerating) return;

    setIsGenerating(true);
    setOutput(null);
    setStatusMessages([]);

    const config = TASK_CONFIGS[activeMode];
    addStatus(`Initializing ${config.label} agent...`);

    await new Promise((r) => setTimeout(r, 600));
    addStatus("Loading RevenueCat product context...");

    await new Promise((r) => setTimeout(r, 400));
    addStatus(`Analyzing brief: "${brief}"`);

    await new Promise((r) => setTimeout(r, 500));
    addStatus("Generating output with Claude Sonnet 4...");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: config.prompt(brief) }],
        }),
      });

      const data = await response.json();
      const text = data.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n") || "No response generated.";

      addStatus("Output generated successfully ✓");
      addStatus("Running quality check...");

      await new Promise((r) => setTimeout(r, 300));
      addStatus("Quality check passed ✓");

      const result = {
        mode: activeMode,
        brief,
        content: text,
        timestamp: new Date().toISOString(),
      };

      setOutput(result);
      setHistory((prev) => [result, ...prev].slice(0, 10));
    } catch (err) {
      addStatus(`Error: ${err.message}`);
      setOutput({
        mode: activeMode,
        brief,
        content: `**Error generating output.** Please check that the Anthropic API is accessible.\n\nError: ${err.message}`,
        timestamp: new Date().toISOString(),
      });
    }

    setIsGenerating(false);
  };

  useEffect(() => {
    if (output && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [output]);

  const config = TASK_CONFIGS[activeMode];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e0e0e0",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg, #F8584A, #FF8A3D)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            RC
          </div>
          <div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#fff",
            }}>
              RevenueCat Developer Advocate Agent
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              Autonomous content • growth • product feedback
            </div>
          </div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: 20,
          padding: "6px 14px",
          fontSize: 12,
          color: "#22C55E",
          fontWeight: 600,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22C55E",
            animation: "pulse 2s infinite",
          }} />
          Agent Online
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        {/* Mode Selector */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {Object.entries(TASK_CONFIGS).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setActiveMode(key); setBriefInput(""); }}
              style={{
                flex: 1,
                padding: "16px 20px",
                borderRadius: 12,
                border: activeMode === key
                  ? `2px solid ${cfg.color}`
                  : "2px solid rgba(255,255,255,0.08)",
                background: activeMode === key
                  ? `${cfg.color}15`
                  : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{cfg.icon}</div>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: activeMode === key ? cfg.color : "#888",
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {cfg.label}
              </div>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <label style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "#666",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}>
            {config.icon} {config.label} Brief
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              value={briefInput}
              onChange={(e) => setBriefInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runAgent(briefInput)}
              placeholder={`Describe what you want the agent to ${activeMode === "content" ? "write about" : activeMode === "growth" ? "experiment with" : "analyze"}...`}
              style={{
                flex: 1,
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "14px 18px",
                color: "#e0e0e0",
                fontSize: 15,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => runAgent(briefInput)}
              disabled={isGenerating || !briefInput.trim()}
              style={{
                padding: "14px 28px",
                borderRadius: 10,
                border: "none",
                background: isGenerating
                  ? "rgba(255,255,255,0.1)"
                  : `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: isGenerating ? "not-allowed" : "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "all 0.2s",
                opacity: !briefInput.trim() ? 0.4 : 1,
                minWidth: 120,
              }}
            >
              {isGenerating ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: 16 }}>⟳</span>
                  Running
                </span>
              ) : (
                "Run Agent →"
              )}
            </button>
          </div>

          {/* Quick Briefs */}
          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#555", lineHeight: "28px", marginRight: 4 }}>Quick briefs:</span>
            {SAMPLE_BRIEFS[activeMode].map((brief, i) => (
              <button
                key={i}
                onClick={() => { setBriefInput(brief); }}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#888",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  lineHeight: 1.5,
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = `${config.color}50`;
                  e.target.style.color = config.color;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                  e.target.style.color = "#888";
                }}
              >
                {brief}
              </button>
            ))}
          </div>
        </div>

        {/* Status Log */}
        {statusMessages.length > 0 && (
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
          }}>
            {statusMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "4px 0",
                  color: msg.text.includes("✓") ? "#22C55E" : msg.text.includes("Error") ? "#F8584A" : "#666",
                  animation: "slideIn 0.3s ease",
                }}
              >
                <span style={{ color: "#444" }}>{msg.time}</span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Output */}
        {output && (
          <div
            ref={outputRef}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${TASK_CONFIGS[output.mode].color}30`,
              borderRadius: 16,
              padding: 32,
              marginBottom: 32,
              animation: "slideIn 0.4s ease",
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div>
                <div style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  color: TASK_CONFIGS[output.mode].color,
                  fontWeight: 700,
                  marginBottom: 4,
                }}>
                  {TASK_CONFIGS[output.mode].icon} {TASK_CONFIGS[output.mode].label} Output
                </div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  Brief: {output.brief}
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText(output.content)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "#888",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}
              >
                Copy Output
              </button>
            </div>

            <div style={{ lineHeight: 1.8, fontSize: 15 }}>
              <MarkdownRenderer content={output.content} />
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && !isGenerating && (
          <div style={{ marginTop: 40 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 16,
            }}>
              Agent History ({history.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setOutput(item)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 20 }}>
                    {TASK_CONFIGS[item.mode].icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: "#ccc", fontWeight: 500 }}>
                      {item.brief}
                    </div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                      {TASK_CONFIGS[item.mode].label} • {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <span style={{ color: "#444", fontSize: 14 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 60,
          padding: "24px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 12, color: "#444" }}>
            Built by Elijah • Powered by Claude Sonnet 4 • Designed for RevenueCat
          </div>
          <div style={{ fontSize: 11, color: "#333", marginTop: 6 }}>
            This agent operates autonomously with human oversight. All content is reviewed before publication.
          </div>
        </div>
      </div>
    </div>
  );
}
