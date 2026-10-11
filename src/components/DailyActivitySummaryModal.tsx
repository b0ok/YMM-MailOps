import React, { useMemo, useState } from 'react';
import {
  X,
  Calendar,
  ShieldAlert,
  Inbox,
  Globe,
  TrendingUp,
  Download,
  Copy,
  Check,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { TrafficPacket } from '../types';
import { generate24HourTrafficData } from '../services/trafficTrendsData';

interface DailyActivitySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  packets: TrafficPacket[];
}

interface DomainStat {
  domain: string;
  total: number;
  spam: number;
  delivered: number;
  percentage: number;
  isHighRisk: boolean;
}

export const DailyActivitySummaryModal: React.FC<DailyActivitySummaryModalProps> = ({
  isOpen,
  onClose,
  packets,
}) => {
  const [copied, setCopied] = useState(false);

  // Calculate the 24-hour summary based on both historical trends and live packets
  const summary = useMemo(() => {
    const historical = generate24HourTrafficData();
    let totalMessages = 0;
    let totalDelivered = 0;
    let totalSpam = 0;
    let totalBandwidthKb = 0;
    let peakHour = '';
    let peakVolume = 0;

    historical.forEach((h) => {
      totalMessages += h.totalPackets;
      totalDelivered += h.delivered;
      totalSpam += h.spamBlocked;
      totalBandwidthKb += h.bandwidthKb;
      if (h.totalPackets > peakVolume) {
        peakVolume = h.totalPackets;
        peakHour = h.timestamp;
      }
    });

    // Also factor in live packet session count
    const liveDelivered = packets.filter((p) => p.action === 'DELIVERED').length;
    const liveSpam = packets.filter((p) => p.action === 'BLOCKED' || p.action === 'QUARANTINED').length;
    totalMessages += packets.length;
    totalDelivered += liveDelivered;
    totalSpam += liveSpam;

    const spamBlockedPercentage =
      totalMessages > 0 ? ((totalSpam / totalMessages) * 100).toFixed(1) : '0.0';

    // Domain tally aggregation
    const domainMap: Record<string, { total: number; spam: number; delivered: number }> = {
      'github.com': { total: 312, spam: 0, delivered: 312 },
      'salesforce.com': { total: 248, spam: 2, delivered: 246 },
      'amazon.com': { total: 195, spam: 4, delivered: 191 },
      'slack.com': { total: 164, spam: 0, delivered: 164 },
      'intuit.com': { total: 120, spam: 1, delivered: 119 },
      'secure-update-corp.xyz': { total: 84, spam: 84, delivered: 0 },
      'portal-sso.top': { total: 52, spam: 52, delivered: 0 },
      'crypto-airdrop-bonus.xyz': { total: 46, spam: 46, delivered: 0 },
      'partner-corp.com': { total: 98, spam: 0, delivered: 98 },
    };

    // Include domains from current live packets
    packets.forEach((p) => {
      try {
        const parts = p.sender.split('@');
        const dom = parts[1] || 'unknown-domain.com';
        if (!domainMap[dom]) {
          domainMap[dom] = { total: 0, spam: 0, delivered: 0 };
        }
        domainMap[dom].total += 1;
        if (p.isSpam) {
          domainMap[dom].spam += 1;
        } else {
          domainMap[dom].delivered += 1;
        }
      } catch {
        // ignore
      }
    });

    // Sort top sender domains
    const topDomains: DomainStat[] = Object.entries(domainMap)
      .map(([domain, counts]) => ({
        domain,
        total: counts.total,
        spam: counts.spam,
        delivered: counts.delivered,
        percentage: totalMessages > 0 ? Math.round((counts.total / totalMessages) * 100) : 0,
        isHighRisk:
          domain.endsWith('.xyz') ||
          domain.endsWith('.top') ||
          domain.endsWith('.ru') ||
          counts.spam > counts.delivered,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    return {
      totalMessages,
      totalDelivered,
      totalSpam,
      spamBlockedPercentage,
      bandwidthMb: (totalBandwidthKb / 1024).toFixed(1),
      peakHour,
      peakVolume,
      topDomains,
    };
  }, [packets]);

  if (!isOpen) return null;

  const handleCopyReport = () => {
    const textReport = [
      '====================================================================',
      'DAILY EMAIL ACTIVITY & SECURITY SUMMARY (LAST 24 HOURS)',
      `Generated: ${new Date().toLocaleString()}`,
      '====================================================================',
      `Total Messages Received:   ${summary.totalMessages.toLocaleString()}`,
      `Legitimate Delivered:      ${summary.totalDelivered.toLocaleString()}`,
      `Filtered Spam / Threats:   ${summary.totalSpam.toLocaleString()}`,
      `Percentage Spam Blocked:   ${summary.spamBlockedPercentage}%`,
      `Peak Traffic Window:       ${summary.peakHour} (${summary.peakVolume} msgs/hr)`,
      `Total Payload Bandwidth:   ${summary.bandwidthMb} MB`,
      '',
      '--- TOP SENDER DOMAINS (LAST 24H) ---',
      ...summary.topDomains.map(
        (d, i) =>
          `${i + 1}. @${d.domain} - ${d.total} msgs (Delivered: ${d.delivered}, Spam: ${d.spam})${
            d.isHighRisk ? ' [HIGH RISK DOMAIN]' : ''
          }`
      ),
      '====================================================================',
    ].join('\n');

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Daily Email Activity Summary
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                24-Hour Inbound Traffic, Spam Filter Interceptions & Domain Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Top 3 KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Messages Received */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="font-medium">Total Messages Received</span>
                <Inbox className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {summary.totalMessages.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {summary.totalDelivered.toLocaleString()} delivered to inboxes
              </div>
            </div>

            {/* Percentage Spam Blocked */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="font-medium">Spam Blocked %</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {summary.spamBlockedPercentage}%
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {summary.totalSpam.toLocaleString()} threats blocked/held
              </div>
            </div>

            {/* Peak Window & Bandwidth */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="font-medium">Peak Hour Window</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {summary.peakHour}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Peak load: {summary.peakVolume} msgs/hr
              </div>
            </div>
          </div>

          {/* Top Sender Domains Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-white text-xs">
                  Top Sender Domains (Last 24 Hours)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                By volume & threat categorization
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60">
              {summary.topDomains.map((item, idx) => {
                const threatRatio = item.total > 0 ? Math.round((item.spam / item.total) * 100) : 0;
                return (
                  <div key={idx} className="p-3.5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-slate-500 text-[11px] w-4">
                          {idx + 1}.
                        </span>
                        <span className="font-mono font-semibold text-white truncate">
                          @{item.domain}
                        </span>
                        {item.isHighRisk && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                            High-Risk TLD
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-right shrink-0">
                        <span className="font-mono text-slate-400 tabular-nums">
                          {item.total.toLocaleString()} msgs
                        </span>
                        <span
                          className={`font-mono text-[11px] tabular-nums font-semibold ${
                            item.spam > 0 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {item.spam > 0 ? `${item.spam} spam (${threatRatio}%)` : '0 spam (100% clean)'}
                        </span>
                      </div>
                    </div>

                    {/* Volume Bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-indigo-500 h-full"
                          style={{
                            width: `${Math.max(5, (item.delivered / item.total) * 100)}%`,
                          }}
                        />
                        {item.spam > 0 && (
                          <div
                            className="bg-amber-500 h-full"
                            style={{
                              width: `${(item.spam / item.total) * 100}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* IT Compliance & Routing Details */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-slate-400">
            <span className="font-semibold text-slate-300 block">
              IT Administration Analysis & Status:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero message loss across Sales & Dev queues</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Heuristic spam rejection rate: &gt; 98.4% precision</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>3 high-risk phishing sender domains actively quarantined</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Mailbox capacity utilization within nominal parameters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Summary</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text Summary</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
