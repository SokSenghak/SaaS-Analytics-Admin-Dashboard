import React from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, Key, History } from 'lucide-react';
import { ActivityLog as ActivityLogType } from '../types';

interface ActivityLogProps {
  activities: ActivityLogType[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div id="activity-log-widget" className="glass-panel rounded-2xl p-5 select-none flex flex-col h-[380px]">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Security Audit Log</h3>
        </div>
        <span className="text-[10px] text-zinc-500 font-bold font-mono">Real-Time Ingress</span>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-0">
        {activities.map((act) => {
          return (
            <div 
              key={act.id} 
              id={`activity-item-${act.id}`}
              className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.01] transition-all group"
            >
              {/* Avatar of triggering user */}
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/5 relative">
                <img 
                  src={act.avatarUrl} 
                  alt={act.userName} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Activity details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-bold text-white truncate leading-tight">
                    {act.userName}
                  </span>
                  <span className="text-[9px] text-zinc-500 shrink-0 font-mono font-medium">
                    {act.timestamp}
                  </span>
                </div>
                
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed truncate">
                  {act.action}
                </p>
                <p className="text-[10px] text-zinc-500 truncate font-mono mt-0.5 font-medium">
                  {act.details}
                </p>
              </div>

              {/* Status Tag Badge */}
              <div className="shrink-0 mt-0.5">
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                  act.status === 'Upgraded' 
                    ? 'bg-electric-purple/10 text-electric-purple border border-electric-purple/10' 
                    : act.status === 'API Reset' 
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/10' 
                    : act.status === 'Suspended' 
                    ? 'bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/10' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {act.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
