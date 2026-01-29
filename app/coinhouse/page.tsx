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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
  const [activeTab, setActiveTab] = useState<"presse" | "crypto">("presse");

  const comparisons = [
    { presse: "Funnel abonnement", crypto: "Funnel onboarding client" },
    { presse: "Scoring leads (chaud/froid)", crypto: "Scoring prospects (retail/premium)" },
    { presse: "Churn & rétention", crypto: "Churn & réactivation" },
    { presse: "LTV / CAC", crypto: "LTV / CAC" },
    { presse: "Nurturing email", crypto: "Nurturing email" },
    { presse: "Upsell (print → digital)", crypto: "Upsell (basic → premium)" },
    { presse: "Pédagogie éditoriale", crypto: "Pédagogie crypto" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab("presse")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "presse"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
            }`}
          >
            Ce que j&apos;ai fait (Presse)
          </button>
          <button
            onClick={() => setActiveTab("crypto")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "crypto"
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
                {activeTab === "presse" ? item.presse : item.crypto}
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            <p className="text-sm text-[var(--foreground)] whitespace-nowrap font-mono">{message}</p>
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
        <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden font-mono transition-colors duration-300">
      <FloatingAssistant />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Back to home */}
      <motion.a
        href="/"
        className="fixed top-6 left-6 z-50 text-[var(--foreground)] opacity-50 hover:opacity-100 transition-opacity font-mono text-sm"
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
              5 ans à transformer des lecteurs en abonnés.
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
            <KPICard value={140} suffix="+" label="Scénarios d'automation IA en production" delay={0.4} />
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
              Presse → Crypto : <span className="text-[var(--accent)]">mêmes mécaniques</span>
            </h2>
            <p className="text-[var(--foreground)] opacity-50 text-center mb-12 max-w-2xl mx-auto">
              Le produit change, les fondamentaux restent. Acquisition, conversion, rétention.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <AnimatedStat value={33} suffix="%" label="des Français veulent acheter crypto" highlight />
            <AnimatedStat value="17M" suffix="" label="de prospects à convertir" />
            <AnimatedStat value="1er" suffix="" label="PSAN français (2020)" />
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
              <Callout type="insight">
                Le problème n&apos;est pas la notoriété. C&apos;est le passage à l&apos;acte.
                <strong> La pédagogie est la clé.</strong>
              </Callout>
            </AccordionItem>

            <AccordionItem title="🌍 Benchmark international">
              <BarChart
                data={[
                  { country: "Pays-Bas", value: 17 },
                  { country: "UK", value: 16 },
                  { country: "Allemagne", value: 12 },
                  { country: "France", value: 10, highlight: true },
                ]}
              />
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
                <strong> Exactement ce dont Coinhouse a besoin.</strong>
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
            Trade Republic est la vraie menace sur le segment débutant — on les bat par la <strong>valeur de l&apos;accompagnement</strong>, pas par le prix.
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
                    <li>• Newsletter → 20% ouverture, 2% clic</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-[var(--accent)]">✅ Ma proposition : &quot;Coinhouse Everywhere&quot;</h4>
                  <p className="text-sm mb-4">Publier <strong>50+ contenus/semaine</strong> grâce à l&apos;IA et au recyclage systématique.</p>
                  <PyramidChart
                    levels={[
                      { label: "1 Masterclass YouTube (45 min)", width: "40%" },
                      { label: "→ 10-15 Shorts extraits", width: "70%" },
                      { label: "→ Recyclage Reels + TikTok + LinkedIn", width: "100%" },
                    ]}
                  />
                </div>
              </div>
              <div className="mt-6">
                <h5 className="font-semibold mb-3">Volume de publication</h5>
                <ComparisonBar label="YouTube Shorts" before="~0/sem" after="10/sem" />
                <ComparisonBar label="TikTok" before="faible" after="15/sem" />
                <ComparisonBar label="LinkedIn vidéo" before="rare" after="5/sem" />
              </div>
              <Callout type="proof">
                <strong>Coût 2025 :</strong> Script IA + voix clonée + montage auto =
                <strong> 20+ vidéos/mois pour le prix d&apos;une en 2020.</strong> Plus d&apos;excuses.
              </Callout>
            </Tab>

            <Tab icon="👥" title="Double ambassadeur" tagline="Le Sage + Le Guide quotidien">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-6 border border-[var(--foreground)]/10">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mb-4 text-xl">ÉL</div>
                  <h4 className="font-bold text-lg">Éric Larchevêque</h4>
                  <span className="text-sm text-[var(--accent)]">&quot;Le Sage&quot;</span>
                  <ul className="mt-4 space-y-2 text-sm opacity-70">
                    <li>• Interventions mensuelles de fond</li>
                    <li>• Keynotes, podcasts longs</li>
                    <li>• Campagnes institutionnelles</li>
                    <li>• Cible : patrimoniaux, médias</li>
                  </ul>
                </div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-6 border border-[var(--accent)]/30">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mb-4 text-xl">👤</div>
                  <h4 className="font-bold text-lg">Le &quot;Guide Coinhouse&quot;</h4>
                  <span className="text-sm text-[var(--accent)]">Présence quotidienne</span>
                  <ul className="mt-4 space-y-2 text-sm opacity-70">
                    <li>• Actu crypto du jour (60 sec)</li>
                    <li>• Question de la semaine</li>
                    <li>• Live Q&A hebdo</li>
                    <li>• Cible : 18-34 ans, nouveaux entrants</li>
                  </ul>
                </div>
              </div>
              <Callout type="insight">
                <strong>Note :</strong> Valente et Desachy ont déjà une présence sociale.
                Un <strong>Community Manager</strong> peut gérer la production, les laissant se concentrer sur le fond.
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
              <div className="mb-6">
                <h4 className="font-bold mb-3">Aujourd&apos;hui : B2B = 30% du CA</h4>
                <p className="opacity-60">Segment sous-exploité avec un potentiel énorme.</p>
              </div>
              <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 mb-6">
                <h5 className="font-semibold mb-3">Le problème des entreprises</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="opacity-60">Virement SWIFT</span>
                    <p>3-5 jours, 25-50€ de frais</p>
                  </div>
                  <div>
                    <span className="text-[var(--accent)]">Stablecoin</span>
                    <p className="text-[var(--accent)] font-bold">10 minutes, 0.5-2€ de frais</p>
                  </div>
                </div>
              </div>
              <h5 className="font-semibold mb-3">Cibles prioritaires</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-3 text-sm">🛒 E-commerçants internationaux</div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-3 text-sm">💻 Agences/ESN offshore</div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-3 text-sm">📦 Importateurs/Exportateurs</div>
                <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-3 text-sm">🌍 Startups remote</div>
              </div>
              <Callout type="action">
                Les DAF détestent les frais SWIFT.
                <strong> Personne ne leur a encore expliqué clairement que les stablecoins résolvent ce problème.</strong>
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
              <TypewriterText text="Je suis bitcoiner. Pas spéculateur, pas touriste des bull runs. Quelqu'un qui croit à la liberté et à la souveraineté que représente Bitcoin." />
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
