import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Plus,
  Terminal,
  Shield,
  Users,
  Code,
  Activity,
  Server,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'accounts' | 'brand' | 'enterprise' | 'terminal' | 'spam' | 'code';
  setActiveTab: (tab: 'dashboard' | 'accounts' | 'brand' | 'enterprise' | 'terminal' | 'spam' | 'code') => void;
  onOpenProvision: () => void;
  accountCount: number;
  spamBlockedCount: number;
}

type DropdownGroup = 'mailboxes' | 'security' | 'developer' | null;

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProvision,
  accountCount,
  spamBlockedCount,
}) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownGroup>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTab = (tab: HeaderProps['activeTab']) => {
    setActiveTab(tab);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const isMailboxGroupActive = activeTab === 'accounts' || activeTab === 'enterprise';
  const isSecurityGroupActive = activeTab === 'spam' || activeTab === 'brand';
  const isDeveloperGroupActive = activeTab === 'terminal' || activeTab === 'code';

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16" ref={navRef}>
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap group-hover:text-indigo-400 transition-colors">
                  YMM MailOps
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">
                  Java SE 21
                </span>
              </div>
            </button>
          </div>

          {/* Regrouped Navigation (Desktop) - 4 clean core hubs */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
            {/* 1. Dashboard & Traffic (Direct) */}
            <button
              onClick={() => handleSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-indigo-400 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard & Traffic</span>
            </button>

            {/* 2. Mailbox Ops Group */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mailboxes' ? null : 'mailboxes')}
                onMouseEnter={() => setOpenDropdown('mailboxes')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isMailboxGroupActive
                    ? 'bg-slate-800 text-indigo-400 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                aria-expanded={openDropdown === 'mailboxes'}
              >
                <Users className="w-4 h-4" />
                <span>Mailbox Ops</span>
                <span className="text-xs text-slate-500 tabular-nums">({accountCount})</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDropdown === 'mailboxes' ? 'rotate-180 text-indigo-400' : 'text-slate-500'
                  }`}
                />
              </button>

              {openDropdown === 'mailboxes' && (
                <div
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/50 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider">
                    Inbox & Lifecycle Architecture
                  </div>

                  <button
                    onClick={() => handleSelectTab('accounts')}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      activeTab === 'accounts'
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Account Directory</span>
                        <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">
                          {accountCount}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        OOP user instances, quota limits & credentials
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('enterprise')}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer mt-1 ${
                      activeTab === 'enterprise'
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <Server className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">
                        Enterprise Infrastructure
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        M365, Google Workspace, SCIM & DNS records
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Security & Threat Defense Group */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'security' ? null : 'security')}
                onMouseEnter={() => setOpenDropdown('security')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSecurityGroupActive
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                aria-expanded={openDropdown === 'security'}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Security & Defense</span>
                {spamBlockedCount > 0 && (
                  <span className="text-xs text-amber-500 tabular-nums">({spamBlockedCount})</span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDropdown === 'security' ? 'rotate-180 text-amber-400' : 'text-slate-500'
                  }`}
                />
              </button>

              {openDropdown === 'security' && (
                <div
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/50 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider">
                    Threat Detection & Brand Shield
                  </div>

                  <button
                    onClick={() => handleSelectTab('spam')}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      activeTab === 'spam'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Spam Defense Center</span>
                        {spamBlockedCount > 0 && (
                          <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                            {spamBlockedCount} blocked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Heuristic rules, Quarantine vault & AI reasoning
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('brand')}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer mt-1 ${
                      activeTab === 'brand'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">
                        Brand & Executive Protection
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Lookalike typosquat radar, CEO spoofing & BIMI
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Java SE Architecture Group */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'developer' ? null : 'developer')}
                onMouseEnter={() => setOpenDropdown('developer')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDeveloperGroupActive
                    ? 'bg-slate-800 text-indigo-400 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                aria-expanded={openDropdown === 'developer'}
              >
                <Code className="w-4 h-4" />
                <span>Java SE Engine</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDropdown === 'developer' ? 'rotate-180 text-indigo-400' : 'text-slate-500'
                  }`}
                />
              </button>

              {openDropdown === 'developer' && (
                <div
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/50 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider">
                    Developer Spec & OOP Console
                  </div>

                  <button
                    onClick={() => handleSelectTab('terminal')}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      activeTab === 'terminal'
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">
                        Java Terminal (OOP)
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Interactive standard console & Scanner simulator
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('code')}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer mt-1 ${
                      activeTab === 'code'
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                        : 'hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <FileCode className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">
                        Java Source Explorer
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Reference Email.java, EmailApp.java & download
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Action Zone: Provision New Hire & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenProvision}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/30 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Provision New Hire</span>
              <span className="sm:hidden">New Hire</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Accordion / Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Dashboard */}
          <button
            onClick={() => handleSelectTab('dashboard')}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Dashboard & Live Traffic</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Overview</span>
          </button>

          {/* Group: Mailbox Ops */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">
              Mailbox Operations
            </div>
            <button
              onClick={() => handleSelectTab('accounts')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Account Directory</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">({accountCount})</span>
            </button>
            <button
              onClick={() => handleSelectTab('enterprise')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'enterprise'
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>Enterprise MailOps (M365 / Workspace)</span>
              </div>
            </button>
          </div>

          {/* Group: Security & Brand */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 px-2 py-1">
              Security & Brand Defense
            </div>
            <button
              onClick={() => handleSelectTab('spam')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'spam'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Spam Defense Center</span>
              </div>
              {spamBlockedCount > 0 && (
                <span className="text-xs text-amber-400 font-mono">({spamBlockedCount})</span>
              )}
            </button>
            <button
              onClick={() => handleSelectTab('brand')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'brand'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Brand & VIP Impersonation Shield</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Shielded</span>
            </button>
          </div>

          {/* Group: Java SE Engine */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">
              Java Architecture
            </div>
            <button
              onClick={() => handleSelectTab('terminal')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Java Terminal (OOP Simulator)</span>
              </div>
            </button>
            <button
              onClick={() => handleSelectTab('code')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>Java Source Explorer</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
