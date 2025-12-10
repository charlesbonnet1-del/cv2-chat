"use client";

import { useState, useEffect } from 'react';

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
  const [company, setCompany] = useState('');
  const [domain, setDomain] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showResults, setShowResults] = useState(false);

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
    setShowResults(true);
    setResults([]);

    const emails = generateEmails(firstName, lastName, domain);
    const newResults: EmailResult[] = [];

    // Initialize with pending status
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
        // Mark remaining as skipped
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
      
      // Update results in real-time
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
      case 'valid': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'accept_all':
      case 'risky': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'invalid':
      case 'disposable':
      case 'error': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'skipped': return 'border-gray-400 bg-gray-50 dark:bg-gray-900/20 opacity-60';
      case 'pending': return 'border-[var(--accent)] bg-[var(--bot-bubble-bg)] animate-pulse';
      default: return 'border-[var(--foreground)]/20 bg-[var(--bot-bubble-bg)]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid': return '✓ VALID';
      case 'accept_all': return '? CATCH-ALL';
      case 'risky': return '⚠ RISKY';
      case 'invalid': return '✗ INVALID';
      case 'disposable': return '✗ DISPOSABLE';
      case 'error': return '✗ ERROR';
      case 'skipped': return '⏭ SKIPPED';
      case 'pending': return '... CHECKING';
      default: return `? ${status.toUpperCase()}`;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-500 text-white';
      case 'accept_all':
      case 'risky': return 'bg-yellow-500 text-black';
      case 'invalid':
      case 'disposable':
      case 'error': return 'bg-red-500 text-white';
      case 'skipped': return 'bg-gray-400 text-white';
      case 'pending': return 'bg-[var(--accent)] text-white';
      default: return 'bg-[var(--foreground)]/50 text-white';
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    alert('Email copied: ' + email);
  };

  const validCount = results.filter(r => r.status === 'valid').length;
  const catchallCount = results.filter(r => r.status === 'accept_all' || r.status === 'risky').length;
  const invalidCount = results.filter(r => !['valid', 'accept_all', 'risky', 'pending', 'skipped'].includes(r.status)).length;

  const bestResult = results.find(r => r.status === 'valid') || results.find(r => r.status === 'accept_all');

  return (
    <div className="min-h-full bg-[var(--background)] font-mono">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--foreground)]">
            Email Finder
          </h1>
          <p className="text-sm text-[var(--foreground)]/70">
            Multi-API email verification cascade
          </p>
        </div>

        {/* Providers Status */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-[var(--bot-bubble-bg)] rounded-xl border border-[var(--foreground)]/10">
          {providers.map((p) => (
            <span
              key={p.name}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                !p.configured ? 'bg-[var(--foreground)]/20 text-[var(--foreground)]/50' :
                p.status.exhausted ? 'bg-red-500 text-white' :
                'bg-green-500 text-white'
              }`}
            >
              {!p.configured ? '○' : p.status.exhausted ? '✗' : '✓'} {p.name}
            </span>
          ))}
        </div>

        {/* Form */}
        <div className="bg-[var(--bot-bubble-bg)] border-2 border-[var(--foreground)]/10 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
                $ FIRST NAME: *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-4 py-3 bg-[var(--background)] border-2 border-[var(--foreground)]/10 rounded-xl text-[var(--foreground)] font-mono outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
                $ LAST NAME: *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-3 bg-[var(--background)] border-2 border-[var(--foreground)]/10 rounded-xl text-[var(--foreground)] font-mono outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
                $ COMPANY: (optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 bg-[var(--background)] border-2 border-[var(--foreground)]/10 rounded-xl text-[var(--foreground)] font-mono outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
                $ DOMAIN: *
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="acme.com"
                className="w-full px-4 py-3 bg-[var(--background)] border-2 border-[var(--foreground)]/10 rounded-xl text-[var(--foreground)] font-mono outline-none focus:border-[var(--accent)] transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && searchEmails()}
              />
            </div>
          </div>

          <button
            onClick={searchEmails}
            disabled={isSearching}
            className="w-full py-4 bg-[var(--accent)] text-white border-none rounded-xl font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isSearching ? '[RUNNING...] VERIFICATION IN PROGRESS' : '[EXEC] >> FIND EMAIL'}
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">&gt; RESULTS.log</h2>
            
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all ${getStatusClass(result.status)} ${
                    bestResult?.email === result.email && result.status === 'valid' ? 'ring-2 ring-green-500 ring-offset-2' : ''
                  }`}
                >
                  {bestResult?.email === result.email && result.status === 'valid' && (
                    <div className="text-xs font-bold text-green-600 mb-2">⭐ BEST RESULT</div>
                  )}
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <span className="font-semibold text-[var(--foreground)] break-all">
                      {result.email}
                      {(result.status === 'valid' || result.status === 'accept_all') && (
                        <button
                          onClick={() => copyEmail(result.email)}
                          className="ml-2 text-xs px-2 py-1 bg-[var(--foreground)]/10 rounded hover:bg-[var(--foreground)]/20 transition-colors"
                        >
                          📋 Copy
                        </button>
                      )}
                    </span>
                    {result.provider && result.provider !== 'none' && result.status !== 'pending' && (
                      <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded">
                        via {result.provider}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(result.status)}`}>
                      {getStatusText(result.status)}
                    </span>
                    {result.score && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--foreground)] text-[var(--background)]">
                        Score: {result.score}/100
                      </span>
                    )}
                  </div>
                  {result.details && result.status !== 'pending' && (
                    <div className="mt-2 text-xs text-[var(--foreground)]/60">
                      // {result.details}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            {!isSearching && results.length > 0 && (
              <div className="mt-6 p-4 bg-[var(--bot-bubble-bg)] rounded-xl">
                <div className="font-semibold mb-2 text-[var(--foreground)]">📊 Summary:</div>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-[var(--foreground)]">{validCount} valid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="text-[var(--foreground)]">{catchallCount} catch-all</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-[var(--foreground)]">{invalidCount} invalid</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Note */}
        <div className="p-4 bg-[var(--bot-bubble-bg)] rounded-xl border border-[var(--foreground)]/10 text-sm text-[var(--foreground)]/70">
          <p>
            <strong>[INFO]</strong> This app uses multiple free APIs in cascade.<br/>
            When one API is exhausted, it automatically switches to the next!<br/><br/>
            ✅ <strong>Valid</strong> = Address exists<br/>
            ⚠️ <strong>Catch-all</strong> = Server accepts all<br/>
            ❌ <strong>Invalid</strong> = Address doesn't exist
          </p>
        </div>
      </div>
    </div>
  );
}
