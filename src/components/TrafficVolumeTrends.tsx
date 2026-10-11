import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShieldAlert,
  Inbox,
  HardDrive,
  BarChart3,
  Layers,
  Percent,
} from 'lucide-react';
import { HourlyTrafficData, generate24HourTrafficData } from '../services/trafficTrendsData';
import { TrafficPacket } from '../types';

interface TrafficVolumeTrendsProps {
  livePackets?: TrafficPacket[];
}

export const TrafficVolumeTrends: React.FC<TrafficVolumeTrendsProps> = ({ livePackets = [] }) => {
  const [viewMode, setViewMode] = useState<'volume' | 'departments' | 'spamRatio'>('volume');
  const [data, setData] = useState<HourlyTrafficData[]>(() => generate24HourTrafficData());

  // Aggregate metrics over the 24 hour dataset
  const metrics = useMemo(() => {
    let totalInbound = 0;
    let totalDelivered = 0;
    let totalSpam = 0;
    let totalBandwidthKb = 0;
    let peakHour = '';
    let peakVolume = 0;

    data.forEach((item) => {
      totalInbound += item.totalPackets;
      totalDelivered += item.delivered;
      totalSpam += item.spamBlocked;
      totalBandwidthKb += item.bandwidthKb;
      if (item.totalPackets > peakVolume) {
        peakVolume = item.totalPackets;
        peakHour = item.timestamp;
      }
    });

    const spamPercent = totalInbound > 0 ? ((totalSpam / totalInbound) * 100).toFixed(1) : '0';
    const bandwidthMb = (totalBandwidthKb / 1024).toFixed(1);

    return {
      totalInbound,
      totalDelivered,
      totalSpam,
      spamPercent,
      bandwidthMb,
      peakHour,
      peakVolume,
    };
  }, [data]);

  // Custom Recharts Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-sm text-xs font-mono">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-2">
            Time: {label} (Last 24h Window)
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-sans text-[11px] text-slate-300">{entry.name}:</span>
                </span>
                <span className="font-bold tabular-nums text-white">
                  {entry.value.toLocaleString()} {viewMode === 'spamRatio' ? '%' : 'pkts'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Prepare data for the Spam Ratio view
  const spamRatioData = useMemo(() => {
    return data.map((d) => ({
      hour: d.hour,
      timestamp: d.timestamp,
      spamPercent: d.totalPackets > 0 ? Math.round((d.spamBlocked / d.totalPackets) * 100) : 0,
      delivered: d.delivered,
      spamBlocked: d.spamBlocked,
    }));
  }, [data]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              24-Hour Traffic Volume & Threat Trends
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly inbound packet frequency, department routing, and spam interception rates
          </p>
        </div>

        {/* Segmented View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('volume')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'volume'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Volume Overview</span>
          </button>
          <button
            onClick={() => setViewMode('departments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'departments'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>By Department</span>
          </button>
          <button
            onClick={() => setViewMode('spamRatio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'spamRatio'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Spam Threat Rate</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-[11px] text-slate-400 block">24h Inbound Packets</span>
          <span className="text-lg font-bold font-mono text-white tabular-nums">
            {metrics.totalInbound.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {metrics.totalDelivered.toLocaleString()} delivered
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">24h Filtered Threats</span>
          <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
            {metrics.totalSpam.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-500/80 block">
            {metrics.spamPercent}% threat ratio
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">Peak Inbound Window</span>
          <span className="text-lg font-bold font-mono text-indigo-300 tabular-nums">
            {metrics.peakVolume} <span className="text-xs font-normal text-slate-400">pkts/hr</span>
          </span>
          <span className="text-[10px] text-slate-500 block">
            Recorded at {metrics.peakHour}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">Payload Bandwidth</span>
          <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
            {metrics.bandwidthMb} <span className="text-xs font-normal text-slate-400">MB</span>
          </span>
          <span className="text-[10px] text-slate-500 block">
            Transferred payload size
          </span>
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="h-[280px] w-full pt-2">
        {viewMode === 'volume' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSpam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="timestamp"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />
              <Area
                type="monotone"
                dataKey="totalPackets"
                name="Total Inbound"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="delivered"
                name="Legitimate Delivered"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDelivered)"
              />
              <Area
                type="monotone"
                dataKey="spamBlocked"
                name="Filtered Spam/Threats"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpam)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {viewMode === 'departments' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="timestamp"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />
              <Bar dataKey="sales" name="Sales Department" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="dev" name="Development" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="acct" name="Accounting" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="general" name="General Corporate" stackId="a" fill="#64748b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {viewMode === 'spamRatio' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spamRatioData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpamRatio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="timestamp"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 50]}
                unit="%"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />
              <Area
                type="monotone"
                dataKey="spamPercent"
                name="Spam Interception Rate (%)"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpamRatio)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Legend Context */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span>Continuous sampling: 1-hour sliding window</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive Heuristic Sensitivity: Level 5</span>
        </div>
        <span className="font-mono text-[11px] text-indigo-400">
          Java Traffic Monitor v2.4 (Recharts Engine)
        </span>
      </div>
    </div>
  );
};
