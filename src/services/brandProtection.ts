import { LookalikeDomainWatch, VipImpersonationTarget, TrafficPacket } from '../types';

export const INITIAL_LOOKALIKE_DOMAINS: LookalikeDomainWatch[] = [
  {
    id: 'lookalike-1',
    domain: 'ymn.com',
    attackTechnique: 'HOMOGLYPH',
    threatRisk: 'CRITICAL',
    status: 'BLOCKED',
    interceptCount: 38,
    lastInterceptAt: '10:42 AM',
  },
  {
    id: 'lookalike-2',
    domain: 'ymm-auth.top',
    attackTechnique: 'COMBO_SQUAT',
    threatRisk: 'CRITICAL',
    status: 'BLOCKED',
    interceptCount: 29,
    lastInterceptAt: '09:18 AM',
  },
  {
    id: 'lookalike-3',
    domain: 'y-mm.com',
    attackTechnique: 'HYPHENATED',
    threatRisk: 'HIGH',
    status: 'BLOCKED',
    interceptCount: 14,
    lastInterceptAt: 'Yesterday',
  },
  {
    id: 'lookalike-4',
    domain: 'ymm-billing.xyz',
    attackTechnique: 'COMBO_SQUAT',
    threatRisk: 'CRITICAL',
    status: 'BLOCKED',
    interceptCount: 42,
    lastInterceptAt: '08:50 AM',
  },
  {
    id: 'lookalike-5',
    domain: 'theymm.co',
    attackTechnique: 'TYPOSQUAT',
    threatRisk: 'HIGH',
    status: 'BLOCKED',
    interceptCount: 8,
    lastInterceptAt: 'Oct 09',
  },
];

export const INITIAL_VIP_TARGETS: VipImpersonationTarget[] = [
  {
    id: 'vip-1',
    name: 'Terry Nguyen',
    officialEmail: 'terry.nguyen@ymm.com',
    role: 'Founder & Chief Executive Officer',
    priorityLevel: 'VIP_EXECUTIVE',
    protectedSince: '2026-01-01',
  },
  {
    id: 'vip-2',
    name: 'Robert Vance',
    officialEmail: 'robert.vance@acct.ymm.com',
    role: 'Chief Financial Officer / Controller',
    priorityLevel: 'FINANCE_LEAD',
    protectedSince: '2026-01-15',
  },
  {
    id: 'vip-3',
    name: 'John Doe',
    officialEmail: 'john.doe@sales.ymm.com',
    role: 'VP of Commercial Strategy & Sales',
    priorityLevel: 'VIP_EXECUTIVE',
    protectedSince: '2026-02-01',
  },
];

export function inspectBrandFraud(
  senderString: string,
  vips: VipImpersonationTarget[] = INITIAL_VIP_TARGETS,
  lookalikes: LookalikeDomainWatch[] = INITIAL_LOOKALIKE_DOMAINS
): {
  isFraudAttempt: boolean;
  threatType?: 'LOOKALIKE_DOMAIN' | 'EXECUTIVE_IMPERSONATION';
  detectedReason?: string;
} {
  const lower = senderString.toLowerCase();
  
  // Extract email address and display name if formatted as "Name <email>"
  let displayName = '';
  let emailAddress = senderString.toLowerCase();

  if (senderString.includes('<') && senderString.includes('>')) {
    displayName = senderString.substring(0, senderString.indexOf('<')).trim().replace(/"/g, '');
    emailAddress = senderString.substring(senderString.indexOf('<') + 1, senderString.indexOf('>')).trim();
  }

  // 1. Check for Lookalike / Typosquatted Domains
  for (const item of lookalikes) {
    if (emailAddress.endsWith(`@${item.domain.toLowerCase()}`) || emailAddress.includes(item.domain.toLowerCase())) {
      return {
        isFraudAttempt: true,
        threatType: 'LOOKALIKE_DOMAIN',
        detectedReason: `Typosquatted domain detected: '@${item.domain}' targeting YMM brand reputation.`,
      };
    }
  }

  // Generic heuristic for combo-squatted ymm domains
  if (
    (emailAddress.includes('ymm-') || emailAddress.includes('-ymm') || emailAddress.includes('ymm.')) &&
    !emailAddress.endsWith('@ymm.com') &&
    !emailAddress.endsWith('.ymm.com')
  ) {
    return {
      isFraudAttempt: true,
      threatType: 'LOOKALIKE_DOMAIN',
      detectedReason: `Combo-squatting domain detected attempting to impersonate YMM brand.`,
    };
  }

  // 2. Check for VIP Executive Display Name Impersonation
  if (displayName) {
    for (const vip of vips) {
      if (
        displayName.toLowerCase().includes(vip.name.toLowerCase()) &&
        !emailAddress.endsWith('@ymm.com') &&
        !emailAddress.endsWith('.ymm.com')
      ) {
        return {
          isFraudAttempt: true,
          threatType: 'EXECUTIVE_IMPERSONATION',
          detectedReason: `Executive Impersonation Alert: Sender claims to be '${vip.name}' (${vip.role}), but originates from external address '${emailAddress}'.`,
        };
      }
    }
  }

  return { isFraudAttempt: false };
}

export function generateBrandAttackSimulation(
  attackType: 'LOOKALIKE' | 'VIP_IMPERSONATION',
  recipientEmail: string
): TrafficPacket {
  const timestamp = new Date().toLocaleTimeString();

  if (attackType === 'LOOKALIKE') {
    return {
      id: `brand-atk-${Date.now()}`,
      timestamp,
      sender: 'accounts-settlement@ymm-billing.xyz',
      recipient: recipientEmail,
      department: 'acct',
      subject: 'URGENT: YMM Q3 Client Invoicing Banking Details Update',
      body: 'Dear client, please take note that YMM corporate remittance accounts have transitioned to a new treasury wire route. Update accounts payable immediately.',
      spamScore: 9.8,
      isSpam: true,
      action: 'BLOCKED',
      triggeredRules: [
        'Brand Protection: Lookalike Domain @ymm-billing.xyz (+5.0)',
        'Suspicious Top-Level Domains (+2.5)',
        'Wire Transfer / Urgent Payment (+3.5)',
      ],
      sizeKb: 32,
    };
  }

  // VIP Executive Impersonation
  return {
    id: `vip-atk-${Date.now()}`,
    timestamp,
    sender: '"Terry Nguyen (YMM CEO)" <terry.nguyen.personal77@gmail.com>',
    recipient: recipientEmail,
    department: 'sales',
    subject: 'Confidential request - are you at your desk right now?',
    body: 'Hey, I am currently stuck in an executive shareholder briefing with poor reception. Need you to quietly process an urgent wire transfer for an acquisition NDA before 3pm.',
    spamScore: 9.5,
    isSpam: true,
    action: 'BLOCKED',
    triggeredRules: [
      'Brand Protection: Executive Display Name Spoofing: "Terry Nguyen" (+5.0)',
      'Wire Transfer / Urgent Payment (+3.5)',
      'External Sender Impersonating C-Suite (+3.0)',
    ],
    sizeKb: 24,
  };
}
