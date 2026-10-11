import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { AccountDirectory } from './components/AccountDirectory';
import { JavaTerminal } from './components/JavaTerminal';
import { TrafficMonitor } from './components/TrafficMonitor';
import { SpamDefenseCenter } from './components/SpamDefenseCenter';
import { JavaSourceExplorer } from './components/JavaSourceExplorer';
import { ProvisionModal } from './components/ProvisionModal';
import {
  ShowInfoModal,
  SetMethodsModal,
  GetMethodsModal,
} from './components/AccountActionModals';
import { DailyActivitySummaryModal } from './components/DailyActivitySummaryModal';
import { SpikeInspectionModal } from './components/SpikeInspectionModal';
import { EnterpriseMailOpsHub } from './components/EnterpriseMailOpsHub';
import { BrandProtectionHub } from './components/BrandProtectionHub';
import {
  EmailAccount,
  TrafficPacket,
  SpamRule,
  TrafficSpikeAnomaly,
  MailProviderType,
} from './types';
import { JavaEmail } from './services/javaEmail';
import {
  DEFAULT_SPAM_RULES,
  INITIAL_TRAFFIC_PACKETS,
  inspectEmailWithRules,
} from './services/spamFilter';
import { exportAuditLogToFile } from './services/auditLogger';
import { detectTrafficSpikes, generateSpamBombPackets } from './services/anomalyDetector';

// Initial pre-provisioned demo accounts
const INITIAL_ACCOUNTS: EmailAccount[] = [
  {
    id: 'acc-1',
    firstName: 'John',
    lastName: 'Doe',
    department: 'sales',
    companySuffix: 'ymm.com',
    email: 'john.doe@sales.ymm.com',
    password: 'M9#kL2$vX8',
    mailboxCapacity: 500,
    mailboxUsed: 142,
    alternateEmail: 'jdoe.home@gmail.com',
    createdAt: '09:15 AM',
    active: true,
    totalReceived: 42,
    spamBlocked: 3,
  },
  {
    id: 'acc-2',
    firstName: 'Alice',
    lastName: 'Zhang',
    department: 'dev',
    companySuffix: 'ymm.com',
    email: 'alice.zhang@dev.ymm.com',
    password: 'Q4!zP9&wR1',
    mailboxCapacity: 1000,
    mailboxUsed: 215,
    alternateEmail: 'azhang.dev@proton.me',
    createdAt: '09:30 AM',
    active: true,
    totalReceived: 88,
    spamBlocked: 7,
  },
  {
    id: 'acc-3',
    firstName: 'Robert',
    lastName: 'Vance',
    department: 'acct',
    companySuffix: 'ymm.com',
    email: 'robert.vance@acct.ymm.com',
    password: 'T7@yB3#nK5',
    mailboxCapacity: 500,
    mailboxUsed: 80,
    alternateEmail: 'None',
    createdAt: '10:00 AM',
    active: true,
    totalReceived: 29,
    spamBlocked: 5,
  },
  {
    id: 'acc-4',
    firstName: 'Stanley',
    lastName: 'Hudson',
    department: '',
    companySuffix: 'ymm.com',
    email: 'stanley.hudson@ymm.com',
    password: 'W2$hC8!pL6',
    mailboxCapacity: 500,
    mailboxUsed: 45,
    alternateEmail: 'shudson.crosswords@yahoo.com',
    createdAt: '10:15 AM',
    active: true,
    totalReceived: 18,
    spamBlocked: 2,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'brand' | 'enterprise' | 'terminal' | 'spam' | 'code'>('dashboard');
  const [activeProvider, setActiveProvider] = useState<MailProviderType>('MICROSOFT_365');
  const [accounts, setAccounts] = useState<EmailAccount[]>(INITIAL_ACCOUNTS);
  const [packets, setPackets] = useState<TrafficPacket[]>(INITIAL_TRAFFIC_PACKETS);
  const [rules, setRules] = useState<SpamRule[]>(DEFAULT_SPAM_RULES);
  const [logs, setLogs] = useState<string[]>([
    'Bootstrapped 4 initial employee accounts using Email(firstName, lastName) constructor.',
    'System ready: Heuristic spam scanner active.',
  ]);
  const [isTrafficPaused, setIsTrafficPaused] = useState(false);

  // Modals state
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [showInfoTarget, setShowInfoTarget] = useState<EmailAccount | null>(null);
  const [setMethodsTarget, setSetMethodsTarget] = useState<EmailAccount | null>(null);
  const [getMethodsTarget, setGetMethodsTarget] = useState<EmailAccount | null>(null);
  const [dailySummaryOpen, setDailySummaryOpen] = useState(false);
  const [dismissedSpikeIds, setDismissedSpikeIds] = useState<string[]>([]);
  const [inspectingAnomaly, setInspectingAnomaly] = useState<TrafficSpikeAnomaly | null>(null);

  // Compute statistically significant traffic spike anomalies
  const detectedAnomalies = detectTrafficSpikes(accounts, packets);
  const activeAnomalies = detectedAnomalies.filter((a) => !dismissedSpikeIds.includes(a.id));

  // Background subtle traffic generation simulation
  useEffect(() => {
    if (isTrafficPaused) return;

    const interval = setInterval(() => {
      const senders = [
        'support@github.com',
        'alerts@pagerduty.com',
        'newsletter@techcrunch.com',
        'invoices@quickbooks.intuit.com',
        'deals@crypto-airdrop-bonus.xyz',
        'hr-review@evaluations-portal.top',
        'notifications@slack.com',
      ];
      const subjects = [
        'Weekly Engineering RFC & Architecture Digest',
        'Vendor Service Agreement update for Q4',
        'Security advisory: Patch available for OpenSSL',
        'URGENT ACCOUNT VERIFICATION - CLICK TO PREVENT LOCKOUT',
        'Meeting notes and action items from product sync',
      ];
      const bodies = [
        'Please review the attached release notes for this upcoming sprint deployment.',
        'Your password expires in 24 hours. Verify login immediately to prevent disruption.',
        'Attached is the itemized expense report for travel reimbursement.',
        'Team, lets convene tomorrow at 10 AM PST to finalize the client onboarding plan.',
      ];

      const randomSender = senders[Math.floor(Math.random() * senders.length)];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
      const targetAccount = accounts[Math.floor(Math.random() * accounts.length)];

      if (!targetAccount) return;

      const inspection = inspectEmailWithRules(randomSender, randomSubject, randomBody, rules);
      const newPacket: TrafficPacket = {
        id: `pkt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        sender: randomSender,
        recipient: targetAccount.email,
        department: (targetAccount.department || 'general') as any,
        subject: randomSubject,
        body: randomBody,
        spamScore: inspection.score,
        isSpam: inspection.isSpam,
        action: inspection.action,
        triggeredRules: inspection.triggeredRules,
        sizeKb: Math.floor(Math.random() * 80) + 15,
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 49)]);
    }, 14000); // New incoming packet every 14s

    return () => clearInterval(interval);
  }, [isTrafficPaused, accounts, rules]);

  const handleAccountCreated = (account: EmailAccount, javaObj: JavaEmail) => {
    setAccounts((prev) => [account, ...prev]);
    const termLogs = javaObj.getConsoleLogs();
    setLogs((prev) => [...prev, ...termLogs]);
  };

  const handleUpdateAccount = (updated: EmailAccount, logMsg: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logMsg}`]);
  };

  const handleReleaseQuarantined = (packetId: string) => {
    setPackets((prev) =>
      prev.map((p) =>
        p.id === packetId
          ? { ...p, action: 'DELIVERED', isSpam: false, spamScore: 0.0 }
          : p
      )
    );
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] IT Admin manually released message ${packetId} to inbox.`,
    ]);
  };

  const handlePurgePacket = (packetId: string) => {
    setPackets((prev) => prev.filter((p) => p.id !== packetId));
  };

  const handleSimulateSpike = (targetEmail: string) => {
    const burst = generateSpamBombPackets(targetEmail);
    setPackets((prev) => [...burst, ...prev]);
    // Reset dismissal for this account if it was previously dismissed
    setDismissedSpikeIds((prev) => prev.filter((id) => !id.includes(targetEmail)));
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [SECURITY ALERT] Inbound traffic burst detected targeting ${targetEmail}. Statistical Z-Score threshold exceeded (+420% velocity spike). Potential spam bombing attack.`,
    ]);
  };

  const handleUpgradeSpikeCapacity = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          const newCap = acc.mailboxCapacity + 500;
          setLogs((prevLogs) => [
            ...prevLogs,
            `[${new Date().toLocaleTimeString()}] Java Method Executed on ${acc.email}: em1.setMailboxCapacity(${newCap}); // Expanded storage to mitigate spam surge overflow.`,
          ]);
          return { ...acc, mailboxCapacity: newCap };
        }
        return acc;
      })
    );
  };

  const handleForceSpikePasswordReset = (accountId: string) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let newPass = '';
    for (let i = 0; i < 12; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          setLogs((prevLogs) => [
            ...prevLogs,
            `[${new Date().toLocaleTimeString()}] Java Method Executed on ${acc.email}: em1.changePassword("********"); // Mandatory credential rotation executed due to anomaly detection.`,
          ]);
          return { ...acc, password: newPass };
        }
        return acc;
      })
    );
  };

  const handleDismissAnomaly = (anomalyId: string) => {
    setDismissedSpikeIds((prev) => [...prev, anomalyId]);
  };

  const handleBatchProvisionFromHR = (
    newItems: { account: EmailAccount; javaInstance: JavaEmail }[]
  ) => {
    setAccounts((prev) => [...newItems.map((n) => n.account), ...prev]);
    newItems.forEach((n) => {
      const termLogs = n.javaInstance.getConsoleLogs();
      setLogs((prevLogs) => [
        ...prevLogs,
        `[SCIM HR SYNC] Instant Java Constructor executed: new Email("${n.account.firstName}", "${n.account.lastName}"); -> ${n.account.email}`,
        ...termLogs,
      ]);
    });
  };

  const spamBlockedCount = packets.filter((p) => p.action === 'BLOCKED' || p.action === 'QUARANTINED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProvision={() => setProvisionOpen(true)}
        accountCount={accounts.length}
        spamBlockedCount={spamBlockedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            accounts={accounts}
            packets={packets}
            anomalies={activeAnomalies}
            onOpenProvision={() => setProvisionOpen(true)}
            onShowInfo={(acc) => setShowInfoTarget(acc)}
            onOpenSetters={(acc) => setSetMethodsTarget(acc)}
            onOpenGetters={(acc) => setGetMethodsTarget(acc)}
            onSwitchTab={setActiveTab}
            onExportAuditLog={() => exportAuditLogToFile(logs)}
            onOpenDailySummary={() => setDailySummaryOpen(true)}
            onInspectAnomaly={(anomaly) => setInspectingAnomaly(anomaly)}
            onDismissAnomaly={handleDismissAnomaly}
            onSimulateSpike={handleSimulateSpike}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountDirectory
            accounts={accounts}
            anomalies={activeAnomalies}
            onOpenProvision={() => setProvisionOpen(true)}
            onShowInfo={(acc) => setShowInfoTarget(acc)}
            onOpenSetters={(acc) => setSetMethodsTarget(acc)}
            onOpenGetters={(acc) => setGetMethodsTarget(acc)}
            onInspectAnomaly={(anomaly) => setInspectingAnomaly(anomaly)}
          />
        )}

        {activeTab === 'enterprise' && (
          <EnterpriseMailOpsHub
            accounts={accounts}
            activeProvider={activeProvider}
            setActiveProvider={setActiveProvider}
            onBatchProvisionFromHR={handleBatchProvisionFromHR}
          />
        )}

        {activeTab === 'brand' && (
          <BrandProtectionHub
            targetRecipientEmail={accounts[0]?.email || 'terry.nguyen@ymm.com'}
            onInjectAttack={(packet) => {
              setPackets((prev) => [packet, ...prev]);
              setLogs((prev) => [
                ...prev,
                `[${new Date().toLocaleTimeString()}] [BRAND DEFENSE INTERCEPT] ${packet.sender} -> ${packet.recipient}. Trigger: ${packet.triggeredRules.join(', ')}`,
              ]);
            }}
          />
        )}

        {activeTab === 'terminal' && (
          <JavaTerminal
            logs={logs}
            onClearLogs={() => setLogs([])}
            onAccountCreated={handleAccountCreated}
          />
        )}

        {activeTab === 'spam' && (
          <div className="space-y-8">
            <TrafficMonitor
              packets={packets}
              accounts={accounts}
              onAddPacket={(pkt) => setPackets((prev) => [pkt, ...prev])}
              onUpdatePacket={(updated) =>
                setPackets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
              }
              isPaused={isTrafficPaused}
              setIsPaused={setIsTrafficPaused}
            />
            <SpamDefenseCenter
              rules={rules}
              onUpdateRules={setRules}
              packets={packets}
              onReleaseQuarantined={handleReleaseQuarantined}
              onPurgePacket={handlePurgePacket}
            />
          </div>
        )}

        {activeTab === 'code' && <JavaSourceExplorer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Project 1: Email Application</span>
            <span aria-hidden="true">·</span>
            <span>IT Support Administrator Specialist</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">Java SE 21 Specification</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('brand')}
              className="hover:text-slate-300 transition-colors cursor-pointer text-amber-400/80 hover:text-amber-300"
            >
              Brand Defense
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Email.java
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Interactive Console
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProvisionModal
        isOpen={provisionOpen}
        onClose={() => setProvisionOpen(false)}
        onAccountCreated={handleAccountCreated}
      />

      <ShowInfoModal
        isOpen={!!showInfoTarget}
        onClose={() => setShowInfoTarget(null)}
        account={showInfoTarget}
      />

      <SetMethodsModal
        isOpen={!!setMethodsTarget}
        onClose={() => setSetMethodsTarget(null)}
        account={setMethodsTarget}
        onUpdateAccount={handleUpdateAccount}
      />

      <GetMethodsModal
        isOpen={!!getMethodsTarget}
        onClose={() => setGetMethodsTarget(null)}
        account={getMethodsTarget}
      />

      <DailyActivitySummaryModal
        isOpen={dailySummaryOpen}
        onClose={() => setDailySummaryOpen(false)}
        packets={packets}
      />

      <SpikeInspectionModal
        isOpen={!!inspectingAnomaly}
        onClose={() => setInspectingAnomaly(null)}
        anomaly={inspectingAnomaly}
        account={accounts.find((a) => a.id === inspectingAnomaly?.accountId) || null}
        onUpgradeCapacity={handleUpgradeSpikeCapacity}
        onForcePasswordReset={handleForceSpikePasswordReset}
        onDismissAlert={handleDismissAnomaly}
      />
    </div>
  );
}
