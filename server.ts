import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for generating AI insights about the dashboard telemetry
app.post("/api/ai/insights", async (req, res) => {
  try {
    const { action, metrics, accounts, activities, customPrompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(403).json({
        error: "GEMINI_API_KEY is not configured on this server. Please set it up in Settings > Secrets."
      });
    }

    // Build system instructions for Gemini to act as a world-class SaaS DevOps & Admin Expert
    const systemInstruction = `You are "Aetheris AI Insights Engine", an elite, autonomous SaaS DevOps and Security Audit AI built into a premium high-end SaaS Admin Dashboard.
Your role is to analyze live system telemetry, user accounts activity, API latency spikes, and server logs, and deliver mathematically-grounded, actionable administrative advice.
Format your responses with clean, professional, scannable Markdown. Use elegant terminology (e.g., "throughput bottlenecks", "anomalous ingress spikes", "optimizing memory caches").
Strictly limit responses to around 200-250 words to keep them perfectly readable in the sidebar panel. Use bullet points and bold headers.`;

    let prompt = "";
    if (action === "AUDIT_SECURITY") {
      prompt = `Perform a rapid Security & Compliance Audit based on this system snapshot:
Active Accounts: ${JSON.stringify(accounts)}
Recent Actions: ${JSON.stringify(activities)}
Identify any anomalous logins, token resets, or suspicious growth metrics, and recommend direct security protocols (e.g., limiting token scopes or flagging suspicious IPs).`;
    } else if (action === "OPTIMIZE_WORKLOAD") {
      prompt = `Analyze these hardware and network metrics to optimize workload clusters:
MRR: $${metrics.mrr} (Growth: ${metrics.mrrGrowth}%)
Active Users: ${metrics.activeUsers} (Growth: ${metrics.activeUsersGrowth}%)
API Latency: ${metrics.apiLatency}ms (Growth: ${metrics.apiLatencyGrowth}%)
System Health: ${metrics.systemHealth}%
Provide 3 concrete suggestions for microservice resource scaling, edge caching adjustments, or database indexing to shave off latency.`;
    } else if (action === "ANOMALY_DETECTION") {
      prompt = `Run real-time anomaly detection. Let's look at recent logs and metrics:
System Health: ${metrics.systemHealth}%
API Latency: ${metrics.apiLatency}ms
Activities: ${JSON.stringify(activities)}
Is the system experiencing a cold start, DDoS, or is it operating under optimal parameter ranges? Point out specific trigger thresholds.`;
    } else {
      prompt = `The user asked this custom administrative question:
"${customPrompt}"

Here is the current system state for your context:
- Metrics: MRR=$${metrics.mrr}, Users=${metrics.activeUsers}, Latency=${metrics.apiLatency}ms, Health=${metrics.systemHealth}%
- Users list: ${JSON.stringify(accounts)}
- Recent Activities: ${JSON.stringify(activities)}

Provide an extremely smart, direct answer addressing their query. Use bullet points for structural recommendations.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred while communicating with Gemini." });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

async function start() {
  // Vite dev server mounting in non-production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

start();
