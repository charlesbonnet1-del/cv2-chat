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
  ComparisonBar,
  Timeline,
  TimelineMonth,
  TimelineItem,
  FunnelStep,
  FunnelArrow,
  CompetitorTable,
  TriggerCard,
  PyramidChart,
  BarChart,
} from "./components";

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// ============================================
// REVEAL ON SCROLL COMPONENT
// ============================================
function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
  };

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, x: 0, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={controls}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// ANIMATED GRID BACKGROUND
// ============================================
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.15,
        }}
      />
    </div>
  );
}

// ============================================
// KPI CARD COMPONENT
// ============================================
function KPICard({
  value,
  suffix,
  prefix,
  label,
  delay,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay: number;
}) {
  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        className="relative bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-2xl p-6 overflow-hidden group"
        whileHover={{ scale: 1.02, borderColor: "var(--accent)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
            <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
          </div>
          <p className="text-[var(--foreground)] opacity-60 text-sm md:text-base">{label}</p>
        </div>
      </motion.div>
    </RevealOnScroll>
  );
}

// ============================================
// COMPARISON TOGGLE COMPONENT
// ============================================
function ComparisonSection() {
  const [activeTab, setActiveTab] = useState<"media" | "crypto">("media");

  const comparisons = [
    { media: "Funnel abonnement", crypto: "Funnel onboarding client" },
    { media: "Scoring leads (chaud/froid)", crypto: "Scoring prospects (retail/premium)" },
    { media: "Churn & rétention", crypto: "Churn & réactivation" },
    { media: "LTV / CAC", crypto: "LTV / CAC" },
    { media: "Nurturing email", crypto: "Nurturing email" },
    { media: "Stratégies d'upsell", crypto: "Upsell (basic → premium)" },
    { media: "Pédagogie éditoriale", crypto: "Pédagogie crypto" },
    { media: "Vulgarisation de sujets complexes", crypto: "Vulgarisation blockchain/DeFi" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab("media")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === "media"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
              }`}
          >
            Ce que j&apos;ai fait (Média)
          </button>
          <button
            onClick={() => setActiveTab("crypto")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === "crypto"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
              }`}
          >
            Ce que je ferai (Crypto)
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {comparisons.map((item, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ x: activeTab === "crypto" ? 10 : 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-lg p-4 hover:border-[var(--accent)]/50 transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab + index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-[var(--foreground)] text-center"
              >
                {activeTab === "media" ? item.media : item.crypto}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// TYPEWRITER EFFECT COMPONENT
// ============================================
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <div ref={ref}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-[var(--accent)]"
      >
        |
      </motion.span>
    </div>
  );
}

// ============================================
// FLOATING ASSISTANT COMPONENT
// ============================================
function FloatingAssistant() {
  const [message, setMessage] = useState("Bienvenue !");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPercent = scrollY / (docHeight - windowHeight);

      setIsVisible(true);

      if (scrollPercent < 0.1) {
        setMessage("Bienvenue !");
      } else if (scrollPercent < 0.2) {
        setMessage("Ces chiffres sont réels.");
      } else if (scrollPercent < 0.3) {
        setMessage("Mêmes mécaniques, nouveau terrain.");
      } else if (scrollPercent < 0.5) {
        setMessage("J'ai fait mes devoirs...");
      } else if (scrollPercent < 0.7) {
        setMessage("Des idées concrètes, pas du blabla.");
      } else if (scrollPercent < 0.85) {
        setMessage("Stack sats, not fiat.");
      } else {
        setMessage("Go, envoie ce mail !");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50 hidden md:block"
        >
          <motion.div
            key={message}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[var(--bot-bubble-bg)] border border-[var(--accent)] rounded-2xl px-4 py-3 shadow-lg"
          >
            <p className="text-sm text-[var(--foreground)] whitespace-nowrap">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// SCROLL INDICATOR COMPONENT
// ============================================
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-2 text-[var(--foreground)] opacity-40"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function CoinHousePage() {
  const [hoveredCTA, setHoveredCTA] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden transition-colors duration-300">
      <FloatingAssistant />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Back to home */}
      <motion.a
        href="/"
        className="fixed top-6 left-6 z-50 text-[var(--foreground)] opacity-50 hover:opacity-100 transition-opacity text-sm"
        whileHover={{ x: -3 }}
      >
        ← Retour
      </motion.a>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <GridBackground />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <span className="text-sm md:text-base font-medium tracking-widest uppercase text-[var(--accent)]">
                Marketing Manager — Lead Generation & Growth
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Pourquoi <span className="text-[var(--accent)]">moi</span>
              <br />
              pour <span className="text-[var(--accent)]">Coinhouse</span>
            </h1>

            <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto">
              Depuis 2019, je transforme des lecteurs en abonnés.
              <br />
              <span className="opacity-100 text-[var(--foreground)]">Prêt à transformer des curieux en investisseurs.</span>
            </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Mes <span className="text-[var(--accent)]">résultats</span>
            </h2>
            <p className="text-[var(--foreground)] opacity-50 text-center mb-12 max-w-2xl mx-auto">
              Des chiffres concrets, mesurés, documentés. Pas du blabla marketing.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard value={17} prefix="x" label="Croissance parc abonnés en 5 ans" delay={0} />
            <KPICard value={28} prefix="+" suffix="%" label="Croissance recrutement 2025" delay={0.1} />
            <KPICard value={107} prefix="+" suffix="%" label="Performance landing pages" delay={0.2} />
            <KPICard value={21} prefix="+" suffix="%" label="ARPU (revenu par utilisateur)" delay={0.3} />
            <KPICard value={29} prefix="+" suffix="%" label="Repricing sans churn" delay={0.4} />
            <RevealOnScroll delay={0.5}>
              <motion.div
                className="relative bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-6 flex items-center justify-center h-full"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-center text-lg">
                  <span className="text-[var(--accent)] font-bold">Et maintenant ?</span>
                  <br />
                  <span className="opacity-60">Direction Coinhouse.</span>
                </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Média → Crypto : <span className="text-[var(--accent)]">mêmes mécaniques</span>
            </h2>
            <p className="text-[var(--foreground)] opacity-50 text-center mb-4 max-w-2xl mx-auto">
              Le produit change, les fondamentaux restent. Acquisition, conversion, rétention.
            </p>
            <p className="text-[var(--foreground)] opacity-70 text-center mb-12 max-w-2xl mx-auto text-sm">
              <strong>L&apos;adoption crypto est un défi éditorial :</strong> vulgariser un sujet complexe, séquencer l&apos;information, accompagner la montée en compétence. C&apos;est exactement ce que je fais depuis 6 ans dans les médias.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <ComparisonSection />
          </RevealOnScroll>
        </div>
      </section>

      {/* ============================================ */}
      {/* STRATEGY SECTION - HEADER */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              Ma vision stratégique pour <span className="text-[var(--accent)]">Coinhouse</span>
            </h2>
            <p className="text-[var(--foreground)] opacity-60 text-center mb-12 max-w-3xl mx-auto text-lg">
              J&apos;ai passé des heures à analyser votre marché, vos concurrents, vos forces et vos opportunités.
              Voici ce que j&apos;ai compris — et ce que je propose.
            </p>
          </RevealOnScroll>

          {/* Stats Teaser */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <AnimatedStat value={33} suffix="%" label="des Français veulent acheter crypto" highlight />
            <AnimatedStat value="17M" suffix="" label="de prospects à convertir" />
          </div>

          {/* ============================================ */}
          {/* DIAGNOSTIC MARCHÉ */}
          {/* ============================================ */}
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-6">1. Diagnostic marché</h3>
          </RevealOnScroll>

          <Accordion>
            <AccordionItem title="📊 Le marché français en 2025" defaultOpen={true}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <AnimatedStat value={10} suffix="%" label="Français détenteurs crypto (5.5M)" />
                <AnimatedStat value={33} suffix="%" label="Envisagent d'acheter (+10pts vs 2023)" highlight />
                <AnimatedStat value={92} suffix="%" label="Connaissent les crypto-actifs" />
                <AnimatedStat value={21} suffix="%" label="Frein n°1 : C'est compliqué" />
              </div>
              <p className="text-xs opacity-40 mb-4">Source : ADAN / KPMG — Baromètre des cryptos en France 2024</p>
              <Callout type="insight">
                Le problème n&apos;est pas la notoriété. C&apos;est le passage à l&apos;acte.
                La crypto est un sujet complexe : <strong>la pédagogie est la clé.</strong>
              </Callout>
            </AccordionItem>

            <AccordionItem title="🌍 Benchmark international">
              <p className="text-sm opacity-60 mb-4">Taux de détention de crypto-actifs par pays :</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-24 text-sm">Pays-Bas</span>
                  <div className="flex-1 h-6 bg-gray-700/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} />
                  </div>
                  <span className="text-sm font-semibold">17%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-sm">UK</span>
                  <div className="flex-1 h-6 bg-gray-700/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "80%" }} />
                  </div>
                  <span className="text-sm font-semibold">16%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-sm">Allemagne</span>
                  <div className="flex-1 h-6 bg-gray-700/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }} />
                  </div>
                  <span className="text-sm font-semibold">12%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-sm text-[var(--accent)]">France</span>
                  <div className="flex-1 h-6 bg-gray-700/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: "50%" }} />
                  </div>
                  <span className="text-sm font-semibold text-[var(--accent)]">10%</span>
                </div>
              </div>
              <p className="text-xs opacity-40 mt-4">Source : Statista / Eurostat 2024</p>
              <p className="mt-4">La France a du retard = <strong className="text-[var(--accent)]">opportunité de croissance</strong></p>
            </AccordionItem>

            <AccordionItem title="🎯 L'opportunité des 33%">
              <div className="space-y-3 text-lg">
                <p>33% de 52M de Français = <strong className="text-[var(--accent)]">17 millions de prospects</strong></p>
                <p>Si Coinhouse en capte 1% = <strong className="text-[var(--accent)]">170 000 nouveaux clients</strong></p>
                <p>Avec un panier moyen de 2 000€ = <strong className="text-[var(--accent)]">340M€ d&apos;encours additionnels</strong></p>
              </div>
              <Callout type="action">
                Mon job chez Lagardère : convertir des &quot;curieux&quot; en clients engagés.
                <strong> La pédagogie crypto est fondamentalement un défi éditorial</strong> — vulgariser, séquencer l&apos;information, créer des parcours d&apos;apprentissage. C&apos;est exactement ce que je fais depuis 6 ans.
              </Callout>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ============================================ */}
      {/* ANALYSE COINHOUSE - SWOT */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-8">2. Analyse Coinhouse</h3>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            <FlipCard
              front={
                <div className="text-center">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-xl font-bold mb-2">Forces à capitaliser</h3>
                  <p className="opacity-60">6 avantages concurrentiels uniques</p>
                </div>
              }
              back={
                <ul className="space-y-3 text-sm">
                  <li><strong className="text-[var(--accent)]">1er PSAN France</strong> — Légitimité réglementaire</li>
                  <li><strong className="text-[var(--accent)]">Support FR téléphone</strong> — Unique vs Binance/Kraken</li>
                  <li><strong className="text-[var(--accent)]">Gestion pilotée</strong> — Aucun concurrent FR</li>
                  <li><strong className="text-[var(--accent)]">Sélection curatée</strong> — Qualité vs quantité</li>
                  <li><strong className="text-[var(--accent)]">Trustpilot 4.7/5</strong> — Meilleur du marché</li>
                  <li><strong className="text-[var(--accent)]">IBAN français</strong> — Pas de déclaration 3916</li>
                </ul>
              }
            />

            <FlipCard
              front={
                <div className="text-center">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-xl font-bold mb-2">Faiblesses à transformer</h3>
                  <p className="opacity-60">4 perceptions à repositionner</p>
                </div>
              }
              back={
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="opacity-40 line-through">&quot;Frais plus élevés&quot;</span>
                    <span className="text-[var(--accent)]">→</span>
                    <span className="text-[var(--accent)]">&quot;Le prix de l&apos;accompagnement&quot;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-40 line-through">&quot;Catalogue limité&quot;</span>
                    <span className="text-[var(--accent)]">→</span>
                    <span className="text-[var(--accent)]">&quot;Sélection curatée par des experts&quot;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-40 line-through">&quot;Pas de dérivés&quot;</span>
                    <span className="text-[var(--accent)]">→</span>
                    <span className="text-[var(--accent)]">&quot;Investissement responsable&quot;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-40 line-through">&quot;Crise FTX 2022&quot;</span>
                    <span className="text-[var(--accent)]">→</span>
                    <span className="text-[var(--accent)]">&quot;On a appris, remboursé, renforcé&quot;</span>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* RADAR CONCURRENTIEL */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-8">3. Radar concurrentiel</h3>
          </RevealOnScroll>

          <CompetitorTable
            competitors={[
              {
                name: "Coinhouse",
                highlight: true,
                data: {
                  origin: "🇫🇷 Paris",
                  cryptos: "50-70",
                  fees: "0.69%",
                  psan: "✅ 2020",
                  support: "✅ Tel FR",
                  managed: "✅",
                  trustpilot: "4.7/5",
                },
              },
              {
                name: "Binance",
                data: {
                  origin: "🇲🇹 Malte",
                  cryptos: "600+",
                  fees: "0.1%",
                  psan: "✅ 2022",
                  support: "❌",
                  managed: "❌",
                  trustpilot: "3.5/5",
                },
              },
              {
                name: "Trade Republic",
                data: {
                  origin: "🇩🇪 Berlin",
                  cryptos: "50+",
                  fees: "1€/ordre",
                  psan: "❌",
                  support: "❌",
                  managed: "❌",
                  trustpilot: "4.2/5",
                },
              },
              {
                name: "Kraken",
                data: {
                  origin: "🇺🇸 SF",
                  cryptos: "200+",
                  fees: "0-0.4%",
                  psan: "✅ 2024",
                  support: "❌",
                  managed: "❌",
                  trustpilot: "3.8/5",
                },
              },
            ]}
          />

          <Callout type="insight">
            <strong>Ma lecture :</strong> Coinhouse ne doit pas concurrencer Binance sur les frais.
            Le positionnement &quot;banque privée crypto&quot; est le bon.
            Trade Republic est la vraie menace sur le segment débutant — on les bat par la <strong>valeur de l&apos;accompagnement</strong>, la <strong>spécialisation crypto</strong> (vs généraliste), et la <strong>pédagogie</strong>. Pas par le prix.
          </Callout>
        </div>
      </section>

      {/* ============================================ */}
      {/* 5 AXES STRATÉGIQUES */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-8">4. Mes 5 axes stratégiques</h3>
          </RevealOnScroll>

          <StrategyTabs>
            <Tab icon="🎬" title="Contenu vidéo massif" tagline="Aller chercher les prospects là où ils sont">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3 opacity-60">❌ L&apos;approche actuelle</h4>
                  <ul className="space-y-2 text-sm opacity-70">
                    <li>• Academy sur le site → l&apos;user doit déjà être là</li>
                    <li>• Livres blancs PDF → personne ne lit</li>
                    <li>• Newsletter → ~20% ouverture, ~2% clic <span className="opacity-50">(estimés)</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-[var(--accent)]">✅ Ma proposition : le recyclage systématique</h4>
                  <p className="text-sm mb-4">Pas de révolution de production. <strong>Un contenu = tous les canaux</strong> grâce au recyclage intelligent.</p>
                  <div className="bg-[var(--accent)]/10 rounded-lg p-3 text-sm">
                    <strong>Mon expérience :</strong> J&apos;ai travaillé sur le lancement de <strong>VA Plus</strong>, aujourd&apos;hui à près de <span className="text-[var(--accent)]">500K abonnés</span>.
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-[var(--bot-bubble-bg)] rounded-xl p-6">
                <h5 className="font-semibold mb-4 text-center">Le recyclage en action</h5>
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-[var(--accent)]/20 border border-[var(--accent)]/40 rounded-lg px-6 py-3 text-center">
                    <span className="text-[var(--accent)] font-bold">1 Masterclass YouTube (45 min)</span>
                  </div>
                  <div className="text-[var(--accent)]">↓</div>
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="bg-[var(--foreground)]/5 rounded-lg p-3 text-center text-sm">
                      <strong>10-15 Shorts</strong>
                      <p className="text-xs opacity-50">extraits clés</p>
                    </div>
                    <div className="bg-[var(--foreground)]/5 rounded-lg p-3 text-center text-sm">
                      <strong>5 posts LinkedIn</strong>
                      <p className="text-xs opacity-50">citations + insights</p>
                    </div>
                    <div className="bg-[var(--foreground)]/5 rounded-lg p-3 text-center text-sm">
                      <strong>1 article blog</strong>
                      <p className="text-xs opacity-50">transcription enrichie</p>
                    </div>
                  </div>
                  <div className="text-[var(--accent)]">↓</div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-[var(--foreground)]/5 rounded-lg p-3 text-center text-sm">
                      <strong>Reels Instagram</strong>
                      <p className="text-xs opacity-50">reformatage vertical</p>
                    </div>
                    <div className="bg-[var(--foreground)]/5 rounded-lg p-3 text-center text-sm">
                      <strong>TikTok</strong>
                      <p className="text-xs opacity-50">ton adapté</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm opacity-60 mt-4">= <strong className="text-[var(--accent)]">30+ contenus</strong> à partir d&apos;une seule production</p>
              </div>
              <Callout type="proof">
                <strong>Coût 2025 :</strong> Avec l&apos;IA pour le script, le chapitrage et le montage,
                <strong> produire 20+ contenus/mois coûte aujourd&apos;hui le prix d&apos;un seul en 2020.</strong>
              </Callout>
              <div className="mt-6 bg-[var(--bot-bubble-bg)] rounded-xl p-4">
                <h5 className="font-semibold mb-2 flex items-center gap-2">🎧 Ne pas oublier le podcast</h5>
                <p className="text-sm opacity-70">
                  La cible crypto est ultra-friande de podcasts : des gens pressés qui écoutent dans le métro,
                  sur le tapis de course, en voiture. <strong>Chaque vidéo longue doit être déclinée en épisode audio</strong>
                  sur Spotify, Apple Podcasts, Deezer. Coût marginal quasi nul, reach multiplié.
                </p>
              </div>
            </Tab>

            <Tab icon="👥" title="Double ambassadeur" tagline="Effet de réseau & personnification">
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-5 mb-6">
                <h4 className="font-bold mb-2">L&apos;enjeu : personnifier la marque</h4>
                <p className="text-sm opacity-80">
                  Les gens ne suivent pas des entreprises, ils suivent des <strong>personnes</strong>.
                  Pour créer un vrai effet de réseau, il faut que les visages de Coinhouse publient
                  régulièrement sur <strong>leurs comptes personnels</strong>, pas seulement sur le compte corporate.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-6 border border-[var(--foreground)]/10">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mb-4 text-xl">NV</div>
                  <h4 className="font-bold text-lg">Nicolas Valente</h4>
                  <span className="text-sm text-[var(--accent)]">CEO — Vision & stratégie</span>
                  <ul className="mt-4 space-y-2 text-sm opacity-70">
                    <li>• Posts LinkedIn perso 2-3x/semaine</li>
                    <li>• Prises de position marché</li>
                    <li>• Interviews médias, keynotes</li>
                    <li>• Cible : institutionnels, B2B, médias</li>
                  </ul>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-6 border border-[var(--accent)]/30">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mb-4 text-xl">TD</div>
                  <h4 className="font-bold text-lg">Thibaut Desachy</h4>
                  <span className="text-sm text-[var(--accent)]">Head of Research — Pédagogie</span>
                  <ul className="mt-4 space-y-2 text-sm opacity-70">
                    <li>• Posts Twitter/X perso quotidiens</li>
                    <li>• Threads analyses, réactions marché</li>
                    <li>• Interactions communauté crypto</li>
                    <li>• Cible : particuliers, crypto-natifs</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5">
                <h5 className="font-semibold mb-3">Pourquoi les réseaux perso ?</h5>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3">
                    <div className="text-2xl mb-2">📈</div>
                    <strong>Reach 5-10x supérieur</strong>
                    <p className="opacity-60 text-xs mt-1">Les algorithmes favorisent les profils personnels</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-2xl mb-2">🤝</div>
                    <strong>Confiance renforcée</strong>
                    <p className="opacity-60 text-xs mt-1">On fait confiance à des humains, pas à des logos</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-2xl mb-2">🔄</div>
                    <strong>Effet boule de neige</strong>
                    <p className="opacity-60 text-xs mt-1">Chaque follower élargit le réseau de Coinhouse</p>
                  </div>
                </div>
              </div>
              <Callout type="action">
                <strong>Action clé :</strong> Définir un calendrier éditorial où Valente et Desachy postent
                régulièrement sur leurs comptes perso. Un CM peut préparer les contenus, eux valident et publient.
              </Callout>
            </Tab>

            <Tab icon="🎯" title="Sélection Curatée" tagline="Transformer une faiblesse perçue en force">
              <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1">
                    <span className="text-xs opacity-50">Perception actuelle</span>
                    <p className="opacity-60">&quot;Coinhouse n&apos;a que 50 cryptos vs 600 chez Binance&quot;</p>
                  </div>
                  <div className="text-[var(--accent)] text-2xl">→</div>
                  <div className="flex-1">
                    <span className="text-xs text-[var(--accent)]">Repositionnement</span>
                    <p className="text-[var(--accent)]">&quot;On a analysé 600+ projets. On en a retenu 50. <strong>Voici pourquoi.</strong>&quot;</p>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--accent)]/10 rounded-xl p-4 mb-6">
                <p>
                  <strong>Analogie :</strong> Le Monde ne publie pas toutes les dépêches AFP.
                  Il sélectionne, hiérarchise, contextualise. <strong>Coinhouse = la rédaction crypto.</strong>
                </p>
              </div>
              <h5 className="font-semibold mb-3">Contenus à créer :</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-[var(--accent)]">→</span> Page &quot;Notre méthodologie de sélection&quot;</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent)]">→</span> Série vidéo &quot;Pourquoi on a dit non à [crypto populaire]&quot;</li>
                <li className="flex items-center gap-2"><span className="text-[var(--accent)]">→</span> Rapport trimestriel &quot;Entrées/sorties de notre sélection&quot;</li>
              </ul>
            </Tab>

            <Tab icon="🏢" title="Accélération B2B" tagline="Stablecoins & paiements internationaux">
              {/* Market Size Banner */}
              <div className="bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5 rounded-2xl p-6 mb-8 border border-[var(--accent)]/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm opacity-60 mb-1">Marché mondial des stablecoins</p>
                    <p className="text-4xl font-bold text-[var(--accent)]">$170 Mds</p>
                    <p className="text-sm opacity-60">+45% en 2024</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-[#2775CA]/20 flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-[#2775CA]">$</span>
                      </div>
                      <p className="text-xs font-semibold">USDC</p>
                      <p className="text-xs opacity-60">$35 Mds</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-[#26A17B]/20 flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-[#26A17B]">₮</span>
                      </div>
                      <p className="text-xs font-semibold">USDT</p>
                      <p className="text-xs opacity-60">$120 Mds</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-[var(--accent)]">€</span>
                      </div>
                      <p className="text-xs font-semibold">EURC</p>
                      <p className="text-xs opacity-60">$90 M</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current State */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[var(--accent)] text-black text-xs font-bold px-3 py-1 rounded-full">OPPORTUNITÉ</span>
                  <h4 className="font-bold text-lg">B2B = 30% du CA Coinhouse</h4>
                </div>
                <p className="opacity-70 mb-4">Un segment sous-exploité alors que MiCA positionne l&apos;Europe comme le hub mondial des stablecoins régulés.</p>
              </div>

              {/* SWIFT vs Stablecoin Interactive Comparison */}
              <div className="bg-[var(--bot-bubble-bg)] rounded-2xl p-6 mb-8">
                <h5 className="font-semibold mb-6 text-center">SWIFT vs Stablecoins : le match</h5>
                <div className="space-y-6">
                  {/* Speed */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="opacity-60">Délai de transfert</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <div className="h-10 bg-red-500/20 rounded-lg flex items-center px-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-red-500/30" style={{ width: '100%' }}></div>
                          <span className="relative z-10 text-sm font-medium">SWIFT : 3-5 jours</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="h-10 bg-green-500/20 rounded-lg flex items-center px-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-green-500/40" style={{ width: '5%' }}></div>
                          <span className="relative z-10 text-sm font-medium text-green-400">Stablecoin : 10 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Cost */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="opacity-60">Frais pour 10 000€</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <div className="h-10 bg-red-500/20 rounded-lg flex items-center px-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-red-500/30" style={{ width: '100%' }}></div>
                          <span className="relative z-10 text-sm font-medium">SWIFT : 25-50€</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="h-10 bg-green-500/20 rounded-lg flex items-center px-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-green-500/40" style={{ width: '4%' }}></div>
                          <span className="relative z-10 text-sm font-medium text-green-400">Stablecoin : 0.50-2€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Availability */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="opacity-60">Disponibilité</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <div className="h-10 bg-red-500/20 rounded-lg flex items-center px-4">
                          <span className="text-sm font-medium">SWIFT : Lun-Ven, heures ouvrées</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="h-10 bg-green-500/20 rounded-lg flex items-center px-4">
                          <span className="text-sm font-medium text-green-400">Stablecoin : 24/7/365</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Use Cases with Real Numbers */}
              <h5 className="font-semibold mb-4">Cas d&apos;usage concrets</h5>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border-l-4 border-[var(--accent)]">
                  <div className="text-3xl mb-3">🏭</div>
                  <h6 className="font-semibold mb-2">Importateur textile</h6>
                  <p className="text-sm opacity-70 mb-3">Paie ses fournisseurs en Turquie et au Bangladesh</p>
                  <div className="bg-[var(--background)] rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="opacity-60">Avant (SWIFT)</span>
                      <span>4 200€/an de frais</span>
                    </div>
                    <div className="flex justify-between text-green-400 font-semibold">
                      <span>Après (USDT)</span>
                      <span>180€/an</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border-l-4 border-[#2775CA]">
                  <div className="text-3xl mb-3">💻</div>
                  <h6 className="font-semibold mb-2">Agence web</h6>
                  <p className="text-sm opacity-70 mb-3">Paie des développeurs en Ukraine et aux Philippines</p>
                  <div className="bg-[var(--background)] rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="opacity-60">Avant (SWIFT)</span>
                      <span>5 jours de délai</span>
                    </div>
                    <div className="flex justify-between text-green-400 font-semibold">
                      <span>Après (USDC)</span>
                      <span>15 minutes</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border-l-4 border-[#26A17B]">
                  <div className="text-3xl mb-3">🛒</div>
                  <h6 className="font-semibold mb-2">E-commerçant</h6>
                  <p className="text-sm opacity-70 mb-3">Reçoit des paiements de clients B2B internationaux</p>
                  <div className="bg-[var(--background)] rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="opacity-60">Avant (CB int.)</span>
                      <span>2.9% + FX fees</span>
                    </div>
                    <div className="flex justify-between text-green-400 font-semibold">
                      <span>Après (EURC)</span>
                      <span>0.1% flat</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stablecoin Selection Guide */}
              <div className="bg-gradient-to-br from-[var(--bot-bubble-bg)] to-[var(--background)] rounded-2xl p-6 mb-8 border border-[var(--foreground)]/10">
                <h5 className="font-semibold mb-4">Guide : Quel stablecoin pour quelle situation ?</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--foreground)]/10">
                        <th className="text-left py-3 px-2"></th>
                        <th className="text-center py-3 px-2">
                          <span className="text-[#26A17B] font-bold">USDT</span>
                        </th>
                        <th className="text-center py-3 px-2">
                          <span className="text-[#2775CA] font-bold">USDC</span>
                        </th>
                        <th className="text-center py-3 px-2">
                          <span className="text-[var(--accent)] font-bold">EURC</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="opacity-80">
                      <tr className="border-b border-[var(--foreground)]/5">
                        <td className="py-3 px-2 font-medium">Liquidité</td>
                        <td className="text-center py-3 px-2">⭐⭐⭐</td>
                        <td className="text-center py-3 px-2">⭐⭐</td>
                        <td className="text-center py-3 px-2">⭐</td>
                      </tr>
                      <tr className="border-b border-[var(--foreground)]/5">
                        <td className="py-3 px-2 font-medium">Compliance MiCA</td>
                        <td className="text-center py-3 px-2">❌</td>
                        <td className="text-center py-3 px-2">✅</td>
                        <td className="text-center py-3 px-2">✅</td>
                      </tr>
                      <tr className="border-b border-[var(--foreground)]/5">
                        <td className="py-3 px-2 font-medium">Acceptance Asie</td>
                        <td className="text-center py-3 px-2">✅</td>
                        <td className="text-center py-3 px-2">✅</td>
                        <td className="text-center py-3 px-2">❌</td>
                      </tr>
                      <tr className="border-b border-[var(--foreground)]/5">
                        <td className="py-3 px-2 font-medium">Transparence réserves</td>
                        <td className="text-center py-3 px-2">⚠️</td>
                        <td className="text-center py-3 px-2">✅</td>
                        <td className="text-center py-3 px-2">✅</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-medium">Cas d&apos;usage idéal</td>
                        <td className="text-center py-3 px-2 text-xs">Trading, marchés émergents</td>
                        <td className="text-center py-3 px-2 text-xs">Entreprises, institutionnels</td>
                        <td className="text-center py-3 px-2 text-xs">Zone euro, comptabilité simplifiée</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Target Segments */}
              <h5 className="font-semibold mb-4">Segments cibles prioritaires</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                  <div className="text-3xl mb-2">🛒</div>
                  <p className="text-sm font-medium">E-commerçants internationaux</p>
                  <p className="text-xs opacity-50 mt-1">50K+ entreprises en France</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                  <div className="text-3xl mb-2">💻</div>
                  <p className="text-sm font-medium">Agences & ESN offshore</p>
                  <p className="text-xs opacity-50 mt-1">Freelances internationaux</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm font-medium">Import/Export</p>
                  <p className="text-xs opacity-50 mt-1">Corridors Asie, Turquie, Afrique</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                  <div className="text-3xl mb-2">🌍</div>
                  <p className="text-sm font-medium">Startups remote-first</p>
                  <p className="text-xs opacity-50 mt-1">Équipes distribuées</p>
                </div>
              </div>

              {/* Content Strategy for B2B */}
              <div className="bg-[var(--accent)]/10 rounded-xl p-5 mb-6">
                <h5 className="font-semibold mb-3">Stratégie de contenu B2B</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Top of Funnel</p>
                    <ul className="text-sm space-y-1 opacity-70">
                      <li>• &quot;Stablecoins pour les nuls (version DAF)&quot;</li>
                      <li>• Calculateur d&apos;économies SWIFT → Stablecoin</li>
                      <li>• Infographie : anatomie d&apos;un paiement international</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Bottom of Funnel</p>
                    <ul className="text-sm space-y-1 opacity-70">
                      <li>• Guide comptable : enregistrer des stablecoins</li>
                      <li>• Template de politique crypto interne</li>
                      <li>• Webinar &quot;Trésorerie crypto pour PME&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Callout type="action">
                <strong>L&apos;angle marketing :</strong> Les DAF passent 10h/mois à gérer les paiements internationaux.
                Les stablecoins réduisent ça à 10 minutes. <strong>Coinhouse doit être celui qui leur apprend.</strong>
              </Callout>
            </Tab>

            <Tab icon="🤖" title="Vision : Agents IA" tagline="L'opportunité à 3-5 ans">
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-6 mb-6">
                <blockquote className="text-lg">
                  &quot;Dans 3 ans, chaque entreprise aura des dizaines d&apos;agents IA qui effectuent des transactions en continu.
                  <strong className="text-[var(--accent)]"> Coinhouse peut être leur infrastructure de paiement.</strong>&quot;
                </blockquote>
              </div>
              <h5 className="font-semibold mb-3">Ce que les agents vont payer :</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <span className="text-sm">Agent recherche</span>
                  <p className="text-xs opacity-50">Achète articles, données, API</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🛒</div>
                  <span className="text-sm">Agent e-commerce</span>
                  <p className="text-xs opacity-50">Compare, négocie, achète</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <span className="text-sm">Agent booking</span>
                  <p className="text-xs opacity-50">Réserve voyages, restaurants</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💻</div>
                  <span className="text-sm">Agent développeur</span>
                  <p className="text-xs opacity-50">Loue compute, paie API</p>
                </div>
              </div>
              <h5 className="font-semibold mb-3">Pourquoi les rails traditionnels ne fonctionnent pas :</h5>
              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-3">
                  <span className="opacity-60">Carte bancaire</span>
                  <p className="text-xs text-red-400">Validation humaine (3DS)</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-3">
                  <span className="opacity-60">Virement</span>
                  <p className="text-xs text-red-400">Trop lent (J+1)</p>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-3">
                  <span className="opacity-60">Stripe/PayPal</span>
                  <p className="text-xs text-red-400">Frais prohibitifs micro-paiements</p>
                </div>
              </div>
              <div className="bg-[var(--accent)]/10 rounded-xl p-4">
                <h5 className="font-semibold text-[var(--accent)] mb-2">La crypto = la seule solution</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>✓ Programmable (Smart contracts)</span>
                  <span>✓ Instantané (secondes)</span>
                  <span>✓ Micro-paiements (frais L2)</span>
                  <span>✓ 24/7 (agents non-stop)</span>
                </div>
              </div>
              <Callout type="personal">
                <strong>Pourquoi j&apos;y crois :</strong> Je développe moi-même des agents IA.
                Je vois le goulot d&apos;étranglement du paiement. Coinhouse a la régulation, la sécurité, l&apos;expérience B2B.
                <strong> Il manque quelqu&apos;un pour raconter cette histoire.</strong>
              </Callout>
            </Tab>
          </StrategyTabs>
        </div>
      </section>

      {/* ============================================ */}
      {/* FUNNEL & UPGRADE */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-8 text-center">5. Parcours d&apos;upgrade client</h3>
          </RevealOnScroll>

          <div className="space-y-2 mb-12">
            <FunnelStep
              level={1}
              name="Compte Gratuit"
              price="0€"
              features={["Accès basique", "Frais 0.99%"]}
              trigger="1er achat, découverte"
            />
            <FunnelArrow label='Email : "Économisez avec Investor"' />
            <FunnelStep
              level={2}
              name="Investor"
              price="9,90€/mois"
              features={["Gratuit jusqu'à 3K€/mois", "Frais 0.69%"]}
              trigger="Investisseur actif"
              highlight
            />
            <FunnelArrow label="Appel conseiller proposé" />
            <FunnelStep
              level={3}
              name="Gestion Privée"
              price="798€/an"
              features={["Conseiller dédié", "Service premium"]}
              trigger="Encours > 50K€"
            />
          </div>

          <RevealOnScroll>
            <h4 className="font-semibold mb-4">Automatisations à déployer</h4>
          </RevealOnScroll>
          <div className="grid md:grid-cols-2 gap-4">
            <TriggerCard trigger="Pas de login 30 jours" action="Email personnalisé + état portfolio" />
            <TriggerCard trigger="Consultation prix sans achat" action="Push notification" />
            <TriggerCard trigger="Anniversaire 1er achat" action="Bilan personnalisé" />
            <TriggerCard trigger="Baisse crypto -20%" action="Message rassurant + pédagogie" />
          </div>

          <Callout type="proof">
            <strong>Mon expérience :</strong> 140+ scénarios d&apos;automation en production chez Lagardère.
            Churn stable malgré +29% de hausse de prix.
          </Callout>
        </div>
      </section>

      {/* ============================================ */}
      {/* PLAN 90 JOURS */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-2 text-center">6. Mon plan à 90 jours</h3>
            <p className="opacity-60 text-center mb-12">Ce que je ferais en arrivant chez Coinhouse</p>
          </RevealOnScroll>

          <Timeline>
            <TimelineMonth month={1} title="Immersion & Quick Wins">
              <TimelineItem status="ready">Audit complet funnel (taux conversion par étape)</TimelineItem>
              <TimelineItem status="ready">Analyse cohortes (qui reste ? qui part ? pourquoi ?)</TimelineItem>
              <TimelineItem status="ready">Identification des 3 plus gros points de friction</TimelineItem>
              <TimelineItem status="quick-win" highlight>Quick win #1 : Optimisation page inscription (A/B test)</TimelineItem>
              <TimelineItem status="quick-win" highlight>Quick win #2 : Séquence email &quot;bienvenue&quot; repensée</TimelineItem>
            </TimelineMonth>

            <TimelineMonth month={2} title="Structuration">
              <TimelineItem>Mise en place tracking comportemental complet</TimelineItem>
              <TimelineItem>Segmentation base (actifs/dormants/churners)</TimelineItem>
              <TimelineItem>Création 10 premiers scénarios automation</TimelineItem>
              <TimelineItem highlight>Lancement production Shorts (10/semaine)</TimelineItem>
              <TimelineItem>Brief CM pour gestion réseaux Valente/Desachy</TimelineItem>
            </TimelineMonth>

            <TimelineMonth month={3} title="Accélération">
              <TimelineItem>Recyclage systématique YouTube → Shorts → Reels → TikTok</TimelineItem>
              <TimelineItem highlight>Activation programme B2B &quot;Crypto Trésorerie&quot;</TimelineItem>
              <TimelineItem>Premiers résultats mesurables</TimelineItem>
              <TimelineItem>Article thought leadership &quot;Agents IA et crypto&quot;</TimelineItem>
              <TimelineItem>Roadmap Q2-Q4 validée avec direction</TimelineItem>
            </TimelineMonth>
          </Timeline>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONVICTION SECTION */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <div className="text-6xl mb-8 text-[var(--accent)]">₿</div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed">
              <TypewriterText text="Je suis bitcoiner. Fasciné par cette technologie qui redéfinit la confiance et la valeur. Bitcoin, c'est une promesse de liberté financière." />
            </blockquote>
            <p className="mt-8 text-xl opacity-60">
              Coinhouse construit l&apos;infrastructure de ce nouveau monde —{" "}
              <span className="text-[var(--accent)]">je veux y contribuer.</span>
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              15 minutes pour en parler ?
            </h2>
            <p className="opacity-50 mb-12 text-lg">
              Je suis disponible pour un call rapide. Pas de pitch, juste une discussion.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="mailto:charles.bonnet@pm.me?subject=Candidature%20Marketing%20Manager%20Coinhouse&body=Bonjour%20Charles,%0A%0AJ'ai%20vu%20votre%20page%20de%20candidature%20et%20j'aimerais%20échanger%20avec%20vous."
                className="inline-flex items-center gap-3 bg-[var(--accent)] text-white font-semibold px-8 py-4 rounded-full text-lg overflow-hidden group hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredCTA(true)}
                onMouseLeave={() => setHoveredCTA(false)}
              >
                <span>M&apos;envoyer un email</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>

              <motion.a
                href="/"
                className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 font-medium px-6 py-4 rounded-full border border-[var(--foreground)]/20 hover:border-[var(--accent)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Voir mon CV complet
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.a>
            </div>

            <AnimatePresence>
              {hoveredCTA && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 text-sm text-[var(--accent)]"
                >
                  Je suis disponible immédiatement
                </motion.p>
              )}
            </AnimatePresence>
          </RevealOnScroll>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="py-8 px-6 border-t border-[var(--foreground)]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="opacity-50 text-sm">Charles Bonnet — {new Date().getFullYear()}</p>
          <p className="opacity-50 text-sm">
            Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block text-[var(--accent)]"
            >
              ₿
            </motion.span>
            {" "}et du code
          </p>
        </div>
      </footer>
    </div>
  );
}
