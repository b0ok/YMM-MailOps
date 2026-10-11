import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  AlertOctagon,
  Eye,
  Plus,
  Play,
  Check,
  CheckCircle,
  Copy,
  UserCheck,
  ExternalLink,
  Flame,
  Award,
  Lock,
} from 'lucide-react';
import { LookalikeDomainWatch, VipImpersonationTarget, TrafficPacket } from '../types';
import {
  INITIAL_LOOKALIKE_DOMAINS,
  INITIAL_VIP_TARGETS,
  generateBrandAttackSimulation,
} from '../services/brandProtection';

interface BrandProtectionHubProps {
  onInjectAttack: (packet: TrafficPacket) => void;
  targetRecipientEmail: string;
}

export const BrandProtectionHub: React.FC<BrandProtectionHubProps> = ({
  onInjectAttack,
  targetRecipientEmail,
}) => {
  const [lookalikes, setLookalikes] = useState<LookalikeDomainWatch[]>(INITIAL_LOOKALIKE_DOMAINS);
  const [vips, setVips] = useState<VipImpersonationTarget[]>(INITIAL_VIP_TARGETS);
  const [newDomain, setNewDomain] = useState('');
  const [newVipName, setNewVipName] = useState('');
  const [newVipEmail, setNewVipEmail] = useState('');
  const [newVipRole, setNewVipRole] = useState('');
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showAddVip, setShowAddVip] = useState(false);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  const handleSimulateAttack = (type: 'LOOKALIKE' | 'VIP_IMPERSONATION') => {
    const packet = generateBrandAttackSimulation(type, targetRecipientEmail);
    onInjectAttack(packet);
    setSimulationNotice(
      type === 'LOOKALIKE'
        ? 'Simulated lookalike domain attack from @ymm-billing.xyz intercepted and blocked!'
        : 'Simulated executive display name impersonation ("Terry Nguyen") intercepted and blocked!'
    );
    setTimeout(() => setSimulationNotice(null), 3500);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const entry: LookalikeDomainWatch = {
      id: `lookalike-${Date.now()}`,
      domain: newDomain.trim().toLowerCase().replace('@', ''),
      attackTechnique: 'COMBO_SQUAT',
      threatRisk: 'CRITICAL',
      status: 'BLOCKED',
      interceptCount: 0,
      lastInterceptAt: 'Just now',
    };

    setLookalikes([entry, ...lookalikes]);
    setNewDomain('');
    setShowAddDomain(false);
  };

  const handleAddVip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVipName.trim() || !newVipEmail.trim()) return;

    const entry: VipImpersonationTarget = {
      id: `vip-${Date.now()}`,
      name: newVipName.trim(),
      officialEmail: newVipEmail.trim().toLowerCase(),
      role: newVipRole.trim() || 'Executive Leadership',
      priorityLevel: 'VIP_EXECUTIVE',
      protectedSince: new Date().toISOString().slice(0, 10),
    };

    setVips([entry, ...vips]);
    setNewVipName('');
    setNewVipEmail('');
    setNewVipRole('');
    setShowAddVip(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              YMM Brand & Executive Protection Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Defensive typosquatting radar, C-suite display name impersonation shield, and BIMI trademark validation
          </p>
        </div>

        {/* Global Protection Status */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">YMM Brand Defense:</span>
          <span className="font-mono font-bold text-amber-300">Active Shield</span>
          <span className="text-slate-500 font-mono text-[11px]">(0 Breaches)</span>
        </div>
      </div>

      {simulationNotice && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{simulationNotice}</span>
        </div>
      )}

      {/* Interactive Simulation Sandbox Bar */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider block">
            Brand Attack Simulation Sandbox
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            Test how the YMM MailOps gateway detects and stops brand spoofing before it reaches user inboxes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSimulateAttack('LOOKALIKE')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Lookalike Attack</span>
          </button>

          <button
            onClick={() => handleSimulateAttack('VIP_IMPERSONATION')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Simulate CEO Impersonation</span>
          </button>
        </div>
      </div>

      {/* Grid: Lookalike Domain Watcher & VIP Impersonation Guard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lookalike & Typosquatting Watcher (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                1. Lookalike & Typosquatting Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Blacklisted cousin domains and homoglyphs targeting YMM reputation
              </p>
            </div>

            <button
              onClick={() => setShowAddDomain(!showAddDomain)}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Watch Domain</span>
            </button>
          </div>

          {showAddDomain && (
            <form onSubmit={handleAddDomain} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <label className="block text-[11px] font-semibold text-slate-400">
                Domain to Block & Watch
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. ymm-investors.com"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 text-xs">
            {lookalikes.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-400">
                      @{item.domain}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                      {item.attackTechnique}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Last intercepted: {item.lastInterceptAt}
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                    {item.status} ({item.interceptCount})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: VIP Executive Display Name Shield (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                2. VIP Executive Impersonation Shield
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Intercepts external non-@ymm.com mail spoofing executive names
              </p>
            </div>

            <button
              onClick={() => setShowAddVip(!showAddVip)}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Protect VIP</span>
            </button>
          </div>

          {showAddVip && (
            <form onSubmit={handleAddVip} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newVipName}
                  onChange={(e) => setNewVipName(e.target.value)}
                  placeholder="Full Name (e.g. Sarah Jenkins)"
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="email"
                  value={newVipEmail}
                  onChange={(e) => setNewVipEmail(e.target.value)}
                  placeholder="Official @ymm.com Email"
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <input
                  type="text"
                  value={newVipRole}
                  onChange={(e) => setNewVipRole(e.target.value)}
                  placeholder="Role (e.g. Chief Operating Officer)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded cursor-pointer"
                >
                  Save VIP
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 text-xs">
            {vips.map((vip) => (
              <div key={vip.id} className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{vip.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {vip.priorityLevel.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                    {vip.officialEmail} · <span className="font-sans text-slate-500">{vip.role}</span>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-emerald-400">
                  <div className="flex items-center gap-1 font-semibold">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Shielded</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BIMI Verified Brand Logo & External Banner Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BIMI Trademark Preview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              BIMI Trademark Verification Preview
            </h4>
            <span className="text-[11px] font-mono text-emerald-400">
              VMC Validated
            </span>
          </div>

          <p className="text-xs text-slate-400">
            When YMM staff email clients, Apple Mail and Gmail display the official verified gold emblem next to your sender address:
          </p>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 font-mono">
              YMM
            </div>
            <div className="text-xs min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <span>Young Millionaire Mindset</span>
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                executive.desk@ymm.com
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Inbound External Warning Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Inbound External Sender Caution Banner
            </h4>
            <span className="text-[11px] font-mono text-indigo-400">
              Auto-Appended
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Automatically attached to the top of every message originating outside `@ymm.com` to prevent staff from mistaking external senders for internal executives:
          </p>

          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-400">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>[CAUTION: EXTERNAL SENDER]</span>
            </div>
            <div className="text-[11px] text-slate-300 font-sans">
              This email originated from outside the YMM organization. Do not click links, open unexpected attachments, or authorize wire transfers without verbal verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
