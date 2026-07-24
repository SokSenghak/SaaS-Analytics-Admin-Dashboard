import React, { useState } from 'react';
import { Calendar, Play, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { ScheduledJob } from '../types';

interface ScheduledJobsProps {
  jobs: ScheduledJob[];
  onTriggerJob: (id: string) => void;
}

export default function ScheduledJobs({ jobs, onTriggerJob }: ScheduledJobsProps) {
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const handleRunJob = (id: string) => {
    setRunningJobId(id);
    onTriggerJob(id);
    
    // Simulate job completing and returning to standard state
    setTimeout(() => {
      setRunningJobId(null);
    }, 1800);
  };

  return (
    <div id="scheduled-jobs-widget" className="glass-panel rounded-2xl p-5 select-none flex flex-col h-[320px]">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Scheduled Workloads</h3>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono font-bold">4 Active Cron Jobs</span>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
        {jobs.map((job) => {
          const isRunning = runningJobId === job.id || job.status === 'Running';
          return (
            <div 
              key={job.id} 
              id={`job-item-${job.id}`}
              className="p-3 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Visual Date Badge Accent */}
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-white/5 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase leading-none font-sans">CRON</span>
                  <span className="text-xs font-bold text-electric-purple font-mono mt-0.5">{job.schedule.split(' ')[0]}</span>
                </div>
                
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate leading-snug">{job.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">{job.schedule}</span>
                    <span className="text-[9px] text-zinc-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{job.duration}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Status Indicator */}
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isRunning
                    ? 'bg-warm-orange/15 text-warm-orange border border-warm-orange/20 animate-pulse'
                    : job.status === 'Success'
                    ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20'
                    : job.status === 'Failed'
                    ? 'bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/20'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${
                    isRunning ? 'bg-warm-orange animate-ping' : job.status === 'Success' ? 'bg-neon-cyan' : 'bg-neon-magenta'
                  }`} />
                  <span>{isRunning ? 'Running' : job.status}</span>
                </span>

                {/* Manual Trigger Trigger */}
                <button
                  disabled={isRunning}
                  onClick={() => handleRunJob(job.id)}
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                  title="Force Trigger Job"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-electric-purple' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
