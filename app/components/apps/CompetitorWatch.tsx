"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "./AppLayout";
import { supabase } from "@/lib/supabase";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type Competitor = {
    id: string;
    url: string;
    name: string;
};

type Snapshot = {
    id: string;
    competitor_id: string;
    screenshot_url: string;
    change_detected: boolean;
    category: string;
    description: string;
    impact_score: number;
    created_at: string;
};

export default function CompetitorWatch() {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");
    const [showSlider, setShowSlider] = useState<{ old: string; new: string } | null>(null);
    const [sliderPos, setSliderPos] = useState(50);

    useEffect(() => {
        fetchCompetitors();
    }, []);

    useEffect(() => {
        if (selectedCompetitor) {
            fetchSnapshots(selectedCompetitor.id);
        }
    }, [selectedCompetitor]);

    const fetchCompetitors = async () => {
        const { data } = await supabase.from("competitors").select("*").order("name");
        if (data) {
            setCompetitors(data);
            if (data.length > 0 && !selectedCompetitor) {
                setSelectedCompetitor(data[0]);
            }
        }
    };

    const fetchSnapshots = async (id: string) => {
        setIsLoading(true);
        const { data } = await supabase
            .from("snapshots")
            .select("*")
            .filter("competitor_id", "eq", id)
            .order("created_at", { ascending: false });
        if (data) setSnapshots(data);
        setIsLoading(false);
    };

    const addCompetitor = async () => {
        if (!newUrl || !newName) return;
        const { data, error } = await supabase
            .from("competitors")
            .insert({ url: newUrl, name: newName })
            .select()
            .single();

        if (data) {
            setCompetitors([...competitors, data]);
            setNewUrl("");
            setNewName("");
        }
    };

    const getChartData = () => {
        const last30Days = [...Array(30)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        });

        const counts = last30Days.map(date => {
            return snapshots.filter(s =>
                new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date &&
                s.category === 'Price' && s.change_detected
            ).length;
        });

        return {
            labels: last30Days,
            datasets: [
                {
                    label: "Fréquence des Promos (30j)",
                    data: counts,
                    borderColor: "#0070f3",
                    backgroundColor: "rgba(0, 112, 243, 0.1)",
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    };

    const getBadgeColor = (category: string) => {
        switch (category) {
            case "Price": return "bg-red-500/20 text-red-500 border-red-500/50";
            case "Design": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
            case "Product": return "bg-green-500/20 text-green-500 border-green-500/50";
            default: return "bg-gray-500/20 text-gray-500 border-gray-500/50";
        }
    };

    return (
        <AppLayout
            title="CompetitorWatch // Intelligence Compétitive"
            description="Surveillance automatisée des changements visuels et tarifaires de vos concurrents."
        >
            <div className="flex h-full w-full bg-[var(--app-bg-primary)] overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex flex-col pt-4">
                    <div className="px-4 mb-6">
                        <h3 className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)] mb-4">Mes Concurrents</h3>
                        <div className="space-y-2 mb-4">
                            {competitors.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedCompetitor(c)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all ${selectedCompetitor?.id === c.id ? 'bg-[var(--app-accent)] text-white shadow-lg' : 'text-[var(--app-text-primary)] hover:bg-[var(--app-border)]'}`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-[var(--app-border)]">
                            <input
                                placeholder="Nom"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-[var(--app-bg-primary)] border border-[var(--app-border)] rounded px-3 py-1.5 text-xs mb-2 outline-none focus:border-[var(--app-accent)] transition-colors"
                            />
                            <input
                                placeholder="URL"
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                className="w-full bg-[var(--app-bg-primary)] border border-[var(--app-border)] rounded px-3 py-1.5 text-xs mb-2 outline-none focus:border-[var(--app-accent)] transition-colors"
                            />
                            <button
                                onClick={addCompetitor}
                                className="w-full bg-[var(--app-border)] hover:bg-[var(--app-accent)] hover:text-white text-[var(--app-text-muted)] hover:text-white py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all"
                            >
                                Ajouter URL
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {selectedCompetitor ? (
                        <>
                            {/* Header Stats / Chart */}
                            <div className="p-6 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)]/30 h-64 shrink-0">
                                <div className="h-full">
                                    <Line
                                        data={getChartData()}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } },
                                            scales: {
                                                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 9 } } },
                                                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 9 } } }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                                <h3 className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Timeline d'activité</h3>
                                <div className="relative border-l-2 border-[var(--app-border)] pl-8 ml-4 space-y-12">
                                    {snapshots.map((s, idx) => (
                                        <div key={s.id} className="relative group">
                                            {/* Dot */}
                                            <div className="absolute -left-[41px] top-4 w-4 h-4 rounded-full bg-[var(--app-bg-primary)] border-2 border-[var(--app-accent)] z-10" />

                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-64 h-40 rounded-lg overflow-hidden border border-[var(--app-border)] bg-black/20 relative group">
                                                    <img src={s.screenshot_url} alt="Screenshot" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={() => {
                                                                const prev = snapshots[idx + 1];
                                                                if (prev) setShowSlider({ old: prev.screenshot_url, new: s.screenshot_url });
                                                            }}
                                                            className="px-4 py-2 bg-[var(--app-accent)] text-white rounded-full text-[10px] uppercase font-bold tracking-wider"
                                                        >
                                                            Comparer (Slider)
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-mono text-[var(--app-text-muted)]">
                                                            {new Date(s.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                        {s.change_detected && (
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getBadgeColor(s.category)}`}>
                                                                {s.category} Update
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-sm font-bold text-[var(--app-text-primary)]">
                                                        {s.change_detected ? s.description : "Aucun changement majeur détecté"}
                                                    </h4>
                                                    {s.change_detected && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[9px] uppercase tracking-wider text-[var(--app-text-muted)]">Impact Score:</span>
                                                            {[...Array(5)].map((_, i) => (
                                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < s.impact_score ? 'bg-[var(--app-accent)] shadow-[0_0_5px_var(--app-accent)]' : 'bg-[var(--app-border)]'}`} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-20 space-y-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <span className="text-[10px] uppercase tracking-[0.3em]">Sélectionnez un concurrent</span>
                        </div>
                    )}
                </main>
            </div>

            {/* Comparison Slider Modal */}
            <AnimatePresence>
                {showSlider && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-12"
                    >
                        <button
                            onClick={() => setShowSlider(null)}
                            className="absolute top-8 right-8 text-white/50 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>

                        <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group cursor-col-resize">
                            {/* Old Image (Bottom) */}
                            <img src={showSlider.old} className="absolute inset-0 w-full h-full object-cover" />

                            {/* New Image (Top) */}
                            <div
                                className="absolute inset-0 w-full h-full overflow-hidden"
                                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                            >
                                <img src={showSlider.new} className="absolute inset-0 w-[100vw] h-full object-cover max-w-none" style={{ width: 'calc(100vw * 0.7)' }} />
                            </div>

                            {/* Slider Handle */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-[var(--app-accent)] shadow-[0_0_15px_var(--app-accent)] z-20 pointer-events-none"
                                style={{ left: `${sliderPos}%` }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--app-accent)] border-4 border-black flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                </div>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderPos}
                                onChange={e => setSliderPos(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-col-resize"
                            />

                            {/* Labels */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded text-[9px] uppercase font-bold text-white tracking-widest z-10 border border-white/10">Hierarchy (Old)</div>
                            <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--app-accent)] rounded text-[9px] uppercase font-bold text-white tracking-widest z-10 border border-white/10">Detection (New)</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </AppLayout>
    );
}
