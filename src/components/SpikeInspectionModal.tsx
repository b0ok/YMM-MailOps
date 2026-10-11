import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Flame,
  TrendingUp,
  KeyRound,
  HardDrive,
  CheckCircle,
  Sliders,
  Shield,
} from 'lucide-react';
import { TrafficSpikeAnomaly, EmailAccount } from '../types';

interface SpikeInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  anomaly: TrafficSpikeAnomaly | null;
  account: EmailAccount | null;
  onUpgradeCapacity: (accountId: string) => void;
  onForcePasswordReset: (accountId: string) => void;
  onDismissAlert: (anomalyId: string) => void;
}

export const SpikeInspectionModal: React.FC<SpikeInspectionModalProps> = ({
  isOpen,
  onClose,
  anomaly,
  account,
  onUpgradeCapacity,
  onForcePasswordReset,
  onDismissAlert,
}) => {
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen || !anomaly) return null;

  const handleUpgrade = () => {
    onUpgradeCapacity(anomaly.accountId);
    setActionNotice(`Java Method Executed: em1.setMailboxCapacity(${((account?.mailboxCapacity || 500) + 500)}mb)`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleResetPassword = () => {
    onForcePasswordReset(anomaly.accountId);
    setActionNotice('Java Method Executed: em1.changePassword("********") with fresh randomized credentials');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDismiss = () => {
    onDismissAlert(anomaly.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Traffic Spike Anomaly Detected</span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {anomaly.severity}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Statistical threshold exceeded on <span className="font-mono text-indigo-300">{anomaly.accountEmail}</span>
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

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {actionNotice && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Statistical Metrics Breakdown */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Surge Multiplier</span>
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                +{Math.round((anomaly.surgeMultiplier - 1) * 100)}%
              </span>
              <span className="text-[10px] text-slate-500 block">
                {anomaly.surgeMultiplier}x baseline volume
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Statistical Z-Score</span>
              <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                +{anomaly.zScore}&sigma;
              </span>
              <span className="text-[10px] text-slate-500 block">
                p-value &lt; 0.005 (top 0.5%)
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Spam Threat Density</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {anomaly.spamRatio}%
              </span>
              <span className="text-[10px] text-slate-500 block">
                Of incoming burst is malicious
              </span>
            </div>
          </div>

          {/* Threat Hypothesis */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Attack Vector Hypothesis: {anomaly.threatType.replace('_', ' ')}</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {anomaly.threatType === 'SPAM_BOMBING'
                ? 'This mailbox is being targeted by an automated registration / spam subscription flood. Threat actors typically deploy mail bombing attacks against corporate targets to submerge legitimate security notifications (such as wire transfer alerts or password change confirmations) under hundreds of junk emails.'
                : 'Abnormal inbound and bounce velocity detected. This pattern commonly indicates account credential abuse, unauthorized password spray attempts, or backscatter from forged outbound headers.'}
            </p>
          </div>

          {/* Account Profile Status */}
          {account && (
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-slate-400">
              <div>
                <span className="font-semibold text-white">{account.firstName} {account.lastName}</span>
                <span className="block text-[11px] font-mono text-indigo-300 mt-0.5">{account.email}</span>
              </div>
              <div className="text-right font-mono text-xs">
                <div>Mailbox: {account.mailboxUsed}mb / {account.mailboxCapacity}mb</div>
                <div className="text-[11px] text-slate-500">Dept: {account.department || 'General'}</div>
              </div>
            </div>
          )}

          {/* Quick IT Remediation Actions */}
          <div className="space-y-2 pt-1">
            <span className="font-semibold text-slate-300 block text-xs">
              Recommended IT Administrative Mitigations:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleUpgrade}
                className="flex items-center gap-2 p-3 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-xs text-white">Expand Capacity (+500mb)</div>
                  <div className="text-[10px] text-slate-500">Prevent inbox overflow disruption</div>
                </div>
              </button>

              <button
                onClick={handleResetPassword}
                className="flex items-center gap-2 p-3 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-xs text-white">Rotate Password (Java OOP)</div>
                  <div className="text-[10px] text-slate-500">Generate fresh random password</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/70">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Acknowledge & Dismiss Alert
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
