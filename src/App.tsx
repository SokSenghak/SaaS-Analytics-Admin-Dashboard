import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KPICards from './components/KPICards';
import HeroBanner from './components/HeroBanner';
import ActiveAccounts from './components/ActiveAccounts';
import LiveTelemetry from './components/LiveTelemetry';
import AIInsights from './components/AIInsights';
import ActivityLog from './components/ActivityLog';
import ScheduledJobs from './components/ScheduledJobs';
import Views from './components/Views';
import CommandPalette from './command-palette';
import { UserAccount, ActivityLog as ActivityLogType, APIKey, Webhook, ScheduledJob, TelemetryRegion, SystemMetrics } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState('Optimal');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Global Core Telemetry & MRR Metrics
  const [metrics, setMetrics] = useState<SystemMetrics>({
    mrr: 128450,
    mrrGrowth: 14.2,
    activeUsers: 12840,
    activeUsersGrowth: 8.5,
    apiLatency: 42,
    apiLatencyGrowth: -12,
    systemHealth: 99.9,
    systemHealthStatus: 'Healthy'
  });

  // Global User Accounts State (Mock CRM Nodes)
  const [accounts, setAccounts] = useState<UserAccount[]>([
    {
      id: 'acc-1',
      name: 'Sarah Jenkins',
      email: 'sjenkins@cyberdyne.co',
      company: 'Cyberdyne Systems',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      requestCount: 2840128,
      growth: 24,
      status: 'Active',
      tier: 'Enterprise',
      role: 'System Architect'
    },
    {
      id: 'acc-2',
      name: 'David Miller',
      email: 'david.miller@krypton.io',
      company: 'Krypton Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      requestCount: 1928410,
      growth: 18,
      status: 'Active',
      tier: 'Enterprise',
      role: 'Lead Developer'
    },
    {
      id: 'acc-3',
      name: 'Chloe Tanaka',
      email: 'tanaka@nakamoto.org',
      company: 'Nakamoto Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      requestCount: 1120340,
      growth: 16,
      status: 'Active',
      tier: 'Pro',
      role: 'Security Engineer'
    },
    {
      id: 'acc-4',
      name: 'Marcus Vance',
      email: 'marcus@tyrell.corp',
      company: 'Tyrell Corp',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      requestCount: 870400,
      growth: 12,
      status: 'Active',
      tier: 'Pro',
      role: 'Data Analyst'
    }
  ]);

  // Global Activity Logs feed
  const [activities, setActivities] = useState<ActivityLogType[]>([
    {
      id: 'act-1',
      userId: 'acc-1',
      userName: 'Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      action: 'Upgraded tenant limits',
      details: 'SLA parameters elevated to Enterprise tier',
      timestamp: '2m ago',
      status: 'Upgraded'
    },
    {
      id: 'act-2',
      userId: 'acc-3',
      userName: 'Chloe Tanaka',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      action: 'API Secret Reset',
      details: 'Token suffix reset for Nakamoto gateway',
      timestamp: '15m ago',
      status: 'API Reset'
    },
    {
      id: 'act-3',
      userId: 'acc-4',
      userName: 'Marcus Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      action: 'Cluster compaction test',
      details: 'Node us-east-3 compaction complete',
      timestamp: '1h ago',
      status: 'Success'
    }
  ]);

  // Global Developer API keys state
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    { id: 'key-1', name: 'Primary Stripe Webhook Token', keyPrefix: 'sk_aether_89ea', created: '2026-05-14', lastUsed: '2 mins ago', status: 'Active', scope: 'Full-Access', usageCount: 428012 },
    { id: 'key-2', name: 'Dev Read-Only Cluster Ingress', keyPrefix: 'sk_aether_31fc', created: '2026-06-20', lastUsed: '12 mins ago', status: 'Active', scope: 'Read-Only', usageCount: 19280 },
    { id: 'key-3', name: 'Compliance Logger Token', keyPrefix: 'sk_aether_01ba', created: '2026-07-01', lastUsed: 'Never', status: 'Revoked', scope: 'Admin', usageCount: 0 }
  ]);

  // Global Webhooks destination state
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: 'wh-1', name: 'Slack Ops Critical Alerts', url: 'https://hooks.slack.com/services/T00/B00/X00', events: ['mrr.ingress.spike', 'cluster.degraded'], status: 'Active', lastDelivery: '5 mins ago' },
    { id: 'wh-2', name: 'SecOps Audit Webhook', url: 'https://api.securityaudit.co/v1/ingress', events: ['security.auth.audit'], status: 'Active', lastDelivery: '1 hr ago' }
  ]);

  // Global Cron Workloads State
  const [jobs, setJobs] = useState<ScheduledJob[]>([
    { id: 'job-1', name: 'Database compression audit', schedule: '*/30 * * * *', lastRun: '12m ago', status: 'Success', duration: '4s' },
    { id: 'job-2', name: 'SSL Certificate compaction', schedule: '0 0 * * 0', lastRun: '3 days ago', status: 'Success', duration: '12s' },
    { id: 'job-3', name: 'Billing sync cron', schedule: '0 0 1 * *', lastRun: '23 days ago', status: 'Success', duration: '8s' },
    { id: 'job-4', name: 'Node health check watchdog', schedule: '*/5 * * * *', lastRun: '3m ago', status: 'Success', duration: '2s' }
  ]);

  // Global POP CDN nodes state
  const [regions, setRegions] = useState<TelemetryRegion[]>([
    { id: 'us-east', name: 'US-East (Virginia)', coordinates: { x: 23, y: 35 }, latency: 12, load: 14, connections: 8410, status: 'Healthy' },
    { id: 'eu-central', name: 'EU-West (Frankfurt)', coordinates: { x: 48, y: 28 }, latency: 28, load: 38, connections: 3120, status: 'Healthy' },
    { id: 'ap-northeast', name: 'AP-East (Tokyo)', coordinates: { x: 78, y: 36 }, latency: 42, load: 24, connections: 1140, status: 'Healthy' },
    { id: 'sa-east', name: 'SA-East (São Paulo)', coordinates: { x: 32, y: 72 }, latency: 68, load: 45, connections: 890, status: 'Healthy' },
    { id: 'au-southeast', name: 'AU-Southeast (Sydney)', coordinates: { x: 84, y: 82 }, latency: 85, load: 12, connections: 450, status: 'Healthy' }
  ]);

  // Command palette ⌘K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Adapt regions and latency values dynamically if status outage is simulated
  useEffect(() => {
    if (systemStatus === 'Degraded') {
      // Outage simulated: Spike EU-Central latency and drop system health
      setMetrics((prev) => ({
        ...prev,
        apiLatency: 114,
        apiLatencyGrowth: 142,
        systemHealth: 94.2,
        systemHealthStatus: 'SLA At Risk'
      }));
      setRegions((prev) =>
        prev.map((reg) =>
          reg.id === 'eu-central'
            ? { ...reg, latency: 184, load: 88, status: 'Degraded' }
            : reg
        )
      );
      // Append a warning activity log
      const newLog: ActivityLogType = {
        id: `act-${Date.now()}`,
        userId: 'system',
        userName: 'Aetheris Watchdog',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        action: 'API latency spike alert',
        details: 'EU-Central egress latency exceeded 180ms threshold',
        timestamp: 'Just now',
        status: 'Suspended'
      };
      setActivities((prev) => [newLog, ...prev]);
    } else {
      // Restore system to healthy state
      setMetrics((prev) => ({
        ...prev,
        apiLatency: 42,
        apiLatencyGrowth: -12,
        systemHealth: 99.9,
        systemHealthStatus: 'Healthy'
      }));
      setRegions((prev) =>
        prev.map((reg) =>
          reg.id === 'eu-central'
            ? { ...reg, latency: 28, load: 38, status: 'Healthy' }
            : reg
        )
      );
    }
  }, [systemStatus]);

  // Handle Forced Synchronizations
  const handleForceSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Small randomized variations to show live backend updates
      setMetrics((prev) => ({
        ...prev,
        mrr: prev.mrr + Math.floor(Math.random() * 500) - 200,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 5
      }));
    }, 1200);
  };

  // Callback to simulate actual system-wide optimization
  const handleOptimizeMetrics = () => {
    setMetrics((prev) => ({
      ...prev,
      apiLatency: 35,
      apiLatencyGrowth: -18,
      systemHealth: 99.95,
      mrr: prev.mrr + 1500,
    }));
    // Change regions latency
    setRegions((prev) => prev.map(r => ({ ...r, latency: Math.max(8, r.latency - 4) })));
    // Append a compaction success security activity log
    const newLog: ActivityLogType = {
      id: `act-${Date.now()}`,
      userId: 'system',
      userName: 'Aetheris AI',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      action: 'Cluster compression triggered',
      details: 'Compressed cache allocations on all edge CDN POP nodes',
      timestamp: 'Just now',
      status: 'API Reset'
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  // State mutators for views
  const handleUpgradeAccount = (id: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, tier: 'Enterprise', growth: acc.growth + 4 };
      }
      return acc;
    }));
    // Log the upgrade action
    const upgradeTarget = accounts.find(a => a.id === id);
    if (upgradeTarget) {
      const newLog: ActivityLogType = {
        id: `act-${Date.now()}`,
        userId: id,
        userName: upgradeTarget.name,
        avatarUrl: upgradeTarget.avatarUrl,
        action: 'Account Upgraded',
        details: `${upgradeTarget.company} promoted to Enterprise tier SLA`,
        timestamp: 'Just now',
        status: 'Upgraded'
      };
      setActivities(prev => [newLog, ...prev]);
    }
  };

  const handleSuspendAccount = (id: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        const nextStatus = acc.status === 'Suspended' ? 'Active' : 'Suspended';
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));
    const target = accounts.find(a => a.id === id);
    if (target) {
      const isSuspending = target.status !== 'Suspended';
      const newLog: ActivityLogType = {
        id: `act-${Date.now()}`,
        userId: id,
        userName: target.name,
        avatarUrl: target.avatarUrl,
        action: isSuspending ? 'Node Suspended' : 'Node Restored',
        details: isSuspending ? `${target.company} ingress token blocked` : `${target.company} access authorized`,
        timestamp: 'Just now',
        status: isSuspending ? 'Suspended' : 'Success'
      };
      setActivities(prev => [newLog, ...prev]);
    }
  };

  const handleRegisterAccount = (acc: Partial<UserAccount>) => {
    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    ];
    const newAcc: UserAccount = {
      id: `acc-${Date.now()}`,
      name: acc.name || 'New Tenant',
      company: acc.company || 'Autonomous Corp',
      email: acc.email || 'operator@brand.io',
      avatarUrl: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
      requestCount: 0,
      growth: 5,
      status: 'Active',
      tier: acc.tier || 'Pro',
      role: 'Database Engineer'
    };
    setAccounts(prev => [...prev, newAcc]);
    const newLog: ActivityLogType = {
      id: `act-${Date.now()}`,
      userId: newAcc.id,
      userName: newAcc.name,
      avatarUrl: newAcc.avatarUrl,
      action: 'Tenant Node Deployed',
      details: `${newAcc.company} registered with ${newAcc.tier} scope`,
      timestamp: 'Just now',
      status: 'Success'
    };
    setActivities(prev => [newLog, ...prev]);
  };

  const handleCreateAPIKey = (name: string, scope: 'Read-Only' | 'Admin' | 'Full-Access') => {
    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name,
      keyPrefix: `sk_aether_${Math.random().toString(36).substring(2, 6)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'Active',
      scope,
      usageCount: 0
    };
    setApiKeys(prev => [newKey, ...prev]);
    const newLog: ActivityLogType = {
      id: `act-${Date.now()}`,
      userId: 'system',
      userName: 'Alex Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      action: 'API Credential Generated',
      details: `Created high-security token node "${name}"`,
      timestamp: 'Just now',
      status: 'API Reset'
    };
    setActivities(prev => [newLog, ...prev]);
  };

  const handleRevokeAPIKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
    const target = apiKeys.find(k => k.id === id);
    if (target) {
      const newLog: ActivityLogType = {
        id: `act-${Date.now()}`,
        userId: 'system',
        userName: 'Alex Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        action: 'API Credential Revoked',
        details: `Revoked security auth key "${target.name}"`,
        timestamp: 'Just now',
        status: 'Suspended'
      };
      setActivities(prev => [newLog, ...prev]);
    }
  };

  const handleAddWebhook = (name: string, url: string, events: string[]) => {
    const newWh: Webhook = {
      id: `wh-${Date.now()}`,
      name,
      url,
      events,
      status: 'Active',
      lastDelivery: 'Never'
    };
    setWebhooks(prev => [...prev, newWh]);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(wh => wh.id !== id));
  };

  const handleTriggerCronJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Running', lastRun: 'Just now' } : j));
    const target = jobs.find(j => j.id === id);
    setTimeout(() => {
      setJobs(prevJobs => prevJobs.map(j => j.id === id ? { ...j, status: 'Success' } : j));
      if (target) {
        const newLog: ActivityLogType = {
          id: `act-${Date.now()}`,
          userId: 'system',
          userName: 'Aetheris Cron',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          action: 'Scheduled cron execution completed',
          details: `Autonomous workload "${target.name}" completed successfully`,
          timestamp: 'Just now',
          status: 'Success'
        };
        setActivities(prev => [newLog, ...prev]);
      }
    }, 1800);
  };

  return (
    <div
      id="saas-dashboard-root"
      className="h-screen bg-obsidian flex text-zinc-300 font-sans relative overflow-hidden radial-glow-top"
      style={{ background: 'linear-gradient(180deg, rgba(10,7,19,1) 0%, rgba(15,10,26,0.98) 40%, rgba(12,9,18,1) 100%)' }}
    >
      {/* Background Decorative Mesh Glow */}
      <div className="absolute inset-0 radial-glow pointer-events-none z-0" />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        onOptimizeMetrics={handleOptimizeMetrics}
        setSystemStatus={setSystemStatus}
      />

      {/* Left Sidebar Menu */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userCount={accounts.length}
        apiKeysCount={apiKeys.filter(k => k.status === 'Active').length}
      />

      {/* Main Content Workspace Panel */}
      <main id="main-content-panel" className="flex-1 min-w-0 flex flex-col h-screen z-10 relative overflow-visible"
        style={{ background: 'transparent' }}
      >
        {/* Consistent Top & Greetings Header */}
        <Header 
          onSearchClick={() => setIsCommandPaletteOpen(true)}
          systemHealth={metrics.systemHealth}
          systemStatus={systemStatus}
          setSystemStatus={setSystemStatus}
          onRefreshData={handleForceSync}
          isRefreshing={isRefreshing}
        />

        {/* Dynamic Inner Layout Body */}
        {activeTab === 'dashboard' ? (
          <div id="dashboard-tab-content" className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
            
            {/* Primary Dashboard Modules (KPI Row + Hero Banner + Split tables/maps) */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              
              {/* Dynamic Greeting Row inside scrollable main container */}
              <div id="main-greeting-container" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 pt-6 pb-2 select-none">
                <div>
                  <h1 id="greeting-title" className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>{(() => {
                      const hours = new Date().getHours();
                      if (hours < 12) return 'Good morning, Alex!';
                      if (hours < 18) return 'Good afternoon, Alex!';
                      return 'Good evening, Alex!';
                    })()}</span>
                    <span className="text-neon-cyan animate-pulse">✦</span>
                  </h1>
                  <p id="greeting-subtitle" className="text-sm text-zinc-400 mt-1 font-medium">
                    System performance is running at optimal speed.
                  </p>
                </div>
                
                {/* Rapid stats badges */}
                <div className="flex items-center gap-3">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00F5D4]" />
                    <span className="text-[11px] font-medium text-zinc-400 font-mono">Load: 12.4%</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-purple shadow-[0_0_8px_#9D4EDD]" />
                    <span className="text-[11px] font-medium text-zinc-400 font-mono">Orchestrator: 28 Nodes</span>
                  </div>
                </div>
              </div>

              {/* Top 4 KPI Metrics row */}
              <KPICards 
                metrics={metrics} 
              />

              {/* Middle Feature Announcement Banner */}
              <HeroBanner 
                onOptimizeMetrics={handleOptimizeMetrics}
                setActiveTab={setActiveTab}
              />

              {/* Bottom Split Row (Accounts Table on Left, Live Map Telemetry on Right) */}
              <div id="bottom-dashboard-grid" className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-8 py-4 mb-6">
                <div className="lg:col-span-3">
                  <ActiveAccounts 
                    accounts={accounts}
                    onUpgradeAccount={handleUpgradeAccount}
                    onSuspendAccount={handleSuspendAccount}
                    onAddAccount={handleRegisterAccount}
                  />
                </div>
                <div className="lg:col-span-2">
                  <LiveTelemetry 
                    regions={regions}
                  />
                </div>
              </div>

            </div>

            {/* Right Widget Panel (AI Assistant + Audit Logs + Cron) */}
            <aside id="right-widget-panel" className="w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-white/5 bg-obsidian-card p-6 flex flex-col gap-6 overflow-y-auto h-full shrink-0">
              <AIInsights 
                metrics={metrics}
                accounts={accounts}
                activities={activities}
              />
              <ActivityLog 
                activities={activities}
              />
              <ScheduledJobs 
                jobs={jobs}
                onTriggerJob={handleTriggerCronJob}
              />
            </aside>

          </div>
        ) : (
          /* Other active navigation views (Analytics, Users, Webhooks, API keys, permissions, settings) */
          <div id="sub-view-content" className="flex-1 overflow-y-auto">
            <Views 
              activeTab={activeTab}
              accounts={accounts}
              onUpgradeAccount={handleUpgradeAccount}
              onSuspendAccount={handleSuspendAccount}
              onAddAccount={handleRegisterAccount}
              apiKeys={apiKeys}
              onCreateAPIKey={handleCreateAPIKey}
              onRevokeAPIKey={handleRevokeAPIKey}
              webhooks={webhooks}
              onAddWebhook={handleAddWebhook}
              onDeleteWebhook={handleDeleteWebhook}
              metrics={metrics}
              setMetrics={setMetrics}
            />
          </div>
        )}
      </main>
    </div>
  );
}
