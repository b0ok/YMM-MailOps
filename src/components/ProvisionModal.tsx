import React, { useState } from 'react';
import { X, Check, KeyRound, Building2, User, Sparkles } from 'lucide-react';
import { JavaEmail } from '../services/javaEmail';
import { EmailAccount } from '../types';

interface ProvisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (account: EmailAccount, javaInstance: JavaEmail) => void;
}

export const ProvisionModal: React.FC<ProvisionModalProps> = ({
  isOpen,
  onClose,
  onAccountCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [departmentCode, setDepartmentCode] = useState<number>(1);
  const [companySuffix, setCompanySuffix] = useState('ymm.com');
  const [customPasswordLength, setCustomPasswordLength] = useState(10);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Real-time preview of the Java syntax generator
  const cleanFirst = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'firstname';
  const cleanLast = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'lastname';
  const deptString =
    departmentCode === 1
      ? 'sales'
      : departmentCode === 2
      ? 'dev'
      : departmentCode === 3
      ? 'acct'
      : '';
  
  const previewEmail = deptString
    ? `${cleanFirst}.${cleanLast}@${deptString}.${companySuffix}`
    : `${cleanFirst}.${cleanLast}@${companySuffix}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide both first and last name for the new hire.');
      return;
    }

    // Invoke the Java Email Constructor
    const javaObj = new JavaEmail(firstName, lastName, departmentCode, companySuffix);
    const raw = javaObj.getRawData();

    const newAccount: EmailAccount = {
      id: `acc-${Date.now()}`,
      firstName: raw.firstName,
      lastName: raw.lastName,
      department: raw.department as any,
      companySuffix: raw.companySuffix,
      email: raw.email,
      password: raw.password,
      mailboxCapacity: raw.mailboxCapacity,
      mailboxUsed: Math.floor(Math.random() * 45) + 10,
      alternateEmail: raw.alternateEmail,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: true,
      totalReceived: 0,
      spamBlocked: 0,
    };

    onAccountCreated(newAccount, javaObj);
    onClose();
    // Reset form
    setFirstName('');
    setLastName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-white">Provision New Hire Account</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Java Constructor · <code className="text-indigo-400">new Email(firstName, lastName)</code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <User className="w-4 h-4 text-slate-600 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <User className="w-4 h-4 text-slate-600 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Department Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Department <span className="text-slate-500 font-normal">(Java setDepartment())</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: 1, label: '1 - Sales', tag: 'sales' },
                { code: 2, label: '2 - Development', tag: 'dev' },
                { code: 3, label: '3 - Accounting', tag: 'acct' },
                { code: 0, label: '0 - None (Blank)', tag: '' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setDepartmentCode(item.code)}
                  className={`flex items-center justify-between p-2.5 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                    departmentCode === item.code
                      ? 'border-indigo-500 bg-indigo-500/10 text-white font-medium'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.tag && (
                    <span className="text-xs text-indigo-400 font-mono">.{item.tag}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Company Domain */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Company Suffix Domain
            </label>
            <div className="relative">
              <input
                type="text"
                value={companySuffix}
                onChange={(e) => setCompanySuffix(e.target.value)}
                placeholder="ymm.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Building2 className="w-4 h-4 text-slate-600 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Live Java Generated Syntax Preview */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Live Java Syntax Generation
              </span>
              <span className="font-mono text-indigo-400">Capacity: 500mb</span>
            </div>
            <div className="font-mono text-xs bg-slate-900/80 p-2.5 rounded border border-slate-800/80 text-emerald-400 break-all select-all">
              {previewEmail}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-amber-400" />
                Random Password (length: 10 chars)
              </span>
              <span>Auto-generated on creation</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/30 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Instantiate Java Email</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
