# YMM MailOps

**An enterprise email admin and security operations console for YMM (Young Millionaire Mindset).** It takes the classic Java `Email` OOP exercise and builds a full SOC-style dashboard around it: mailbox provisioning, a weighted spam-scoring engine, brand-impersonation defense, statistical spike detection, and AI threat analysis powered by Gemini.

![React 19](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Vite 8](https://img.shields.io/badge/Vite-8-646cff) ![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Gemini](https://img.shields.io/badge/AI-Gemini-8e75b2)

> 7 workspaces · 15 components · 7 service modules · ~6,800 lines of TypeScript

---

## ✨ Highlights

| | Feature | What it does |
|---|---|---|
| 📬 | **Java OOP mailbox engine** | `JavaEmail` class ports `Email.java` with private fields, getters, setters, and a running method-call log |
| 🛡️ | **Spam scoring engine** | 8 weighted rules (keyword, header-regex, subject-pattern) plus a brand-fraud pre-check, scored 0–10 |
| 🎭 | **Brand & VIP defense** | Catches typosquat, homoglyph, and combo-squat domains, and spoofed executive display names (BEC) |
| 📈 | **Z-score spike detector** | Flags accounts whose inbound volume is a statistical outlier and labels the threat type |
| 🤖 | **AI deep inspection** | Sends a flagged message to Gemini through the server and gets back a structured threat verdict |
| 🏢 | **M365 / Google Workspace ops** | Generates real Microsoft Graph and Admin SDK provisioning payloads, plus an SPF/DKIM/DMARC/BIMI panel |
| 💻 | **In-browser Java terminal** | Runs `EmailApp.java` interactively, then exports the session as an audit report |

---

## 🧠 Under the hood: the key methods

### 1. `JavaEmail`: OOP account lifecycle (`src/services/javaEmail.ts`)

This is a line-for-line port of `Email.java`. All state is private, and every getter and setter writes an entry to the console log, so you can watch encapsulation in action.

```ts
const em1 = new JavaEmail('Terry', 'Nguyen', 2);   // 1=sales, 2=dev, 3=acct, 0=none
em1.getEmail();                 // "terry.nguyen@dev.aeycompany.com"
em1.setMailboxCapacity(1000);
em1.setAlternateEmail('t3@backup.com');
em1.changePassword('********');
em1.showInfo();                 // DISPLAY NAME / COMPANY EMAIL / MAILBOX CAPACITY / ALTERNATE EMAIL
em1.getConsoleLogs();           // full timestamped method-call trail
```

- **Address syntax:** `firstname.lastname@department.company.com`. Names are sanitized, and the department segment is dropped when no department is set.
- **`setDepartment()`** accepts a numeric menu code (`1`/`2`/`3`) or a name (`'sales'`, `'development'`, ...), the same way the Java `Scanner` menu does.
- **`randomPassword(10)`** draws from `A–Z`, `0–9`, and `!@#$%`.

### 2. `inspectEmailWithRules()`: weighted spam scoring (`src/services/spamFilter.ts`)

Each message runs through a brand-fraud check first, then through every enabled rule. Each rule matches in its own way:

| Rule category | Matches against | Example |
|---|---|---|
| `KEYWORD` | subject + body, pipe-separated terms | `wire transfer\|swift code` → **+3.5** |
| `HEADER` | sender, case-insensitive regex | `\.(xyz\|top\|ru\|click)$` → **+2.5** |
| `PATTERN` | raw subject regex | all-caps urgency `^[A-Z0-9\s!$%]{12,}$` → **+2.0** |
| Brand pre-check | sender domain / display name | lookalike or VIP spoof → **+5.0** |

The final score is capped at 10.0, and the action depends on which band it lands in:

```
score < 5.0          → DELIVERED
5.0 ≤ score < 7.5    → QUARANTINED
score ≥ 7.5          → BLOCKED
```

Rules can be toggled, created, and reset to the defaults from the **Spam Defense Center**, and the live traffic feed re-scores new mail against the current rule set.

### 3. `inspectBrandFraud()`: impersonation defense (`src/services/brandProtection.ts`)

- Parses `"Display Name" <address>` senders into a display name and an address.
- **Lookalike watchlist:** `ymn.com` (homoglyph), `y-mm.com` (hyphenated), `theymm.co` (typosquat), `ymm-auth.top` / `ymm-billing.xyz` (combo-squat).
- **Combo-squat heuristic:** flags any `ymm-` / `-ymm` / `ymm.` domain that isn't really `ymm.com` or one of its subdomains.
- **VIP shield:** flags a protected executive's name in the display name when the address comes from outside the company (the classic CEO-fraud / BEC pattern).
- `generateBrandAttackSimulation()` creates a realistic lookalike or CEO-fraud email on demand for live demos.

### 4. `detectTrafficSpikes()`: statistical anomaly detection (`src/services/anomalyDetector.ts`)

```
mean   = packets / accounts
σ      = max(1.2, √variance across accounts)
z      = (observed − mean) / σ
alert  if  z ≥ 1.8  AND  observed ≥ 3  AND  surge ≥ 2.0×
```

Each spike is labeled **SPAM_BOMBING** (≥60% spam), **CREDENTIAL_ATTACK** (dev/acct targets), or **NDR_BACKSCATTER**. It escalates to **CRITICAL** when z ≥ 3.0 or the spam ratio is ≥ 70%. From the inspection modal an admin can respond in one click: expand the quota (`setMailboxCapacity(+500)`), force a credential rotation (`changePassword`), or dismiss the alert.

### 5. `POST /api/analyze-spam`: Gemini threat analyst (`server.ts`)

An Express endpoint sends the message, its heuristic score, and the triggered rules to **Gemini 3.1 Pro** with high thinking enabled and JSON output. If the key doesn't have Pro access, it falls back to **Gemini 3.8 Flash**. The response includes:

```json
{ "classification": "BEC / CEO Fraud", "confidenceScore": 96, "threatLevel": "CRITICAL",
  "recommendedAction": "BLOCK_SENDER", "detectedIndicators": ["..."], "mitigationAdvice": "..." }
```

The API key stays on the server and is never shipped to the browser.

### 6. `generateProviderSyncPayload()`: hybrid mail ops (`src/services/enterpriseMailOps.ts`)

One account can be turned into three provisioning targets:

- **Microsoft 365:** `POST graph.microsoft.com/v1.0/users`, with an E5 license, `forceChangePasswordNextSignIn`, and the quota mapped to `maxReceiveSize`
- **Google Workspace:** `POST admin.googleapis.com/.../users`, with an org-unit path per department and custom schema attributes
- **YMM Native:** a self-hosted Java mail daemon profile

There is also **SCIM-style HR batch sync**, which provisions new hires from an HR roster in one click. The DNS panel covers **SPF, DKIM (2048-bit), DMARC `p=reject`, and BIMI**, plus subdomain reputation isolation (`auth.`, `billing.`, `sales.`).

---

## 🖥️ Workspaces

| Tab | Component | Highlights |
|---|---|---|
| Dashboard | `DashboardOverview`, `TrafficVolumeTrends` | KPI tiles, 24h traffic curve by department, spike alerts, daily activity report |
| Accounts | `AccountDirectory`, `ProvisionModal`, `AccountActionModals` | Mailbox list, quota bars, getter/setter inspector modals |
| Enterprise | `EnterpriseMailOpsHub` | Provider toggle, payload preview, HR batch sync, DNS records |
| Brand | `BrandProtectionHub` | Lookalike watchlist, VIP roster, one-click attack simulation |
| Spam | `SpamDefenseCenter`, `TrafficMonitor` | Rule editor, live feed (new packet every 14s), quarantine release/purge, AI inspect, test-payload injector |
| Terminal | `JavaTerminal` | Interactive `EmailApp` run, copy logs, export audit report (`.txt`) |
| Code | `JavaSourceExplorer` | `Email.java` / `EmailApp.java` with copy and `.java` download |

---

## 🧱 Project structure

```
├── server.ts                    # Express + Vite middleware, Gemini /api/analyze-spam
├── src/
│   ├── App.tsx                  # Root state, live traffic loop, admin action handlers
│   ├── components/              # 15 UI components (see Workspaces)
│   ├── services/
│   │   ├── javaEmail.ts         # JavaEmail OOP class
│   │   ├── spamFilter.ts        # Rule engine + seed traffic + AI client
│   │   ├── brandProtection.ts   # Lookalike / VIP fraud detection
│   │   ├── anomalyDetector.ts   # Z-score spike detection + spam-bomb generator
│   │   ├── enterpriseMailOps.ts # M365 / Workspace payloads, DNS, subdomains, HR roster
│   │   ├── trafficTrendsData.ts # 24h business-hours traffic model
│   │   └── auditLogger.ts       # Audit report export
│   ├── java/sourceCode.ts       # Reference Email.java / EmailApp.java
│   └── types/index.ts           # Shared TypeScript types
```

## 🛠️ Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Recharts · Motion · Lucide · Express · `@google/genai`

## 🚀 Run it locally

```bash
git clone https://github.com/b0ok/YMM-MailOps.git
cd YMM-MailOps
npm install
cp .env.example .env      # add GEMINI_API_KEY to enable AI inspection
npm run dev               # http://localhost:3000
```

`npm run lint` type-checks the project, and `npm run build` creates a production bundle.

> **Note:** This is a demo console. Mail traffic, provider sync, and DNS status are simulated in the browser. The Graph and Admin SDK payloads are real request shapes, but they are not sent anywhere. The only live external call is the Gemini analysis.
