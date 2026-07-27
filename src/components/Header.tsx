import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  Sliders,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  systemHealth: number;
  systemStatus: string;
  setSystemStatus: (status: string) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export default function Header({ 
  onSearchClick, 
  systemHealth, 
  systemStatus, 
  setSystemStatus,
  onRefreshData,
  isRefreshing
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Notifications state
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'Anomalous MRR ingress spike detected', type: 'info', time: '2 mins ago', read: false },
    { id: '2', title: 'API latency exceeded 120ms in EU-West-1', type: 'warning', time: '12 mins ago', read: false },
    { id: '3', title: 'User (Enterprise) upgraded via stripe webhooks', type: 'success', time: '1 hr ago', read: true },
    { id: '4', title: 'Database compaction complete', type: 'success', time: '3 hrs ago', read: true },
  ]);

  const unreadCount = alerts.filter(a => !a.read).length;

  useEffect(() => {
    // Standard beautiful clock showing hours, minutes, and seconds
    const updateTime = () => {
      const date = new Date();
      setLocalTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  return (
    <header id="dashboard-header" className="px-8 py-4 border-b border-white/5 select-none bg-obsidian-light/20 backdrop-blur-sm relative z-[70] overflow-visible">
      {/* Top Header Row */}
      <div id="top-header-row" className="flex items-center justify-between gap-4 relative z-[70]">
        {/* Search Input Bar */}
        <div 
          id="search-trigger"
          onClick={onSearchClick}
          className="w-96 bg-obsidian-light/50 hover:bg-obsidian-light/80 border border-white/5 hover:border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between text-zinc-400 text-sm cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-zinc-500" />
            <span>Search accounts, nodes, actions...</span>
          </div>
          <kbd className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[11px] font-mono border border-zinc-700/50">⌘K</kbd>
        </div>

        {/* Action Controls & Profile info */}
        <div id="top-header-actions" className="flex items-center gap-4">
          
          {/* Live Server Status Badge */}
          <div className="relative group">
            <button 
              id="server-status-trigger"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 bg-zinc-900 border transition-all cursor-pointer ${
                systemStatus === 'Optimal'
                  ? 'border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/5'
                  : 'border-warm-orange/20 text-warm-orange hover:bg-warm-orange/5'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                systemStatus === 'Optimal' ? 'bg-neon-cyan animate-ping' : 'bg-warm-orange animate-ping'
              }`} />
              <span>System: {systemStatus}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {/* System Status Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-obsidian-light/95 border border-white/10 rounded-xl shadow-xl py-1.5 z-50 hidden group-hover:block backdrop-blur-md">
              <div className="px-3 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-white/5 mb-1">
                Simulate State
              </div>
              <button 
                onClick={() => setSystemStatus('Optimal')}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                <span>Optimal Performance</span>
              </button>
              <button 
                onClick={() => setSystemStatus('Degraded')}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-warm-orange" />
                <span>Latency Anomaly</span>
              </button>
            </div>
          </div>

          {/* Refresh Action Trigger */}
          <button 
            id="refresh-telemetry"
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="w-10 h-10 rounded-xl bg-obsidian-light/50 hover:bg-obsidian-light/80 border border-white/5 hover:border-white/10 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            title="Refresh System Metrics"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-400 ${isRefreshing ? 'animate-spin text-electric-purple' : ''}`} />
          </button>

          {/* Clock Display */}
          <div className="hidden md:flex items-center gap-2 bg-obsidian-light/50 border border-white/5 px-3 py-2 rounded-xl text-xs font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-purple" />
            <span>{localTime || '07:40:33 AM'}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative z-[70]">
            <button 
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-obsidian-light/50 hover:bg-obsidian-light/80 border border-white/5 hover:border-white/10 flex items-center justify-center transition-all relative cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5 text-zinc-400" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-neon-magenta rounded-full glow-magenta animate-pulse" />
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div id="notification-popover" className="absolute right-0 mt-3 w-80 bg-obsidian-light/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[90] backdrop-blur-md">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-electric-purple" />
                    <span className="font-semibold text-xs text-white">System Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[11px] text-neon-cyan hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] flex gap-3 transition-all ${
                        !alert.read ? 'bg-white/[0.01]' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {alert.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-warm-orange shrink-0" />
                        ) : alert.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-electric-purple shrink-0" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs leading-relaxed ${!alert.read ? 'text-white font-medium' : 'text-zinc-400'}`}>
                          {alert.title}
                        </p>
                        <span className="text-[10px] text-zinc-500 mt-1 block">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/5 bg-zinc-950/30 text-center">
                  <span className="text-[11px] text-zinc-500">Telemetry Stream Connected</span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative z-[70]">
            <button 
              id="profile-trigger-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 bg-obsidian-light/60 hover:bg-obsidian-light/95 border border-white/5 hover:border-white/10 rounded-xl px-3 py-1.5 transition-all duration-200 cursor-pointer text-left"
            >
              {/* Premium Avatar Visual */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-electric-purple to-neon-magenta flex items-center justify-center text-white text-xs font-bold font-mono">
                AV
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-white leading-tight">Alex Vance</p>
                <p className="text-[10px] text-zinc-400 font-medium">Lead Admin</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden lg:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div id="profile-dropdown-menu" className="absolute right-0 mt-3 w-52 bg-obsidian-light/95 border border-white/10 rounded-2xl shadow-2xl py-1.5 z-[90] backdrop-blur-md">
                <div className="px-4 py-2 border-b border-white/5 mb-1.5">
                  <p className="text-xs text-zinc-500">Access Key</p>
                  <p className="text-xs font-mono text-zinc-300 truncate">sk_aetheris_...fc98</p>
                </div>
                <button 
                  onClick={() => { setShowProfileMenu(false); setSystemStatus('Degraded'); }}
                  className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-zinc-500" />
                  <span>Simulate Outage</span>
                </button>
                <button 
                  onClick={() => { setShowProfileMenu(false); onRefreshData(); }}
                  className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-zinc-500" />
                  <span>Force Core Sync</span>
                </button>
                <div className="border-t border-white/5 my-1.5" />
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-zinc-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
