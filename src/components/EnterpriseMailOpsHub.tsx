import React, { useState } from 'react';
import {
  Server,
  Cloud,
  ShieldCheck,
  Globe,
  Users,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Lock,
  Layers,
  ArrowRight,
  UserPlus,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  EmailAccount,
  MailProviderType,
  DnsSecurityRecord,
  SubdomainIsolationRoute,
} from '../types';
import {
  DNS_SECURITY_RECORDS,
  SUBDOMAIN_ROUTES,
  generateProviderSyncPayload,
  PENDING_HR_NEW_HIRES,
} from '../services/enterpriseMailOps';
import { JavaEmail } from '../services/javaEmail';

interface EnterpriseMailOpsHubProps {
  accounts: EmailAccount[];
  activeProvider: MailProviderType;
  setActiveProvider: (provider: MailProviderType) => void;
  onBatchProvisionFromHR: (newAccounts: { account: EmailAccount; javaInstance: JavaEmail }[]) => void;
}

export const EnterpriseMailOpsHub: React.FC<EnterpriseMailOpsHubProps> = ({
  accounts,
  activeProvider,
  setActiveProvider,
  onBatchProvisionFromHR,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [batchSuccess, setBatchSuccess] = useState(false);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];
  const syncPayload = selectedAccount
    ? generateProviderSyncPayload(activeProvider, selectedAccount)
    : null;

  const handleCopyRecord = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTriggerSync = () => {
    setSyncStatus('Connecting to target provider endpoint...');
    setTimeout(() => {
      setSyncStatus(`200 OK — Successfully synchronized ${selectedAccount?.email} to ${activeProvider}`);
      setTimeout(() => setSyncStatus(null), 3000);
    }, 600);
  };

  const handleRunBatchProvision = () => {
    const created: { account: EmailAccount; javaInstance: JavaEmail }[] = [];

    PENDING_HR_NEW_HIRES.forEach((hire) => {
      const javaObj = new JavaEmail(hire.firstName, hire.lastName, hire.departmentCode, 'ymm.com');
      const raw = javaObj.getRawData();

      const newAcc: EmailAccount = {
        id: `acc-scim-${Date.now()}-${hire.firstName.toLowerCase()}`,
        firstName: raw.firstName,
        lastName: raw.lastName,
        department: raw.department as any,
        companySuffix: 'ymm.com',
        email: raw.email,
        password: raw.password,
        mailboxCapacity: raw.mailboxCapacity,
        mailboxUsed: 20,
        alternateEmail: raw.alternateEmail,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        active: true,
        totalReceived: 0,
        spamBlocked: 0,
      };

      created.push({ account: newAcc, javaInstance: javaObj });
    });

    onBatchProvisionFromHR(created);
    setBatchSuccess(true);
    setTimeout(() => setBatchSuccess(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Enterprise MailOps & Gateway Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Provider-agnostic compatibility (M365 vs Google Workspace), DMARC security, and automated SCIM lifecycle
          </p>
        </div>

        {/* Global Security Grade Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-sans">Domain Health:</span>
          <span className="font-mono font-bold text-emerald-400">100 / 100</span>
          <span className="text-[11px] text-slate-500 font-mono">(p=reject ENFORCED)</span>
        </div>
      </div>

      {/* Recommendation 1: Provider Ecosystem Compatibility Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-indigo-400" />
              1. Universal Mail Provider Gateway Selector
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero client lock-in: toggle target ecosystem to inspect live API provisioning payloads
            </p>
          </div>

          {/* Provider Toggle Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveProvider('MICROSOFT_365')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium cursor-pointer ${
                activeProvider === 'MICROSOFT_365'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Microsoft 365 / Exchange
            </button>
            <button
              onClick={() => setActiveProvider('GOOGLE_WORKSPACE')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium cursor-pointer ${
                activeProvider === 'GOOGLE_WORKSPACE'
                  ? 'bg-red-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Google Workspace
            </button>
            <button
              onClick={() => setActiveProvider('YMM_NATIVE')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium cursor-pointer ${
                activeProvider === 'YMM_NATIVE'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              YMM Native Java (Autonomous)
            </button>
          </div>
        </div>

        {/* Live Payload Preview */}
        {syncPayload && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 font-sans">
                  Account Sync Target:
                </span>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName} ({a.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerSync}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors cursor-pointer font-sans"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Simulate API Dispatch</span>
                </button>
              </div>
            </div>

            {syncStatus && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-300 text-xs font-mono">
                {syncStatus}
              </div>
            )}

            <div className="space-y-1">
              <div className="text-slate-400">
                <span className="text-slate-500">HTTP Endpoint:</span> {syncPayload.endpoint}
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Auth Method:</span> {syncPayload.authMethod}
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Status Cluster:</span>{' '}
                <span className="text-emerald-400">{syncPayload.exchangeStatus}</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded p-3 overflow-x-auto max-h-48 text-[11px] text-slate-300 select-all">
              <pre>{JSON.stringify(syncPayload.payload, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Recommendation 3 & 4: SCIM Automated HR Sync & Subdomain Routing (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 1-Click SCIM Batch Provisioning from HR Roster (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                2. Automated SCIM / HR Sync Lifecycle
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Workday / Rippling mock queue ready for batch Java instantiation
              </p>
            </div>

            <button
              onClick={handleRunBatchProvision}
              disabled={batchSuccess}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              {batchSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>3 Accounts Provisioned!</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>1-Click Batch Provision</span>
                </>
              )}
            </button>
          </div>

          {batchSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Java constructor executed for Marcus Vance, Elena Rostova, and David Chen. Added to active accounts directory!
              </span>
            </div>
          )}

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            {PENDING_HR_NEW_HIRES.map((hire, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">
                    {hire.firstName} {hire.lastName}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Role: {hire.role} · Starts {hire.startDate}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="text-indigo-400">
                    {hire.departmentCode === 1
                      ? 'sales.ymm.com'
                      : hire.departmentCode === 2
                      ? 'dev.ymm.com'
                      : 'acct.ymm.com'}
                  </span>
                  <div className="text-slate-500">Auto-SCIM Ready</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Subdomain Isolation Architecture (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              3. Outbound Subdomain Isolation Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Isolates transactional, billing, and sales traffic to safeguard core @ymm.com sender score
            </p>
          </div>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 text-xs">
            {SUBDOMAIN_ROUTES.map((route, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-300">
                      @{route.subdomain}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                      {route.ipPoolType}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5 truncate">
                    {route.purpose}
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-emerald-400 font-bold">
                    {route.reputationScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {route.volume24h} msgs / 24h
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation 4: The "Triple Threat" DNS Authentication (SPF, DKIM, DMARC, BIMI) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              4. Domain Authentication & Anti-Spoofing (SPF, DKIM, DMARC, BIMI)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live cryptographic verification records ensuring spoofed emails pretending to be @ymm.com are rejected worldwide
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strict Quarantine & Reject Active</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {DNS_SECURITY_RECORDS.map((rec, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono">
                    {rec.protocol}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {rec.recordName}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyRecord(rec.rawRecord, idx)}
                  className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Copy DNS Raw Record"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="font-mono text-[11px] text-indigo-300 bg-slate-900/90 p-2 rounded border border-slate-800/80 break-all select-all">
                {rec.rawRecord}
              </div>

              <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-0.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec.antiSpoofingRole}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
