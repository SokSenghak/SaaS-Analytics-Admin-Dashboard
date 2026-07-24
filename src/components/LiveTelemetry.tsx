import React, { useState } from 'react';
import { Globe, Server, Activity, Users, Radio } from 'lucide-react';
import { TelemetryRegion } from '../types';

interface LiveTelemetryProps {
  regions: TelemetryRegion[];
  onRegionSelect?: (region: TelemetryRegion) => void;
}

export default function LiveTelemetry({ regions, onRegionSelect }: LiveTelemetryProps) {
  const [hoveredRegion, setHoveredRegion] = useState<TelemetryRegion | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('us-east');

  const activeRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  const distribution = [
    { country: 'United States', percentage: 56, load: 'Optimal', color: '#9D4EDD' },
    { country: 'United Kingdom', percentage: 24, load: 'Optimal', color: '#00F5D4' },
    { country: 'Japan', percentage: 12, load: 'Optimal', color: '#FF9E00' },
    { country: 'Germany', percentage: 8, load: 'Degraded', color: '#FF007F' },
  ];

  return (
    <div id="live-telemetry-card" className="glass-panel rounded-2xl p-6 flex flex-col h-[520px] select-none">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <Radio className="w-4.5 h-4.5 text-neon-cyan animate-pulse" />
            <span>Global Live Telemetry</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">Live edge latency nodes & user connections distribution</p>
        </div>
        <span className="text-[10px] font-mono font-bold text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded-full animate-pulse">
          5 CDN POPs Active
        </span>
      </div>

      {/* World Map Container */}
      <div id="world-map-wrapper" className="relative flex-1 bg-zinc-950/45 rounded-xl border border-white/5 overflow-hidden p-2 flex items-center justify-center">
        {/* Fine background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:14px_14px]" />

        {/* High-End Stylized SVG World Map (Continents Outline & Nodes) */}
        <svg 
          viewBox="0 0 800 400" 
          width="100%" 
          height="100%" 
          className="relative z-10 opacity-75 max-h-[220px]"
        >
          <g fill="#1B1530" opacity="0.35" stroke="rgba(255,255,255,0.02)" strokeWidth="1">
            {/* North America */}
            <path d="M 120 80 Q 150 70 190 90 T 260 110 Q 250 140 230 160 T 150 170 Q 120 120 120 80 Z" />
            {/* South America */}
            <path d="M 230 200 Q 260 210 250 240 T 210 330 T 190 350 Q 170 300 200 240 Z" />
            {/* Africa */}
            <path d="M 400 180 Q 450 160 480 190 T 490 260 Q 450 300 420 270 T 380 210 Z" />
            {/* Eurasia / Europe */}
            <path d="M 370 70 Q 420 50 490 60 T 600 80 T 680 120 Q 640 180 580 160 T 450 140 Q 380 110 370 70 Z" />
            {/* Asia / India / China */}
            <path d="M 580 110 Q 640 100 700 120 T 730 180 Q 710 220 630 200 T 540 170 Z" />
            {/* Australia */}
            <path d="M 680 260 Q 720 250 740 280 T 710 330 Q 660 310 680 260 Z" />
            {/* Greenland */}
            <path d="M 280 40 Q 320 30 310 60 Q 270 70 280 40 Z" />
          </g>

          {/* Connect node link lines */}
          {regions.map((reg) => (
            <line 
              key={`line-${reg.id}`}
              x1="220" y1="130" // Centered from US node
              x2={reg.coordinates.x * 8}
              y2={reg.coordinates.y * 4}
              stroke="rgba(157, 78, 221, 0.12)"
              strokeWidth="1.5"
              strokeDasharray={reg.id === selectedRegionId ? "none" : "3 3"}
            />
          ))}
        </svg>

        {/* Pulsing Region Markers (using CSS percentages to position overlays perfectly) */}
        {regions.map((reg) => {
          const isSelected = reg.id === selectedRegionId;
          const isHovered = hoveredRegion?.id === reg.id;
          
          return (
            <button
              key={reg.id}
              onClick={() => {
                setSelectedRegionId(reg.id);
                if (onRegionSelect) onRegionSelect(reg);
              }}
              onMouseEnter={() => setHoveredRegion(reg)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="absolute group/marker cursor-pointer z-20"
              style={{ 
                left: `${reg.coordinates.x}%`, 
                top: `${reg.coordinates.y}%` 
              }}
            >
              {/* Ping Glow Ring */}
              <span className={`absolute top-0 left-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all ${
                isSelected ? 'bg-neon-cyan/20 scale-125 pulse-marker' : 'bg-electric-purple/10 scale-75 group-hover/marker:scale-100'
              }`} />

              {/* Central Solid core */}
              <span className={`absolute top-0 left-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all ${
                isSelected 
                  ? 'bg-neon-cyan border-white shadow-[0_0_12px_#00F5D4]' 
                  : 'bg-electric-purple border-white/50 group-hover/marker:bg-neon-magenta shadow-[0_0_8px_#9D4EDD]'
              }`} />

              {/* Floating Inline Name Tag */}
              <span className="absolute left-3 top-0 -translate-y-1/2 whitespace-nowrap bg-zinc-950/80 border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-zinc-300 pointer-events-none opacity-0 group-hover/marker:opacity-100 transition-opacity">
                {reg.name} ({reg.latency}ms)
              </span>
            </button>
          );
        })}

        {/* Floating Tooltip displaying current region health details */}
        <div id="telemetry-tooltip" className="absolute bottom-3 left-3 right-3 bg-obsidian-light/90 border border-white/10 rounded-xl p-3 flex items-center justify-between z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
              <Server className="w-4 h-4 text-electric-purple" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{activeRegion.name} Node</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  activeRegion.status === 'Healthy' ? 'bg-neon-cyan' : 'bg-warm-orange'
                }`} />
              </p>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase font-mono">POP Cluster Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono font-bold">Latency</span>
              <span className="text-xs font-mono font-bold text-neon-cyan">{activeRegion.latency}ms</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono font-bold">Connections</span>
              <span className="text-xs font-mono font-bold text-white">{(activeRegion.connections / 1000).toFixed(1)}k</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono font-bold">Load</span>
              <span className="text-xs font-mono font-bold text-warm-orange">{activeRegion.load}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bars geographic distribution below */}
      <div id="telemetry-distributions" className="mt-5 space-y-3">
        <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Inbound Traffic Concentration</span>
          <span>By Region Cluster</span>
        </h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {distribution.map((dist) => (
            <div key={dist.country} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-zinc-300">{dist.country}</span>
                <span className="font-mono text-zinc-400 font-bold">{dist.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/[0.02]">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${dist.percentage}%`,
                    backgroundColor: dist.color,
                    boxShadow: `0 0 8px ${dist.color}90`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
