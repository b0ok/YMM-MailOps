import React, { useState } from 'react';
import {
  Activity,
  Play,
  Pause,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Inbox,
  Brain,
  Sliders,
} from 'lucide-react';
import { TrafficPacket, EmailAccount, AiSpamAnalysis } from '../types';
import { analyzeSpamWithAI, inspectEmailWithRules } from '../services/spamFilter';
import { TrafficVolumeTrends } from './TrafficVolumeTrends';

interface TrafficMonitorProps {
  packets: TrafficPacket[];
  accounts: EmailAccount[];
  onAddPacket: (pkt: TrafficPacket) => void;
  onUpdatePacket: (pkt: TrafficPacket) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export const TrafficMonitor: React.FC<TrafficMonitorProps> = ({
  packets,
  accounts,
  onAddPacket,
  onUpdatePacket,
  isPaused,
  setIsPaused,
}) => {
  const [selectedPacket, setSelectedPacket] = useState<TrafficPacket | null>(packets[0] || null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DELIVERED' | 'QUARANTINED' | 'BLOCKED'>('ALL');
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filtered packets
  const filteredPackets = packets.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.action === statusFilter;
  });

  // Calculate high level metrics
  const totalTraversed = packets.length;
  const blockedCount = packets.filter((p) => p.action === 'BLOCKED').length;
  const quarantinedCount = packets.filter((p) => p.action === 'QUARANTINED').length;
  const deliveredCount = packets.filter((p) => p.action === 'DELIVERED').length;
  const blockRate = totalTraversed > 0 ? Math.round(((blockedCount + quarantinedCount) / totalTraversed) * 100) : 0;

  // Run AI deep inspection on the selected packet
  const handleDeepAiInspect = async (pkt: TrafficPacket) => {
    setAnalyzingAi(true);
    setAiError(null);
    try {
      const analysis = await analyzeSpamWithAI(pkt);
      const updated = { ...pkt, aiAnalysis: analysis };
      onUpdatePacket(updated);
      setSelectedPacket(updated);
    } catch (err: any) {
      setAiError(err.message || 'AI Inspection encountered an error.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  // Inject a synthetic test threat
  const handleInjectTestPayload = (type: 'ceo' | 'creds' | 'safe') => {
    const timestamp = new Date().toLocaleTimeString();
    if (type === 'ceo') {
      const subject = 'URGENT: IMMEDIATE WIRE TRANSFER REQUIRED FOR Q3 MERGER';
      const body = 'Please wire $48,500 to account 9821-4401 before end of bank business today. Strictly confidential.';
      const sender = 'ceo.executive@urgent-wire-routing.xyz';
      const recipient = accounts[0]?.email || 'finance@acct.aeycompany.com';
      const inspection = inspectEmailWithRules(sender, subject, body);

      const pkt: TrafficPacket = {
        id: `pkt-${Date.now()}`,
        timestamp,
        sender,
        recipient,
        department: 'acct',
        subject,
        body,
        spamScore: inspection.score,
        isSpam: inspection.isSpam,
        action: inspection.action,
        triggeredRules: inspection.triggeredRules,
        sizeKb: 36,
      };
      onAddPacket(pkt);
      setSelectedPacket(pkt);
    } else if (type === 'creds') {
      const subject = 'Action Required: Active Directory Password Expires in 24 Hours';
      const body = 'Your employee single-sign-on credentials are scheduled for revocation. Re-authenticate now at auth-portal-sso.top';
      const sender = 'it-service-desk@portal-sso.top';
      const recipient = accounts[1]?.email || 'dev.lead@dev.aeycompany.com';
      const inspection = inspectEmailWithRules(sender, subject, body);

      const pkt: TrafficPacket = {
        id: `pkt-${Date.now()}`,
        timestamp,
        sender,
        recipient,
        department: 'dev',
        subject,
        body,
        spamScore: inspection.score,
        isSpam: inspection.isSpam,
        action: inspection.action,
        triggeredRules: inspection.triggeredRules,
        sizeKb: 28,
      };
      onAddPacket(pkt);
      setSelectedPacket(pkt);
    } else {
      const subject = 'Sprint Planning Agenda & Architecture RFC review';
      const body = 'Attached are the Jira user stories for next sprint. Let us meet tomorrow at 10 AM PST.';
      const sender = 'product.owner@partner-corp.com';
      const recipient = accounts[0]?.email || 'worker@dev.aeycompany.com';
      const inspection = inspectEmailWithRules(sender, subject, body);

      const pkt: TrafficPacket = {
        id: `pkt-${Date.now()}`,
        timestamp,
        sender,
        recipient,
        department: 'dev',
        subject,
        body,
        spamScore: inspection.score,
        isSpam: inspection.isSpam,
        action: inspection.action,
        triggeredRules: inspection.triggeredRules,
        sizeKb: 94,
      };
      onAddPacket(pkt);
      setSelectedPacket(pkt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Traversed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Traversed Messages</span>
            <Inbox className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {totalTraversed}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Monitored across {accounts.length} provisioned inboxes
          </div>
        </div>

        {/* Spam Block Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Spam Defense Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {blockRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {blockedCount} hard blocked · {quarantinedCount} quarantined
          </div>
        </div>

        {/* Quarantined Threats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quarantined Items</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {quarantinedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Held in quarantine for administrative signoff
          </div>
        </div>

        {/* Legitimate Delivered */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Legitimate Delivered</span>
            <CheckCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {deliveredCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Safe inbox deliveries routed without issue
          </div>
        </div>
      </div>

      {/* 24-Hour Traffic Trends Recharts Component */}
      <TrafficVolumeTrends livePackets={packets} />

      {/* Main Split: Stream on left, Packet Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Traffic Stream (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {/* Header & Controls */}
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Live Inbox Traffic Stream
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time inspection of inbound corporate communication
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                  isPaused
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 px-1 font-semibold">Inject:</span>
                <button
                  onClick={() => handleInjectTestPayload('ceo')}
                  className="px-2 py-0.5 text-[11px] text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded cursor-pointer"
                  title="Inject CEO Wire Fraud Attack"
                >
                  BEC Fraud
                </button>
                <button
                  onClick={() => handleInjectTestPayload('creds')}
                  className="px-2 py-0.5 text-[11px] text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded cursor-pointer"
                  title="Inject Credential Harvesting Phish"
                >
                  Phish
                </button>
                <button
                  onClick={() => handleInjectTestPayload('safe')}
                  className="px-2 py-0.5 text-[11px] text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded cursor-pointer"
                  title="Inject Safe Corporate Memo"
                >
                  Safe Memo
                </button>
              </div>
            </div>
          </div>

          {/* Filter segment tabs */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 text-xs">
            {(['ALL', 'DELIVERED', 'QUARANTINED', 'BLOCKED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setStatusFilter(mode)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === mode
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'ALL'
                  ? `All (${packets.length})`
                  : mode === 'DELIVERED'
                  ? `Delivered (${deliveredCount})`
                  : mode === 'QUARANTINED'
                  ? `Quarantined (${quarantinedCount})`
                  : `Blocked (${blockedCount})`}
              </button>
            ))}
          </div>

          {/* Stream Item List */}
          <div className="divide-y divide-slate-800/60 max-h-[520px] overflow-y-auto">
            {filteredPackets.map((pkt) => {
              const isSelected = selectedPacket?.id === pkt.id;
              return (
                <div
                  key={pkt.id}
                  onClick={() => setSelectedPacket(pkt)}
                  className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-800/70 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-slate-400 truncate max-w-[200px]">
                      {pkt.sender}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {pkt.timestamp}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                          pkt.action === 'BLOCKED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : pkt.action === 'QUARANTINED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {pkt.action} · Score {pkt.spamScore}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 text-xs font-medium text-white truncate">
                    {pkt.subject}
                  </div>

                  <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[280px]">To: {pkt.recipient}</span>
                    <span className="text-slate-500 font-mono">{pkt.sizeKb} KB</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Packet Inspector & AI Security Analyzer (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm sticky top-20">
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              Packet Inspector & Spam Engine
            </h3>
            {selectedPacket && (
              <span className="text-xs font-mono text-slate-400">
                Score: {selectedPacket.spamScore}/10
              </span>
            )}
          </div>

          {selectedPacket ? (
            <div className="p-5 space-y-4 text-xs">
              {/* Sender & Recipient Metadata */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-slate-500">From:</span>
                  <span className="font-mono text-white select-all">{selectedPacket.sender}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-slate-500">To:</span>
                  <span className="font-mono text-indigo-300 select-all">{selectedPacket.recipient}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-medium text-white text-right">{selectedPacket.subject}</span>
                </div>
              </div>

              {/* Email Body preview */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Message Body
                </label>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-300 whitespace-pre-wrap font-sans text-xs max-h-36 overflow-y-auto leading-relaxed">
                  {selectedPacket.body}
                </div>
              </div>

              {/* Heuristic Trigger Breakdown */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Java Heuristic Rule Triggers
                </label>
                {selectedPacket.triggeredRules.length === 0 ? (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Clean. No suspicious triggers found.</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {selectedPacket.triggeredRules.map((r, i) => (
                      <div
                        key={i}
                        className="p-2 bg-slate-950 border border-slate-800 rounded text-amber-300 font-mono text-[11px] flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI High Thinking Deep Inspection Section */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    Deep AI Security Analysis
                  </span>
                  <button
                    onClick={() => handleDeepAiInspect(selectedPacket)}
                    disabled={analyzingAi}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {analyzingAi ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Analyzing with Thinking Mode...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>{selectedPacket.aiAnalysis ? 'Re-Analyze (Thinking: HIGH)' : 'Analyze with Gemini Pro'}</span>
                      </>
                    )}
                  </button>
                </div>

                {aiError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs">
                    {aiError}
                  </div>
                )}

                {selectedPacket.aiAnalysis ? (
                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300">
                        {selectedPacket.aiAnalysis.classification}
                      </span>
                      <span className="font-mono text-[11px] text-indigo-400">
                        Confidence: {selectedPacket.aiAnalysis.confidenceScore}% · Level: {selectedPacket.aiAnalysis.threatLevel}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      {selectedPacket.aiAnalysis.reasoningSummary}
                    </p>

                    {selectedPacket.aiAnalysis.detectedIndicators?.length > 0 && (
                      <div className="mt-1">
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Detected IoC Indicators:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedPacket.aiAnalysis.detectedIndicators.map((ind, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                            >
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-2 text-[11px] text-amber-300/90 font-mono bg-amber-950/20 p-2 rounded border border-amber-900/30">
                      Recommendation: {selectedPacket.aiAnalysis.recommendedAction} — {selectedPacket.aiAnalysis.mitigationAdvice}
                    </div>

                    {selectedPacket.aiAnalysis.modelUsed && (
                      <div className="text-[10px] text-slate-500 text-right font-mono">
                        Model: {selectedPacket.aiAnalysis.modelUsed}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-slate-500 text-xs text-center">
                    Click "Analyze with Gemini Pro" to run multi-step heuristic reasoning and threat classification with Thinking Level HIGH.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select an email packet from the traffic stream to inspect headers and spam telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
