"use client";

import React, { useState, useEffect, useMemo } from "react";
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

    // Admin state
    const [isAdmin, setIsAdmin] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [showAdminModal, setShowAdminModal] = useState(false);

    // Form states
    const [newUrl, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");
    const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [showSlider, setShowSlider] = useState<{ old: string; new: string } | null>(null);
    const [sliderPos, setSliderPos] = useState(50);

    const ADMIN_PASSWORD = "admin"; // Simple password as requested

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
            .eq("competitor_id", id)
            .order("created_at", { ascending: false });
        if (data) setSnapshots(data as Snapshot[]);
        setIsLoading(false);
    };

    const handleAdminLogin = () => {
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";
        if (passwordInput === adminPassword) {
            setIsAdmin(true);
            setShowAdminModal(false);
            setPasswordInput("");
        } else {
            alert("Mot de passe incorrect");
        }
    };

    const addOrUpdateCompetitor = async () => {
        if (!isAdmin) {
            setShowAdminModal(true);
            return;
        }
        if (!newUrl || !newName) return;

        if (editingCompetitor) {
            const { error } = await supabase
                .from("competitors")
                .update({ url: newUrl, name: newName })
                .eq('id', editingCompetitor.id);

            if (!error) {
                setCompetitors(competitors.map(c => c.id === editingCompetitor.id ? { ...c, name: newName, url: newUrl } : c));
                setEditingCompetitor(null);
            }
        } else {
            const { data } = await supabase
                .from("competitors")
                .insert({ url: newUrl, name: newName })
                .select()
                .single();

            if (data) setCompetitors([...competitors, data as Competitor]);
        }
        setNewUrl("");
        setNewName("");
    };

    const deleteCompetitor = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAdmin) {
            setShowAdminModal(true);
            return;
        }
        if (!confirm("Supprimer ce concurrent et tout son historique ?")) return;

        const { error } = await supabase.from("competitors").delete().eq("id", id);
        if (!error) {
            setCompetitors(competitors.filter(c => c.id !== id));
            if (selectedCompetitor?.id === id) setSelectedCompetitor(null);
        }
    };

    const filteredSnapshots = useMemo(() => {
        return snapshots.filter((s: Snapshot) => {
            const matchesSearch = s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.category?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [snapshots, searchQuery, categoryFilter]);

    const getChartData = () => {
        const last30Days = [...Array(30)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        });

        const counts = last30Days.map((date: string) => {
            return snapshots.filter((s: Snapshot) =>
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
                <aside className="w-72 border-r border-[var(--app-border)] bg-[var(--app-bg-secondary)] flex flex-col pt-4">
                    <div className="px-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] uppercase tracking-widest text-[var(--app-text-muted)]">Mes Concurrents</h3>
                            <button
                                onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
                                className={`text-[9px] px-2 py-0.5 rounded border transition-all ${isAdmin ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'text-[var(--app-text-muted)] border-[var(--app-border)]'}`}
                            >
                                {isAdmin ? "ADMIN ON" : "ADMIN OFF"}
                            </button>
                        </div>

                        <div className="space-y-1 mb-6">
                            {competitors.map((c: Competitor) => (
                                <div
                                    key={c.id}
                                    className={`p-2 border rounded-lg bg-[var(--app-bg-secondary)] cursor-pointer transition-all ${selectedCompetitor?.id === c.id ? 'border-[var(--app-accent)] shadow-lg' : 'border-[var(--app-border)] hover:border-[var(--app-accent)]/50'}`}
                                    onClick={() => setSelectedCompetitor(c)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className={`text-xs font-semibold ${selectedCompetitor?.id === c.id ? 'text-[var(--app-accent)]' : 'text-[var(--app-text-primary)]'}`}>{c.name}</h4>
                                            <p className="text-[10px] text-[var(--app-text-muted)] truncate w-32">{c.url}</p>
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation();
                                                        setEditingCompetitor(c);
                                                        setNewName(c.name);
                                                        setNewUrl(c.url);
                                                    }}
                                                    className="p-1 hover:text-[var(--app-accent)]"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                </button>
                                                <button onClick={(e: React.MouseEvent) => deleteCompetitor(c.id, e)} className="p-1 hover:text-red-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-[var(--app-border)] space-y-2">
                            <h4 className="text-[9px] uppercase tracking-tighter text-[var(--app-text-muted)]">{editingCompetitor ? "Modifier" : "Nouveau concurrent"}</h4>
                            <input
                                placeholder="Nom du site"
                                value={newName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                                className="w-full bg-[var(--app-bg-primary)] border border-[var(--app-border)] rounded px-3 py-1.5 text-xs outline-none focus:border-[var(--app-accent)] transition-colors"
                            />
                            <input
                                placeholder="https://..."
                                value={newUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUrl(e.target.value)}
                                className="w-full bg-[var(--app-bg-primary)] border border-[var(--app-border)] rounded px-3 py-1.5 text-xs outline-none focus:border-[var(--app-accent)] transition-colors"
                            />
                            <div className="flex gap-2">
                                {editingCompetitor && (
                                    <button
                                        onClick={() => { setEditingCompetitor(null); setNewName(""); setNewUrl(""); }}
                                        className="flex-1 border border-[var(--app-border)] text-[var(--app-text-muted)] py-1.5 rounded text-[10px] uppercase font-bold tracking-wider"
                                    >
                                        Annuler
                                    </button>
                                )}
                                <button
                                    onClick={addOrUpdateCompetitor}
                                    className="flex-[2] bg-[var(--app-accent)] text-white py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all hover:brightness-110 shadow-lg shadow-[var(--app-accent)]/20"
                                >
                                    {editingCompetitor ? "Mettre à jour" : "Ajouter au suivi"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 p-3 rounded-lg bg-[var(--app-accent)]/5 border border-[var(--app-accent)]/10">
                            <p className="text-[10px] text-[var(--app-text-muted)] leading-relaxed italic">
                                ℹ️ Chaque modification détectée est envoyée instantanément sur votre email avec un rapport d'analyse détaillé.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {selectedCompetitor ? (
                        <>
                            {/* Header Stats / Chart */}
                            <div className="p-6 border-b border-[var(--app-border)] bg-[var(--app-bg-secondary)]/30 h-72 shrink-0">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-bold text-[var(--app-text-primary)]">{selectedCompetitor.name}</h2>
                                        <span className="text-[10px] text-[var(--app-text-muted)] font-mono">{selectedCompetitor.url}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex border border-[var(--app-border)] rounded-md overflow-hidden bg-[var(--app-bg-primary)]">
                                            <input
                                                type="text"
                                                placeholder="Rechercher..."
                                                value={searchQuery}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                                className="bg-transparent px-3 py-1.5 text-xs outline-none w-48 border-r border-[var(--app-border)]"
                                            />
                                            <select
                                                value={categoryFilter}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
                                                className="bg-transparent px-2 py-1.5 text-xs outline-none text-[var(--app-text-muted)] cursor-pointer"
                                            >
                                                <option value="All">Categories (Tous)</option>
                                                <option value="Price">Prix</option>
                                                <option value="Design">Design</option>
                                                <option value="Product">Produit</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-44">
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
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--app-text-muted)]">Historique des Snapshot</h3>
                                    <span className="text-[10px] text-[var(--app-text-muted)]">Resultats: {filteredSnapshots.length}</span>
                                </div>

                                <div className="relative border-l-2 border-[var(--app-border)] pl-8 ml-4 space-y-12">
                                    {filteredSnapshots.map((s: Snapshot, idx: number) => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="relative group"
                                        >
                                            {/* Dot */}
                                            <div className="absolute -left-[41px] top-4 w-4 h-4 rounded-full bg-[var(--app-bg-primary)] border-2 border-[var(--app-accent)] z-10" />

                                            <div className="flex flex-col xl:flex-row gap-8 bg-[var(--app-bg-secondary)]/20 p-4 rounded-xl border border-[var(--app-border)]/50 group-hover:border-[var(--app-accent)]/30 transition-all">
                                                <div className="w-full xl:w-72 h-44 rounded-lg overflow-hidden border border-[var(--app-border)] bg-black/40 relative group/img cursor-pointer shrink-0">
                                                    <img src={s.screenshot_url} alt="Screenshot" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                        <button
                                                            onClick={() => {
                                                                const prev = snapshots[idx + 1];
                                                                if (prev) setShowSlider({ old: prev.screenshot_url, new: s.screenshot_url });
                                                                else alert("Pas de snapshot précédente pour comparer.");
                                                            }}
                                                            className="px-5 py-2.5 bg-white text-black rounded-full text-[10px] uppercase font-black tracking-widest hover:scale-105 transition-transform"
                                                        >
                                                            Visual Diff
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-xs font-mono text-[var(--app-text-muted)] flex items-center gap-1.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                            {new Date(s.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {s.change_detected && (
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getBadgeColor(s.category)}`}>
                                                                {s.category} Update
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h4 className={`text-sm md:text-md font-bold leading-relaxed ${s.change_detected ? 'text-[var(--app-text-primary)]' : 'text-[var(--app-text-muted)]'}`}>
                                                        {s.description || "Scan de routine effectué. Aucun changement détecté."}
                                                    </h4>

                                                    {s.change_detected && (
                                                        <div className="mt-4 pt-4 border-t border-[var(--app-border)]/30 flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[9px] uppercase tracking-wider text-[var(--app-text-muted)] font-black">Impact</span>
                                                                <div className="flex gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <div key={i} className={`w-3 h-1 rounded-sm ${i < s.impact_score ? 'bg-[var(--app-accent)] shadow-[0_0_8px_var(--app-accent)]' : 'bg-[var(--app-border)]'}`} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <button className="text-[10px] underline underline-offset-4 decoration-[var(--app-accent)]/30 hover:text-[var(--app-accent)] transition-colors uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 italic">Voir le rapport email</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
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

            {/* Admin Password Modal */}
            <AnimatePresence>
                {showAdminModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-[var(--app-bg-secondary)] border border-[var(--app-border)] p-8 rounded-2xl max-w-sm w-full shadow-2xl"
                        >
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-center">Accès Administrateur</h3>
                            <p className="text-[10px] text-[var(--app-text-muted)] mb-6 text-center italic">Veuillez entrer le mot de passe pour modifier les concurrents.</p>
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={passwordInput}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordInput(e.target.value)}
                                autoFocus
                                className="w-full bg-[var(--app-bg-primary)] border border-[var(--app-border)] rounded-lg px-4 py-3 text-sm mb-4 outline-none focus:border-[var(--app-accent)] text-center transition-all"
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAdminLogin()}
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setShowAdminModal(false); setPasswordInput(""); }}
                                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--app-border)] text-xs font-bold uppercase tracking-wider"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleAdminLogin}
                                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--app-accent)] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[var(--app-accent)]/30"
                                >
                                    Valider
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Slider Modal */}
            <AnimatePresence>
                {showSlider && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-12"
                    >
                        <button onClick={() => setShowSlider(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>

                        <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] group cursor-col-resize">
                            <img src={showSlider.old} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                                <img src={showSlider.new} className="absolute inset-0 w-full h-full object-cover scale-[1.002]" />
                            </div>

                            <div className="absolute top-0 bottom-0 w-0.5 bg-[var(--app-accent)] shadow-[0_0_20px_var(--app-accent)] z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--app-bg-primary)] border border-[var(--app-accent)] flex items-center justify-center text-[var(--app-accent)] shadow-2xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                                </div>
                            </div>

                            <input type="range" min="0" max="100" value={sliderPos} onChange={e => setSliderPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-col-resize" />

                            <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg text-[10px] uppercase font-black text-white tracking-[0.2em] z-10 border border-white/10 shadow-2xl">Yesterday</div>
                            <div className="absolute bottom-6 right-6 px-4 py-2 bg-[var(--app-accent)] rounded-lg text-[10px] uppercase font-black text-white tracking-[0.2em] z-10 border border-white/10 shadow-2xl">Today</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                input[type=range]::-webkit-slider-thumb { appearance: none; width: 0; height: 0; }
            `}</style>
        </AppLayout>
    );
}
