import { useState, useEffect } from "react";
import AppLayout from "./AppLayout";

type EmailResult = {
  email: string;
  valid: boolean;
  status: string;
  confidence: string;
  details: string;
  provider: string;
  score?: number;
};

type Provider = {
  name: string;
  configured: boolean;
  status: { exhausted: boolean; errorCount: number };
  limit: string | number;
};

const patterns = [
  (f: string, l: string) => `${f}.${l}`,
  (f: string, l: string) => `${f}${l}`,
  (f: string, l: string) => `${f[0]}${l}`,
  (f: string, l: string) => `${f}`,
  (f: string, l: string) => `${l}`,
  (f: string, l: string) => `${f[0]}.${l}`,
  (f: string, l: string) => `${f}-${l}`,
];

function cleanString(str: string): string {
  return str.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, '');
}

function generateEmails(firstName: string, lastName: string, domain: string): string[] {
  const f = cleanString(firstName);
  const l = cleanString(lastName);
  const d = domain.toLowerCase().trim()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '');

  return [...new Set(patterns.map(p => `${p(f, l)}@${d}`))];
}

export default function MailFinder() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [domain, setDomain] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    loadProvidersStatus();
  }, []);

  const loadProvidersStatus = async () => {
    try {
      const response = await fetch('/api/providers-status');
      const data = await response.json();
      setProviders(data);
    } catch (e) {
      console.error('Failed to load providers status', e);
    }
  };

  const verifyEmail = async (email: string): Promise<EmailResult> => {
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await response.json();
    } catch (error) {
      return {
        email,
        valid: false,
        status: 'error',
        confidence: 'low',
        details: 'Connection error',
        provider: 'none'
      };
    }
  };

  const searchEmails = async () => {
    if (!firstName || !lastName || !domain) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    setResults([]);

    const emails = generateEmails(firstName, lastName, domain);
    const newResults: EmailResult[] = [];

    const pendingResults = emails.map(email => ({
      email,
      valid: false,
      status: 'pending',
      confidence: 'low',
      details: 'Checking...',
      provider: 'none'
    }));
    setResults(pendingResults);

    let foundValid = false;

    for (let i = 0; i < emails.length; i++) {
      if (foundValid) {
        newResults.push({
          email: emails[i],
          valid: false,
          status: 'skipped',
          confidence: 'low',
          details: 'Search stopped - valid email found',
          provider: 'none'
        });
        continue;
      }

      const result = await verifyEmail(emails[i]);
      newResults.push(result);

      setResults([...newResults, ...emails.slice(i + 1).map(email => ({
        email,
        valid: false,
        status: 'pending',
        confidence: 'low',
        details: 'Waiting...',
        provider: 'none'
      }))]);

      loadProvidersStatus();

      if (result.status === 'valid') {
        foundValid = true;
      }
    }

    setResults(newResults);
    setIsSearching(false);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'valid': return 'border-green-500/50 text-green-400';
      case 'accept_all':
      case 'risky': return 'border-[var(--app-accent)]/50 text-[var(--app-accent)]';
      case 'invalid':
      case 'disposable':
      case 'error': return 'border-red-500/50 text-red-400';
      case 'skipped': return 'border-white/10 text-white/20';
      case 'pending': return 'border-[var(--app-accent)] animate-pulse text-[var(--app-accent)]';
      default: return 'border-white/10 text-white/40';
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
  };

  return (
    <AppLayout
      title="Mail Finder // Discovery"
      description="Multi-API email verification cascade pour identifier des contacts directs."
    >
      {/* Left: Search Panel */}
      <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[var(--app-border)]">
        <div className="px-4 py-2 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Discovery Parameters</span>
          <div className="flex gap-2">
            {providers.map((p) => (
              <div
                key={p.name}
                className={`w-1.5 h-1.5 rounded-full ${!p.configured ? 'bg-white/10' : p.status.exhausted ? 'bg-red-500' : 'bg-green-500'}`}
                title={`${p.name}: ${!p.configured ? 'Not Configured' : p.status.exhausted ? 'Exhausted' : 'Active'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)] block">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full bg-[var(--app-bg-secondary)] border border-[var(--app-border)] rounded-md px-4 py-2 text-sm outline-none focus:border-[var(--app-accent)] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)] block">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full bg-[var(--app-bg-secondary)] border border-[var(--app-border)] rounded-md px-4 py-2 text-sm outline-none focus:border-[var(--app-accent)] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)] block">Target Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="company.com"
              className="w-full bg-[var(--app-bg-secondary)] border border-[var(--app-border)] rounded-md px-4 py-2 text-sm outline-none focus:border-[var(--app-accent)] transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && searchEmails()}
            />
          </div>

          <button
            onClick={searchEmails}
            disabled={isSearching || !firstName || !lastName || !domain}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-4 rounded-md transition-all duration-300 text-xs font-bold uppercase tracking-widest
              ${!isSearching && firstName && lastName && domain
                ? "bg-[var(--app-accent)] text-white hover:bg-[#0060df] shadow-[0_0_20px_rgba(0,112,243,0.2)] active:scale-95"
                : "bg-[var(--app-bg-secondary)] text-[var(--app-text-muted)] cursor-not-allowed"}
            `}
          >
            {isSearching ? "Verification Cascade Active..." : "[ EXECUTE ] >> Find Email"}
          </button>

          <div className="p-4 bg-[var(--app-bg-secondary)] rounded-md border border-[var(--app-border)] space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-[var(--app-text-dim)] font-bold">Protocol Info</h4>
            <p className="text-[10px] text-[var(--app-text-muted)] leading-relaxed uppercase">
              // Sequential pattern generation<br />
              // Real-time SMTP & API handshake<br />
              // automatic provider failover
            </p>
          </div>
        </div>
      </div>

      {/* Right: Results Panel */}
      <div className="flex-1 flex flex-col bg-[var(--app-bg-primary)]">
        <div className="px-4 py-2 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Discovery Logs</span>
          {results.length > 0 && !isSearching && (
            <span className="text-[9px] text-[var(--app-text-dim)] uppercase tracking-widest">
              {results.filter(r => r.status === 'valid').length} Found
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/5 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-xs uppercase tracking-[0.3em]">No Logs recorded</span>
            </div>
          ) : (
            results.map((result, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 border rounded-md transition-all ${getStatusClass(result.status)} bg-black/20`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold tracking-wider truncate max-w-[200px] md:max-w-none">
                    {result.email}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-60">
                      {result.status.replace('_', ' ')}
                    </span>
                    {result.provider && result.provider !== 'none' && (
                      <span className="text-[8px] px-1 bg-blue-500/20 text-blue-400 rounded">
                        {result.provider}
                      </span>
                    )}
                  </div>
                </div>

                {(result.status === 'valid' || result.status === 'accept_all') && (
                  <button
                    onClick={() => copyEmail(result.email)}
                    className="p-2 hover:bg-white/10 rounded transition-colors text-[var(--app-text-dim)] hover:text-white"
                    title="Copy Email"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
