import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  FileCode,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { EMAIL_JAVA_CODE, EMAIL_APP_JAVA_CODE, SPAM_FILTER_JAVA_CODE } from '../java/sourceCode';

export const JavaSourceExplorer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'Email.java' | 'EmailApp.java' | 'SpamFilterService.java'>('Email.java');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (activeFile === 'Email.java') return EMAIL_JAVA_CODE;
    if (activeFile === 'EmailApp.java') return EMAIL_APP_JAVA_CODE;
    return SPAM_FILTER_JAVA_CODE;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getActiveCode();
    const blob = new Blob([code], { type: 'text/x-java-source;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const codeLines = getActiveCode().split('\n');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            Java OOP Source Code Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete, authentic Java files implementing the IT Support Administrator specification
          </p>
        </div>

        {/* File Tabs & Actions */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1">
            {(['Email.java', 'EmailApp.java', 'SpamFilterService.java'] as const).map((filename) => (
              <button
                key={filename}
                onClick={() => setActiveFile(filename)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                  activeFile === filename
                    ? 'bg-slate-800 text-indigo-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filename}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Copy Source Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            title="Download .java file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .java</span>
          </button>
        </div>
      </div>

      {/* Specification Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Constructor & Department</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            <code className="text-indigo-300 font-mono">public Email(firstName, lastName)</code> queries department code (1=sales, 2=dev, 3=acct, 0=none).
          </p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Random Password & Syntax</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Generates random String password and creates <code className="text-indigo-300 font-mono">firstname.lastname@department.company.com</code>.
          </p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Class Set Methods</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            <code className="text-indigo-300 font-mono">setMailboxCapacity()</code>, <code className="text-indigo-300 font-mono">setAlternateEmail()</code>, <code className="text-indigo-300 font-mono">changePassword()</code>.
          </p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Get Methods & showInfo()</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            <code className="text-indigo-300 font-mono">getName()</code>, <code className="text-indigo-300 font-mono">getEmail()</code>, <code className="text-indigo-300 font-mono">getMailboxCapacity()</code>, and <code className="text-indigo-300 font-mono">showInfo()</code> output.
          </p>
        </div>
      </div>

      {/* Code Editor / Viewer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Editor Tab Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">{activeFile}</span>
            <span className="text-[11px] text-slate-500 font-sans">
              · {codeLines.length} lines · UTF-8
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-sans">
            Ready for compilation with <code className="font-mono">javac</code>
          </span>
        </div>

        {/* Code Viewport with Line Numbers */}
        <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto bg-slate-950">
          <table className="w-full border-collapse">
            <tbody>
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isComment = line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*');
                const isMethod = line.includes('public ') || line.includes('private ');
                return (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="w-12 select-none pr-4 text-right text-slate-600 font-mono text-[11px] tabular-nums">
                      {lineNum}
                    </td>
                    <td
                      className={`whitespace-pre font-mono text-xs ${
                        isComment
                          ? 'text-slate-500 italic'
                          : isMethod
                          ? 'text-indigo-300 font-medium'
                          : line.includes('return ')
                          ? 'text-amber-300'
                          : line.includes('class ') || line.includes('import ')
                          ? 'text-cyan-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {line || ' '}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
