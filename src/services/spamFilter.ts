import { TrafficPacket, SpamRule, AiSpamAnalysis } from '../types';
import { inspectBrandFraud } from './brandProtection';

export const DEFAULT_SPAM_RULES: SpamRule[] = [
  {
    id: 'rule-wire',
    name: 'Wire Transfer / Urgent Payment',
    category: 'KEYWORD',
    pattern: 'wire transfer|urgent payment|swift code|bank transfer required',
    scoreWeight: 3.5,
    description: 'Catches executive impersonation and fraudulent payment requests.',
    enabled: true,
    matchCount: 14,
  },
  {
    id: 'rule-crypto',
    name: 'Crypto / Wallet Verification',
    category: 'KEYWORD',
    pattern: 'bitcoin|usdt|seed phrase|crypto wallet|claim eth|binance reward',
    scoreWeight: 3.0,
    description: 'Flags unsolicited cryptocurrency giveaways and extortion threats.',
    enabled: true,
    matchCount: 8,
  },
  {
    id: 'rule-credentials',
    name: 'Credential Harvesting / Password Expiration',
    category: 'KEYWORD',
    pattern: 'password expires in 24 hours|verify login|account suspended immediately|re-authenticate now',
    scoreWeight: 4.0,
    description: 'Detects fake IT security alerts requesting corporate credentials.',
    enabled: true,
    matchCount: 22,
  },
  {
    id: 'rule-tld',
    name: 'Suspicious Top-Level Domains',
    category: 'HEADER',
    pattern: '\\.(xyz|top|ru|biz|click|fit|gq|cf)$',
    scoreWeight: 2.5,
    description: 'Penalizes domains historically correlated with high spam volumes.',
    enabled: true,
    matchCount: 19,
  },
  {
    id: 'rule-caps',
    name: 'All-Caps Subject Urgency',
    category: 'PATTERN',
    pattern: '^[A-Z0-9\\s!$%]{12,}$',
    scoreWeight: 2.0,
    description: 'Flags shouty, high-pressure subject lines.',
    enabled: true,
    matchCount: 11,
  },
  {
    id: 'rule-prince',
    name: 'Advance-Fee / Inheritance Scam',
    category: 'KEYWORD',
    pattern: 'inheritance fund|barrister|confidential proposal|consignment box|unclaimed lottery',
    scoreWeight: 4.5,
    description: 'Flags classic 419 advance-fee fraud patterns.',
    enabled: true,
    matchCount: 6,
  },
  {
    id: 'rule-brand-lookalike',
    name: 'YMM Brand Impersonation & Lookalike Domains',
    category: 'REPUTATION',
    pattern: 'ymn.com|ymm-auth.top|ymm-billing.xyz|theymm.co|y-mm.com',
    scoreWeight: 5.0,
    description: 'Intercepts registered lookalike domains and typo variants impersonating YMM brand.',
    enabled: true,
    matchCount: 31,
  },
  {
    id: 'rule-vip-spoof',
    name: 'Executive & VIP Display Name Spoofing',
    category: 'HEADER',
    pattern: 'terry nguyen|robert vance|c-suite|chief executive',
    scoreWeight: 5.0,
    description: 'Detects external email addresses attempting to spoof executive leadership names.',
    enabled: true,
    matchCount: 17,
  },
];

export function inspectEmailWithRules(
  sender: string,
  subject: string,
  body: string,
  rules: SpamRule[] = DEFAULT_SPAM_RULES
): {
  isSpam: boolean;
  score: number;
  triggeredRules: string[];
  action: 'DELIVERED' | 'QUARANTINED' | 'BLOCKED';
} {
  let score = 0.0;
  const triggered: string[] = [];
  const textToScan = `${subject} ${body}`.toLowerCase();

  // 1. Dedicated Brand Fraud and Executive Display Spoofing Engine
  const brandFraud = inspectBrandFraud(sender);
  if (brandFraud.isFraudAttempt) {
    score += 5.0;
    triggered.push(`Brand Defense: ${brandFraud.detectedReason || 'Brand spoofing attempt'} (+5.0)`);
  }

  for (const rule of rules) {
    if (!rule.enabled) continue;

    if (rule.category === 'KEYWORD') {
      const keywords = rule.pattern.split('|');
      for (const kw of keywords) {
        if (textToScan.includes(kw.toLowerCase())) {
          score += rule.scoreWeight;
          triggered.push(`${rule.name} (+${rule.scoreWeight})`);
          break;
        }
      }
    } else if (rule.category === 'HEADER') {
      try {
        const regex = new RegExp(rule.pattern, 'i');
        if (regex.test(sender)) {
          score += rule.scoreWeight;
          triggered.push(`${rule.name} (+${rule.scoreWeight})`);
        }
      } catch {
        // ignore regex compilation error
      }
    } else if (rule.category === 'PATTERN') {
      try {
        const regex = new RegExp(rule.pattern);
        if (regex.test(subject.trim())) {
          score += rule.scoreWeight;
          triggered.push(`${rule.name} (+${rule.scoreWeight})`);
        }
      } catch {
        // ignore regex error
      }
    }
  }

  const normalizedScore = Math.min(10.0, Math.round(score * 10) / 10);
  const isSpam = normalizedScore >= 5.0;

  let action: 'DELIVERED' | 'QUARANTINED' | 'BLOCKED' = 'DELIVERED';
  if (normalizedScore >= 7.5) {
    action = 'BLOCKED';
  } else if (normalizedScore >= 5.0) {
    action = 'QUARANTINED';
  }

  return {
    isSpam,
    score: normalizedScore,
    triggeredRules: triggered,
    action,
  };
}

// Initial seed traffic for realistic email administration demo
export const INITIAL_TRAFFIC_PACKETS: TrafficPacket[] = [
  {
    id: 'pkt-101',
    timestamp: '10:48:12',
    sender: 'alex.rivera@salesforce.com',
    recipient: 'michael.scott@sales.aeycompany.com',
    department: 'sales',
    subject: 'Q3 Enterprise Licensing Renewal Quotation',
    body: 'Hi Michael, attached is the revised quotation for 150 enterprise seats with the agreed 15% annual discount.',
    spamScore: 0.5,
    isSpam: false,
    action: 'DELIVERED',
    triggeredRules: [],
    sizeKb: 142,
  },
  {
    id: 'pkt-102',
    timestamp: '10:46:55',
    sender: 'accounts-notice@secure-update-corp.xyz',
    recipient: 'dwight.schrute@dev.aeycompany.com',
    department: 'dev',
    subject: 'CRITICAL ALERT: CORPORATE PASSWORD EXPIRES IN 24 HOURS',
    body: 'Your IT Active Directory password expires immediately. Please verify login at http://portal-auth-check.xyz to prevent disruption.',
    spamScore: 8.5,
    isSpam: true,
    action: 'BLOCKED',
    triggeredRules: [
      'Credential Harvesting / Password Expiration (+4.0)',
      'Suspicious Top-Level Domains (+2.5)',
      'All-Caps Subject Urgency (+2.0)',
    ],
    sizeKb: 34,
  },
  {
    id: 'pkt-103',
    timestamp: '10:45:01',
    sender: 'notifications@github.com',
    recipient: 'pam.beesly@dev.aeycompany.com',
    department: 'dev',
    subject: '[PR #42] Merge feature/auth-jwt into main passed CI pipeline',
    body: 'All 84 unit tests completed successfully. Coverage 96.4%. Ready for code review by department lead.',
    spamScore: 0.2,
    isSpam: false,
    action: 'DELIVERED',
    triggeredRules: [],
    sizeKb: 48,
  },
  {
    id: 'pkt-104',
    timestamp: '10:41:20',
    sender: 'cfo-internal@urgent-payment-desk.top',
    recipient: 'jim.halpert@acct.aeycompany.com',
    department: 'acct',
    subject: 'URGENT WIRE TRANSFER REQUIRED BEFORE 2PM CLOSE',
    body: 'Jim, I am currently traveling in meeting. Need an urgent payment processed via wire transfer to vendor account for acquisition deal.',
    spamScore: 9.0,
    isSpam: true,
    action: 'BLOCKED',
    triggeredRules: [
      'Wire Transfer / Urgent Payment (+3.5)',
      'Suspicious Top-Level Domains (+2.5)',
      'All-Caps Subject Urgency (+2.0)',
    ],
    sizeKb: 28,
  },
  {
    id: 'pkt-105',
    timestamp: '10:39:44',
    sender: 'billing@aws-invoicing.amazon.com',
    recipient: 'angela.martin@acct.aeycompany.com',
    department: 'acct',
    subject: 'Your Amazon Web Services Monthly Tax Invoice #INV-88912',
    body: 'The monthly invoice for cloud compute, storage, and networking is ready for download in your AWS Billing Console.',
    spamScore: 0.8,
    isSpam: false,
    action: 'DELIVERED',
    triggeredRules: [],
    sizeKb: 215,
  },
  {
    id: 'pkt-106',
    timestamp: '10:37:11',
    sender: 'rewards-dept@airdrop-crypto-claims.biz',
    recipient: 'stanley.hudson@aeycompany.com',
    department: 'general',
    subject: 'Claim 2.5 Bitcoin and ETH reward allocation',
    body: 'You have been selected to claim ETH rewards. Enter your crypto wallet address to receive prompt credit.',
    spamScore: 6.0,
    isSpam: true,
    action: 'QUARANTINED',
    triggeredRules: [
      'Crypto / Wallet Verification (+3.0)',
      'Suspicious Top-Level Domains (+2.5)',
    ],
    sizeKb: 52,
  },
];

// Helper to call AI Deep Spam Inspection
export async function analyzeSpamWithAI(email: TrafficPacket): Promise<AiSpamAnalysis> {
  const response = await fetch('/api/analyze-spam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: {
        sender: email.sender,
        recipient: email.recipient,
        subject: email.subject,
        body: email.body,
        heuristicScore: email.spamScore,
        flags: email.triggeredRules,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.details || 'Spam analysis request failed');
  }

  const data = await response.json();
  return {
    ...data.analysis,
    analyzedAt: new Date().toLocaleTimeString(),
    modelUsed: data.modelUsed,
  };
}
