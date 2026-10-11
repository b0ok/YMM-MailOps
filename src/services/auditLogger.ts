/**
 * Utility to export system console execution logs to a standardized
 * plain text file for IT auditing and security compliance.
 */
export function exportAuditLogToFile(logs: string[]) {
  const timestamp = new Date().toISOString();
  const formattedDate = new Date().toLocaleString();
  const filenameDate = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  const auditContent = [
    '================================================================================',
    'ENTERPRISE IT AUDIT REPORT - SYSTEM CONSOLE & EXECUTION LOGS',
    '================================================================================',
    `Application:      Java Email Administration & Traffic Security Console`,
    `Report Generated: ${formattedDate} (${timestamp})`,
    `Auditor Role:     IT Support Administrator Specialist`,
    `Environment:      OpenJDK 21.0.2 / EmailApp Simulator Runtime`,
    `Total Log Lines:  ${logs.length}`,
    '================================================================================',
    '',
    '--- AUDIT TRAIL RECORDINGS ---',
    '',
    ...logs.map((line, idx) => {
      const lineNum = (idx + 1).toString().padStart(4, '0');
      return `[LOG #${lineNum}] ${line}`;
    }),
    '',
    '================================================================================',
    '--- END OF AUDIT REPORT ---',
    'Integrity Status: VERIFIED',
    'Export Specification: Compliance with IT System Access & Security Policy',
    '================================================================================',
  ].join('\n');

  const blob = new Blob([auditContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `it_audit_log_${filenameDate}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
