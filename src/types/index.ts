export interface EmailAccount {
  id: string;
  firstName: string;
  lastName: string;
  department: 'sales' | 'dev' | 'acct' | '';
  companySuffix: string;
  email: string;
  password: string;
  mailboxCapacity: number; // in MB
  mailboxUsed: number;     // in MB
  alternateEmail: string;
  createdAt: string;
  active: boolean;
  totalReceived: number;
  spamBlocked: number;
}

export interface TrafficPacket {
  id: string;
  timestamp: string;
  sender: string;
  recipient: string;
  department: 'sales' | 'dev' | 'acct' | 'general';
  subject: string;
  body: string;
  spamScore: number;
  isSpam: boolean;
  action: 'DELIVERED' | 'QUARANTINED' | 'BLOCKED';
  triggeredRules: string[];
  sizeKb: number;
  aiAnalysis?: AiSpamAnalysis;
}

export interface AiSpamAnalysis {
  classification: string;
  confidenceScore: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: 'QUARANTINE' | 'BLOCK_SENDER' | 'REJECT' | 'DELIVER_WITH_WARNING' | 'RELEASE_SAFE';
  reasoningSummary: string;
  detectedIndicators: string[];
  mitigationAdvice: string;
  analyzedAt: string;
  modelUsed?: string;
}

export interface SpamRule {
  id: string;
  name: string;
  category: 'KEYWORD' | 'PATTERN' | 'HEADER' | 'REPUTATION';
  pattern: string;
  scoreWeight: number;
  description: string;
  enabled: boolean;
  matchCount: number;
}

export interface JavaLogEntry {
  id: string;
  timestamp: string;
  command: string;
  output: string;
  type: 'CONSTRUCTOR' | 'SETTER' | 'GETTER' | 'SHOW_INFO' | 'SPAM_FILTER';
}

export interface TrafficSpikeAnomaly {
  id: string;
  accountId: string;
  accountEmail: string;
  accountName: string;
  timestamp: string;
  baselineRate: number;      // msgs/hr expected
  currentRate: number;       // msgs/hr observed
  surgeMultiplier: number;   // e.g. 4.5x
  zScore: number;            // standard deviations above mean
  threatType: 'SPAM_BOMBING' | 'CREDENTIAL_ATTACK' | 'NDR_BACKSCATTER';
  severity: 'WARNING' | 'CRITICAL';
  samplePacketsCount: number;
  spamRatio: number;         // percentage of spam in the spike
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'ISOLATED';
  detectedAt: string;
}

export type MailProviderType = 'MICROSOFT_365' | 'GOOGLE_WORKSPACE' | 'YMM_NATIVE';

export interface DnsSecurityRecord {
  protocol: 'SPF' | 'DKIM' | 'DMARC' | 'BIMI';
  recordName: string;
  rawRecord: string;
  status: 'VALID' | 'SECURED';
  description: string;
  antiSpoofingRole: string;
}

export interface SubdomainIsolationRoute {
  subdomain: string;
  purpose: string;
  reputationScore: number;
  volume24h: number;
  ipPoolType: 'DEDICATED' | 'HIGH_VOLUME' | 'INTERNAL_VIP';
  deliverySuccessRate: number;
}

export interface LookalikeDomainWatch {
  id: string;
  domain: string;
  attackTechnique: 'HOMOGLYPH' | 'TYPOSQUAT' | 'HYPHENATED' | 'COMBO_SQUAT';
  threatRisk: 'CRITICAL' | 'HIGH';
  status: 'BLOCKED' | 'MONITORED';
  interceptCount: number;
  lastInterceptAt: string;
}

export interface VipImpersonationTarget {
  id: string;
  name: string;
  officialEmail: string;
  role: string;
  priorityLevel: 'VIP_EXECUTIVE' | 'FINANCE_LEAD' | 'IT_ADMIN';
  protectedSince: string;
}



