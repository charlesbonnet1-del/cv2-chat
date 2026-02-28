"use client";

import { useState, useMemo } from 'react';
import AppLayout from "./AppLayout";

type SentimentResult = {
  text: string;
  score: number;
  label: string;
  type: string;
  details?: {
    perspective?: number;
    intensity?: number;
    words?: string[];
  };
};

export default function SentimentHeatmap() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SentimentResult[]>([]);

  const analyzeSentiment = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setResults([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();

      if (data.wordAnalysis) {
        const mappedResults = data.wordAnalysis.map((item: any) => ({
          text: item.word,
          score: (item.sentiment * 2) - 1, // Map 0-1 to -1 to 1 if needed, but let's check what the API meant. 
          // Re-reading route.ts: "sentiment": 0.5. 
          // Let's keep it as is and adjust getColor or map it.
          // The previous getColor (Step 769) used -1 to 1.
          // Let's map 0-1 to -1-1 for consistency with my UI logic.
          label: item.reasoning || item.word,
          type: 'word',
          details: { perspective: item.sentiment }
        }));
        setResults(mappedResults);
      }
    } catch (e) {
      console.error('Failed to analyze sentiment', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getColor = (score: number) => {
    if (score > 0.6) return 'bg-[#0070f3]'; // Positive
    if (score < -0.2) return 'bg-red-500/80'; // Negative
    return 'bg-white/10'; // Neutral
  };

  const averageScore = useMemo(() => {
    if (results.length === 0) return 0;
    return results.reduce((acc, curr) => acc + curr.score, 0) / results.length;
  }, [results]);

  return (
    <AppLayout
      title="Sentiment Heatmap // Linguistic Analysis"
      description="Cartographie vectorielle de la tonalité émotionnelle d'un corpus textuel."
    >
      {/* Left: Input Panel */}
      <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/5">
        <div className="px-4 py-2 border-b border-white/5 bg-[var(--app-bg-secondary)] flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest text-white/20">Input Corpus</span>
        </div>

        <div className="flex-1 flex flex-col p-6 space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text for emotional mapping..."
            className="flex-1 bg-transparent border border-white/5 rounded-md p-4 text-sm resize-none outline-none focus:border-[var(--app-accent)] transition-colors leading-relaxed placeholder:text-white/10"
          />

          <button
            onClick={analyzeSentiment}
            disabled={isAnalyzing || !inputText.trim()}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-4 rounded-md transition-all duration-300 text-xs font-bold uppercase tracking-widest
              ${!isAnalyzing && inputText.trim()
                ? "bg-[var(--app-accent)] text-white hover:bg-[#0060df] shadow-[0_0_20px_rgba(0,112,243,0.2)] active:scale-95"
                : "bg-white/5 text-white/20 cursor-not-allowed"}
            `}
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Corpus...
              </div>
            ) : "[ EXECUTE ] >> Map Sentiment"}
          </button>
        </div>
      </div>

      {/* Right: Visualization Panel */}
      <div className="flex-1 flex flex-col bg-[var(--app-bg-primary)]">
        <div className="px-4 py-2 border-b border-white/5 bg-[var(--app-bg-secondary)] flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest text-white/20">Emotional Heatmap</span>
          {results.length > 0 && (
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest">
              <span className="text-white/40">Density: {results.length} blocks</span>
              <span className={averageScore > 0 ? 'text-[var(--app-accent)]' : 'text-red-400'}>
                Avg: {averageScore.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-8">
          {results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/5 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
              </svg>
              <span className="text-xs uppercase tracking-[0.3em]">No Vector data</span>
            </div>
          ) : (
            <>
              {/* Heatmap Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-sm ${getColor(result.score)} transition-all hover:scale-110 hover:shadow-[0_0_15px_var(--app-accent-glow)] cursor-help`}
                    title={`${result.label}: ${result.score}`}
                  />
                ))}
              </div>

              {/* Detailed Protocol Logs */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold border-b border-white/5 pb-2">Analysis Logs</h4>
                <div className="space-y-2">
                  {results.slice(0, 8).map((result, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded border border-white/5 group">
                      <div className={`w-1 h-8 rounded-full ${getColor(result.score)} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-white/60">{result.type}</span>
                          <span className="text-[9px] text-white/20">{(result.score * 100).toFixed(0)}% Intensity</span>
                        </div>
                        <p className="text-xs text-white/40 italic truncate opacity-60 group-hover:opacity-100 transition-opacity">
                          "{result.text}"
                        </p>
                      </div>
                    </div>
                  ))}
                  {results.length > 8 && (
                    <div className="text-[9px] text-center text-white/10 uppercase tracking-widest">
                      + {results.length - 8} additional segments analyzed
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
