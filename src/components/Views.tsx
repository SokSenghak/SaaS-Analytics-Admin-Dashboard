import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Activity, 
  Database, 
  Layers, 
  Key, 
  Globe, 
  ShieldCheck, 
  Users,
  Webhook as WebhookIcon,
  Sliders,
  Sparkles,
  AlertTriangle,
  ShoppingBag,
  Megaphone,
  Tag,
  Mail,
  ClipboardList,
  Search,
  MessageSquare,
  Send,
  Percent,
  Calendar,
  DollarSign
} from 'lucide-react';
import { UserAccount, APIKey, Webhook, ScheduledJob, SystemMetrics } from '../types';

interface ViewsProps {
  activeTab: string;
  // User Management tab props
  accounts: UserAccount[];
  onUpgradeAccount: (id: string) => void;
  onSuspendAccount: (id: string) => void;
  onAddAccount: (acc: Partial<UserAccount>) => void;
  // API Keys tab props
  apiKeys: APIKey[];
  onCreateAPIKey: (name: string, scope: 'Read-Only' | 'Admin' | 'Full-Access') => void;
  onRevokeAPIKey: (id: string) => void;
  // Webhooks tab props
  webhooks: Webhook[];
  onAddWebhook: (name: string, url: string, events: string[]) => void;
  onDeleteWebhook: (id: string) => void;
  // System Metrics
  metrics: SystemMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<SystemMetrics>>;
}

export default function Views({ 
  activeTab, 
  accounts, 
  onUpgradeAccount, 
  onSuspendAccount, 
  onAddAccount,
  apiKeys, 
  onCreateAPIKey, 
  onRevokeAPIKey,
  webhooks, 
  onAddWebhook, 
  onDeleteWebhook,
  metrics,
  setMetrics
}: ViewsProps) {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Form states
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState<'Read-Only' | 'Admin' | 'Full-Access'>('Read-Only');

  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['user.created']);

  // --- STORE PRODUCTS STATE ---
  const [products, setProducts] = useState([
    { id: 'prod-1', name: 'Minimal Table Lamp', price: 129, sold: 1284, growth: 24, stock: 45, category: 'Lighting', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=150&q=80' },
    { id: 'prod-2', name: 'Ceramic Vase', price: 79, sold: 1120, growth: 18, stock: 12, category: 'Decor', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=150&q=80' },
    { id: 'prod-3', name: 'Nordic Lounge Chair', price: 249, sold: 980, growth: 16, stock: 5, category: 'Furniture', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=150&q=80' },
    { id: 'prod-4', name: 'Linen Cushion Set', price: 159, sold: 870, growth: 12, stock: 84, category: 'Textiles', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=150&q=80' },
  ]);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCategory, setProdCategory] = useState('Decor');

  // --- STORE ORDERS STATE ---
  const [orders, setOrders] = useState([
    { id: 'ord-1248', name: 'Sophia Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', items: '2 items', price: 129.00, status: 'Delivered', date: 'Today, 11:24 AM' },
    { id: 'ord-1247', name: 'James Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', items: '1 item', price: 79.00, status: 'Shipped', date: 'Today, 09:15 AM' },
    { id: 'ord-1246', name: 'Olivia Brown', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', items: '3 items', price: 249.00, status: 'Processing', date: 'Yesterday' },
    { id: 'ord-1245', name: 'Daniel Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', items: '2 items', price: 159.00, status: 'Delivered', date: 'Yesterday' },
  ]);
  const [ordersFilter, setOrdersFilter] = useState('All');

  // --- MARKETING CAMPAIGNS STATE ---
  const [campaigns, setCampaigns] = useState([
    { id: 'camp-1', name: 'Summer Glow Sale', type: 'Email Campaign', budget: 1200, revenue: 14200, ctr: '4.8%', status: 'Active', date: 'Starts 05 July' },
    { id: 'camp-2', name: 'Social Media Push', type: 'Instagram Ads', budget: 800, revenue: 5600, ctr: '3.2%', status: 'Active', date: 'Ongoing' },
    { id: 'camp-3', name: 'Holiday Special Deals', type: 'Influencer Collab', budget: 2500, revenue: 0, ctr: '-', status: 'Scheduled', date: 'Scheduled Dec 1' },
  ]);
  const [campName, setCampName] = useState('');
  const [campType, setCampType] = useState('Email Campaign');
  const [campBudget, setCampBudget] = useState('');

  // --- DISCOUNTS STATE ---
  const [discounts, setDiscounts] = useState([
    { code: 'SUMMERGLOW25', discount: '25% OFF', type: 'Percentage', usage: 148, status: 'Active' },
    { code: 'WELCOME10', discount: '10% OFF', type: 'Percentage', usage: 310, status: 'Active' },
    { code: 'LUMAORAPRO', discount: 'Free Shipping', type: 'Free Shipping', usage: 42, status: 'Active' },
  ]);
  const [discCode, setDiscCode] = useState('');
  const [discVal, setDiscVal] = useState('');
  const [discType, setDiscType] = useState('Percentage');

  // --- INBOX STATE ---
  const [messages, setMessages] = useState([
    { id: 'msg-1', sender: 'Sophia Miller', subject: 'Inquiry about Minimal Table Lamp stock', preview: 'Hi Lumaora support, I wanted to buy 5 table lamps but noticed only...', body: 'Hi Lumaora support,\n\nI wanted to buy 5 of the Minimal Table Lamps for a dining room redecoration project, but noticed that there are only 4 remaining in stock. When will you be restocking this item? I would love to place a bulk order as soon as they are available.\n\nBest,\nSophia Miller', date: '10:42 AM', unread: true, category: 'Support' },
    { id: 'msg-2', sender: 'James Carter', subject: 'Shipping address correction', preview: 'Hello, I just placed order #1247. I made a typo in my ZIP code...', body: 'Hello,\n\nI just placed order #1247. I noticed that I made a typo in my shipping ZIP code (should be 90210 instead of 90211). Could you please correct this before the package ships out today?\n\nThank you,\nJames', date: 'Yesterday', unread: false, category: 'Order Issue' },
    { id: 'msg-3', sender: 'Olivia Brown', subject: 'Collaboration proposal', preview: 'Hello marketing team! I am an interior design influencer with...', body: 'Hello marketing team!\n\nI am an interior design influencer with 120k followers on Instagram. I absolutely love your home decor catalog and would be thrilled to discuss a potential partnership or sponsor opportunity for my upcoming living room makeover video series.\n\nLet me know if we can set up a short call!\n\nOlivia', date: '2 days ago', unread: false, category: 'Marketing' },
  ]);
  const [selectedMsgId, setSelectedMsgId] = useState('msg-1');
  const [replyText, setReplyText] = useState('');

  // -- Telemetry chart interactive state --
  const [chartHoverIdx, setChartHoverIdx] = useState<number | null>(null);
  const [chartHoverPos, setChartHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartData = [120, 80, 140, 70, 160, 110, 130];
  const chartWidth = 1000;
  const chartHeight = 200;
  const chartMax = Math.max(...chartData);
  const chartPoints = chartData.map((v, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - ((v / chartMax) * (chartHeight - 40)) - 20; // padding
    return { x, y, value: v };
  });
  const areaPath = `M ${chartPoints[0].x} ${chartHeight} L ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartWidth} ${chartHeight} Z`;
  const linePath = chartPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

  // Copy helper
  const handleCopy = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Webhook event toggler
  const toggleWebhookEvent = (ev: string) => {
    if (webhookEvents.includes(ev)) {
      setWebhookEvents(webhookEvents.filter(x => x !== ev));
    } else {
      setWebhookEvents([...webhookEvents, ev]);
    }
  };

  // Roles Matrix State
  const [roles, setRoles] = useState([
    { role: 'Lead Admin', desc: 'Full core systems deployment and master key access', caps: ['node.write', 'keys.grant', 'users.modify', 'billing.read'] },
    { role: 'Security Auditor', desc: 'Inspects real-time auth patterns and active tokens', caps: ['keys.grant', 'users.modify'] },
    { role: 'Developer Operator', desc: 'Can adjust microservices scaling and telemetry POPs', caps: ['node.write', 'billing.read'] },
    { role: 'Billing Controller', desc: 'MRR ledger monitoring and stripe integration audits', caps: ['billing.read'] }
  ]);

  const allCapabilities = [
    { key: 'node.write', name: 'Write Cluster Configurations' },
    { key: 'keys.grant', name: 'Generate & Revoke API Tokens' },
    { key: 'users.modify', name: 'Suspend & Upgrade User Accounts' },
    { key: 'billing.read', name: 'Read MRR & Financial Ingress' }
  ];

  const handleRoleToggle = (roleName: string, capKey: string) => {
    setRoles(roles.map(r => {
      if (r.role === roleName) {
        const hasCap = r.caps.includes(capKey);
        return {
          ...r,
          caps: hasCap ? r.caps.filter(c => c !== capKey) : [...r.caps, capKey]
        };
      }
      return r;
    }));
  };

  /* ==================== 1. LIVE ANALYTICS VIEW ==================== */
  if (activeTab === 'analytics') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Activity className="w-5 h-5 text-neon-cyan" />
            <span>Telemetry Pipeline Analytics</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Real-time throughput metrics, IOPS distribution and CDN loads</p>
        </div>

        {/* Real-Time SVG Performance Chart */}
        <div className="glass-panel rounded-2xl p-6 h-[280px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-white">Cluster Egress Latency (MS)</span>
              <p className="text-[10px] text-zinc-500 font-mono">Aggregated hourly spikes - 5 Server zones</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded">US-East Gateway Active</span>
              <span className="text-xs font-mono font-bold text-electric-purple bg-electric-purple/10 border border-electric-purple/20 px-2 py-0.5 rounded">EU-West Node: Healthy</span>
            </div>
          </div>
          
          <div className="flex-1 relative flex items-end">
            <div className="relative w-full h-full">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="analytics-area" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#00F5D4" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Background grid lines */}
                <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#0f0b13" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="#0f0b13" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2={chartWidth} y2="150" stroke="#0f0b13" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />

                {/* Area + lines */}
                <path d={areaPath} fill="url(#analytics-area)" />
                <path d={linePath} fill="none" stroke="#00F5D4" strokeWidth="3" strokeLinecap="round" />
                <path d={chartPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')} fill="none" stroke="#9D4EDD" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

                {/* Interactive hit areas / data points */}
                {chartPoints.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={4} fill={i === chartHoverIdx ? '#00F5D4' : '#00F5D4'} />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={12}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setChartHoverIdx(i)}
                      onMouseLeave={() => setChartHoverIdx(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Tooltip (positioned with percentage within the container) */}
              {chartHoverIdx !== null && chartPoints[chartHoverIdx] && (
                <div
                  className="absolute z-[100] bg-zinc-900/95 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
                  style={{
                    left: `${(chartPoints[chartHoverIdx].x / chartWidth) * 100}%`,
                    top: `${(chartPoints[chartHoverIdx].y / chartHeight) * 100}%`,
                    transform: 'translate(-50%, -120%)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div className="font-semibold">{`${chartPoints[chartHoverIdx].value} ms`}</div>
                  <div className="text-[11px] text-zinc-400">Cluster Egress</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Microservice Clusters List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Gateway Auth Broker', load: '14.2%', temp: '42°C', status: 'Optimal', icon: ShieldCheck, color: 'text-neon-cyan' },
            { name: 'Database Spanner Cluster', load: '68.5%', temp: '54°C', status: 'Optimal', icon: Database, color: 'text-electric-purple' },
            { name: 'Edge CDN Ingress POPS', load: '32.1%', temp: '38°C', status: 'Optimal', icon: Layers, color: 'text-warm-orange' }
          ].map((node) => {
            const Icon = node.icon;
            return (
              <div key={node.name} className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${node.color}`} />
                    <span className="text-xs font-bold text-white">{node.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded-full">
                    {node.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono font-bold">Node Load</span>
                    <span className="text-sm font-bold text-white font-mono">{node.load}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono font-bold">Thermals</span>
                    <span className="text-sm font-bold text-white font-mono">{node.temp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ==================== 2. USER MANAGEMENT VIEW ==================== */
  if (activeTab === 'users') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Users className="w-5 h-5 text-electric-purple" />
            <span>User Management CRM Workspace</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Verify tenant parameters, upgrade service tiers, or revoke system access</p>
        </div>

        {/* Detailed accounts logs */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Active Tenant Nodes Directory</span>
            <span className="text-xs font-semibold text-zinc-500">{accounts.length} Total Registered Accounts</span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <th className="pb-3">User Node</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Access Tier</th>
                <th className="pb-3 text-right">Inbound API Ingress</th>
                <th className="pb-3 text-center">Security Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {accounts.map((user) => (
                <tr key={user.id} className={`text-xs hover:bg-white/[0.01] transition-all ${user.status === 'Suspended' ? 'opacity-40' : ''}`}>
                  <td className="py-3.5 flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-white leading-tight">{user.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 text-zinc-300 font-medium">{user.company}</td>
                  <td className="py-3.5">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      user.tier === 'Enterprise' 
                        ? 'bg-electric-purple/10 text-electric-purple border border-electric-purple/20' 
                        : user.tier === 'Pro' 
                        ? 'bg-warm-orange/10 text-warm-orange border border-warm-orange/20' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-white">{user.requestCount.toLocaleString()}</td>
                  <td className="py-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                      user.status === 'Active' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-magenta/10 text-neon-magenta'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${user.status === 'Active' ? 'bg-neon-cyan' : 'bg-neon-magenta'}`} />
                      <span>{user.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.tier !== 'Enterprise' && (
                        <button 
                          onClick={() => onUpgradeAccount(user.id)}
                          className="bg-electric-purple/10 hover:bg-electric-purple text-electric-purple hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold border border-electric-purple/20 transition-all cursor-pointer"
                        >
                          Upgrade
                        </button>
                      )}
                      <button 
                        onClick={() => onSuspendAccount(user.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          user.status === 'Suspended' 
                            ? 'bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-black border-neon-cyan/20' 
                            : 'bg-neon-magenta/10 hover:bg-neon-magenta text-neon-magenta hover:text-white border-neon-magenta/20'
                        }`}
                      >
                        {user.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ==================== 3. API KEYS VIEW ==================== */
  if (activeTab === 'keys') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Key className="w-5 h-5 text-neon-cyan" />
            <span>Developer API Key Credentials</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Generate high-security tokens to authentic external cluster ingress webhooks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Generator Form */}
          <div className="glass-panel rounded-2xl p-6 h-fit space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Create New Auth Token</h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Token Description Name</label>
              <input 
                type="text" 
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                placeholder="e.g. Production Stripe Analytics"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Cryptographic Permission Scope</label>
              <div className="flex flex-col gap-1.5">
                {(['Read-Only', 'Admin', 'Full-Access'] as const).map(scp => (
                  <button
                    key={scp}
                    type="button"
                    onClick={() => setNewKeyScope(scp)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      newKeyScope === scp 
                        ? 'bg-neon-cyan/5 border-neon-cyan text-neon-cyan' 
                        : 'bg-obsidian border-white/5 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <span>{scp}</span>
                    {newKeyScope === scp && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (!newKeyName.trim()) return;
                onCreateAPIKey(newKeyName, newKeyScope);
                setNewKeyName('');
              }}
              className="w-full bg-neon-cyan text-black py-2.5 rounded-xl text-xs font-bold hover:opacity-90 shadow-[0_0_15px_rgba(0,245,212,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Token</span>
            </button>
          </div>

          {/* Active Keys Table */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Workspace API Keys</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Key Label</th>
                    <th className="pb-3">Secret Token Prefix</th>
                    <th className="pb-3">Scope</th>
                    <th className="pb-3 text-right">Inbound Logs</th>
                    <th className="pb-3 text-center">Revoke</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-xs">
                  {apiKeys.map((k) => (
                    <tr key={k.id} className={k.status === 'Revoked' ? 'opacity-40' : ''}>
                      <td className="py-3.5 font-bold text-white">{k.name}</td>
                      <td className="py-3.5 font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span>{k.keyPrefix}</span>
                          {k.status !== 'Revoked' && (
                            <button 
                              onClick={() => handleCopy(k.id, `${k.keyPrefix}....SECRET`)}
                              className="text-zinc-500 hover:text-white cursor-pointer"
                            >
                              {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-neon-cyan" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-semibold bg-zinc-900 border border-white/5 px-2 py-0.5 rounded text-zinc-300">
                          {k.scope}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-zinc-300">{k.usageCount.toLocaleString()}</td>
                      <td className="py-3.5 text-center">
                        {k.status !== 'Revoked' && (
                          <button 
                            onClick={() => onRevokeAPIKey(k.id)}
                            className="p-1 rounded hover:bg-zinc-800 text-neon-magenta hover:opacity-90 transition-all cursor-pointer"
                            title="Revoke Token"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 4. WEBHOOKS VIEW ==================== */
  if (activeTab === 'webhooks') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <WebhookIcon className="w-5 h-5 text-neon-magenta" />
            <span>Telemetry Inbound Webhooks</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Configure external system events to pipe into our analytical engine</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Webhook Creator Form */}
          <div className="glass-panel rounded-2xl p-6 h-fit space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Configure Webhook Endpoint</h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Endpoint Identifier Label</label>
              <input 
                type="text" 
                value={webhookName}
                onChange={e => setWebhookName(e.target.value)}
                placeholder="e.g. Stripe Account Ingress"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Secure Webhook Destination URL</label>
              <input 
                type="text" 
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://api.mybrand.co/v1/webhook"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>
            
            {/* Pick Events */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Listen For Events</label>
              <div className="space-y-2 max-h-32 overflow-y-auto bg-obsidian/40 border border-white/5 rounded-lg p-2.5">
                {['user.created', 'mrr.ingress.spike', 'cluster.degraded', 'security.auth.audit'].map(ev => {
                  const isChecked = webhookEvents.includes(ev);
                  return (
                    <button
                      key={ev}
                      type="button"
                      onClick={() => toggleWebhookEvent(ev)}
                      className="w-full flex items-center justify-between text-left text-xs font-semibold text-zinc-400 hover:text-zinc-300 py-1.5 cursor-pointer"
                    >
                      <span className="font-mono">{ev}</span>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-neon-magenta border-neon-magenta text-white' : 'border-zinc-700'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                if (!webhookName.trim() || !webhookUrl.trim()) return;
                onAddWebhook(webhookName, webhookUrl, webhookEvents);
                setWebhookName('');
                setWebhookUrl('');
              }}
              className="w-full bg-neon-magenta text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-90 shadow-[0_0_15px_rgba(255,0,127,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Webhook</span>
            </button>
          </div>

          {/* Active Webhooks List */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Pipeline Destinations</h3>
            <div className="space-y-4 max-h-[380px] overflow-y-auto">
              {webhooks.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">No webhooks registered. Configure one to listen for ingress telemetry.</div>
              ) : (
                webhooks.map(wh => (
                  <div key={wh.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{wh.name}</span>
                        <span className="text-[9px] font-bold text-neon-cyan bg-neon-cyan/15 px-1.5 py-0.2 rounded font-mono uppercase">Connected</span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-400 mt-1 truncate">{wh.url}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {wh.events.map(ev => (
                          <span key={ev} className="text-[9px] font-mono font-bold bg-zinc-900 border border-white/5 text-zinc-500 px-1.5 py-0.2 rounded">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-semibold text-zinc-500 shrink-0">Delivery: {wh.lastDelivery}</span>
                      <button
                        onClick={() => onDeleteWebhook(wh.id)}
                        className="p-1 rounded hover:bg-zinc-800 text-neon-magenta hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 5. ROLES & PERMISSIONS VIEW ==================== */
  if (activeTab === 'permissions') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-electric-purple" />
            <span>Administrative Roles & Compliance</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Design permission access control layers across team operator keys</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Access Capability Checklist Matrix</span>
            <span className="text-[10px] text-zinc-500 font-mono">RBAC Security Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="pb-4 w-1/4">Operator Persona</th>
                  {allCapabilities.map(cap => (
                    <th key={cap.key} className="pb-4 text-center font-sans max-w-[120px]">{cap.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs">
                {roles.map(r => (
                  <tr key={r.role}>
                    <td className="py-4 pr-4">
                      <p className="font-bold text-white">{r.role}</p>
                      <p className="text-[10px] text-zinc-500 mt-1 font-medium">{r.desc}</p>
                    </td>
                    {allCapabilities.map(cap => {
                      const hasCap = r.caps.includes(cap.key);
                      return (
                        <td key={cap.key} className="py-4 text-center">
                          <button
                            onClick={() => handleRoleToggle(r.role, cap.key)}
                            className={`w-6 h-6 rounded-lg border inline-flex items-center justify-center transition-all cursor-pointer ${
                              hasCap 
                                ? 'bg-electric-purple/10 border-electric-purple text-electric-purple' 
                                : 'bg-zinc-950/40 border-white/5 text-transparent hover:border-zinc-600'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 6. SETTINGS VIEW ==================== */
  if (activeTab === 'settings') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Sliders className="w-5 h-5 text-zinc-300" />
            <span>Dashboard Workspace Configuration</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Calibrate live telemetry ingestion rates and mock financial ledgers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Telemetry settings config */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
              <span>Simulate Cluster Adjustments</span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-zinc-400">Simulated MRR Ledger</label>
                  <span className="text-xs font-mono font-bold text-neon-cyan">${metrics.mrr.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="50000" 
                  max="200000" 
                  step="1000"
                  value={metrics.mrr}
                  onChange={e => setMetrics({ ...metrics, mrr: parseInt(e.target.value) })}
                  className="w-full accent-neon-cyan cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-zinc-400">Simulated Median Latency</label>
                  <span className="text-xs font-mono font-bold text-neon-magenta">{metrics.apiLatency}ms</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  step="1"
                  value={metrics.apiLatency}
                  onChange={e => setMetrics({ ...metrics, apiLatency: parseInt(e.target.value) })}
                  className="w-full accent-neon-magenta cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-zinc-400">Core Active SLA Health</label>
                  <span className="text-xs font-mono font-bold text-electric-purple">{metrics.systemHealth}%</span>
                </div>
                <input 
                  type="range" 
                  min="90" 
                  max="100" 
                  step="0.1"
                  value={metrics.systemHealth}
                  onChange={e => setMetrics({ ...metrics, systemHealth: parseFloat(e.target.value) })}
                  className="w-full accent-electric-purple cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Secure Environment Settings block */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warm-orange" />
              <span>Workspace Environment Secrets</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              API keys and cloud databases connection credentials must remain safe. Aetheris binds all active credentials strictly to server-side memory pools to prevent browser network leakage.
            </p>
            <div className="space-y-2 border-t border-white/5 pt-3 mt-auto">
              <div className="p-3 bg-zinc-950/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-400">GEMINI_API_KEY</span>
                <span className="font-mono text-zinc-500 font-bold">Injected via User Secrets Panel</span>
              </div>
              <div className="p-3 bg-zinc-950/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-400">APP_URL_ORCHESTRATOR</span>
                <span className="font-mono text-neon-cyan font-bold">Deploy-Resolved Node Callback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 7. PRODUCTS VIEW ==================== */
  if (activeTab === 'products') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neon-magenta" />
            <span>Storefront Products Inventory</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Manage catalog pricing, update real-time stock levels, and track product sales performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Add Product Form Panel */}
          <div className="glass-panel rounded-2xl p-6 h-fit space-y-4 lg:col-span-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-neon-magenta" />
              <span>Catalog Ingestion</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Product Name</label>
              <input 
                type="text" 
                value={prodName}
                onChange={e => setProdName(e.target.value)}
                placeholder="e.g. Minimalist Wooden Chair"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Price (USD)</label>
              <input 
                type="number" 
                value={prodPrice}
                onChange={e => setProdPrice(e.target.value)}
                placeholder="149"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Stock Available</label>
              <input 
                type="number" 
                value={prodStock}
                onChange={e => setProdStock(e.target.value)}
                placeholder="25"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Category</label>
              <select 
                value={prodCategory}
                onChange={e => setProdCategory(e.target.value)}
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              >
                <option value="Decor">Decor</option>
                <option value="Lighting">Lighting</option>
                <option value="Furniture">Furniture</option>
                <option value="Textiles">Textiles</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (!prodName.trim() || !prodPrice || !prodStock) return;
                const newProd = {
                  id: `prod-${Date.now()}`,
                  name: prodName,
                  price: parseFloat(prodPrice),
                  stock: parseInt(prodStock),
                  category: prodCategory,
                  sold: 0,
                  growth: 0,
                  image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80'
                };
                setProducts([...products, newProd]);
                setProdName('');
                setProdPrice('');
                setProdStock('');
              }}
              className="w-full bg-gradient-to-r from-electric-purple to-neon-magenta text-white py-2 rounded-xl text-xs font-bold hover:opacity-90 shadow-[0_0_15px_rgba(255,0,127,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Catalog Listing Table */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-3 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Product Inventory Directory</h3>
              <span className="text-[11px] text-zinc-500">{products.length} Products listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-center">Stock</th>
                    <th className="pb-3 text-right">Units Sold</th>
                    <th className="pb-3 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-xs">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="py-3 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-zinc-900 border border-white/5" />
                        <span className="font-bold text-white">{p.name}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] font-semibold bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-white">${p.price}</td>
                      <td className="py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                          p.stock === 0 
                            ? 'bg-neon-magenta/10 text-neon-magenta' 
                            : p.stock < 15 
                            ? 'bg-warm-orange/10 text-warm-orange' 
                            : 'bg-neon-cyan/10 text-neon-cyan'
                        }`}>
                          <span>{p.stock} units</span>
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-zinc-300">
                        {p.sold} {p.growth > 0 && <span className="text-neon-cyan text-[10px] ml-1">+{p.growth}%</span>}
                      </td>
                      <td className="py-3 text-center">
                        <button 
                          onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                          className="p-1 rounded hover:bg-zinc-800 text-neon-magenta cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 8. ORDERS VIEW ==================== */
  if (activeTab === 'orders') {
    // Filter logic
    const filteredOrders = orders.filter(o => {
      if (ordersFilter === 'All') return true;
      return o.status.toLowerCase() === ordersFilter.toLowerCase();
    });

    return (
      <div className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-neon-magenta" />
              <span>Customer Orders Ledger</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Review active transaction queues, dispatch shipments, and track operational fulfillment states</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-white/5 rounded-xl p-1 w-fit">
            {['All', 'Processing', 'Shipped', 'Delivered'].map(status => (
              <button
                key={status}
                onClick={() => setOrdersFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  ordersFilter === status 
                    ? 'bg-gradient-to-r from-electric-purple to-neon-magenta text-white font-bold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Store Orders', val: orders.length, color: 'text-white' },
            { label: 'Processing Queue', val: orders.filter(o => o.status === 'Processing').length, color: 'text-electric-purple' },
            { label: 'In-Transit Shipments', val: orders.filter(o => o.status === 'Shipped').length, color: 'text-warm-orange' },
            { label: 'Completed Deliveries', val: orders.filter(o => o.status === 'Delivered').length, color: 'text-neon-cyan' }
          ].map((m, i) => (
            <div key={i} className="glass-panel rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">{m.label}</span>
              <span className={`text-xl font-bold font-mono ${m.color}`}>{m.val}</span>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Placement Date</th>
                  <th className="pb-3">Items Purchased</th>
                  <th className="pb-3 text-right">Price Value</th>
                  <th className="pb-3 text-center">Fulfillment Status</th>
                  <th className="pb-3 text-right">Progress Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="py-4 font-mono font-extrabold text-neon-magenta">{o.id}</td>
                    <td className="py-4 flex items-center gap-2.5">
                      <img src={o.avatar} alt={o.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-white">{o.name}</span>
                    </td>
                    <td className="py-4 text-zinc-400 font-medium">{o.date}</td>
                    <td className="py-4 font-medium text-zinc-300">{o.items}</td>
                    <td className="py-4 text-right font-mono font-bold text-white">${o.price.toFixed(2)}</td>
                    <td className="py-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                        o.status === 'Delivered' 
                          ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20' 
                          : o.status === 'Shipped' 
                          ? 'bg-warm-orange/15 text-warm-orange border border-warm-orange/20' 
                          : 'bg-electric-purple/15 text-electric-purple border border-electric-purple/20'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          o.status === 'Delivered' ? 'bg-neon-cyan' : o.status === 'Shipped' ? 'bg-warm-orange' : 'bg-electric-purple'
                        }`} />
                        <span>{o.status}</span>
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {o.status !== 'Delivered' ? (
                        <button
                          onClick={() => {
                            setOrders(orders.map(item => {
                              if (item.id === o.id) {
                                const nextStatus = item.status === 'Processing' ? 'Shipped' : 'Delivered';
                                return { ...item, status: nextStatus };
                              }
                              return item;
                            }));
                          }}
                          className="bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-extrabold text-white px-3 py-1 rounded-lg cursor-pointer"
                        >
                          {o.status === 'Processing' ? 'Ship Order' : 'Mark Delivered'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-semibold italic">Fulfilled ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 9. MARKETING VIEW ==================== */
  if (activeTab === 'marketing') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-neon-magenta" />
            <span>Storefront Marketing Campaigns</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Design ad campaigns, manage budget distributions, and analyze financial returns and conversion rates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Campaign Panel */}
          <div className="glass-panel rounded-2xl p-6 h-fit space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-neon-magenta animate-pulse" />
              <span>Launch Campaign</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Campaign Name</label>
              <input 
                type="text" 
                value={campName}
                onChange={e => setCampName(e.target.value)}
                placeholder="e.g. Winter Warmth Promo"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Campaign Type</label>
              <select 
                value={campType}
                onChange={e => setCampType(e.target.value)}
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Email Campaign">Email Campaign</option>
                <option value="Instagram Ads">Instagram Ads</option>
                <option value="Google Search Ads">Google Search Ads</option>
                <option value="Influencer Collab">Influencer Collab</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Allocated Budget (USD)</label>
              <input 
                type="number" 
                value={campBudget}
                onChange={e => setCampBudget(e.target.value)}
                placeholder="1000"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>

            <button
              onClick={() => {
                if (!campName.trim() || !campBudget) return;
                const newCamp = {
                  id: `camp-${Date.now()}`,
                  name: campName,
                  type: campType,
                  budget: parseFloat(campBudget),
                  revenue: 0,
                  ctr: '0.0%',
                  status: 'Scheduled',
                  date: 'Starts soon'
                };
                setCampaigns([...campaigns, newCamp]);
                setCampName('');
                setCampBudget('');
              }}
              className="w-full bg-gradient-to-r from-electric-purple to-neon-magenta text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-95 shadow-[0_0_15px_rgba(255,0,127,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Campaign</span>
            </button>
          </div>

          {/* Campaigns Directory */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active & Scheduled Ad Campaigns</h3>

            <div className="space-y-4 max-h-[420px] overflow-y-auto">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-all">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{camp.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase ${
                        camp.status === 'Active' ? 'bg-neon-cyan/15 text-neon-cyan' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">{camp.type} • {camp.date}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">Budget</span>
                        <span className="text-xs font-bold text-white font-mono">${camp.budget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">Revenue</span>
                        <span className={`text-xs font-bold font-mono ${camp.revenue > 0 ? 'text-neon-cyan' : 'text-zinc-500'}`}>
                          {camp.revenue > 0 ? `$${camp.revenue.toLocaleString()}` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">CTR</span>
                        <span className="text-xs font-bold text-white font-mono">{camp.ctr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {camp.status !== 'Active' && (
                      <button
                        onClick={() => {
                          setCampaigns(campaigns.map(c => c.id === camp.id ? { ...c, status: 'Active', date: 'Ongoing' } : c));
                        }}
                        className="bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-black border border-neon-cyan/20 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Start
                      </button>
                    )}
                    <button
                      onClick={() => setCampaigns(campaigns.filter(c => c.id !== camp.id))}
                      className="p-1 rounded hover:bg-zinc-800 text-neon-magenta cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 10. DISCOUNTS VIEW ==================== */
  if (activeTab === 'discounts') {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Tag className="w-5 h-5 text-neon-magenta" />
            <span>Discount Coupon Codes</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Configure active checkout coupon codes, promotional parameters, and monitor consumer usage counts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Code */}
          <div className="glass-panel rounded-2xl p-6 h-fit space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Percent className="w-4 h-4 text-neon-magenta" />
              <span>Generate Coupon</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Coupon Promo Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={discCode}
                  onChange={e => setDiscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH30"
                  className="flex-1 bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    const rnd = 'LUMA' + Math.floor(10 + Math.random() * 90) + 'PRO';
                    setDiscCode(rnd);
                  }}
                  className="bg-white/5 hover:bg-white/10 px-2.5 rounded-lg text-[10px] font-bold text-zinc-300 border border-white/5 cursor-pointer"
                >
                  Rnd
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Discount Value</label>
              <input 
                type="text" 
                value={discVal}
                onChange={e => setDiscVal(e.target.value)}
                placeholder="30% OFF or Free Shipping"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Discount Type</label>
              <select 
                value={discType}
                onChange={e => setDiscType(e.target.value)}
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Percentage">Percentage (e.g. % OFF)</option>
                <option value="Fixed Amount">Fixed Amount (e.g. $ OFF)</option>
                <option value="Free Shipping">Free Shipping</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (!discCode.trim() || !discVal.trim()) return;
                const newDisc = {
                  code: discCode,
                  discount: discVal,
                  type: discType,
                  usage: 0,
                  status: 'Active'
                };
                setDiscounts([...discounts, newDisc]);
                setDiscCode('');
                setDiscVal('');
              }}
              className="w-full bg-gradient-to-r from-electric-purple to-neon-magenta text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-95 shadow-[0_0_15px_rgba(255,0,127,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          {/* List Coupons */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Promotional Discounts</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Promo Code</th>
                    <th className="pb-3">Benefit</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3 text-center">Checkout Uses</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-xs">
                  {discounts.map((d) => (
                    <tr key={d.code} className="hover:bg-white/[0.01] transition-all">
                      <td className="py-3.5 font-mono font-extrabold text-neon-magenta">{d.code}</td>
                      <td className="py-3.5 text-white font-bold">{d.discount}</td>
                      <td className="py-3.5 text-zinc-400 font-medium">{d.type}</td>
                      <td className="py-3.5 text-center font-mono font-bold text-white">{d.usage} times</td>
                      <td className="py-3.5 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                          d.status === 'Active' ? 'bg-neon-cyan/15 text-neon-cyan' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${d.status === 'Active' ? 'bg-neon-cyan' : 'bg-zinc-500'}`} />
                          <span>{d.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setDiscounts(discounts.filter(item => item.code !== d.code))}
                          className="p-1 rounded hover:bg-zinc-800 text-neon-magenta cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== 11. INBOX VIEW ==================== */
  if (activeTab === 'inbox') {
    const selectedMsg = messages.find(m => m.id === selectedMsgId) || messages[0];

    return (
      <div className="p-8 h-[calc(100vh-80px)] flex flex-col gap-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Mail className="w-5 h-5 text-neon-magenta" />
            <span>Customer Assistance Inbox</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Review inbound client inquires, dispatch responses, and resolve support requests</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
          {/* Messages list */}
          <div className="glass-panel rounded-2xl flex flex-col min-h-0 lg:col-span-2 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Conversations</span>
              <span className="text-[10px] bg-neon-magenta text-white px-2 py-0.5 rounded-full font-bold">
                {messages.filter(m => m.unread).length} Unread
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
              {messages.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMsgId(m.id);
                    // Mark as read
                    setMessages(messages.map(item => item.id === m.id ? { ...item, unread: false } : item));
                  }}
                  className={`w-full text-left p-4 hover:bg-white/[0.02] transition-all flex flex-col gap-1.5 relative cursor-pointer ${
                    selectedMsgId === m.id ? 'bg-white/[0.03] border-l-2 border-neon-magenta' : ''
                  }`}
                >
                  {m.unread && (
                    <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-neon-magenta shadow-[0_0_8px_#FF007F]" />
                  )}
                  <div className="flex items-center justify-between pr-4">
                    <span className="text-xs font-bold text-white">{m.sender}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{m.date}</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 truncate pr-4">{m.subject}</span>
                  <span className="text-[11px] text-zinc-500 truncate pr-4">{m.preview}</span>
                  <span className="text-[9px] font-bold text-electric-purple mt-1 uppercase font-mono">{m.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Message View + Response Box */}
          <div className="glass-panel rounded-2xl lg:col-span-3 flex flex-col min-h-0 overflow-hidden">
            {selectedMsg ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Header info */}
                <div className="p-6 border-b border-white/5 shrink-0 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedMsg.subject}</h4>
                    <p className="text-xs text-zinc-400 mt-1">From: <span className="font-semibold text-zinc-200">{selectedMsg.sender}</span> • {selectedMsg.date}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-electric-purple/20 text-electric-purple border border-electric-purple/30 px-2 py-0.5 rounded font-mono uppercase">
                    {selectedMsg.category}
                  </span>
                </div>

                {/* Body content */}
                <div className="flex-1 p-6 overflow-y-auto text-xs text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line">
                  {selectedMsg.body}
                </div>

                {/* Reply composer */}
                <div className="p-4 border-t border-white/5 bg-[#07040D] shrink-0 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Replying to {selectedMsg.sender} as <span className="text-neon-magenta font-semibold">Lumaora Agent</span></span>
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your official response..."
                      rows={2}
                      className="flex-1 bg-obsidian border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-magenta resize-none"
                    />
                    <button
                      onClick={() => {
                        if (!replyText.trim()) return;
                        // Mock sending: append the text to message body
                        setMessages(messages.map(item => {
                          if (item.id === selectedMsg.id) {
                            return {
                              ...item,
                              body: item.body + `\n\n-------------------------------\nSent response by Lumaora Agent:\n"${replyText}"`
                            };
                          }
                          return item;
                        }));
                        setReplyText('');
                        alert(`Reply sent officially to ${selectedMsg.sender}!`);
                      }}
                      className="bg-neon-magenta hover:opacity-95 text-white px-4 rounded-xl flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(255,0,127,0.2)]"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
                Select a message to display contents
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
