import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Activity, Users, Key, Webhook, ShieldCheck, Sliders, Cpu, AlertTriangle, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  onOptimizeMetrics: () => void;
  setSystemStatus: (status: string) => void;
}

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  setActiveTab, 
  onOptimizeMetrics,
  setSystemStatus 
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'view_dashboard', name: 'Go to Dashboard Overview', icon: Terminal, category: 'Navigation', action: () => { setActiveTab('dashboard'); onClose(); } },
    { id: 'view_analytics', name: 'View Telemetry Analytics', icon: Activity, category: 'Navigation', action: () => { setActiveTab('analytics'); onClose(); } },
    { id: 'view_users', name: 'Manage Registered CRM Tenants', icon: Users, category: 'Navigation', action: () => { setActiveTab('users'); onClose(); } },
    { id: 'view_keys', name: 'Generate/Revoke API Tokens', icon: Key, category: 'Navigation', action: () => { setActiveTab('keys'); onClose(); } },
    { id: 'view_webhooks', name: 'Configure Live Webhooks', icon: Webhook, category: 'Navigation', action: () => { setActiveTab('webhooks'); onClose(); } },
    { id: 'view_roles', name: 'Edit Role Compliance Checklist', icon: ShieldCheck, category: 'Navigation', action: () => { setActiveTab('permissions'); onClose(); } },
    { id: 'view_settings', name: 'Open Dashboard Configurations', icon: Sliders, category: 'Navigation', action: () => { setActiveTab('settings'); onClose(); } },
    { id: 'opt_cluster', name: 'Run Workload Cluster Optimization', icon: Cpu, category: 'Operations', action: () => { onOptimizeMetrics(); onClose(); } },
    { id: 'sim_outage', name: 'Simulate Latency Outage Anomaly', icon: AlertTriangle, category: 'Maintenance', action: () => { setSystemStatus('Degraded'); onClose(); } },
    { id: 'sim_optimal', name: 'Reset Cluster to Optimal Range', icon: Cpu, category: 'Maintenance', action: () => { setSystemStatus('Optimal'); onClose(); } },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div id="command-palette" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4 select-none">
      {/* Click backdrop to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="w-full max-w-xl bg-obsidian-light/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col h-[380px]">
        {/* Search header bar */}
        <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-white/5 bg-zinc-950/40">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to view..."
            className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-zinc-500 font-sans"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Commands List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {filteredCommands.length === 0 ? (
            <div className="text-center text-xs text-zinc-500 py-10">No administrative commands found.</div>
          ) : (
            <div>
              {/* Group commands by category */}
              {['Navigation', 'Operations', 'Maintenance'].map((cat) => {
                const catCmds = filteredCommands.filter(c => c.category === cat);
                if (catCmds.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1 mb-3.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-1 block">
                      {cat}
                    </span>
                    {catCmds.map((cmd) => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-between transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-electric-purple" />
                            <span>{cmd.name}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.03]">
                            Execute
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-zinc-950/40 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-zinc-800 px-1 py-0.2 rounded font-mono">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-zinc-800 px-1 py-0.2 rounded font-mono">Enter</kbd> Select</span>
            <span><kbd className="bg-zinc-800 px-1 py-0.2 rounded font-mono">Esc</kbd> Close</span>
          </div>
          <span className="font-mono">Aetheris Console v3.4</span>
        </div>
      </div>
    </div>
  );
}
