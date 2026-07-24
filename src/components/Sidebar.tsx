import React from 'react';
import { 
  Home,
  ShoppingBag,
  ClipboardList,
  Users,
  Activity,
  Megaphone,
  Tag,
  Mail,
  Key,
  Webhook as WebhookIcon,
  ShieldCheck,
  Settings as SettingsIcon,
  Crown,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userCount: number;
  apiKeysCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, userCount, apiKeysCount }: SidebarProps) {
  const storeMenuItems = [
    { id: 'dashboard', name: 'Home', icon: Home, badge: null },
    { id: 'products', name: 'Products', icon: ShoppingBag, badge: null },
    { id: 'orders', name: 'Orders', icon: ClipboardList, badge: null },
    { id: 'users', name: 'Customers', icon: Users, badge: userCount.toString() },
    { id: 'analytics', name: 'Analytics', icon: Activity, badge: 'Live' },
    { id: 'marketing', name: 'Marketing', icon: Megaphone, badge: null },
    { id: 'discounts', name: 'Discounts', icon: Tag, badge: null },
    { id: 'inbox', name: 'Inbox', icon: Mail, badge: '5' },
  ];

  const systemMenuItems = [
    { id: 'keys', name: 'API Keys', icon: Key, badge: apiKeysCount.toString() },
    { id: 'webhooks', name: 'Webhooks', icon: WebhookIcon, badge: null },
    { id: 'permissions', name: 'Permissions', icon: ShieldCheck, badge: null },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, badge: null },
  ];

  return (
    <aside id="sidebar-container" className="w-64 bg-[#0A0713] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 select-none overflow-y-auto">
      {/* Brand Logo matching the Lumaora design */}
      <div id="brand-logo-container" className="p-6 flex items-center gap-3 border-b border-white/5">
        <div id="brand-logo-icon-wrapper" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-purple via-neon-magenta to-warm-orange flex items-center justify-center p-[1px] shadow-[0_0_20px_rgba(157,78,221,0.4)]">
          <div className="w-full h-full bg-[#0D0B14] rounded-[11px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-neon-magenta animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-white font-sans text-lg">Lumaora</span>
            <span className="text-[9px] font-extrabold bg-neon-magenta/20 text-neon-magenta px-1.5 py-0.5 rounded border border-neon-magenta/30 font-mono">Beta</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Live Beautifully</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-4 space-y-6">
        {/* Store Management Section */}
        <div className="space-y-1">
          <span className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Management</span>
          {storeMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 relative group cursor-pointer ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-electric-purple/30 to-neon-magenta/10 border border-white/10 shadow-[0_4px_20px_rgba(157,78,221,0.15)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${
                    isActive ? 'text-neon-magenta' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`} />
                  <span>{item.name}</span>
                </div>
                
                {/* Badge */}
                {item.badge && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    item.badge === 'Live'
                      ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20 animate-pulse'
                      : item.id === 'inbox'
                      ? 'bg-neon-magenta text-white font-sans text-[10px] w-5 h-5 flex items-center justify-center rounded-full'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Glowing active bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-electric-purple to-neon-magenta rounded-full shadow-[0_0_10px_#FF007F]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Developer / Platform Section */}
        <div className="space-y-1">
          <span className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Platform Console</span>
          {systemMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 relative group cursor-pointer ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-electric-purple/30 to-neon-magenta/10 border border-white/10 shadow-[0_4px_20px_rgba(157,78,221,0.15)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${
                    isActive ? 'text-neon-magenta' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`} />
                  <span>{item.name}</span>
                </div>
                
                {/* Badge */}
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                    {item.badge}
                  </span>
                )}

                {/* Glowing active bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-electric-purple to-neon-magenta rounded-full shadow-[0_0_10px_#FF007F]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upgrade Promo Card - styled exactly like "Upgrade to Lumaora Pro" */}
      <div id="promo-card-container" className="p-4 border-t border-white/5">
        <div id="promo-card" className="bg-gradient-to-b from-[#1c122c] to-[#0D0B14] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
          {/* Decorative background glow */}
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-electric-purple/20 rounded-full blur-2xl group-hover:bg-neon-magenta/30 transition-all duration-500" />
          
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-neon-magenta" />
            <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">Lumaora Pro</span>
          </div>

          <h4 className="text-xs font-bold text-white mb-1">Upgrade to Lumaora Pro</h4>
          <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
            Unlock advanced insights, automation and more.
          </p>

          <button 
            id="upgrade-promo-btn"
            onClick={() => setActiveTab('settings')}
            className="w-full bg-gradient-to-r from-electric-purple to-neon-magenta text-white py-2 px-4 rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-[0_4px_15px_rgba(157,78,221,0.2)] hover:shadow-[0_4px_25px_rgba(255,0,127,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Pro</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

