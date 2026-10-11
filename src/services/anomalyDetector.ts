import { EmailAccount, TrafficPacket, TrafficSpikeAnomaly } from '../types';

export function detectTrafficSpikes(
  accounts: EmailAccount[],
  packets: TrafficPacket[]
): TrafficSpikeAnomaly[] {
  const anomalies: TrafficSpikeAnomaly[] = [];

  // Group recent packets by recipient
  const recipientCounts: Record<string, { total: number; spam: number; packets: TrafficPacket[] }> = {};

  packets.forEach((pkt) => {
    const key = pkt.recipient.toLowerCase();
    if (!recipientCounts[key]) {
      recipientCounts[key] = { total: 0, spam: 0, packets: [] };
    }
    recipientCounts[key].total += 1;
    if (pkt.isSpam) {
      recipientCounts[key].spam += 1;
    }
    recipientCounts[key].packets.push(pkt);
  });

  // Calculate baseline mean and standard deviation across accounts
  const totalAcc = Math.max(1, accounts.length);
  const baselineMean = packets.length / totalAcc;
  const variance = accounts.reduce((acc, a) => {
    const count = recipientCounts[a.email.toLowerCase()]?.total || 0;
    return acc + Math.pow(count - baselineMean, 2);
  }, 0) / totalAcc;
  const stdDev = Math.max(1.2, Math.sqrt(variance));

  accounts.forEach((acc) => {
    const stats = recipientCounts[acc.email.toLowerCase()];
    if (!stats) return;

    const observed = stats.total;
    const baselineExpected = Math.max(1, Math.round(baselineMean));
    const zScore = Math.round(((observed - baselineMean) / stdDev) * 10) / 10;
    const surgeMultiplier = Math.round((observed / Math.max(1, baselineExpected)) * 10) / 10;
    const spamRatio = Math.round((stats.spam / Math.max(1, observed)) * 100);

    // Statistically significant condition:
    // Z-Score >= 2.0 (top 2.5% tail) and observed >= 3 packets and surge >= 2.2x
    if (zScore >= 1.8 && observed >= 3 && surgeMultiplier >= 2.0) {
      let threatType: 'SPAM_BOMBING' | 'CREDENTIAL_ATTACK' | 'NDR_BACKSCATTER' = 'SPAM_BOMBING';
      if (spamRatio >= 60) {
        threatType = 'SPAM_BOMBING';
      } else if (acc.department === 'acct' || acc.department === 'dev') {
        threatType = 'CREDENTIAL_ATTACK';
      } else {
        threatType = 'NDR_BACKSCATTER';
      }

      anomalies.push({
        id: `spike-${acc.id}-${observed}`,
        accountId: acc.id,
        accountEmail: acc.email,
        accountName: `${acc.firstName} ${acc.lastName}`,
        timestamp: new Date().toLocaleTimeString(),
        baselineRate: baselineExpected * 4, // converted to hourly rate
        currentRate: observed * 12,
        surgeMultiplier,
        zScore,
        threatType,
        severity: zScore >= 3.0 || spamRatio >= 70 ? 'CRITICAL' : 'WARNING',
        samplePacketsCount: observed,
        spamRatio,
        status: 'ACTIVE',
        detectedAt: new Date().toLocaleTimeString(),
      });
    }
  });

  return anomalies;
}

// Helper to simulate a sudden spam bomb surge against a chosen account
export function generateSpamBombPackets(targetEmail: string): TrafficPacket[] {
  const timestamp = new Date().toLocaleTimeString();
  const subjects = [
    'Subscription confirmation - Newsletter daily update #8812',
    'Verification code request: 489201',
    'Order receipt from partner vendor #9910',
    'Service registration verification link inside',
    'URGENT: Review account terms update immediately',
    'Your password reset token has been generated',
  ];
  const senders = [
    'botnet-relay@mail-cluster-node1.top',
    'automated-dist@bulletproof-vps.xyz',
    'mailer-daemon@compromised-host.ru',
    'no-reply@inbound-flood-relay.click',
    'service@subscription-bomb.xyz',
  ];

  return subjects.map((sub, idx) => ({
    id: `spike-pkt-${Date.now()}-${idx}`,
    timestamp,
    sender: senders[idx % senders.length],
    recipient: targetEmail,
    department: 'sales',
    subject: sub,
    body: 'Automated flood payload simulating mail bombing attack to overwhelm IT spam filters and obscure security alerts.',
    spamScore: 6.5 + (idx % 3),
    isSpam: true,
    action: idx % 2 === 0 ? 'BLOCKED' : 'QUARANTINED',
    triggeredRules: [
      'Suspicious Top-Level Domains (+2.5)',
      'Automated Flood Inbound Velocity (+4.0)',
    ],
    sizeKb: 18 + idx * 4,
  }));
}
