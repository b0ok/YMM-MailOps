# YMM Enterprise MailOps & Java Administration Suite

> **Enterprise Email Administration, Mailbox Telemetry, and Brand Defense Platform** built around robust **Java Object-Oriented Programming (OOP)** foundations, designed for **YMM (Young Millionaire Mindset)** and scalable enterprise IT teams.

---

## 📌 Repository Description

A repository description is the **short, 1–2 sentence summary displayed under the repository title on GitHub / GitLab / Bitbucket**. It gives developers, recruiters, and stakeholders an immediate grasp of what your software accomplishes and what technologies it leverages.

### Recommended Descriptions for this Repo:

Choose the one that best fits your focus:

* **Enterprise & Security Focus (Recommended):**
  > `Enterprise mail administration & security operations platform for YMM, featuring Java OOP email lifecycle management, live telemetry, brand impersonation defense, and hybrid Microsoft 365 / Google Workspace mail ops.`

* **Software Engineering & OOP Focus:**
  > `Production-grade full-stack implementation of the classic Java EmailApp OOP architecture, complete with an interactive terminal, live mail telemetry, heuristic spam filter, and enterprise IT administration.`

* **Concise / Punchy Tagline:**
  > `Enterprise email administration dashboard & brand protection suite powered by Java OOP architecture, live anomaly detection, and automated provisioning.`

---

## 🚀 Key Features & Modules

### 1. 📬 Mailbox Ops & OOP Account Lifecycle
* **Java Class Foundation**: Complete implementation of the classic `Email.java` specification with strict encapsulation (private fields, validated getters, and setters).
* **Automated Company Syntax**: Generates corporate addresses matching company standard format: `firstname.lastname@department.company.com`.
* **Cryptographic Random Passwords**: 10-character high-entropy alphanumeric password generator adhering to enterprise NIST guidelines.
* **Storage Quota Enforcement**: Dynamic mailbox capacity management (MB) with live visual utilization bars, warning thresholds, and quota expansion.
* **Alternate Address Routing**: Redirection and disaster-recovery backup address bindings.
* **Getters & Setters Auditing**: Direct modal inspectors to test and visualize OOP encapsulation behavior.

### 2. 🏢 Enterprise Infrastructure Hub
* **Multi-Provider Simulation**: Seamless toggle between **Microsoft 365 (Exchange Online / Microsoft Graph)** and **Google Workspace (Gmail API)** environments.
* **SCIM 2.0 HR Batch Sync**: Automated directory synchronization simulating Workday/BambooHR imports with conflict resolution and automated department code mapping.
* **DNS Deliverability Wizard**: One-click DNS inspection and verification tool for:
  - **SPF** (`v=spf1 include:spf.protection.outlook.com -all` / `_spf.google.com`)
  - **DKIM** (2048-bit selector signatures)
  - **DMARC** (`v=DMARC1; p=reject; rua=mailto:...`)
  - **MX** Priority records with high-availability MX fallbacks

### 3. 🛡️ Security & Brand Defense Center
* **Lookalike & Typosquatting Radar**: Continuous defense against deceptive domain variations targeting `ymm.com` (e.g., `@ymn.com`, `@ymm-auth.top`, `@ymm-billing.xyz`, `@y-mm.com`).
* **Executive & VIP Impersonation Shield**: Business Email Compromise (BEC) defense detecting display name spoofing, urgent wire transfers, gift card requests, and payroll divert attempts targeting leadership.
* **Heuristic & AI Spam Filter Engine**: Evaluates inbound traffic against 8+ heuristic rule weights (advance-fee fraud, urgent phishing triggers, failed authentication, raw IPs) with scoring thresholds:
  - `Score < 3.0` ➔ Delivered to Inbox
  - `3.0 ≤ Score < 6.5` ➔ Flagged with Warnings
  - `Score ≥ 6.5` ➔ Quarantined
* **Live Quarantine Vault**: Secure containment area allowing security analysts to inspect packet payloads, inspect raw headers, release falsely flagged mail, or purge malicious payloads.

### 4. 📈 Telemetry & Anomaly Spike Detection
* **24-Hour Traffic Visualizer**: Live volumetric telemetry tracking clean inbound mail, filtered spam, and flagged attacks.
* **Statistical Inbound Spike Detector**: Real-time algorithm monitoring account mail volume. When an account encounters a statistically anomalous surge (Z-score spike), the dashboard automatically triggers visual warning badges and high-priority modals to isolate potential compromised credentials or active spam storms.
* **Audit Trail Export**: One-click CSV log export recording all provisioning events, password rotations, and security incidents.

### 5. 💻 Interactive Java SE Engine & Terminal
* **In-Browser Terminal Simulation**: Interactive CLI simulator executing the compiled `EmailApp.java` program with interactive prompts (`Scanner`), department selection, and real-time output.
* **Source Code Explorer**: Full syntax-highlighted access to production Java reference classes (`Email.java`, `EmailApp.java`), complete with one-click clipboard copying and raw file download.

---

## 🧱 Architecture Overview

```
├── /src
│   ├── /components
│   │   ├── Header.tsx                 # Grouped 4-hub navigation bar & mobile drawer
│   │   ├── DashboardOverview.tsx      # Central KPI metrics, 24h charts & spike alerts
│   │   ├── AccountDirectory.tsx       # Employee mailbox list, quota gauges & actions
│   │   ├── EnterpriseMailOpsHub.tsx   # Microsoft 365 / Google Workspace & DNS wizard
│   │   ├── BrandProtectionHub.tsx     # Typosquats, lookalikes & VIP BEC shields
│   │   ├── SpamFilterView.tsx         # Heuristic rules engine, tester & quarantine vault
│   │   ├── JavaTerminal.tsx           # Interactive simulated Java SE console
│   │   ├── JavaCodeViewer.tsx         # Java OOP source code reference viewer
│   │   ├── SpikeInspectionModal.tsx   # Anomaly spike deep-dive & containment modal
│   │   └── Modals/                    # Encapsulated Getter/Setter inspectors
│   ├── /services
│   │   ├── brandProtection.ts         # Brand defence rules, homoglyphs & blacklist
│   │   ├── spamFilter.ts              # Heuristic scanning & AI inspection engine
│   │   └── geminiService.ts           # Optional generative AI analysis proxy
│   ├── /types
│   │   └── index.ts                   # Unified TypeScript schemas & interfaces
│   ├── App.tsx                        # Root state manager & tab router
│   ├── main.tsx                       # React application entry point
│   └── index.css                      # Tailwind CSS v4 design tokens & fonts
├── index.html                         # Entry HTML with typography & SEO meta
├── metadata.json                      # Application metadata & capabilities
├── package.json                       # Dependencies & build scripts
├── server.ts                          # Full-stack Express & Vite dev proxy
└── vite.config.ts                     # Vite build configuration
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) with dark mode palette |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Charts & Metrics** | [Recharts](https://recharts.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Server / Proxy** | [Express](https://expressjs.com/) via `tsx` |
| **Core Paradigm** | Java SE Object-Oriented Programming (OOP) + Modern Web Full-Stack |

---

## 💻 Local Setup & Development

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ymm-mailops-suite.git
   cd ymm-mailops-suite
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The app will run locally at `http://localhost:3000`.

4. **Verify TypeScript compilation & linting:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## ☕ Classic Java Reference Model

The application mirrors the foundational Java class structure:

```java
package emailapp;

public class Email {
    private String firstName;
    private String lastName;
    private String password;
    private String department;
    private String email;
    private int mailboxCapacity = 500;
    private int defaultPasswordLength = 10;
    private String alternateEmail;
    private String companySuffix = "ymm.com";

    // Constructor to receive first name and last name
    public Email(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = setDepartment();
        this.password = randomPassword(defaultPasswordLength);
        this.email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@" + 
                     (department.isEmpty() ? "" : department + ".") + companySuffix;
    }

    // Encapsulated Getters and Setters
    public void setMailboxCapacity(int capacity) { this.mailboxCapacity = capacity; }
    public void setAlternateEmail(String altEmail) { this.alternateEmail = altEmail; }
    public void changePassword(String password) { this.password = password; }

    public int getMailboxCapacity() { return mailboxCapacity; }
    public String getAlternateEmail() { return alternateEmail; }
    public String getPassword() { return password; }
}
```

---

## 🛡️ Security Best Practices Enforced

1. **Least Privilege & Role-Based Access**: Mailbox capacity and department assignments require verified administrative role.
2. **Strict Encapsulation**: Internal account parameters cannot be modified directly without invoking audited mutators (`setMailboxCapacity`, `setAlternateEmail`, `changePassword`).
3. **Automated Anomaly Detection**: Statistical Z-Score tracking flags compromised accounts before volume flooding affects IP sender reputation.
4. **Proactive Brand Defense**: Defensive domain monitoring stops brand abuse before phishing emails hit customer and employee inboxes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for personal, educational, and commercial purposes.
