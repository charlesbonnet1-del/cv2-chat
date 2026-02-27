"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import {
    AnimatedStat,
    Accordion,
    AccordionItem,
    FlipCard,
    Callout,
    StrategyTabs,
    Tab,
    Timeline,
    TimelineMonth,
    TimelineItem,
    DataTable,
    KPIDashboard,
    ImpactCard,
    UnitEconomicsCompare,
    BarChart,
} from "./components";

// ============================================
// ANIMATED COUNTER
// ============================================
function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    useEffect(() => {
        if (!isInView) return;
        let startTime: number;
        const animate = (t: number) => {
            if (!startTime) startTime = t;
            const p = Math.min((t - startTime) / (duration * 1000), 1);
            setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
            if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, value, duration]);
    return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ============================================
// REVEAL ON SCROLL
// ============================================
function RevealOnScroll({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const controls = useAnimation();
    const dirs = { up: { y: 50, x: 0 }, down: { y: -50, x: 0 }, left: { x: 50, y: 0 }, right: { x: -50, y: 0 } };
    useEffect(() => { if (isInView) controls.start({ opacity: 1, x: 0, y: 0 }); }, [isInView, controls]);
    return (
        <motion.div ref={ref} initial={{ opacity: 0, ...dirs[direction] }} animate={controls} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
            {children}
        </motion.div>
    );
}

// ============================================
// GRID BACKGROUND
// ============================================
function GridBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.15 }} />
            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.08 }} />
        </div>
    );
}

// ============================================
// KPI CARD
// ============================================
function KPICard({ value, suffix, prefix, label, delay }: { value: number; suffix?: string; prefix?: string; label: string; delay: number }) {
    return (
        <RevealOnScroll delay={delay}>
            <motion.div className="relative bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-2xl p-6 overflow-hidden group" whileHover={{ scale: 1.02, borderColor: "var(--accent)" }} transition={{ duration: 0.2 }}>
                <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2"><AnimatedCounter value={value} suffix={suffix} prefix={prefix} /></div>
                    <p className="text-[var(--foreground)] opacity-60 text-sm md:text-base">{label}</p>
                </div>
            </motion.div>
        </RevealOnScroll>
    );
}

// ============================================
// COMPARISON TOGGLE
// ============================================
function ComparisonSection() {
    const [activeTab, setActiveTab] = useState<"media" | "nutra">("media");
    const comparisons = [
        { media: "Funnel abonnement presse", nutra: "Funnel subscription D2C Cuure" },
        { media: "Scoring leads (chaud/froid)", nutra: "Scoring prospects (curieux/engagés)" },
        { media: "Churn & rétention abonnés", nutra: "Churn & rétention M2/M3" },
        { media: "LTV / CAC", nutra: "LTV / CAC" },
        { media: "Nurturing email séquentiel", nutra: "Automatisation Klaviyo" },
        { media: "Stratégies d'upsell (basic→premium)", nutra: "Upsell Cuure → Cuure Precision" },
        { media: "Pédagogie éditoriale complexe", nutra: "Pédagogie santé & nutrition" },
        { media: "Vulgarisation sujets techniques", nutra: "Vulgarisation microbiote & biomarqueurs" },
    ];
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
                <div className="bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-full p-1 flex">
                    <button onClick={() => setActiveTab("media")} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === "media" ? "bg-[var(--accent)] text-white" : "text-[var(--foreground)] opacity-60 hover:opacity-100"}`}>Ce que j&apos;ai fait (Média)</button>
                    <button onClick={() => setActiveTab("nutra")} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === "nutra" ? "bg-[var(--accent)] text-white" : "text-[var(--foreground)] opacity-60 hover:opacity-100"}`}>Ce que je ferai (Cuure)</button>
                </div>
            </div>
            <div className="space-y-3">
                {comparisons.map((item, index) => (
                    <motion.div key={index} initial={false} animate={{ x: activeTab === "nutra" ? 10 : 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-lg p-4 hover:border-[var(--accent)]/50 transition-colors">
                        <AnimatePresence mode="wait">
                            <motion.p key={activeTab + index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="text-[var(--foreground)] text-center">
                                {activeTab === "media" ? item.media : item.nutra}
                            </motion.p>
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// TYPEWRITER TEXT
// ============================================
function TypewriterText({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    useEffect(() => {
        if (!isInView) return;
        let i = 0;
        const interval = setInterval(() => { if (i <= text.length) { setDisplayedText(text.slice(0, i)); i++; } else clearInterval(interval); }, 30);
        return () => clearInterval(interval);
    }, [isInView, text]);
    return (
        <div ref={ref}>
            <span>{displayedText}</span>
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-[var(--accent)]">|</motion.span>
        </div>
    );
}

// ============================================
// FLOATING ASSISTANT
// ============================================
function FloatingAssistant() {
    const [message, setMessage] = useState("Bienvenue !");
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            setIsVisible(true);
            if (p < 0.08) setMessage("Bienvenue !");
            else if (p < 0.15) setMessage("Ces chiffres sont réels.");
            else if (p < 0.22) setMessage("Mêmes mécaniques, nouveau terrain.");
            else if (p < 0.35) setMessage("J'ai fait mes devoirs...");
            else if (p < 0.5) setMessage("Des Quick Wins concrets.");
            else if (p < 0.65) setMessage("La vision long terme.");
            else if (p < 0.8) setMessage("Un plan à 12 mois.");
            else if (p < 0.9) setMessage("Data + créativité.");
            else setMessage("Parlons-en !");
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} className="fixed bottom-6 right-6 z-50 hidden md:block">
                    <motion.div key={message} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--bot-bubble-bg)] border border-[var(--accent)] rounded-2xl px-4 py-3 shadow-lg">
                        <p className="text-sm text-[var(--foreground)] whitespace-nowrap font-mono">{message}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ============================================
// SCROLL INDICATOR
// ============================================
function ScrollIndicator() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2 text-[var(--foreground)] opacity-40">
                <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
            </motion.div>
        </motion.div>
    );
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function ScrollProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            setProgress(p);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return <motion.div className="fixed top-0 left-0 h-1 bg-[var(--accent)] z-[100]" style={{ width: `${progress * 100}%` }} />;
}

// ============================================
// MAIN PAGE
// ============================================
export default function CuurePage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden transition-colors duration-300">
            <FloatingAssistant />
            <ScrollProgress />

            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50"><ThemeToggle /></div>

            {/* Back to home */}
            <motion.a href="/" className="fixed top-6 left-6 z-50 text-[var(--foreground)] opacity-50 hover:opacity-100 transition-opacity font-mono text-sm" whileHover={{ x: -3 }}>← Retour</motion.a>

            {/* ============================================ */}
            {/* HERO SECTION */}
            {/* ============================================ */}
            <section className="relative min-h-screen flex items-center justify-center px-6">
                <GridBackground />
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-block mb-6">
                            <span className="text-sm md:text-base font-medium tracking-widest uppercase text-[var(--accent)]">Head of Growth — Candidature 2026</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Pourquoi <span className="text-[var(--accent)]">moi</span><br />pour <span className="text-[var(--accent)]">Cuure</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto">
                            Depuis 2019, je transforme des lecteurs en abonnés.<br />
                            <span className="opacity-100 text-[var(--foreground)]">Prêt à transformer des curieux santé en abonnés fidèles.</span>
                        </p>
                    </motion.div>
                    {/* Animated pill badges */}
                    <motion.div className="flex flex-wrap justify-center gap-3 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                        {["Subscription Economics", "Klaviyo / Segment", "A/B Testing", "Product-Led Growth", "Data-Driven"].map((skill, i) => (
                            <motion.span key={skill} className="px-4 py-2 rounded-full bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 text-sm opacity-60" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.6, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>{skill}</motion.span>
                        ))}
                    </motion.div>
                </div>
                <ScrollIndicator />
            </section>

            {/* ============================================ */}
            {/* RESULTS SECTION */}
            {/* ============================================ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Mes <span className="text-[var(--accent)]">résultats</span></h2>
                        <p className="text-[var(--foreground)] opacity-50 text-center mb-12 max-w-2xl mx-auto">Des chiffres concrets, mesurés, documentés. 8+ ans en subscription economics.</p>
                    </RevealOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <KPICard value={17} prefix="x" label="Croissance parc abonnés en 5 ans" delay={0} />
                        <KPICard value={28} prefix="+" suffix="%" label="Croissance recrutement 2025" delay={0.1} />
                        <KPICard value={107} prefix="+" suffix="%" label="Performance landing pages" delay={0.2} />
                        <KPICard value={21} prefix="+" suffix="%" label="ARPU (revenu par utilisateur)" delay={0.3} />
                        <KPICard value={29} prefix="+" suffix="%" label="Repricing sans churn" delay={0.4} />
                        <RevealOnScroll delay={0.5}>
                            <motion.div className="relative bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-6 flex items-center justify-center h-full" whileHover={{ scale: 1.02 }}>
                                <p className="text-center text-lg"><span className="text-[var(--accent)] font-bold">Et maintenant ?</span><br /><span className="opacity-60">Direction Cuure.</span></p>
                            </motion.div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* COMPARISON SECTION */}
            {/* ============================================ */}
            <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
                <div className="max-w-6xl mx-auto">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Média → Nutraceutique : <span className="text-[var(--accent)]">mêmes mécaniques</span></h2>
                        <p className="text-[var(--foreground)] opacity-50 text-center mb-4 max-w-2xl mx-auto">Le produit change, les fondamentaux restent. Acquisition, conversion, rétention.</p>
                        <p className="text-[var(--foreground)] opacity-70 text-center mb-12 max-w-2xl mx-auto text-sm">
                            <strong>La nutrition personnalisée est un défi éditorial :</strong> vulgariser des sujets complexes (microbiote, biomarqueurs), séquencer l&apos;information, accompagner la montée en compétence. C&apos;est exactement ce que je fais depuis 6+ ans dans les médias.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.2}><ComparisonSection /></RevealOnScroll>
                </div>
            </section>

            {/* ============================================ */}
            {/* STRATEGY SECTION HEADER */}
            {/* ============================================ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">Mon plan de croissance pour <span className="text-[var(--accent)]">Cuure</span></h2>
                        <p className="text-[var(--foreground)] opacity-60 text-center mb-12 max-w-3xl mx-auto text-lg">
                            J&apos;ai analysé votre marché, vos concurrents, vos avis Trustpilot et votre stack technique.<br />Voici ce que j&apos;ai compris — et ce que je propose.
                        </p>
                    </RevealOnScroll>

                    {/* Market Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <AnimatedStat value="2.9" suffix=" Mds€" label="Marché FR compléments alimentaires 2025" highlight />
                        <AnimatedStat value="30.9" suffix=" Mds$" label="Nutrition personnalisée mondiale 2030" />
                        <AnimatedStat value="14.4" suffix="%" label="CAGR projeté du marché" highlight />
                    </div>

                    {/* ============================================ */}
                    {/* DIAGNOSTIC MARCHÉ */}
                    {/* ============================================ */}
                    <RevealOnScroll><h3 className="text-2xl font-bold mb-6">1. Contexte : où en est Cuure ?</h3></RevealOnScroll>

                    {/* Cuure Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <AnimatedStat value="15" suffix="M€" label="CA estimé 2025" highlight />
                        <AnimatedStat value={93} suffix="K" label="Abonnés actifs" />
                        <AnimatedStat value={56} label="NPS (moy. secteur: 30)" highlight />
                        <AnimatedStat value={5} label="Pays européens" />
                    </div>

                    <Accordion>
                        <AccordionItem title="📊 Positionnement compétitif" defaultOpen={true}>
                            <DataTable
                                headers={["Prix d'entrée", "Base scientifique", "Friction", "Personnalisation", "Scalabilité"]}
                                dataKeys={["price", "science", "friction", "perso", "scale"]}
                                rows={[
                                    { name: "Cuure", highlight: true, data: { price: "~35€/mois", science: "Déclaratif (Quiz)", friction: "Nulle ✅", perso: "Forte", scale: "Très forte" } },
                                    { name: "Zoe", data: { price: "200€+", science: "Biologique (CGM)", friction: "Haute ❌", perso: "Très forte", scale: "Faible" } },
                                    { name: "Vitl", data: { price: "Variable", science: "Mixte (ADN)", friction: "Moyenne", perso: "Moyenne", scale: "Moyenne" } },
                                ]}
                            />
                            <Callout type="insight">
                                <strong>Ma lecture :</strong> Cuure a le meilleur ratio accessibilité/personnalisation du marché. Le défi n&apos;est pas le produit — c&apos;est le <strong>funnel de conversion</strong> et le <strong>referral</strong>. Et c&apos;est exactement ce que je sais faire.
                            </Callout>
                        </AccordionItem>

                        <AccordionItem title="⚠️ Frictions identifiées (Trustpilot / App Store)">
                            <div className="space-y-3">
                                {[
                                    { issue: "Confusion abonnement vs achat unique", impact: "Avis négatifs récurrents, churn M2 élevé" },
                                    { issue: "Bug Apple Pay (adresse écrasée)", impact: "Erreurs d'expédition, frustration client" },
                                    { issue: "Absence de confirmation d'engagement", impact: "Sentiment de tromperie au 2ème prélèvement" },
                                    { issue: "Pas de programme referral structuré", impact: "NPS 56 non capitalisé → acquisition organique faible" },
                                ].map((item, i) => (
                                    <motion.div key={i} className="flex items-start gap-3 bg-[var(--bot-bubble-bg)] rounded-lg p-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                        <span className="text-red-400 mt-0.5 shrink-0">●</span>
                                        <div>
                                            <strong>{item.issue}</strong>
                                            <p className="text-sm opacity-60">{item.impact}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <Callout type="action">
                                Ces frictions sont <strong>des opportunités immédiates</strong>. Chacune a une solution concrète que je détaille dans mon plan ci-dessous.
                            </Callout>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* ============================================ */}
            {/* SWOT */}
            {/* ============================================ */}
            <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
                <div className="max-w-6xl mx-auto">
                    <RevealOnScroll><h3 className="text-2xl font-bold mb-8">2. Analyse SWOT de Cuure</h3></RevealOnScroll>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FlipCard
                            front={<div className="text-center"><div className="text-4xl mb-4">🛡️</div><h3 className="text-xl font-bold mb-2">Forces</h3><p className="opacity-60">5 avantages concurrentiels</p></div>}
                            back={
                                <ul className="space-y-3 text-sm">
                                    <li><strong className="text-[var(--accent)]">Quiz 5 min + algo</strong> — Personnalisation sans friction</li>
                                    <li><strong className="text-[var(--accent)]">NPS 56</strong> — Exceptionnel pour du D2C subscription</li>
                                    <li><strong className="text-[var(--accent)]">Stack Bubble.io</strong> — Agilité supérieure aux concurrents</li>
                                    <li><strong className="text-[var(--accent)]">FS-3B (Tribiotique)</strong> — Innovation propriétaire brevetée</li>
                                    <li><strong className="text-[var(--accent)]">Sachets personnalisés</strong> — Branding premium, engagement visuel</li>
                                </ul>
                            }
                        />
                        <FlipCard
                            front={<div className="text-center"><div className="text-4xl mb-4">🚀</div><h3 className="text-xl font-bold mb-2">Opportunités</h3><p className="opacity-60">4 leviers de croissance</p></div>}
                            back={
                                <ul className="space-y-3 text-sm">
                                    <li><strong className="text-green-400">Referral inexploité</strong> — 60%+ de promoteurs actifs, 0 programme structuré</li>
                                    <li><strong className="text-green-400">Expansion biologique</strong> — Biomarqueurs réels = pricing premium (x2.5 ARPU)</li>
                                    <li><strong className="text-green-400">GEO (IA générative)</strong> — 95% des users d&apos;IA utilisent aussi Google, taux de conv ~7%</li>
                                    <li><strong className="text-green-400">Expansion EU</strong> — Allemagne et Pays-Bas, marchés sous-pénétrés</li>
                                </ul>
                            }
                        />
                        <FlipCard
                            front={<div className="text-center"><div className="text-4xl mb-4">🔄</div><h3 className="text-xl font-bold mb-2">Faiblesses à résoudre</h3><p className="opacity-60">4 frictions identifiées</p></div>}
                            back={
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-2"><span className="opacity-40 line-through">&quot;Abonnement caché&quot;</span><span className="text-[var(--accent)]">→</span><span className="text-[var(--accent)]">&quot;Transparence proactive&quot;</span></div>
                                    <div className="flex items-center gap-2"><span className="opacity-40 line-through">&quot;Bug Apple Pay&quot;</span><span className="text-[var(--accent)]">→</span><span className="text-[var(--accent)]">&quot;Fix workflow Bubble 2-3j&quot;</span></div>
                                    <div className="flex items-center gap-2"><span className="opacity-40 line-through">&quot;Test déclaratif seulement&quot;</span><span className="text-[var(--accent)]">→</span><span className="text-[var(--accent)]">&quot;Hybridation biomarqueurs&quot;</span></div>
                                    <div className="flex items-center gap-2"><span className="opacity-40 line-through">&quot;Pas de referral&quot;</span><span className="text-[var(--accent)]">→</span><span className="text-[var(--accent)]">&quot;Programme gamifié Dropbox-like&quot;</span></div>
                                </div>
                            }
                        />
                        <FlipCard
                            front={<div className="text-center"><div className="text-4xl mb-4">⚡</div><h3 className="text-xl font-bold mb-2">Menaces</h3><p className="opacity-60">3 risques à anticiper</p></div>}
                            back={
                                <ul className="space-y-3 text-sm">
                                    <li><strong className="text-red-400">Zoe et le premium</strong> — Approche biologique crédibilise la &quot;deep science&quot;</li>
                                    <li><strong className="text-red-400">Régulation EU</strong> — Disparités de dosages autorisés entre pays</li>
                                    <li><strong className="text-red-400">Fatigue subscription</strong> — Le consommateur est sur-sollicité → différenciation par la valeur</li>
                                </ul>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* 3 AXES STRATÉGIQUES */}
            {/* ============================================ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <RevealOnScroll>
                        <h3 className="text-2xl font-bold mb-2">3. Le Plan en 3 Mouvements</h3>
                        <p className="opacity-60 mb-8">2 Quick Wins opérationnels + 1 stratégie structurelle pour passer de 15M€ à 25M€ ARR</p>
                    </RevealOnScroll>

                    <StrategyTabs>
                        {/* QUICK WIN 1 */}
                        <Tab icon="⚡" title="Quick Win #1 — Conversion Checkout" tagline="+18-25% de conversion, implémentable en 6 semaines">
                            <div className="space-y-6">
                                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-5">
                                    <h5 className="font-bold mb-2">Problème identifié</h5>
                                    <p className="text-sm opacity-80">La friction checkout coûte à Cuure entre <strong className="text-[var(--accent)]">18% et 25%</strong> de ses conversions. Confusion abonnement, bug Apple Pay, absence de confirmation d&apos;engagement.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { num: "1", title: "Confirmation explicite", desc: "Écran interstitiel \"Vous souscrivez un abonnement de XX€/mois\". Les marques D2C qui l'ajoutent voient -60 à -80% d'avis négatifs." },
                                        { num: "2", title: "Fix Apple Pay", desc: "Vérification forcée de l'adresse de livraison post-auth. Sur Bubble.io : workflow conditionnel, 2-3 jours de dev." },
                                        { num: "3", title: "Transparence proactive", desc: "Calendrier des prélèvements + rappel email 48h avant. Transformer le \"piège perçu\" en \"service attentionné\"." },
                                        { num: "4", title: "A/B test engagement", desc: "Tester \"3 mois puis flexible\" vs \"sans engagement\" pour mesurer l'impact LTV sans augmenter la friction." },
                                    ].map((item) => (
                                        <motion.div key={item.num} className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 border-l-4 border-[var(--accent)]" whileHover={{ scale: 1.02 }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-[var(--accent)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{item.num}</span>
                                                <h6 className="font-semibold text-sm">{item.title}</h6>
                                            </div>
                                            <p className="text-sm opacity-70">{item.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <ImpactCard value="+18-25%" label="Taux de conversion" icon="📈" />
                                    <ImpactCard value="-60%" label="Avis négatifs checkout" icon="⭐" />
                                    <ImpactCard value="-15-20%" label="Churn mois 2" icon="🔒" />
                                    <ImpactCard value="6 sem." label="Délai implémentation" icon="⏱️" />
                                </div>
                            </div>
                        </Tab>

                        {/* QUICK WIN 2 */}
                        <Tab icon="👥" title="Quick Win #2 — Programme Referral" tagline="+30% d'acquisition organique, ROI x3 vs paid">
                            <div className="space-y-6">
                                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-5">
                                    <h5 className="font-bold mb-2">Opportunité inexploitée</h5>
                                    <p className="text-sm opacity-80">NPS de <strong className="text-[var(--accent)]">56</strong> = 60%+ de promoteurs actifs. Pourtant, <strong className="text-[var(--accent)]">aucun programme de referral structuré</strong>. C&apos;est comme avoir un Ferrari dans le garage sans les clés.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { num: "1", title: "Double récompense", desc: "Parrain : 1 mois offert. Filleul : -30% première commande. CAC estimé : 8-12€ vs 25-35€ en paid." },
                                        { num: "2", title: "Gamification par paliers", desc: "3 filleuls → \"Ambassadeur\" + accès anticipé. 5 → consultation nutritionniste. 10 → abonnement annuel offert." },
                                        { num: "3", title: "Déclenchement au pic de satisfaction", desc: "Après le 3ème mois (efficacité ressentie maximale). Automatisé via Klaviyo." },
                                        { num: "4", title: "Social proof natif", desc: "Widget \"X personnes de votre ville prennent Cuure\" + QR code referral sur chaque sachet." },
                                    ].map((item) => (
                                        <motion.div key={item.num} className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 flex items-start gap-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                            <span className="bg-[var(--accent)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.num}</span>
                                            <div>
                                                <h6 className="font-semibold text-sm mb-1">{item.title}</h6>
                                                <p className="text-sm opacity-70">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <UnitEconomicsCompare
                                    title1="Acquisition Payante (actuel)"
                                    title2="Referral (projection)"
                                    metrics={[
                                        { label: "CAC moyen", value1: "25-35€", value2: "8-12€" },
                                        { label: "Payback period", value1: "~2 mois", value2: "<1 mois" },
                                        { label: "Rétention M3", value1: "~55%", value2: "~70%" },
                                        { label: "LTV/CAC", value1: "~4x", value2: "~10x" },
                                    ]}
                                />

                                <Callout type="proof">
                                    <strong>Objectif :</strong> 30% de l&apos;acquisition via referral à M+6, soit ~2 800 nouveaux abonnés/mois (93K × 3% taux de referral).
                                </Callout>
                            </div>
                        </Tab>

                        {/* STRATÉGIE LT */}
                        <Tab icon="🧬" title="Stratégie LT — Expansion Biologique" tagline="x2.5 sur le panier moyen, Cuure Precision">
                            <div className="space-y-6">
                                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-5">
                                    <h5 className="font-bold mb-2">Vision stratégique</h5>
                                    <p className="text-sm opacity-80">Transformer Cuure d&apos;un <strong>&quot;quiz + sachets&quot;</strong> en une <strong className="text-[var(--accent)]">plateforme de santé personnalisée data-driven</strong>, en intégrant des biomarqueurs réels. La précision de Zoe au prix de Cuure.</p>
                                </div>

                                <Timeline>
                                    <TimelineMonth month="M1-M3" title="Partenariat Labo">
                                        <TimelineItem status="quick-win">Partenariat avec un labo d&apos;analyses (type Cerascreen)</TimelineItem>
                                        <TimelineItem>Kit bilan micronutritionnel : 15 biomarqueurs clés</TimelineItem>
                                        <TimelineItem>Intégration API → CRM Bubble</TimelineItem>
                                        <TimelineItem highlight>Prix cible du test : 49€ (subventionné dans l&apos;abonnement annuel)</TimelineItem>
                                    </TimelineMonth>
                                    <TimelineMonth month="M3-M6" title="Algorithme Augmenté">
                                        <TimelineItem status="quick-win">Enrichir l&apos;algo avec données biologiques réelles</TimelineItem>
                                        <TimelineItem>Passer de 40 questions déclaratives à scoring hybride</TimelineItem>
                                        <TimelineItem highlight>Différenciation radicale vs Vitl et concurrents</TimelineItem>
                                        <TimelineItem>Recalibration automatique des formules (1x/an)</TimelineItem>
                                    </TimelineMonth>
                                    <TimelineMonth month="M6-M12" title="Monétisation Premium">
                                        <TimelineItem status="quick-win" highlight>Lancement &quot;Cuure Precision&quot; : 89-119€/mois</TimelineItem>
                                        <TimelineItem>Inclus : 1 bilan/an + formule adaptée + suivi nutritionniste</TimelineItem>
                                        <TimelineItem>Upsell 15-20% de la base active</TimelineItem>
                                        <TimelineItem highlight>ARPU : 35€ → 55€/mois en moyenne pondérée</TimelineItem>
                                    </TimelineMonth>
                                </Timeline>

                                {/* Financial projection */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                    <AnimatedStat value="15" suffix="M€" label="CA actuel (est. 2025)" />
                                    <AnimatedStat value="19" suffix="M€" label="Avec Quick Wins seuls" />
                                    <AnimatedStat value="25" suffix="M€" label="Avec Cuure Precision" highlight />
                                    <AnimatedStat value="2.5" suffix="x" label="Panier moyen premium" highlight />
                                </div>
                            </div>
                        </Tab>
                    </StrategyTabs>
                </div>
            </section>

            {/* ============================================ */}
            {/* KPIs DE PILOTAGE */}
            {/* ============================================ */}
            <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
                <div className="max-w-6xl mx-auto">
                    <RevealOnScroll>
                        <h3 className="text-2xl font-bold mb-8">4. KPIs de pilotage — Vue d&apos;ensemble</h3>
                    </RevealOnScroll>
                    <KPIDashboard
                        kpis={[
                            { label: "Conversion Rate Checkout", category: "Conversion", current: "~3-4%", target: "5-6%" },
                            { label: "MRR", category: "Revenue", current: "~1.25M€/mois", target: "2M€/mois" },
                            { label: "Referral Rate", category: "Acquisition", current: "<2%", target: "8-10%" },
                            { label: "Churn M2", category: "Rétention", current: "~20% (est.)", target: "12%" },
                            { label: "ARPU", category: "Monétisation", current: "~35€/mois", target: "55€/mois" },
                        ]}
                    />
                </div>
            </section>

            {/* ============================================ */}
            {/* CE QUE J'APPORTE */}
            {/* ============================================ */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ce que j&apos;apporte à <span className="text-[var(--accent)]">Cuure</span></h2>
                    </RevealOnScroll>
                    <div className="space-y-4">
                        {[
                            { icon: "📈", title: "8+ ans en Growth & Subscription", desc: "Médias numériques, gestion solo de portfolio, croissance mesurable et documentée." },
                            { icon: "🎯", title: "Track record prouvé", desc: "+28% recrutement, +5.3% cash growth, x17 parc abonnés. Pas des projections — des résultats." },
                            { icon: "🔧", title: "Maîtrise du stack D2C", desc: "Klaviyo, Segment, analytics, A/B testing, CRM. La stack de Cuure, c'est mon terrain de jeu quotidien." },
                            { icon: "🧠", title: "Double culture data + créativité", desc: "Ex-joueur de poker professionnel. Pensée probabiliste, gestion du risque, prise de décision sous incertitude." },
                            { icon: "🚀", title: "Vision product-led growth", desc: "Alignée avec l'ADN tech de Cuure (Bubble, no-code, IA). Le produit comme premier canal d'acquisition." },
                        ].map((item, i) => (
                            <RevealOnScroll key={item.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                                <motion.div className="flex items-start gap-4 bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-xl p-5 hover:border-[var(--accent)]/50 transition-colors" whileHover={{ x: 5 }}>
                                    <span className="text-2xl shrink-0">{item.icon}</span>
                                    <div>
                                        <h4 className="font-bold mb-1">{item.title}</h4>
                                        <p className="text-sm opacity-70">{item.desc}</p>
                                    </div>
                                </motion.div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* CTA FINAL */}
            {/* ============================================ */}
            <section className="py-32 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <RevealOnScroll>
                        <div className="text-2xl md:text-3xl font-bold mb-8">
                            <TypewriterText text="Parlons-en autour d'un café ☕" />
                        </div>
                        <p className="opacity-60 mb-8 max-w-xl mx-auto">
                            J&apos;ai les compétences, la vision et l&apos;envie. Ce document n&apos;est qu&apos;un aperçu de ce que je peux apporter à Cuure.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.2}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.a
                                href="mailto:charles.bonnet@pm.me?subject=Candidature Head of Growth — Cuure"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold text-lg shadow-lg"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px var(--accent)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                Contactez-moi
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/charlesbonn3t/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-full font-semibold text-lg hover:border-[var(--accent)]/50 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                LinkedIn
                            </motion.a>
                        </div>
                    </RevealOnScroll>

                    {/* Signature */}
                    <motion.p className="mt-16 text-sm opacity-30 font-mono" initial={{ opacity: 0 }} whileInView={{ opacity: 0.3 }} viewport={{ once: true }}>
                        Charles Bonnet · {new Date().getFullYear()} · Built with Next.js, Framer Motion & ☕
                    </motion.p>
                </div>
            </section>
        </div>
    );
}
