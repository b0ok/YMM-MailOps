// Run: npm run check — fails if a simulated spam bomb stops raising a spike alert.
import assert from 'node:assert';
import { EmailAccount } from '../types';
import { detectTrafficSpikes, generateSpamBombPackets } from './anomalyDetector';
import { INITIAL_TRAFFIC_PACKETS } from './spamFilter';

const acc = (id: string, email: string): EmailAccount => ({
  id, firstName: id, lastName: 'x', department: 'sales', companySuffix: 'ymm.com', email, password: '',
  mailboxCapacity: 500, mailboxUsed: 0, alternateEmail: 'None', createdAt: '', active: true, totalReceived: 0, spamBlocked: 0,
});
const accounts = ['john.doe@sales.ymm.com', 'alice.zhang@dev.ymm.com', 'robert.vance@acct.ymm.com', 'stanley.hudson@ymm.com'].map((e, i) => acc(`a${i}`, e));

assert.deepStrictEqual(detectTrafficSpikes(accounts, INITIAL_TRAFFIC_PACKETS), [], 'seed traffic alone must not alert');

const spikes = detectTrafficSpikes(accounts, [...generateSpamBombPackets(accounts[0].email), ...INITIAL_TRAFFIC_PACKETS]);
assert.strictEqual(spikes.length, 1, 'one spam bomb on 4 accounts must raise exactly one alert');
assert.strictEqual(spikes[0].accountEmail, accounts[0].email);
assert.strictEqual(spikes[0].threatType, 'SPAM_BOMBING');
console.log('ok', spikes[0].zScore, spikes[0].severity);
