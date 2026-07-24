import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Zap, HeartPulse } from 'lucide-react';
import { SystemMetrics } from '../types';

interface KPICardsProps {
  metrics: SystemMetrics;
  onCardClick?: (metricKey: string) => void;
  activeFocusedCard?: string;
}

export default function KPICards({ metrics, onCardClick, activeFocusedCard }: KPICardsProps) {
  // Sparkline SVG data points for premium vector lines
  const sparklineData = {
    mrr: [25, 45, 30, 65, 55, 85, 75, 110, 95, 128],
    users: [30, 20, 45, 60, 50, 75, 70, 90, 85, 95],
    latency: [90, 85, 70, 75, 60, 55, 48, 52, 45, 42],
    health: [99.5, 99.8, 99.4, 99.9, 99.7, 99.9, 99.8, 99.9, 99.9, 99.9],
  };

  const getCoordinates = (points: number[], width: number, height: number, minVal: number, maxVal: number) => {
    const xStep = width / (points.length - 1);
    const range = maxVal - minVal;
    return points.map((p, index) => {
      const x = index * xStep;
      // Invert Y because SVG 0,0 is top-left
      const y = height - ((p - minVal) / (range || 1)) * (height - 8) - 4;
      return { x, y };
    });
  };

  const buildPath = (coords: { x: number, y: number }[]) => {
    return coords.reduce((acc, c, i) => {
      if (i === 0) return `M ${c.x} ${c.y}`;
      // Smooth cubic bezier calculation
      const prev = coords[i - 1];
      const cpX1 = prev.x + (c.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (c.x - prev.x) / 2;
      const cpY2 = c.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${c.x} ${c.y}`;
    }, '');
  };

  const cards = [
    {
      id: 'mrr',
      label: 'Monthly Recurring Revenue',
      value: `$${metrics.mrr.toLocaleString()}`,
      change: `+${metrics.mrrGrowth}%`,
      changeType: 'up',
      period: 'vs last week',
      icon: DollarSign,
      glowClass: 'glow-purple',
      accentColor: '#9D4EDD',
      gradientId: 'spark-mrr',
      points: sparklineData.mrr,
      min: 20,
      max: 130,
    },
    {
      id: 'users',
      label: 'Active System Users',
      value: metrics.activeUsers.toLocaleString(),
      change: `+${metrics.activeUsersGrowth}%`,
      changeType: 'up',
      period: 'vs last week',
      icon: Users,
      glowClass: 'glow-orange',
      accentColor: '#FF9E00',
      gradientId: 'spark-users',
      points: sparklineData.users,
      min: 15,
      max: 100,
    },
    {
      id: 'latency',
      label: 'Median API Latency',
      value: `${metrics.apiLatency}ms`,
      change: `${metrics.apiLatencyGrowth}%`,
      changeType: 'down',
      period: 'vs last hour',
      icon: Zap,
      glowClass: 'glow-cyan',
      accentColor: '#00F5D4',
      gradientId: 'spark-latency',
      points: sparklineData.latency,
      min: 30,
      max: 95,
    },
    {
      id: 'health',
      label: 'System Health & SLA',
      value: `${metrics.systemHealth}%`,
      change: metrics.systemHealthStatus,
      changeType: 'steady',
      period: '100% uptime',
      icon: HeartPulse,
      glowClass: 'glow-magenta',
      accentColor: '#FF007F',
      gradientId: 'spark-health',
      points: sparklineData.health,
      min: 99.0,
      max: 100.0,
    },
  ];

  return (
    <section id="kpi-cards-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const coords = getCoordinates(card.points, 120, 42, card.min, card.max);
        const pathString = buildPath(coords);
        
        // Build closed path for gradient fill
        const fillPathString = `${pathString} L 120 42 L 0 42 Z`;
        const isFocused = activeFocusedCard === card.id;

        return (
          <div
            key={card.id}
            id={`kpi-card-${card.id}`}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`glass-panel-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col cursor-pointer transition-all duration-300 ${
              isFocused 
                ? `${card.glowClass} border-${card.id === 'mrr' ? 'electric-purple' : card.id === 'users' ? 'warm-orange' : card.id === 'latency' ? 'neon-cyan' : 'neon-magenta'}/40 bg-white/[0.04]` 
                : 'border-white/5'
            }`}
          >
            {/* Top Indicator Accent Line */}
            {isFocused && (
              <div 
                className="absolute top-0 left-0 right-0 h-[2px]" 
                style={{ backgroundColor: card.accentColor }}
              />
            )}

            {/* Header info */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-zinc-400 font-sans tracking-wide">
                {card.label}
              </span>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center border"
                style={{ 
                  backgroundColor: `${card.accentColor}10`, 
                  borderColor: `${card.accentColor}25` 
                }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color: card.accentColor }} />
              </div>
            </div>

            {/* Metric Value */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                {card.value}
              </span>
              <span className={`text-[11px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                card.changeType === 'up' 
                  ? 'bg-neon-cyan/10 text-neon-cyan' 
                  : card.changeType === 'down' 
                  ? 'bg-neon-magenta/10 text-neon-magenta' 
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                {card.changeType === 'up' && <TrendingUp className="w-3 h-3" />}
                {card.changeType === 'down' && <TrendingDown className="w-3 h-3" />}
                <span>{card.change}</span>
              </span>
            </div>

            {/* Sparkline & Subtitle */}
            <div className="flex items-end justify-between gap-4 mt-auto pt-2">
              <span className="text-[11px] text-zinc-500 font-medium">
                {card.period}
              </span>
              
              {/* Animated Glowing Sparkline SVG */}
              <div className="w-[120px] h-[42px] shrink-0 relative overflow-visible">
                <svg width="100%" height="100%" viewBox="0 0 120 42" className="overflow-visible">
                  <defs>
                    <linearGradient id={`${card.gradientId}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={`${card.accentColor}50`} />
                      <stop offset="50%" stopColor={`${card.accentColor}`} />
                      <stop offset="100%" stopColor={`${card.accentColor}`} />
                    </linearGradient>
                    <linearGradient id={`${card.gradientId}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={card.accentColor} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={card.accentColor} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Area */}
                  <path d={fillPathString} fill={`url(#${card.gradientId}-fill)`} />
                  
                  {/* Line Stroke */}
                  <path 
                    d={pathString} 
                    fill="none" 
                    stroke={`url(#${card.gradientId}-line)`} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="transition-all duration-500"
                  />
                  
                  {/* Glowing end node */}
                  {coords.length > 0 && (
                    <circle 
                      cx={coords[coords.length - 1].x} 
                      cy={coords[coords.length - 1].y} 
                      r="3.5" 
                      fill={card.accentColor} 
                      className="animate-pulse"
                      style={{ filter: `drop-shadow(0 0 6px ${card.accentColor})` }}
                    />
                  )}
                </svg>
              </div>
            </div>

          </div>
        );
      })}
    </section>
  );
}
