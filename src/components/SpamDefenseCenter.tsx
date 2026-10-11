import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Sliders,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Send,
} from 'lucide-react';
import { SpamRule, TrafficPacket } from '../types';
import { DEFAULT_SPAM_RULES } from '../services/spamFilter';

interface SpamDefenseCenterProps {
  rules: SpamRule[];
  onUpdateRules: (rules: SpamRule[]) => void;
  packets: TrafficPacket[];
  onReleaseQuarantined: (packetId: string) => void;
  onPurgePacket: (packetId: string) => void;
}

export const SpamDefenseCenter: React.FC<SpamDefenseCenterProps> = ({
  rules,
  onUpdateRules,
  packets,
  onReleaseQuarantined,
  onPurgePacket,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'quarantine'>('rules');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<'KEYWORD' | 'PATTERN' | 'HEADER'>('KEYWORD');
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleWeight, setNewRuleWeight] = useState<number>(3.0);
  const [showAddForm, setShowAddForm] = useState(false);

  const quarantinedPackets = packets.filter(
    (p) => p.action === 'QUARANTINED' || p.action === 'BLOCKED'
  );

  const handleToggleRule = (id: string) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onUpdateRules(updated);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRulePattern.trim()) return;

    const newRule: SpamRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      category: newRuleCategory,
      pattern: newRulePattern.trim(),
      scoreWeight: newRuleWeight,
      description: 'Custom rule added by IT Email Administrator.',
      enabled: true,
      matchCount: 0,
    };

    onUpdateRules([...rules, newRule]);
    setNewRuleName('');
    setNewRulePattern('');
    setShowAddForm(false);
  };

  const handleResetDefaultRules = () => {
    onUpdateRules(DEFAULT_SPAM_RULES);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Spam Defense & Quarantine Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Bayesian keyword scoring matrix, Regex heuristics, and quarantined asset retention
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setActiveSubTab('rules')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'rules'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Filter Rules ({rules.length})
            </button>
            <button
              onClick={() => setActiveSubTab('quarantine')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'quarantine'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quarantine Vault ({quarantinedPackets.length})
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'rules' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Active Heuristic Scoring Rules
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaultRules}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Rule</span>
              </button>
            </div>
          </div>

          {/* Add custom rule form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateRule}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3"
            >
              <h4 className="text-xs font-bold text-white">Define New Spam Rule</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. Gift Card Fraud"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Rule Type
                  </label>
                  <select
                    value={newRuleCategory}
                    onChange={(e) => setNewRuleCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="KEYWORD">Keyword Match</option>
                    <option value="PATTERN">Regex Pattern</option>
                    <option value="HEADER">Header / TLD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Penalty Weight (Score addition)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="5.0"
                    value={newRuleWeight}
                    onChange={(e) => setNewRuleWeight(parseFloat(e.target.value) || 2.0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Pattern / Pipe-separated Keywords
                </label>
                <input
                  type="text"
                  value={newRulePattern}
                  onChange={(e) => setNewRulePattern(e.target.value)}
                  placeholder="e.g. steam gift card|apple card|itunes code"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                >
                  Save Rule
                </button>
              </div>
            </form>
          )}

          {/* Rules List Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pattern / Trigger</th>
                  <th className="py-3 px-4 text-right">Score Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`text-xs px-2 py-0.5 rounded cursor-pointer font-medium ${
                          rule.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {rule.name}
                      <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                        {rule.description}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {rule.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300 text-[11px] max-w-xs truncate">
                      {rule.pattern}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-400 font-semibold">
                      +{rule.scoreWeight.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Quarantine Vault */
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Quarantined Emails</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Emails intercepted by Java Spam Engine with score &ge; 5.0
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400">
                {quarantinedPackets.length} Items Pending Review
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {quarantinedPackets.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
                  No messages currently quarantined in the vault.
                </div>
              ) : (
                quarantinedPackets.map((pkt) => (
                  <div key={pkt.id} className="p-4 hover:bg-slate-800/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-white">{pkt.subject}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          From: <span className="font-mono text-slate-300">{pkt.sender}</span> · To: <span className="font-mono text-indigo-300">{pkt.recipient}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Score {pkt.spamScore}
                        </span>
                        <button
                          onClick={() => onReleaseQuarantined(pkt.id)}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          title="Release false positive to employee inbox"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Release to Inbox</span>
                        </button>
                        <button
                          onClick={() => onPurgePacket(pkt.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Permanently Purge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 line-clamp-2">
                      {pkt.body}
                    </div>

                    {pkt.triggeredRules.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {pkt.triggeredRules.map((r, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono bg-slate-950 text-amber-300/80 px-1.5 py-0.5 rounded border border-slate-800"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
