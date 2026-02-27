"use client";

import { useState } from 'react';

export default function SentimentHeatmap() {
  const [text, setText] = useState("Try our product free for 30 days. Maybe you'll like it. We think it's okay.");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('heatmap');
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error(`Rate limit reached. Try again in ${errorData.remainingTime || '1 hour'}.`);
        }
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const parsed = await response.json();
      setAnalysis(parsed);
      setActiveTab('heatmap');

    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return 'var(--accent)';
    if (sentiment > 0.2) return 'var(--accent)';
    if (sentiment > -0.2) return 'var(--foreground)';
    if (sentiment > -0.5) return 'var(--accent)'; // Standardize risky to accent
    return 'var(--foreground)'; // Fallback to foreground
  };

  const getSentimentBg = (sentiment: number) => {
    if (sentiment > 0.6) return 'bg-[var(--accent)]/10 border-[var(--accent)]/30';
    if (sentiment > 0.2) return 'bg-[var(--accent)]/5 border-[var(--accent)]/20';
    if (sentiment > -0.2) return 'border-[var(--bot-bubble-bg)]';
    if (sentiment > -0.5) return 'bg-[var(--accent)]/5 border-[var(--accent)]/20';
    return 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-[var(--accent)]';
    return 'text-red-600 dark:text-red-400';
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const tabs = [
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'optimized', label: 'Optimized' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <div className="min-h-full bg-[var(--background)]">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--foreground)]">
            Sentiment Heatmap
          </h1>
          <p className="text-sm text-[var(--foreground)]/70">
            AI-powered copy analysis for maximum conversion
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
            <span className="text-xs text-[var(--foreground)]/50">Powered by Claude</span>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-[var(--bot-bubble-bg)] border-2 border-[var(--foreground)]/10 rounded-2xl p-6 mb-6">
          <label className="block text-sm font-semibold mb-3 text-[var(--foreground)]">
            Your Marketing Copy
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-4 bg-[var(--background)] border-2 border-[var(--foreground)]/10 rounded-xl text-sm text-[var(--foreground)] resize-none outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="Paste your headline, CTA, email subject, or landing page copy..."
          />
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={analyzeText}
              disabled={isAnalyzing || !text.trim()}
              className="px-6 py-3 bg-[var(--accent)] text-white border-none rounded-full font-semibold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Analyze Copy
                </>
              )}
            </button>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}
          </div>
          <div className="mt-4 text-xs text-[var(--foreground)]/40">
            💡 Limit: 10 analyses per hour • Identical analyses are cached
          </div>
        </div>

        {/* Results */}
        {analysis && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.overallMetrics.conversionScore)}`}>
                  {analysis.overallMetrics.conversionScore}
                </div>
                <div className="text-xs text-[var(--foreground)]/60 mt-1">Conversion Score</div>
              </div>
              <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.overallMetrics.clarityScore)}`}>
                  {analysis.overallMetrics.clarityScore}
                </div>
                <div className="text-xs text-[var(--foreground)]/60 mt-1">Clarity Score</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-[var(--bot-bubble-bg)] rounded-2xl overflow-hidden">
              <div className="flex border-b border-[var(--foreground)]/10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${activeTab === tab.id
                      ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                      : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Heatmap Tab */}
                {activeTab === 'heatmap' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 p-4 bg-[var(--background)] rounded-xl">
                      {analysis.wordAnalysis.map((word: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded text-sm font-medium"
                          style={{
                            backgroundColor: `${getSentimentColor(word.sentiment)}20`,
                            color: getSentimentColor(word.sentiment),
                            border: `1px solid ${getSentimentColor(word.sentiment)}40`
                          }}
                          title={word.reasoning}
                        >
                          {word.word}
                        </span>
                      ))}
                    </div>
                    <div className="bg-[var(--accent)]/10 rounded-xl p-4">
                      <h4 className="font-semibold mb-2 text-sm text-[var(--accent)]">AI Insights</h4>
                      <ul className="space-y-1 text-sm text-[var(--foreground)]/80">
                        <li>• Tone: {analysis.overallMetrics.emotionalTone}</li>
                        <li>• Urgency: {analysis.overallMetrics.urgencyLevel}</li>
                        <li>• Confidence: {analysis.overallMetrics.confidenceLevel}</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec: any, idx: number) => (
                      <div
                        key={idx}
                        className={`border-l-4 p-4 rounded-r-xl ${rec.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                          rec.type === 'high' ? 'border-[var(--accent)] bg-orange-50 dark:bg-orange-900/20' :
                            'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-[var(--foreground)]">{rec.title}</h4>
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-[var(--accent)] text-white">
                            {rec.impact}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--foreground)]/70 mb-3">{rec.detail}</p>
                        <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--background)] rounded-lg text-sm">
                          <div>
                            <div className="text-xs text-red-500 font-semibold mb-1">BEFORE</div>
                            <div className="line-through text-[var(--foreground)]/60">{rec.before}</div>
                          </div>
                          <div>
                            <div className="text-xs text-green-500 font-semibold mb-1">AFTER</div>
                            <div className="font-medium text-[var(--foreground)]">{rec.after}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optimized Tab */}
                {activeTab === 'optimized' && (
                  <div className="space-y-4">
                    {analysis.optimizedVersions.map((version: any, idx: number) => (
                      <div
                        key={idx}
                        className="border-2 border-[var(--foreground)]/10 rounded-xl p-5 hover:border-[var(--accent)] transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-lg text-[var(--foreground)]">{version.title}</h4>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {version.changes.map((change: string, i: number) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]">
                                  {change}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-[var(--accent)]">{version.score}</div>
                            <div className="text-xs text-[var(--foreground)]/50">Score</div>
                          </div>
                        </div>
                        <div className="bg-[var(--background)] rounded-xl p-4 mb-3">
                          <p className="font-medium text-[var(--foreground)]">{version.text}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(version.text)}
                          className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] bg-transparent border-none cursor-pointer hover:opacity-70"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy to clipboard
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-[var(--foreground)]">
                        Common Patterns in High-Converting Copy
                      </h3>
                      <ul className="space-y-2">
                        {analysis.competitorInsights.commonPatterns.map((pattern: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-[var(--foreground)]/80">
                            <span className="text-[var(--accent)] font-bold">•</span>
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-[var(--foreground)]">
                        Differentiation Opportunities
                      </h3>
                      <ul className="space-y-2">
                        {analysis.competitorInsights.differentiationOpportunities.map((opp: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-[var(--foreground)]/80">
                            <span className="text-green-500 font-bold">✓</span>
                            {opp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
