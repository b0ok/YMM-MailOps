import { EmailAccount, MailProviderType, DnsSecurityRecord, SubdomainIsolationRoute } from '../types';

export const DNS_SECURITY_RECORDS: DnsSecurityRecord[] = [
  {
    protocol: 'SPF',
    recordName: 'ymm.com (TXT)',
    rawRecord: 'v=spf1 include:spf.protection.outlook.com include:_spf.google.com ip4:198.51.100.24 ~all',
    status: 'SECURED',
    description: 'Sender Policy Framework: Explicit whitelist of authorized IP relays.',
    antiSpoofingRole: 'Blocks unauthorized servers from emitting forged emails as @ymm.com',
  },
  {
    protocol: 'DKIM',
    recordName: 'ymm2026._domainkey.ymm.com (CNAME)',
    rawRecord: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx4Zq7... (2048-bit RSA Key)',
    status: 'SECURED',
    description: 'DomainKeys Identified Mail: Cryptographic header and body signature validation.',
    antiSpoofingRole: 'Guarantees message contents were not tampered with during transit.',
  },
  {
    protocol: 'DMARC',
    recordName: '_dmarc.ymm.com (TXT)',
    rawRecord: 'v=DMARC1; p=reject; rua=mailto:dmarc-reports@ymm.com; pct=100; sp=reject; adkim=s; aspf=s',
    status: 'SECURED',
    description: 'Strict Rejection Policy (p=reject): Instructs all receiving mail servers to drop unverified mail.',
    antiSpoofingRole: 'Prevents display name and domain impersonation attacks worldwide.',
  },
  {
    protocol: 'BIMI',
    recordName: 'default._bimi.ymm.com (TXT)',
    rawRecord: 'v=BIMI1; l=https://ymm.com/brand/logo-gold.svg; a=https://ymm.com/brand/ymm-vmc.pem',
    status: 'SECURED',
    description: 'Brand Indicators for Message Identification with Verified Mark Certificate (VMC).',
    antiSpoofingRole: 'Displays the official verified YMM emblem inside Apple Mail and Gmail inboxes.',
  },
];

export const SUBDOMAIN_ROUTES: SubdomainIsolationRoute[] = [
  {
    subdomain: 'ymm.com',
    purpose: 'Core Human & Executive Correspondence (Zero bulk traffic permitted)',
    reputationScore: 99.9,
    volume24h: 340,
    ipPoolType: 'INTERNAL_VIP',
    deliverySuccessRate: 99.8,
  },
  {
    subdomain: 'auth.ymm.com',
    purpose: 'Critical Security, MFA Tokens & Password Recovery Dispatches',
    reputationScore: 99.6,
    volume24h: 182,
    ipPoolType: 'DEDICATED',
    deliverySuccessRate: 99.9,
  },
  {
    subdomain: 'billing.ymm.com',
    purpose: 'Itemized Invoices, Accounting Receipts & Payment Confirmations',
    reputationScore: 99.1,
    volume24h: 420,
    ipPoolType: 'DEDICATED',
    deliverySuccessRate: 99.2,
  },
  {
    subdomain: 'sales.ymm.com',
    purpose: 'Outbound Client Quotations, Inquiries & Enterprise Pipeline',
    reputationScore: 98.4,
    volume24h: 680,
    ipPoolType: 'HIGH_VOLUME',
    deliverySuccessRate: 98.9,
  },
];

export function generateProviderSyncPayload(provider: MailProviderType, account: EmailAccount) {
  if (provider === 'MICROSOFT_365') {
    return {
      endpoint: 'POST https://graph.microsoft.com/v1.0/users',
      authMethod: 'OAuth 2.0 Bearer (Azure Entra ID App Token)',
      headers: {
        'Content-Type': 'application/json',
        ConsistencyLevel: 'eventual',
      },
      payload: {
        accountEnabled: true,
        displayName: `${account.firstName} ${account.lastName}`,
        mailNickname: `${account.firstName.toLowerCase()}.${account.lastName.toLowerCase()}`,
        userPrincipalName: account.email,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: account.password,
        },
        department: account.department ? account.department.toUpperCase() : 'GENERAL',
        usageLocation: 'US',
        assignedLicenses: [
          { skuId: 'c7df2760-2c81-4ef7-b578-5b5392b571df (Microsoft 365 E5)' },
        ],
        mailboxSettings: {
          maxReceiveSize: account.mailboxCapacity * 1024 * 1024,
          language: { locale: 'en-US' },
        },
      },
      exchangeStatus: 'Mailbox provisioned on Exchange Online Database cluster US-EAST',
    };
  }

  if (provider === 'GOOGLE_WORKSPACE') {
    return {
      endpoint: 'POST https://admin.googleapis.com/admin/directory/v1/users',
      authMethod: 'OAuth 2.0 Service Account JWT (Google Admin SDK Directory API)',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: {
        primaryEmail: account.email,
        name: {
          givenName: account.firstName,
          familyName: account.lastName,
          fullName: `${account.firstName} ${account.lastName}`,
        },
        password: account.password,
        changePasswordAtNextLogin: true,
        orgUnitPath: `/YMM/${account.department ? account.department.toUpperCase() : 'GENERAL'}`,
        recoveryEmail: account.alternateEmail !== 'None' ? account.alternateEmail : undefined,
        customSchemas: {
          YMM_Attributes: {
            MailboxQuotaMB: account.mailboxCapacity,
            ProvisionedVia: 'Java OOP EmailApp Engine v1.0',
          },
        },
      },
      exchangeStatus: 'Google Workspace Enterprise Plus User Created & Gmail API Filter Active',
    };
  }

  // YMM Native Autonomous
  return {
    endpoint: 'JVM Local IPC / POSIX /var/mail/ymm daemon',
    authMethod: 'Java Internal Object Reference (OOP Memory Instance)',
    headers: {
      'Runtime-Engine': 'OpenJDK 21.0.2 JVM Authoritative',
    },
    payload: {
      javaClass: 'emailapp.Email',
      constructorCall: `new Email("${account.firstName}", "${account.lastName}");`,
      primaryEmail: account.email,
      mailboxCapacityMb: account.mailboxCapacity,
      departmentCode: account.department || 'none',
      alternateEmail: account.alternateEmail,
      isEncryptedAtRest: true,
      storageBackend: 'Local ZFS NVMe Maildir',
    },
    exchangeStatus: 'Autonomous Java Mail Service Running with Zero External Cloud Billing',
  };
}

// Mock HR Roster (e.g. from Workday or Rippling) for 1-Click SCIM Batch Provisioning
export const PENDING_HR_NEW_HIRES = [
  {
    firstName: 'Marcus',
    lastName: 'Vance',
    departmentCode: 1, // Sales
    role: 'Enterprise Account Executive',
    startDate: 'Tomorrow',
  },
  {
    firstName: 'Elena',
    lastName: 'Rostova',
    departmentCode: 2, // Dev
    role: 'Senior Backend Engineer',
    startDate: 'Next Monday',
  },
  {
    firstName: 'David',
    lastName: 'Chen',
    departmentCode: 3, // Acct
    role: 'Financial Operations Analyst',
    startDate: 'Next Monday',
  },
];
