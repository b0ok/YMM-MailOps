import React, { useState } from 'react';
import { Search, Eye, Sliders, FileText, UserPlus, Mail, ShieldAlert, Flame } from 'lucide-react';
import { EmailAccount, TrafficSpikeAnomaly } from '../types';

interface AccountDirectoryProps {
  accounts: EmailAccount[];
  anomalies?: TrafficSpikeAnomaly[];
  onOpenProvision: () => void;
  onShowInfo: (account: EmailAccount) => void;
  onOpenSetters: (account: EmailAccount) => void;
  onOpenGetters: (account: EmailAccount) => void;
  onInspectAnomaly?: (anomaly: TrafficSpikeAnomaly) => void;
}

export const AccountDirectory: React.FC<AccountDirectoryProps> = ({
  accounts,
  anomalies = [],
  onOpenProvision,
  onShowInfo,
  onOpenSetters,
  onOpenGetters,
  onInspectAnomaly,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === 'all' ||
      (departmentFilter === 'none' && acc.department === '') ||
      acc.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Email Accounts Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provisioned new hire accounts managed via Java OOP class methods
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2 pointer-events-none" />
          </div>

          <button
            onClick={onOpenProvision}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Hire</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Accounts' },
          { id: 'sales', label: 'Sales' },
          { id: 'dev', label: 'Development' },
          { id: 'acct', label: 'Accounting' },
          { id: 'none', label: 'No Department (Blank)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDepartmentFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              departmentFilter === tab.id
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* High-density Account Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold">
                <th className="py-3 px-4">Display Name</th>
                <th className="py-3 px-4">Generated Email Syntax</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Mailbox Capacity</th>
                <th className="py-3 px-4">Alternate Email</th>
                <th className="py-3 px-4 text-right">Java Methods Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    No email accounts match the active filter.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const usedPercent = Math.min(
                    100,
                    Math.round((account.mailboxUsed / account.mailboxCapacity) * 100)
                  );
                  const accAnomaly = anomalies.find(
                    (a) =>
                      a.accountId === account.id ||
                      a.accountEmail.toLowerCase() === account.email.toLowerCase()
                  );

                  return (
                    <tr
                      key={account.id}
                      className={`hover:bg-slate-800/40 transition-colors group ${
                        accAnomaly ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-white">
                            {account.firstName} {account.lastName}
                          </div>
                          {accAnomaly && onInspectAnomaly && (
                            <button
                              onClick={() => onInspectAnomaly(accAnomaly)}
                              className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 cursor-pointer hover:bg-amber-500/30"
                              title="Click to inspect traffic spike telemetry"
                            >
                              <Flame className="w-3 h-3 text-amber-400" />
                              <span>SPIKE (+{Math.round((accAnomaly.surgeMultiplier - 1) * 100)}%)</span>
                            </button>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Created {account.createdAt}
                        </div>
                      </td>

                      {/* Email syntax */}
                      <td className="py-3 px-4 font-mono text-indigo-300 select-all whitespace-nowrap">
                        {account.email}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-300">
                          {account.department === 'sales'
                            ? 'Sales'
                            : account.department === 'dev'
                            ? 'Development'
                            : account.department === 'acct'
                            ? 'Accounting'
                            : 'None (blank)'}
                        </span>
                      </td>

                      {/* Mailbox Capacity Gauge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${usedPercent}%` }}
                            />
                          </div>
                          <span className="text-slate-300 font-mono tabular-nums">
                            {account.mailboxCapacity}mb
                          </span>
                        </div>
                      </td>

                      {/* Alternate Email */}
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {account.alternateEmail}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* showInfo() */}
                          <button
                            onClick={() => onShowInfo(account)}
                            title="Execute em1.showInfo()"
                            className="px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>showInfo()</span>
                          </button>

                          {/* Get methods */}
                          <button
                            onClick={() => onOpenGetters(account)}
                            title="Inspect Get Methods (getName, getEmail, getMailboxCapacity, getPassword)"
                            className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Getters</span>
                          </button>

                          {/* Set methods */}
                          <button
                            onClick={() => onOpenSetters(account)}
                            title="Execute Set Methods (setMailboxCapacity, setAlternateEmail, changePassword)"
                            className="px-2 py-1 text-xs text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Setters</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info strip */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Total Accounts: {accounts.length}</span>
            <span aria-hidden="true">·</span>
            <span>Default Capacity: 500mb</span>
            <span aria-hidden="true">·</span>
            <span>Password length: 10 chars</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            emailapp.Email Specification v1.0
          </span>
        </div>
      </div>
    </div>
  );
};
