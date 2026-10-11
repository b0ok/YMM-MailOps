import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Download,
  FileText,
} from 'lucide-react';
import { JavaEmail } from '../services/javaEmail';
import { EmailAccount } from '../types';
import { exportAuditLogToFile } from '../services/auditLogger';

interface JavaTerminalProps {
  logs: string[];
  onClearLogs: () => void;
  onAccountCreated: (account: EmailAccount, javaInstance: JavaEmail) => void;
}

export const JavaTerminal: React.FC<JavaTerminalProps> = ({
  logs,
  onClearLogs,
  onAccountCreated,
}) => {
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Initializing Java Virtual Machine (OpenJDK 21.0.2)...',
    'Compiled: Email.java, EmailApp.java, SpamFilterService.java',
    'Package emailapp loaded successfully.',
    'Ready. Press "Run EmailApp.main()" or execute quick test cases below.',
  ]);
  const [copied, setCopied] = useState(false);
  const [interactiveStep, setInteractiveStep] = useState<number>(0);
  const [tempFirst, setTempFirst] = useState('');
  const [tempLast, setTempLast] = useState('');
  const [userInput, setUserInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const allLogs = [...terminalHistory, ...logs];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allLogs.length, interactiveStep]);

  const addTermLog = (msg: string) => {
    setTerminalHistory((prev) => [...prev, msg]);
  };

  const handleRunEmailApp = () => {
    addTermLog('\n$ java emailapp.EmailApp');
    addTermLog('New worker: John.');
    addTermLog('DEPARTMENT CODES:\n1 for Sales\n2 for Development\n3 for Accounting\n0 for none\nEnter department code: 1');
    
    // Instantiate Java Email
    const em1 = new JavaEmail('John', 'Smith', 1, 'aeycompany.com');
    const raw = em1.getRawData();
    
    addTermLog(`Your password is: ${raw.password}`);
    addTermLog(`Email created: ${raw.email}`);
    
    addTermLog('\n--- DEMONSTRATION OF CLASS SET METHODS ---');
    em1.setMailboxCapacity(1000);
    addTermLog('em1.setMailboxCapacity(1000); // Mailbox capacity upgraded to 1000mb');
    
    em1.setAlternateEmail('jsmith.personal@gmail.com');
    addTermLog('em1.setAlternateEmail("jsmith.personal@gmail.com");');
    
    em1.changePassword('SecurePass#2026!');
    addTermLog('em1.changePassword("SecurePass#2026!"); // Password changed');

    addTermLog('\n--- DEMONSTRATION OF CLASS GET METHODS ---');
    addTermLog(`Get Name: ${em1.getName()}`);
    addTermLog(`Get Email: ${em1.getEmail()}`);
    addTermLog(`Get Mailbox Capacity: ${em1.getMailboxCapacity()}mb`);
    addTermLog(`Get Alternate Email: ${em1.getAlternateEmail()}`);

    addTermLog('\n--- SHOW INFO METHOD OUTPUT ---');
    addTermLog(em1.showInfo());

    // Also register into account directory
    const newAcc: EmailAccount = {
      id: `acc-term-${Date.now()}`,
      firstName: raw.firstName,
      lastName: raw.lastName,
      department: 'sales',
      companySuffix: 'aeycompany.com',
      email: raw.email,
      password: 'SecurePass#2026!',
      mailboxCapacity: 1000,
      mailboxUsed: 85,
      alternateEmail: 'jsmith.personal@gmail.com',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: true,
      totalReceived: 0,
      spamBlocked: 0,
    };
    onAccountCreated(newAcc, em1);
  };

  const startInteractivePrompt = () => {
    setInteractiveStep(1);
    addTermLog('\n$ java emailapp.EmailApp --interactive');
    addTermLog('Enter worker first name:');
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (interactiveStep === 1) {
      setTempFirst(userInput.trim());
      addTermLog(`> ${userInput.trim()}`);
      addTermLog('Enter worker last name:');
      setInteractiveStep(2);
      setUserInput('');
    } else if (interactiveStep === 2) {
      setTempLast(userInput.trim());
      addTermLog(`> ${userInput.trim()}`);
      addTermLog(
        `New worker: ${tempFirst}.\nDEPARTMENT CODES:\n1 for Sales\n2 for Development\n3 for Accounting\n0 for none\nEnter department code (0-3):`
      );
      setInteractiveStep(3);
      setUserInput('');
    } else if (interactiveStep === 3) {
      const depChoice = parseInt(userInput.trim(), 10) || 0;
      addTermLog(`> ${userInput.trim()}`);
      
      const em = new JavaEmail(tempFirst, tempLast, depChoice, 'aeycompany.com');
      const raw = em.getRawData();
      addTermLog(`Your password is: ${raw.password}`);
      addTermLog(`Email created: ${raw.email}`);
      addTermLog('\n--- SHOW INFO METHOD OUTPUT ---');
      addTermLog(em.showInfo());

      const newAcc: EmailAccount = {
        id: `acc-prompt-${Date.now()}`,
        firstName: raw.firstName,
        lastName: raw.lastName,
        department: raw.department as any,
        companySuffix: raw.companySuffix,
        email: raw.email,
        password: raw.password,
        mailboxCapacity: raw.mailboxCapacity,
        mailboxUsed: 15,
        alternateEmail: raw.alternateEmail,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        active: true,
        totalReceived: 0,
        spamBlocked: 0,
      };
      onAccountCreated(newAcc, em);

      setInteractiveStep(0);
      setUserInput('');
    }
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(allLogs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportAuditLog = () => {
    exportAuditLogToFile(allLogs);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar for Terminal */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-indigo-400" />
            Interactive Java Execution Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulates <code className="text-indigo-400">Scanner(System.in)</code>, class constructors, getters, setters, and <code className="text-indigo-400">showInfo()</code>
          </p>
        </div>

        {/* Quick run actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunEmailApp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run EmailApp.main()</span>
          </button>

          <button
            onClick={startInteractivePrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Scanner</span>
          </button>

          <button
            onClick={handleExportAuditLog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Export System Logs to TXT file for IT Audit"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Audit Log (.txt)</span>
          </button>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy Terminal Logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setTerminalHistory(['Terminal reset. OpenJDK 21 ready.']);
              onClearLogs();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear Terminal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono">
        {/* Terminal Title Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-xs text-slate-400 ml-2 font-mono">
              emailapp/EmailApp.class [Java SE 21]
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Standard Output Stream (System.out)
          </span>
        </div>

        {/* Output lines */}
        <div className="p-4 h-[440px] overflow-y-auto text-xs space-y-1 select-text">
          {allLogs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed whitespace-pre-wrap ${
                log.startsWith('DISPLAY NAME:') || log.includes('SHOW INFO')
                  ? 'text-emerald-400 font-bold bg-emerald-950/20 p-2 rounded border border-emerald-900/30 my-1'
                  : log.startsWith('$')
                  ? 'text-indigo-400 font-semibold mt-2'
                  : log.startsWith('>')
                  ? 'text-amber-400 font-semibold'
                  : log.includes('GET METHODS') || log.includes('SET METHODS')
                  ? 'text-cyan-400 font-semibold mt-2'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}

          {/* Interactive input row when user triggered interactive Scanner prompt */}
          {interactiveStep > 0 && (
            <form onSubmit={handleInputSubmit} className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">&gt;</span>
              <input
                type="text"
                autoFocus
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  interactiveStep === 1
                    ? 'Enter first name...'
                    : interactiveStep === 2
                    ? 'Enter last name...'
                    : 'Enter department code: 1 (Sales), 2 (Dev), 3 (Acct), 0 (None)'
                }
                className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-slate-600"
              />
              <button
                type="submit"
                className="px-2 py-0.5 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer"
              >
                Send (Enter)
              </button>
            </form>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
