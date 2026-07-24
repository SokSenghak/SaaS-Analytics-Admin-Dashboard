import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  ShieldAlert, 
  Check, 
  ChevronUp, 
  UserMinus,
  ArrowUpRight
} from 'lucide-react';
import { UserAccount } from '../types';

interface ActiveAccountsProps {
  accounts: UserAccount[];
  onUpgradeAccount: (id: string) => void;
  onSuspendAccount: (id: string) => void;
  onAddAccount: (account: Partial<UserAccount>) => void;
}

export default function ActiveAccounts({ 
  accounts, 
  onUpgradeAccount, 
  onSuspendAccount,
  onAddAccount
}: ActiveAccountsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // New account form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTier, setNewTier] = useState<'Enterprise' | 'Pro' | 'Free'>('Pro');

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          acc.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          acc.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'All' || acc.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompany || !newEmail) return;

    onAddAccount({
      name: newName,
      company: newCompany,
      email: newEmail,
      tier: newTier,
    });

    // Reset Form
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewTier('Pro');
    setShowAddForm(false);
  };

  return (
    <div id="active-accounts-card" className="glass-panel rounded-2xl p-6 flex flex-col h-[520px] select-none">
      {/* Header with quick search */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-white font-sans">Top Active Accounts</h3>
          <p className="text-xs text-zinc-400 mt-1">High-throughput SaaS consumers by API ingestion</p>
        </div>
        
        <button 
          id="add-account-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-electric-purple/10 border border-electric-purple/30 text-electric-purple px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-electric-purple hover:text-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register User</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizations or contact..."
            className="w-full bg-obsidian-light/60 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-electric-purple/40 placeholder-zinc-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-obsidian-light/60 border border-white/5 rounded-xl p-1">
          {['All', 'Enterprise', 'Pro'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedTier === t 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        {/* Register Account Form Overlay */}
        {showAddForm ? (
          <form onSubmit={handleCreateAccount} className="absolute inset-0 bg-obsidian-card backdrop-blur-md z-10 p-5 rounded-xl border border-white/10 flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Register New Account Node</h4>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">Account Owner Name</label>
              <input 
                type="text" 
                required 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-electric-purple"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-zinc-400">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="sarah@cyberdyne.co"
                  className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-electric-purple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-zinc-400">Company Name</label>
                <input 
                  type="text" 
                  required 
                  value={newCompany} 
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="Cyberdyne Systems"
                  className="w-full bg-obsidian border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-electric-purple"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400">SaaS Access Level</label>
              <div className="flex gap-2">
                {(['Enterprise', 'Pro', 'Free'] as const).map(tierOpt => (
                  <button
                    key={tierOpt}
                    type="button"
                    onClick={() => setNewTier(tierOpt)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      newTier === tierOpt 
                        ? 'bg-electric-purple/10 border-electric-purple text-white' 
                        : 'bg-obsidian border-white/5 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tierOpt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-zinc-800 text-zinc-300 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-electric-purple to-neon-magenta text-white py-2 rounded-xl text-xs font-semibold hover:opacity-95 cursor-pointer"
              >
                Deploy Account
              </button>
            </div>
          </form>
        ) : null}

        {/* Real Table Elements */}
        {filteredAccounts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10">
            <ShieldAlert className="w-8 h-8 text-zinc-600 mb-2" />
            <span className="text-xs">No active account nodes found matching filters.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pt-1">User Entity</th>
                <th className="pb-3 pt-1">Company</th>
                <th className="pb-3 pt-1 text-right">API Ingress</th>
                <th className="pb-3 pt-1 text-right">Trend</th>
                <th className="pb-3 pt-1 text-center w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredAccounts.map((acc) => (
                <tr 
                  key={acc.id}
                  id={`account-row-${acc.id}`}
                  className={`text-xs hover:bg-white/[0.01] transition-all group ${
                    acc.status === 'Suspended' ? 'opacity-40' : ''
                  }`}
                >
                  {/* User Profile column */}
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/5 relative">
                        <img 
                          src={acc.avatarUrl} 
                          alt={acc.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        {/* Status light */}
                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-obsidian ${
                          acc.status === 'Active' ? 'bg-neon-cyan' : acc.status === 'Suspended' ? 'bg-neon-magenta' : 'bg-warm-orange'
                        }`} />
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight flex items-center gap-1.5">
                          <span>{acc.name}</span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                            acc.tier === 'Enterprise' 
                              ? 'bg-electric-purple/10 text-electric-purple border border-electric-purple/20' 
                              : acc.tier === 'Pro' 
                              ? 'bg-warm-orange/10 text-warm-orange border border-warm-orange/20' 
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {acc.tier}
                          </span>
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">{acc.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Company Name column */}
                  <td className="py-3 text-zinc-300 font-medium">
                    {acc.company}
                  </td>

                  {/* API Ingress volume column */}
                  <td className="py-3 text-right font-mono font-bold text-white">
                    {acc.requestCount.toLocaleString()}
                  </td>

                  {/* Growth Indicators */}
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-neon-cyan">
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>+{acc.growth}%</span>
                    </span>
                  </td>

                  {/* Quick Action drop triggers */}
                  <td className="py-3 text-center relative">
                    <div className="inline-block text-left">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === acc.id ? null : acc.id)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === acc.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-20" 
                            onClick={() => setActiveMenuId(null)} 
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-obsidian-light border border-white/10 rounded-xl shadow-2xl py-1 z-30 font-semibold text-[11px]">
                            {acc.tier !== 'Enterprise' && (
                              <button 
                                onClick={() => { onUpgradeAccount(acc.id); setActiveMenuId(null); }}
                                className="w-full text-left px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5 text-electric-purple" />
                                <span>Upgrade to Enterprise</span>
                              </button>
                            )}
                            
                            <button 
                              onClick={() => { onSuspendAccount(acc.id); setActiveMenuId(null); }}
                              className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                                acc.status === 'Suspended'
                                  ? 'text-neon-cyan hover:bg-white/5'
                                  : 'text-neon-magenta hover:bg-white/5'
                              }`}
                            >
                              {acc.status === 'Suspended' ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Activate Node</span>
                                </>
                              ) : (
                                <>
                                  <UserMinus className="w-3.5 h-3.5" />
                                  <span>Suspend Node</span>
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
