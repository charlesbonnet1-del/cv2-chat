"use client";

import { useState, useEffect } from 'react';
import AppLayout from "./AppLayout";

type WordAnalysis = {
  word: string;
  sentiment: number;
  richness: string;
  polysemy: string[];
  issue: string;
  suggestion: string;
  reasoning: string;
};

type MetricSet = {
  conversionScore: number;
  emotionalTone: string;
  urgencyLevel: string;
  clarityScore: number;
  linguisticDensity: string;
};

type Recommendation = {
  type: string;
  title: string;
  impact: string;
  detail: string;
  before: string;
  after: string;
};

type OptimizedVersion = {
  title: string;
  text: string;
  score: number;
  changes: string[];
};

type AnalysisData = {
  wordAnalysis: WordAnalysis[];
  overallMetrics: MetricSet;
  recommendations: Recommendation[];
  optimizedVersions: OptimizedVersion[];
};

export default function SentimentHeatmap() {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [targetGoal, setTargetGoal] = useState('conversion');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const analyzeSentiment = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, targetGoal }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (data && (data.wordAnalysis || data.overallMetrics)) {
        setAnalysis(data);
      } else {
        throw new Error('Invalid analysis format from AI');
      }
    } catch (e) {
      console.error('Failed to analyze sentiment', e);
      setError((e as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getColor = (score: number) => {
    if (score > 0.4) return 'bg-[#0070f3]'; // Positive
    if (score < -0.4) return 'bg-red-500/60'; // Negative
    return 'bg-[var(--app-border)]'; // Neutral
  };

  const getRichnessLabel = (richness: string) => {
    switch (richness?.toLowerCase()) {
      case 'high': return 'text-[var(--app-accent)]';
      case 'medium': return 'text-[var(--app-text-dim)]';
      default: return 'text-[var(--app-text-muted)]';
    }
  };

  return (
    <AppLayout
      title="Sentiment Heatmap // Linguistic Analysis"
      description="Cartographie vectorielle et optimisation sémantique multivariée."
    >
      {/* Left: Input Panel */}
      <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[var(--app-border)] min-h-[400px]">
        <div className="px-4 py-2 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Input Corpus</span>

          <select
            value={targetGoal}
            onChange={(e) => setTargetGoal(e.target.value)}
            className="bg-transparent text-[9px] uppercase tracking-widest text-[var(--app-accent)] outline-none border-none cursor-pointer"
          >
            <option value="conversion" className="bg-[#0a0a0a]">Goal: Conversion</option>
            <option value="branding" className="bg-[#0a0a0a]">Goal: Brand Aura</option>
            <option value="educational" className="bg-[#0a0a0a]">Goal: Clarity</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col p-6 space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your copy for linguistic mapping..."
            className="flex-1 bg-transparent border border-[var(--app-border)] rounded-md p-4 text-sm resize-none outline-none focus:border-[var(--app-accent)] transition-colors leading-relaxed placeholder:text-[var(--app-text-muted)]"
          />

          <button
            onClick={analyzeSentiment}
            disabled={isAnalyzing || !inputText.trim()}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-4 rounded-md transition-all duration-300 text-xs font-bold uppercase tracking-widest
              ${!isAnalyzing && inputText.trim()
                ? "bg-[var(--app-accent)] text-white hover:bg-[#0060df] shadow-[0_0_20px_rgba(0,112,243,0.2)] active:scale-95"
                : "bg-[var(--app-bg-secondary)] text-[var(--app-text-muted)] cursor-not-allowed"}
            `}
          >
            {isAnalyzing ? "Analyzing Vector Depth..." : "[ EXECUTE ANALYSIS ]"}
          </button>
        </div>
      </div>

      {/* Right: Visualization Panel */}
      <div className="flex-1 flex flex-col bg-[var(--app-bg-primary)]">
        <div className="border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex items-center overflow-x-auto no-scrollbar">
          {['map', 'logic', 'suggestions', 'versions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-colors border-r border-[var(--app-border)] whitespace-nowrap ${activeTab === tab ? 'text-[var(--app-accent)] bg-[var(--app-bg-secondary)]' : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-dim)]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-[10px] uppercase tracking-wider flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Error: {error}</span>
            </div>
          )}

          {!analysis ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--app-text-primary)]/5 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
              </svg>
              <span className="text-xs uppercase tracking-[0.3em]">{isAnalyzing ? "Processing Corpus..." : "Awaiting Vector input"}</span>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              {activeTab === 'map' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-[var(--app-bg-secondary)] rounded border border-[var(--app-border)]">
                      <div className="text-[9px] uppercase text-[var(--app-text-muted)] mb-1">Conversion</div>
                      <div className="text-xl font-bold text-[var(--app-accent)]">{analysis.overallMetrics?.conversionScore || 0}%</div>
                    </div>
                    <div className="p-4 bg-[var(--app-bg-secondary)] rounded border border-[var(--app-border)]">
                      <div className="text-[9px] uppercase text-[var(--app-text-muted)] mb-1">Clarity</div>
                      <div className="text-xl font-bold text-[var(--app-text-primary)]/80">{analysis.overallMetrics?.clarityScore || 0}%</div>
                    </div>
                    <div className="p-4 bg-[var(--app-bg-secondary)] rounded border border-[var(--app-border)]">
                      <div className="text-[9px] uppercase text-[var(--app-text-muted)] mb-1">Tone</div>
                      <div className="text-[11px] font-bold text-[var(--app-text-primary)]/80 uppercase">{analysis.overallMetrics?.emotionalTone || 'Neutral'}</div>
                    </div>
                    <div className="p-4 bg-[var(--app-bg-secondary)] rounded border border-[var(--app-border)]">
                      <div className="text-[9px] uppercase text-[var(--app-text-muted)] mb-1">Density</div>
                      <div className="text-[11px] font-bold text-[var(--app-text-primary)]/80 uppercase">{analysis.overallMetrics?.linguisticDensity || 'Normal'}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Vector Heatmap</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.wordAnalysis?.map((word, idx) => (
                        <div
                          key={idx}
                          className={`w-8 h-8 rounded-sm ${getColor(word.sentiment)} transition-all hover:scale-110 cursor-help border border-[var(--app-border)] shadow-sm group relative`}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-50 p-2 bg-black border border-[var(--app-border)] rounded text-[9px] text-[var(--app-text-primary)]/80 backdrop-blur-md">
                            <div className="font-bold border-b border-[var(--app-border)] pb-1 mb-1">{word.word}</div>
                            <div>{word.reasoning}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logic' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Linguistic Protocol</h3>
                  <div className="space-y-2">
                    {analysis.wordAnalysis?.map((word, idx) => (
                      <div key={idx} className="p-4 bg-[var(--app-bg-secondary)] rounded border border-[var(--app-border)] space-y-2 group shadow-sm hover:border-[var(--app-border)] transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[var(--app-text-primary)]/80 uppercase tracking-wider">{word.word}</span>
                          <span className={`text-[9px] uppercase font-bold ${getRichnessLabel(word.richness)}`}>Richness: {word.richness}</span>
                        </div>
                        {word.polysemy && word.polysemy.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {word.polysemy.map((m, i) => (
                              <span key={i} className="text-[8px] bg-[var(--app-bg-secondary)] px-1.5 py-0.5 rounded text-[var(--app-text-dim)] border border-[var(--app-border)] italic">"{m}"</span>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-[var(--app-text-dim)] leading-relaxed">{word.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Actionable Protocols</h3>
                  <div className="space-y-4">
                    {analysis.recommendations?.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-[var(--app-bg-secondary)] rounded border-l-2 border-l-[var(--app-accent)] border-[var(--app-border)] space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-[var(--app-text-primary)]/80 uppercase tracking-widest">{rec.title}</h4>
                          <span className="text-[9px] px-2 py-0.5 bg-[var(--app-accent)]/10 text-[var(--app-accent)] border border-[var(--app-accent)]/20 rounded-full font-bold">{rec.impact}</span>
                        </div>
                        <p className="text-[10px] text-[var(--app-text-dim)] leading-relaxed italic">"{rec.detail}"</p>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="p-2 bg-red-500/5 rounded border border-red-500/10 opacity-60">
                            <div className="text-[8px] uppercase text-red-400 mb-1">Replace</div>
                            <div className="text-[10px] line-through">{rec.before}</div>
                          </div>
                          <div className="p-2 bg-blue-500/5 rounded border border-blue-500/10">
                            <div className="text-[8px] uppercase text-blue-400 mb-1">Adopt</div>
                            <div className="text-[10px] text-[var(--app-text-primary)]/80 font-bold">{rec.after}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'versions' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Targeted Optimizations</h3>
                  {analysis.optimizedVersions?.map((v, idx) => (
                    <div key={idx} className="p-6 bg-[var(--app-bg-secondary)] rounded border border-[var(--app-border)] space-y-4">
                      <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-2">
                        <span className="text-[10px] uppercase font-bold text-[var(--app-accent)]">{v.title}</span>
                        <span className="text-xl font-bold text-[var(--app-text-muted)] font-mono">{v.score}%</span>
                      </div>
                      <p className="text-sm text-[var(--app-text-primary)]/80 leading-relaxed italic font-serif">"{v.text}"</p>
                      <div className="space-y-2">
                        <div className="text-[9px] uppercase text-[var(--app-text-muted)]">Linguistic Shifts:</div>
                        <div className="flex gap-2 flex-wrap">
                          {v.changes?.map((c, i) => (
                            <span key={i} className="text-[8px] bg-[var(--app-bg-secondary)] border border-[var(--app-border)] px-2 py-1 rounded text-[var(--app-text-dim)] text-[var(--app-accent)]">+ {c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
