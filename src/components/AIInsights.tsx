import React, { useState } from 'react';
import { Sparkles, Terminal, ArrowRight, ShieldCheck, Zap, AlertCircle, RefreshCw, Cpu, Send } from 'lucide-react';
import { SystemMetrics, UserAccount, ActivityLog } from '../types';

interface AIInsightsProps {
  metrics: SystemMetrics;
  accounts: UserAccount[];
  activities: ActivityLog[];
}

export default function AIInsights({ metrics, accounts, activities }: AIInsightsProps) {
  const [insightText, setInsightText] = useState<string>(
    "### **Aetheris Core Insights**\n\n- **System load is nominal** at 12.4% with 99.9% health.\n- **API Latency (42ms)** is stable across all POP nodes.\n- **Recommendation**: Consider setting up an edge cache rule for *EU-Central* to shave off an extra 4ms."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [statusLog, setStatusLog] = useState('');

  const triggerAIAction = async (action: string, customPromptText?: string) => {
    setIsLoading(true);
    setInsightText('');
    
    // Simulate complex DevOps audit status logs to look incredibly premium
    const logs = [
      "Aggregating system hardware states...",
      "Reading active ingress connections...",
      "Synthesizing security auth trails...",
      "Querying Aetheris Gemini Core..."
    ];
    
    let logIndex = 0;
    setStatusLog(logs[0]);
    const logInterval = setInterval(() => {
      logIndex++;
      if (logIndex < logs.length) {
        setStatusLog(logs[logIndex]);
      }
    }, 500);

    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          metrics,
          accounts,
          activities,
          customPrompt: customPromptText
        })
      });

      const data = await response.json();
      clearInterval(logInterval);

      if (data.error) {
        setInsightText(`### **Core Error**\n\n${data.error}`);
      } else {
        setInsightText(data.text);
      }
    } catch (err: any) {
      clearInterval(logInterval);
      setInsightText(`### **System Pipeline Blocked**\n\nCould not compile telemetry nodes. Ensure the server is online and the Gemini API key is valid.`);
    } finally {
      setIsLoading(false);
      setStatusLog('');
    }
  };

  const handleCustomQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim() || isLoading) return;
    triggerAIAction("CUSTOM", customQuery);
    setCustomQuery('');
  };

  return (
    <div id="ai-insights-widget" className="bg-gradient-to-br from-indigo-900/30 via-purple-900/10 to-[#0D0B14]/40 border border-white/10 rounded-2xl p-5 select-none flex flex-col h-[400px] shadow-xl">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-electric-purple/10 border border-electric-purple/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-electric-purple animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Aetheris AI Insights</h3>
            <p className="text-[10px] text-zinc-500 font-semibold font-mono">Model: Gemini 3.6 Flash</p>
          </div>
        </div>
        <span className="text-[9px] font-bold text-white bg-electric-purple/20 border border-electric-purple/40 px-1.5 py-0.2 rounded font-mono">BETA</span>
      </div>

      {/* Main recommendation showcase box */}
      <div className="flex-1 overflow-y-auto bg-zinc-950/50 rounded-xl border border-white/[0.03] p-4 mb-4 relative flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <RefreshCw className="w-6 h-6 text-electric-purple animate-spin mb-3" />
            <p className="text-xs font-bold text-zinc-300 font-sans">{statusLog}</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Analyzing cluster telemetry...</p>
          </div>
        ) : (
          <div className="text-xs text-zinc-300 leading-relaxed font-medium markdown-body space-y-2">
            {/* Very simple custom Markdown rendering to display bullet points, bold headers, and key terms in premium visual layout */}
            {insightText.split('\n').map((line, idx) => {
              const cleanLine = line.trim();
              if (cleanLine.startsWith('###')) {
                return (
                  <h4 key={idx} className="text-xs font-bold text-white border-b border-white/5 pb-1 mb-2 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>{cleanLine.replace('###', '').replace(/\*\*/g, '').trim()}</span>
                  </h4>
                );
              }
              if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
                return (
                  <div key={idx} className="flex items-start gap-2 pl-1 my-1">
                    <span className="text-electric-purple mt-1 font-bold shrink-0">•</span>
                    <span>{cleanLine.replace(/^[-*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                  </div>
                );
              }
              if (cleanLine === '') return <div key={idx} className="h-1" />;
              
              // Handle bold blocks
              return (
                <p key={idx} className="text-zinc-400">
                  {cleanLine.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Action Triggers */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Recommended Telemetry Audits:</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => triggerAIAction("AUDIT_SECURITY")}
            disabled={isLoading}
            className="px-2.5 py-2 text-left rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-[10px] font-bold text-zinc-300 hover:text-white flex items-center justify-between transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-electric-purple shrink-0" />
              <span className="truncate">Run Security Audit</span>
            </div>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
          </button>
          
          <button
            onClick={() => triggerAIAction("OPTIMIZE_WORKLOAD")}
            disabled={isLoading}
            className="px-2.5 py-2 text-left rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-[10px] font-bold text-zinc-300 hover:text-white flex items-center justify-between transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Zap className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
              <span className="truncate">Optimize Clusters</span>
            </div>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
          </button>
        </div>

        {/* Custom Query Input */}
        <form onSubmit={handleCustomQuerySubmit} className="flex gap-2 mt-1 relative">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Ask Aetheris AI about clusters..."
            className="flex-1 bg-obsidian-light/60 border border-white/5 rounded-xl pl-3 pr-10 py-2.5 text-[11px] text-zinc-300 focus:outline-none focus:border-electric-purple/40 placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={isLoading || !customQuery.trim()}
            className="absolute right-1 top-1 bottom-1 w-8 rounded-lg bg-electric-purple/10 border border-electric-purple/20 text-electric-purple hover:bg-electric-purple hover:text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
