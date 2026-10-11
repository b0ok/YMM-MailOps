import React, { useState } from 'react';
import { X, Check, Copy, Eye, EyeOff, Sliders, ShieldCheck, Mail, Database } from 'lucide-react';
import { EmailAccount } from '../types';

interface ShowInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: EmailAccount | null;
}

export const ShowInfoModal: React.FC<ShowInfoModalProps> = ({ isOpen, onClose, account }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !account) return null;

  const showInfoText = 
`DISPLAY NAME: ${account.firstName} ${account.lastName}
COMPANY EMAIL: ${account.email}
MAILBOX CAPACITY: ${account.mailboxCapacity}mb
ALTERNATE EMAIL: ${account.alternateEmail}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(showInfoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Java method: <code className="text-indigo-400">em1.showInfo()</code>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard Java formatted output for IT Administrator review
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed select-all">
              {showInfoText}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <span className="font-semibold text-slate-300">Java Specification Compliance:</span>
            <ul className="mt-1.5 list-disc list-inside space-y-1 text-slate-400">
              <li>Displays formatted worker Display Name</li>
              <li>Displays synthesized company email address</li>
              <li>Displays configured mailbox capacity in megabytes (mb)</li>
              <li>Displays active alternate email address fallback</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

interface SetMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: EmailAccount | null;
  onUpdateAccount: (updated: EmailAccount, logMsg: string) => void;
}

export const SetMethodsModal: React.FC<SetMethodsModalProps> = ({
  isOpen,
  onClose,
  account,
  onUpdateAccount,
}) => {
  if (!isOpen || !account) return null;

  const [capacity, setCapacity] = useState(account.mailboxCapacity);
  const [altEmail, setAltEmail] = useState(account.alternateEmail === 'None' ? '' : account.alternateEmail);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EmailAccount = {
      ...account,
      mailboxCapacity: capacity,
      alternateEmail: altEmail.trim() || 'None',
      password: newPassword.trim() ? newPassword.trim() : account.password,
    };

    let logMsg = `Applied Java Set Methods on ${account.email}:`;
    if (capacity !== account.mailboxCapacity) {
      logMsg += ` em1.setMailboxCapacity(${capacity});`;
    }
    if (altEmail.trim() !== account.alternateEmail) {
      logMsg += ` em1.setAlternateEmail("${altEmail.trim()}");`;
    }
    if (newPassword.trim()) {
      logMsg += ` em1.changePassword("********");`;
    }

    onUpdateAccount(updated, logMsg);
    setNotice('Java Set methods executed successfully.');
    setTimeout(() => {
      setNotice('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Class Set Methods Inspector
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute <code className="text-indigo-400">setMailboxCapacity()</code>, <code className="text-indigo-400">setAlternateEmail()</code>, <code className="text-indigo-400">changePassword()</code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="p-6 space-y-5">
          {notice && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300">
              {notice}
            </div>
          )}

          {/* Set Mailbox Capacity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Method: <code className="text-indigo-400 font-mono">public void setMailboxCapacity(int capacity)</code>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="100"
                max="10000"
                step="50"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 500)}
                className="w-36 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs text-slate-400">megabytes (mb)</span>
            </div>
          </div>

          {/* Set Alternate Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Method: <code className="text-indigo-400 font-mono">public void setAlternateEmail(String altEmail)</code>
            </label>
            <input
              type="email"
              value={altEmail}
              onChange={(e) => setAltEmail(e.target.value)}
              placeholder="e.g. personal.account@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Change Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Method: <code className="text-indigo-400 font-mono">public void changePassword(String password)</code>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep existing password"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Execute Java Set Methods</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface GetMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: EmailAccount | null;
}

export const GetMethodsModal: React.FC<GetMethodsModalProps> = ({ isOpen, onClose, account }) => {
  const [revealPassword, setRevealPassword] = useState(false);
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Class Get Methods Inspector
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live inspection of Java getter methods
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <span className="text-slate-400 block font-sans text-xs">public String getName()</span>
            <div className="text-white text-sm font-semibold">{account.firstName} {account.lastName}</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <span className="text-slate-400 block font-sans text-xs">public String getEmail()</span>
            <div className="text-indigo-400 text-sm font-semibold">{account.email}</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <span className="text-slate-400 block font-sans text-xs">public int getMailboxCapacity()</span>
            <div className="text-emerald-400 text-sm font-semibold">{account.mailboxCapacity}mb</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <span className="text-slate-400 block font-sans text-xs">public String getAlternateEmail()</span>
            <div className="text-slate-300 text-sm">{account.alternateEmail}</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 block font-sans text-xs">public String getPassword()</span>
              <button
                type="button"
                onClick={() => setRevealPassword(!revealPassword)}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1 font-sans text-xs"
              >
                {revealPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealPassword ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <div className="text-amber-400 text-sm font-semibold">
              {revealPassword ? account.password : '••••••••••••'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
