import React from 'react';
import {
  Users,
  ShieldAlert,
  Activity,
  Code,
  ArrowRight,
  UserPlus,
  Terminal,
  FileText,
  Sliders,
  Eye,
  CheckCircle,
  Sparkles,
  Download,
  Calendar,
  Flame,
  AlertTriangle,
  X,
} from 'lucide-react';
import { EmailAccount, TrafficPacket, TrafficSpikeAnomaly } from '../types';
import { TrafficVolumeTrends } from './TrafficVolumeTrends';

interface DashboardOverviewProps {
  accounts: EmailAccount[];
  packets: TrafficPacket[];
  anomalies?: TrafficSpikeAnomaly[];
  onOpenProvision: () => void;
  onShowInfo: (account: EmailAccount) => void;
  onOpenSetters: (account: EmailAccount) => void;
  onOpenGetters: (account: EmailAccount) => void;
  onSwitchTab: (tab: 'dashboard' | 'accounts' | 'brand' | 'enterprise' | 'terminal' | 'spam' | 'code') => void;
  onExportAuditLog?: () => void;
  onOpenDailySummary?: () => void;
  onInspectAnomaly?: (anomaly: TrafficSpikeAnomaly) => void;
  onDismissAnomaly?: (anomalyId: string) => void;
  onSimulateSpike?: (targetEmail: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  accounts,
  packets,
  anomalies = [],
  onOpenProvision,
  onShowInfo,
  onOpenSetters,
  onOpenGetters,
  onSwitchTab,
  onExportAuditLog,
  onOpenDailySummary,
  onInspectAnomaly,
  onDismissAnomaly,
  onSimulateSpike,
}) => {
  const spamCount = packets.filter((p) => p.isSpam).length;
  const spamRate = packets.length > 0 ? Math.round((spamCount / packets.length) * 100) : 0;
  const recentAccounts = accounts.slice(0, 4);
  const recentPackets = packets.slice(0, 5);

  const activeAnomaly = anomalies[0]; // primary top alert if any exists

  return (
    <div className="space-y-6">
      {/* Visual Notification System for Traffic Spikes */}
      {activeAnomaly && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-xl p-4 shadow-lg shadow-amber-950/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                    Statistically Significant Traffic Spike
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    +{Math.round((activeAnomaly.surgeMultiplier - 1) * 100)}% Surge · Z: +{activeAnomaly.zScore}&sigma;
                  </span>
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Account Alert: <span className="text-amber-200">{activeAnomaly.accountName}</span> (<code className="text-indigo-300 font-mono text-xs">{activeAnomaly.accountEmail}</code>)
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Sudden packet influx detected (observed: <span className="font-mono text-white font-bold">{activeAnomaly.samplePacketsCount}</span> messages, {activeAnomaly.spamRatio}% spam density). 
                  Indicates possible <span className="text-amber-300 font-medium">{activeAnomaly.threatType.replace('_', ' ')}</span> attack or compromised account.
                </p>
              </div>
            </div>

            {/* Notification Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {onInspectAnomaly && (
                <button
                  onClick={() => onInspectAnomaly(activeAnomaly)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Inspect Telemetry
                </button>
              )}
              {onDismissAnomaly && (
                <button
                  onClick={() => onDismissAnomaly(activeAnomaly.id)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Dismiss Anomaly Alert"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* IT Support Administrator Scenario Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            YMM Enterprise Systems · IT Support Administration
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            YMM Mail Administration & Traffic Monitor
          </h1>
          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed max-w-2xl">
            Enterprise account lifecycle, Java OOP credential provisioning, and real-time spam filtration for Young Millionaire Mindset (<span className="font-mono text-indigo-300">@ymm.com</span>).
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenProvision}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Provision New Hire Account</span>
            </button>
            <button
              onClick={() => onSwitchTab('terminal')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Run Java Terminal</span>
            </button>
            <button
              onClick={() => onSwitchTab('code')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Code className="w-4 h-4" />
              <span>View Email.java Source</span>
            </button>
            <button
              onClick={() => onSwitchTab('brand')}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-colors cursor-pointer"
              title="Open YMM Brand Defense & Executive Impersonation Center"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Brand Defense Radar</span>
            </button>
            {onOpenDailySummary && (
              <button
                onClick={onOpenDailySummary}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors cursor-pointer"
                title="Calculate and display 24h daily email activity summary"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>24h Activity Summary</span>
              </button>
            )}
            {onExportAuditLog && (
              <button
                onClick={onExportAuditLog}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Export system console logs to text file for IT auditing"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Audit Log (.txt)</span>
              </button>
            )}
            {onSimulateSpike && accounts.length > 0 && (
              <button
                onClick={() => onSimulateSpike(accounts[0].email)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-colors cursor-pointer"
                title="Simulate sudden incoming spam bomb spike against an account"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Spike Attack</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Provisioned Inboxes</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {accounts.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Sales, Dev, Acct & Corporate
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inbox Traffic Packets</span>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {packets.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Traversed messages analyzed
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Spam Intercept Rate</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {spamRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {spamCount} malicious or junk filtered
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Java OOP Architecture</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            Verified
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Constructor, Getters, Setters
          </div>
        </div>

        <div
          onClick={() => onSwitchTab('brand')}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-amber-500/50 transition-colors cursor-pointer group"
          title="Open YMM Brand & Executive Protection Center"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Brand Defense Radar</span>
            <ShieldAlert className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300 tabular-nums">
            Active
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>5 Lookalikes Watched</span>
            <span className="text-amber-400 group-hover:text-amber-300 font-mono text-[11px]">&rarr;</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Traffic Trends Component with Recharts */}
      <TrafficVolumeTrends livePackets={packets} />

      {/* Main 2-column split: Accounts Overview & Live Traffic Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Accounts Directory Snapshot (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Active Provisioned Accounts
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute Java methods (<code className="text-indigo-400">showInfo()</code>, Setters, Getters)
              </p>
            </div>
            <button
              onClick={() => onSwitchTab('accounts')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>View All ({accounts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {recentAccounts.map((acc) => {
              const accAnomaly = anomalies.find(
                (a) =>
                  a.accountId === acc.id ||
                  a.accountEmail.toLowerCase() === acc.email.toLowerCase()
              );

              return (
                <div
                  key={acc.id}
                  className={`p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    accAnomaly ? 'bg-amber-950/10 border-l-2 border-amber-500' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-white">
                        {acc.firstName} {acc.lastName}
                      </div>
                      {accAnomaly && onInspectAnomaly && (
                        <button
                          onClick={() => onInspectAnomaly(accAnomaly)}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 cursor-pointer hover:bg-amber-500/30"
                          title="Click to inspect traffic spike telemetry"
                        >
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>SPIKE DETECTED (+{Math.round((accAnomaly.surgeMultiplier - 1) * 100)}%)</span>
                        </button>
                      )}
                    </div>
                    <div className="font-mono text-indigo-300 text-xs mt-0.5 select-all">
                      {acc.email}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>
                        Dept:{' '}
                        {acc.department ? acc.department.toUpperCase() : 'None (blank)'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Capacity: {acc.mailboxCapacity}mb
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono truncate max-w-[140px]">
                        Alt: {acc.alternateEmail}
                      </span>
                    </div>
                  </div>

                {/* Java Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onShowInfo(acc)}
                    className="px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    title="Execute showInfo()"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>showInfo()</span>
                  </button>

                  <button
                    onClick={() => onOpenGetters(acc)}
                    className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
                    title="Inspect Get Methods"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Getters</span>
                  </button>

                  <button
                    onClick={() => onOpenSetters(acc)}
                    className="px-2 py-1 text-xs text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-md transition-colors cursor-pointer"
                    title="Execute Set Methods"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Setters</span>
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Right: Live Traffic & Spam Snapshot (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Recent Inbox Traffic
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Heuristic spam scores & routing status
              </p>
            </div>
            <button
              onClick={() => onSwitchTab('spam')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Spam Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[380px] overflow-y-auto">
            {recentPackets.map((pkt) => (
              <div key={pkt.id} className="p-3 hover:bg-slate-800/40 transition-colors text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-slate-400 truncate max-w-[180px]">
                    {pkt.sender}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${
                      pkt.action === 'BLOCKED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : pkt.action === 'QUARANTINED'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {pkt.action} · {pkt.spamScore}
                  </span>
                </div>
                <div className="mt-1 font-medium text-white truncate">
                  {pkt.subject}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>To: {pkt.recipient}</span>
                  <span className="font-mono">{pkt.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Heuristic Filter Status:</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
