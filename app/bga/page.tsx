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
  FunnelStep,
  FunnelArrow,
  DataTable,
  KPIDashboard,
  TriggerCard,
  PyramidChart,
  BarChart,
  EmailFlowTable,
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
  const [activeTab, setActiveTab] = useState<"media" | "gaming">("media");

  const comparisons = [
    { media: "Funnel abonnement presse", gaming: "Funnel Free-to-Paid BGA" },
    { media: "Scoring leads (chaud/froid)", gaming: "Scoring joueurs (casual/hardcore)" },
    { media: "Churn & rétention abonnés", gaming: "Churn & rétention J28" },
    { media: "LTV / CAC", gaming: "LTV / CAC" },
    { media: "Nurturing email séquentiel", gaming: "CRM & email automation gaming" },
    { media: "Stratégies d'upsell (basic→premium)", gaming: "Upgrade Free→Premium" },
    { media: "Pédagogie éditoriale", gaming: "Onboarding & tutoriels interactifs" },
    { media: "Vulgarisation de sujets complexes", gaming: "Gamification & Season Pass" },
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
            onClick={() => setActiveTab("gaming")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === "gaming"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
              }`}
          >
            Ce que je ferai (BGA)
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {comparisons.map((item, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ x: activeTab === "gaming" ? 10 : 0 }}
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
                {activeTab === "media" ? item.media : item.gaming}
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

      if (scrollPercent < 0.08) {
        setMessage("Bienvenue !");
      } else if (scrollPercent < 0.15) {
        setMessage("Ces chiffres sont réels.");
      } else if (scrollPercent < 0.22) {
        setMessage("Mêmes mécaniques, nouveau terrain.");
      } else if (scrollPercent < 0.35) {
        setMessage("J'ai étudié BGA en profondeur...");
      } else if (scrollPercent < 0.5) {
        setMessage("6 piliers, 0 blabla.");
      } else if (scrollPercent < 0.65) {
        setMessage("Le phygital, c'est la clé.");
      } else if (scrollPercent < 0.8) {
        setMessage("Un plan concret, pas une wishlist.");
      } else if (scrollPercent < 0.9) {
        setMessage("GG, bien joué !");
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
export default function BGAPage() {
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
                Growth Officer — Board Game Arena (Asmodee Group)
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Pourquoi <span className="text-[var(--accent)]">moi</span>
              <br />
              pour <span className="text-[var(--accent)]">Board Game Arena</span>
            </h1>

            <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto">
              Depuis 2019, je transforme des lecteurs en abonnés.
              <br />
              <span className="opacity-100 text-[var(--foreground)]">Prêt à transformer des joueurs gratuits en Premium.</span>
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
              Des chiffres concrets issus de plus de 6 ans en subscription economics. Pas du blabla.
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
                  <span className="opacity-60">Direction Board Game Arena.</span>
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
              Média → Gaming : <span className="text-[var(--accent)]">mêmes mécaniques</span>
            </h2>
            <p className="text-[var(--foreground)] opacity-50 text-center mb-4 max-w-2xl mx-auto">
              Le produit change, les fondamentaux restent. Acquisition, conversion, rétention.
            </p>
            <p className="text-[var(--foreground)] opacity-70 text-center mb-12 max-w-2xl mx-auto text-sm">
              <strong>Le freemium gaming est un défi éditorial :</strong> onboarder des joueurs novices, les accompagner vers la maîtrise, les convertir en abonnés fidèles. C&apos;est exactement ce que je fais depuis plus de 6 ans dans les médias.
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
              Ma vision stratégique pour <span className="text-[var(--accent)]">BGA</span>
            </h2>
            <p className="text-[var(--foreground)] opacity-60 text-center mb-12 max-w-3xl mx-auto text-lg">
              J&apos;ai passé des heures à analyser la plateforme, le marché, les concurrents, les données de trafic.
              Voici mon plan de croissance 2025-2028 structuré en 6 piliers.
            </p>
          </RevealOnScroll>

          {/* Stats Teaser */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <AnimatedStat value="$2.27B" suffix="" label="Marché jeu de société en ligne (2025)" highlight />
            <AnimatedStat value="7.1" suffix="%" label="CAGR jusqu'en 2030" />
            <AnimatedStat value="10" suffix="M+" label="Utilisateurs BGA (estimé)" highlight />
          </div>

          {/* ============================================ */}
          {/* DIAGNOSTIC MARCHÉ */}
          {/* ============================================ */}
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-6">1. Diagnostic marché</h3>
          </RevealOnScroll>

          <Accordion>
            <AccordionItem title="📊 Profil démographique des joueurs BGA" defaultOpen={true}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <AnimatedStat value={36} suffix=" ans" label="Âge moyen des joueurs" />
                <AnimatedStat value={40} suffix="%" label="18-34 ans (segment clé)" highlight />
                <AnimatedStat value={43} suffix="%" label="Joueuses (en hausse)" />
                <AnimatedStat value={68} suffix="%" label="CA du jeu en ligne = mobile (Mordor Intelligence 2024)" highlight />
              </div>
              <Callout type="insight">
                Le joueur BGA a un pouvoir d&apos;achat élevé, recherche du jeu profond, et utilise le jeu comme décompression (38,8% des +25 ans).
                <strong> La communication doit porter sur les bénéfices cognitifs et sociaux, pas juste le divertissement.</strong>
              </Callout>
            </AccordionItem>

            <AccordionItem title="🌍 Répartition géographique du trafic">
              <BarChart
                data={[
                  { country: "États-Unis", value: 29.75, highlight: true },
                  { country: "France", value: 8.84, highlight: true },
                  { country: "Canada", value: 5.56, highlight: false },
                  { country: "Allemagne", value: 4.2, highlight: false },
                  { country: "Brésil", value: 3.1, highlight: false },
                  { country: "Japon", value: 1.2, highlight: false },
                ]}
              />
              <Callout type="action">
                Domination occidentale massive. L&apos;Asie-Pacifique est le relais de croissance : le Japon à lui seul représente une culture du jeu de société en pleine explosion.
                <strong> C&apos;est le pilier 6 de mon plan.</strong>
              </Callout>
            </AccordionItem>

            <AccordionItem title="⚠️ Le problème structurel du trafic">
              <div className="space-y-4">
                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <span className="text-5xl font-bold text-[var(--accent)]">75,9%</span>
                    <p className="opacity-60 mt-2">de trafic direct</p>
                  </div>
                  <p className="text-center opacity-70">
                    Signal de marque forte, mais aussi <strong className="text-[var(--accent)]">vulnérabilité majeure</strong> : on ne prospecte pas, on attend.
                    Seulement ~9% de trafic organique.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4">
                    <p className="text-2xl font-bold">75,9%</p>
                    <p className="text-xs opacity-50">Direct</p>
                  </div>
                  <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4">
                    <p className="text-2xl font-bold">~9%</p>
                    <p className="text-xs opacity-50">Organique</p>
                  </div>
                  <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4">
                    <p className="text-2xl font-bold">~15%</p>
                    <p className="text-xs opacity-50">Autres</p>
                  </div>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ============================================ */}
      {/* ANALYSE BGA - SWOT */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-8">2. Analyse SWOT de Board Game Arena</h3>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            <FlipCard
              front={
                <div className="text-center">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-xl font-bold mb-2">Forces</h3>
                  <p className="opacity-60">4 avantages concurrentiels majeurs</p>
                </div>
              }
              back={
                <ul className="space-y-3 text-sm">
                  <li><strong className="text-[var(--accent)]">Catalogue sous licence unique</strong> — Accès prioritaire aux titres Asmodee (7 Wonders, Carcassonne, Azul)</li>
                  <li><strong className="text-[var(--accent)]">Zéro barrière technique</strong> — Navigateur, aucun téléchargement, tous supports</li>
                  <li><strong className="text-[var(--accent)]">Mode asynchrone</strong> — Tour par tour, engagement constant sur plusieurs jours</li>
                  <li><strong className="text-[var(--accent)]">BGA Studio</strong> — Framework de développement ouvert, écosystème agile</li>
                </ul>
              }
            />

            <FlipCard
              front={
                <div className="text-center">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-xl font-bold mb-2">Faiblesses à résoudre</h3>
                  <p className="opacity-60">4 chantiers critiques identifiés</p>
                </div>
              }
              back={
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">●</span>
                    <div>
                      <strong>App mobile sous-optimale</strong>
                      <p className="opacity-60">Simple wrapper web, déconnexions, UX médiocre</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">●</span>
                    <div>
                      <strong>Interface datée (UI/UX)</strong>
                      <p className="opacity-60">Densité d&apos;information élevée, difficile sur petit écran</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">●</span>
                    <div>
                      <strong>Modération communautaire</strong>
                      <p className="opacity-60">Perception négative, support technique limité</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">●</span>
                    <div>
                      <strong>Dépendance au bénévolat</strong>
                      <p className="opacity-60">Traduction et débogage par la communauté</p>
                    </div>
                  </div>
                </div>
              }
            />

            <FlipCard
              front={
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold mb-2">Opportunités</h3>
                  <p className="opacity-60">4 leviers de croissance inexploités</p>
                </div>
              }
              back={
                <ul className="space-y-3 text-sm">
                  <li><strong className="text-green-400">Data phygitale</strong> — Prédire les ventes physiques avec les habitudes de jeu numériques</li>
                  <li><strong className="text-green-400">Expansion Asie</strong> — Japon, Corée, Asie du Sud-Est : marchés en explosion</li>
                  <li><strong className="text-green-400">Streaming & e-sport</strong> — Twitch Plays Catan a prouvé le potentiel</li>
                  <li><strong className="text-green-400">IA & tutoriels</strong> — IA pour expliquer les règles en temps réel selon les coups joués</li>
                </ul>
              }
            />

            <FlipCard
              front={
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold mb-2">Menaces</h3>
                  <p className="opacity-60">3 risques à anticiper</p>
                </div>
              }
              back={
                <ul className="space-y-3 text-sm">
                  <li><strong className="text-red-400">Fragmentation du marché</strong> — Apps dédiées haute qualité par les éditeurs (Nomad Games, Dire Wolf Digital)</li>
                  <li><strong className="text-red-400">Coûts d&apos;acquisition en hausse</strong> — Fin des cookies, ciblage plus complexe et coûteux</li>
                  <li><strong className="text-red-400">Fatigue numérique</strong> — Retour post-pandémie vers le jeu physique pour la déconnexion</li>
                </ul>
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

          <DataTable
            headers={["Technologie", "Règles", "Matchmaking", "Modèle", "Accessibilité"]}
            dataKeys={["tech", "rules", "matchmaking", "model", "access"]}
            rows={[
              {
                name: "Board Game Arena",
                highlight: true,
                data: {
                  tech: "Navigateur (natif)",
                  rules: "100% automatisées",
                  matchmaking: "Elo, Ranked, Tournois",
                  model: "Freemium ($42/an)",
                  access: "Très haute",
                },
              },
              {
                name: "Tabletop Simulator",
                data: {
                  tech: "Steam (moteur physique)",
                  rules: "Manuelles",
                  matchmaking: "Limité (groupes privés)",
                  model: "Achat unique ($20)",
                  access: "Basse (PC puissant)",
                },
              },
              {
                name: "Tabletopia",
                data: {
                  tech: "Navigateur + Steam (3D)",
                  rules: "Partiellement auto.",
                  matchmaking: "Modéré",
                  model: "Freemium (Silver/Gold)",
                  access: "Moyenne",
                },
              },
            ]}
          />

          <Callout type="insight">
            <strong>Ma lecture :</strong> BGA domine sur l&apos;accessibilité et l&apos;automatisation des règles.
            Le vrai avantage, c&apos;est que l&apos;utilisateur n&apos;a rien à installer et que les règles sont codées en dur.
            TTS séduit les hardcore gamers. <strong>BGA doit rester le choix évident pour 95% des joueurs</strong> — et résoudre le mobile.
          </Callout>
        </div>
      </section>

      {/* ============================================ */}
      {/* 6 PILIERS STRATÉGIQUES */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-8">4. Mes 6 piliers stratégiques</h3>
          </RevealOnScroll>

          <StrategyTabs>
            {/* ============================================ */}
            {/* PILIER 1 — ACQUISITION */}
            {/* ============================================ */}
            <Tab icon="🎯" title="Acquisition" tagline="Diversifier les sources de trafic au-delà du 75,9% direct">
              <div className="space-y-8">
                {/* SEO/Content */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">1.1</span>
                    SEO/Content : devenir le &quot;Wikipedia du jeu de société&quot;
                  </h5>
                  <p className="text-sm opacity-70 mb-4">
                    Capter l&apos;intent informationnel en amont du funnel. Chaque jeu du catalogue (1 200+) doit avoir une landing page optimisée.
                  </p>
                  <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5">
                    <h6 className="font-semibold mb-3">Exécution concrète</h6>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Template SEO par jeu : règles, stratégies, vidéos + CTA direct vers la table de jeu</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Cibler la longue traîne : &quot;comment jouer à Ark Nova en ligne&quot;, &quot;7 Wonders stratégie débutant&quot;</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Blog éditorialisé : tops, guides saisonniers, analyses de méta</li>
                    </ul>
                    <div className="mt-4 bg-[var(--accent)]/10 rounded-lg p-3 text-sm text-center">
                      <strong>KPI cible :</strong> passer de ~9% à <span className="text-[var(--accent)] font-bold">20% de trafic organique</span> en 18 mois
                    </div>
                  </div>
                </div>

                {/* Paid Acquisition */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">1.2</span>
                    Paid Acquisition ciblée
                  </h5>
                  <p className="text-sm opacity-70 mb-4">Pas de spray-and-pray. 3 segments précis :</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 border-l-4 border-[var(--accent)]">
                      <h6 className="font-semibold text-sm mb-2">Joueurs physiques curieux</h6>
                      <p className="text-xs opacity-60 mb-2">YouTube pre-roll + Meta</p>
                      <p className="text-sm text-[var(--accent)]">&quot;Ton jeu préféré, jouable en 2 clics&quot;</p>
                      <p className="text-xs opacity-40 mt-2">40% du budget</p>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 border-l-4 border-blue-500">
                      <h6 className="font-semibold text-sm mb-2">Gamers casual mobile</h6>
                      <p className="text-xs opacity-60 mb-2">TikTok + App Store Ads</p>
                      <p className="text-sm text-blue-400">&quot;Une partie en 15 min pendant ta pause&quot;</p>
                      <p className="text-xs opacity-40 mt-2">35% du budget</p>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 border-l-4 border-purple-500">
                      <h6 className="font-semibold text-sm mb-2">Lapsed users (inactifs)</h6>
                      <p className="text-xs opacity-60 mb-2">Email + retargeting Meta</p>
                      <p className="text-sm text-purple-400">&quot;Tes amis jouent ce soir — rejoins-les&quot;</p>
                      <p className="text-xs opacity-40 mt-2">25% du budget</p>
                    </div>
                  </div>
                </div>

                {/* Ambassador Program */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">1.3</span>
                    Programme d&apos;Ambassadeurs structuré
                  </h5>
                  <p className="text-sm opacity-70 mb-4">
                    Les &quot;points cadeaux&quot; actuels sont insuffisants. Programme à 3 tiers :
                  </p>
                  <PyramidChart
                    levels={[
                      { label: "Tier 3 — Partenaires (>50k abonnés) : cosmétiques personnalisés + revenue share", width: "100%" },
                      { label: "Tier 2 — Créateurs (<50k) : accès anticipé + co-branding", width: "75%" },
                      { label: "Tier 1 — Contributeurs : traducteurs, beta-testeurs → Premium gratuit + badge", width: "50%" },
                    ]}
                  />
                  <div className="mt-4 bg-[var(--accent)]/10 rounded-lg p-3 text-sm text-center">
                    <strong>KPI :</strong> générer <span className="text-[var(--accent)] font-bold">15% des nouvelles inscriptions</span> via les ambassadeurs d&apos;ici fin 2026
                  </div>
                </div>

                <Callout type="proof">
                  <strong>Mon expérience :</strong> J&apos;ai lancé VA Plus (500K abonnés) et géré l&apos;acquisition sur des marchés matures.
                  Le SEO, le paid et les ambassadeurs sont mes trois leviers natifs.
                </Callout>
              </div>
            </Tab>

            {/* ============================================ */}
            {/* PILIER 2 — CONVERSION */}
            {/* ============================================ */}
            <Tab icon="💰" title="Conversion" tagline="Optimiser le tunnel Free-to-Paid de 5% à 8%">
              <div className="space-y-8">
                {/* Paywall Redesign */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">2.1</span>
                    Refonte du Paywall
                  </h5>
                  <p className="text-sm opacity-70 mb-4">
                    Le passage à $42/an est un signal prix fort. Pour protéger la conversion :
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border border-[var(--foreground)]/10">
                      <div className="text-2xl mb-3">🎁</div>
                      <h6 className="font-semibold mb-2">Essai 7 jours</h6>
                      <p className="text-sm opacity-70">Déclenché après la 5e partie (moment de hook prouvé). Pas avant, pas après.</p>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border border-[var(--accent)]/30">
                      <div className="text-2xl mb-3">🌍</div>
                      <h6 className="font-semibold mb-2 text-[var(--accent)]">Pricing localisé (PPP)</h6>
                      <p className="text-sm opacity-70">$42 OK aux US, prohibitif au Brésil ou en Inde. Pricing dynamique par géo.</p>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border border-[var(--foreground)]/10">
                      <div className="text-2xl mb-3">📅</div>
                      <h6 className="font-semibold mb-2">Plan mensuel visible</h6>
                      <p className="text-sm opacity-70">Réduire la friction du commitment annuel. L&apos;upgrade annuel se fait naturellement après 3 mois.</p>
                    </div>
                  </div>
                </div>

                {/* Conversion Triggers */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">2.2</span>
                    Triggers de conversion contextuelle
                  </h5>
                  <p className="text-sm opacity-70 mb-4">
                    Plutôt qu&apos;un paywall statique, déclencher des micro-moments :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <TriggerCard trigger="Défaite serrée (score < 5pts)" action="&quot;Analyse tes stats détaillées avec Premium&quot;" />
                    <TriggerCard trigger="Ami gratuit veut créer table Premium" action="&quot;Débloquez cette table pour 0,99€ en one-shot&quot;" />
                    <TriggerCard trigger="10 parties d'un même jeu" action="&quot;Tu adores Terraforming Mars ? 200+ jeux Premium t'attendent&quot;" />
                    <TriggerCard trigger="Joueur atteint Top 100 d'un jeu" action="&quot;Débloque tes stats avancées et ton historique Elo&quot;" />
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">2.3</span>
                    Parcours d&apos;upgrade
                  </h5>
                  <div className="space-y-2">
                    <FunnelStep
                      level={1}
                      name="Joueur Gratuit"
                      price="0€"
                      features={["Accès au catalogue de base", "Rejoint les tables Premium d'amis"]}
                      trigger="Inscription, premières parties"
                    />
                    <FunnelArrow label="Après 5 parties → essai Premium 7 jours" />
                    <FunnelStep
                      level={2}
                      name="Premium"
                      price="$42/an"
                      features={["Crée des tables tous jeux", "Stats avancées, chat vocal", "Viralité : invite des amis gratuits"]}
                      trigger="Hook prouvé + essai converti"
                      highlight
                    />
                  </div>
                </div>

                <Callout type="proof">
                  <strong>Mon expérience :</strong> +29% de repricing sans churn chez Lagardère.
                  Je sais gérer l&apos;élasticité-prix d&apos;un abonnement et monitorer les cohortes post-hausse tarifaire.
                </Callout>
              </div>
            </Tab>

            {/* ============================================ */}
            {/* PILIER 3 — RÉTENTION */}
            {/* ============================================ */}
            <Tab icon="🔄" title="Rétention" tagline="Transformer le joueur occasionnel en habitué (J28 : 5,5% → 12%)">
              <div className="space-y-8">
                {/* Onboarding */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">3.1</span>
                    Onboarding repensé
                  </h5>
                  <p className="text-sm opacity-70 mb-4">
                    BGA lâche le nouveau joueur dans 1 200 jeux sans guidage. Nouveau parcours :
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 flex items-start gap-3">
                      <span className="bg-[var(--accent)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                      <div>
                        <strong>Questionnaire rapide (3 questions)</strong>
                        <p className="text-sm opacity-60">&quot;Seul ou entre amis ?&quot;, &quot;Partie rapide ou longue ?&quot;, &quot;Stratégie ou ambiance ?&quot;</p>
                      </div>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 flex items-start gap-3">
                      <span className="bg-[var(--accent)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                      <div>
                        <strong>Recommandation de 3 jeux + tutoriel interactif</strong>
                        <p className="text-sm opacity-60">Pas un PDF. Un tutoriel jouable, étape par étape.</p>
                      </div>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 flex items-start gap-3">
                      <span className="bg-[var(--accent)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                      <div>
                        <strong>Première partie guidée</strong>
                        <p className="text-sm opacity-60">Contre IA ou matchmaking &quot;débutants protégés&quot;</p>
                      </div>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-lg p-4 flex items-start gap-3">
                      <span className="bg-[var(--accent)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">4</span>
                      <div>
                        <strong>Notification J+1</strong>
                        <p className="text-sm opacity-60">&quot;Tu as joué à Carcassonne — essaie Kingdomino, c&apos;est similaire mais en 10 min&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Season Pass */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">3.2</span>
                    Le &quot;Season Pass&quot; BGA — L&apos;opportunité majeure
                  </h5>
                  <div className="bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5 rounded-2xl p-6 mb-4 border border-[var(--accent)]/30">
                    <h6 className="font-bold text-lg mb-4 text-[var(--accent)]">Exemple : Saison &quot;Exploration&quot; (Q1 2026)</h6>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-[var(--background)]/50 rounded-lg p-3">
                          <span className="text-2xl">🥉</span>
                          <div>
                            <p className="text-sm font-medium">5 parties de jeux d&apos;exploration</p>
                            <p className="text-xs text-[var(--accent)]">→ Badge Bronze</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-[var(--background)]/50 rounded-lg p-3">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <p className="text-sm font-medium">Gagner 3 parties</p>
                            <p className="text-xs text-[var(--accent)]">→ Avatar &quot;Explorateur&quot;</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-[var(--background)]/50 rounded-lg p-3">
                          <span className="text-2xl">👑</span>
                          <div>
                            <p className="text-sm font-medium">10 jeux différents complétés</p>
                            <p className="text-xs text-[var(--accent)]">→ Cadre de profil exclusif</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[var(--background)]/50 rounded-lg p-4">
                        <h6 className="font-semibold mb-2 text-sm">Ce que ça résout :</h6>
                        <ul className="space-y-2 text-sm opacity-70">
                          <li>• <strong>Diversifie les jeux joués</strong> — réduit la dépendance aux 10 titres phares</li>
                          <li>• <strong>Engagement récurrent</strong> — mécanique FOMO par saison</li>
                          <li>• <strong>Classement saisonnier</strong> — récompenses (mois Premium, réductions boutique Asmodee)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM & Email */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">3.3</span>
                    CRM & email automation
                  </h5>
                  <p className="text-sm opacity-70 mb-4">La newsletter est &quot;sous-exploitée&quot; (rapport). Flows prioritaires :</p>
                  <EmailFlowTable
                    flows={[
                      { name: "Welcome series", trigger: "Inscription", content: "5 emails / 14 jours (tuto, 1er jeu, inviter ami, Premium, feedback)", objective: "Activation" },
                      { name: "Win-back", trigger: "Inactif 14 jours", content: "\"Tes amis ont joué 12 parties sans toi\"", objective: "Réactivation" },
                      { name: "Churn prevention", trigger: "Abo. expire J-30", content: "Récap stats annuelles + offre -15%", objective: "Rétention Premium" },
                      { name: "Cross-sell phygital", trigger: "20+ parties d'un jeu", content: "\"Tu maîtrises Azul — offre-toi la boîte\" + code promo", objective: "Revenue Asmodee" },
                    ]}
                  />
                </div>

                <Callout type="proof">
                  <strong>Mon expérience :</strong> 140+ scénarios d&apos;automation en production. Welcome series, win-back, churn prevention — c&apos;est mon quotidien depuis plus de 6 ans.
                </Callout>
              </div>
            </Tab>

            {/* ============================================ */}
            {/* PILIER 4 — MOBILE */}
            {/* ============================================ */}
            <Tab icon="📱" title="Mobile" tagline="Résoudre le talon d'Achille (68% du CA du jeu en ligne = mobile)">
              <div className="space-y-8">
                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-6 mb-4">
                  <blockquote className="text-lg text-center">
                    68% du CA du marché du jeu en ligne est généré sur mobile (Mordor Intelligence, 2024), et l&apos;app BGA est un wrapper web sous-performant.
                    <strong className="text-[var(--accent)]"> C&apos;est le frein n°1 à la croissance.</strong>
                  </blockquote>
                </div>

                <div>
                  <h5 className="font-semibold mb-4">Roadmap Mobile itérative (pas de refonte big-bang)</h5>

                  <div className="space-y-4">
                    {/* Phase 1 */}
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border-l-4 border-[var(--accent)]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">Phase 1</span>
                        <span className="text-sm opacity-60">Q3 2025 — Quick wins sur l&apos;app existante</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Optimiser temps de chargement (objectif &lt;3s)</li>
                        <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Corriger les déconnexions en cours de partie (problème n°1 des reviews)</li>
                        <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Accès direct &quot;Reprendre ma partie&quot; et &quot;Rejoindre un ami&quot;</li>
                      </ul>
                    </div>

                    {/* Phase 2 */}
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">Phase 2</span>
                        <span className="text-sm opacity-60">Q1 2026 — Progressive Web App (PWA)</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2"><span className="text-blue-400">→</span> Notifications push natives</li>
                        <li className="flex items-start gap-2"><span className="text-blue-400">→</span> Mode hors-ligne pour le tour par tour</li>
                        <li className="flex items-start gap-2"><span className="text-blue-400">→</span> Interface adaptative (pas responsive bricolé)</li>
                      </ul>
                    </div>

                    {/* Phase 3 */}
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border-l-4 border-purple-500">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">Phase 3</span>
                        <span className="text-sm opacity-60">Q3 2026 — Features mobiles exclusives</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2"><span className="text-purple-400">→</span> Mode &quot;Commute&quot; : parties de 5 min calibrées pour le trajet</li>
                        <li className="flex items-start gap-2"><span className="text-purple-400">→</span> Widgets iOS/Android : &quot;Ton tour !&quot; sur l&apos;écran d&apos;accueil</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--accent)]/10 rounded-lg p-4 text-center">
                  <strong>Objectif :</strong> réduire le taux de rebond mobile de <span className="text-[var(--accent)] font-bold">30%</span> et atteindre{" "}
                  <span className="text-[var(--accent)] font-bold">50% des parties jouées sur mobile</span> d&apos;ici fin 2027
                </div>
              </div>
            </Tab>

            {/* ============================================ */}
            {/* PILIER 5 — SYNERGIES PHYGITALES */}
            {/* ============================================ */}
            <Tab icon="🎲" title="Synergies Phygitales" tagline="Le vrai différenciateur Asmodee qu'aucun concurrent ne peut répliquer">
              <div className="space-y-8">
                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-6 mb-4">
                  <blockquote className="text-lg text-center">
                    BGA est adossé au <strong className="text-[var(--accent)]">plus gros éditeur mondial de jeux de société</strong>.
                    C&apos;est un avantage structurel qu&apos;aucun concurrent ne peut répliquer.
                  </blockquote>
                </div>

                {/* Try Before You Buy */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">5.1</span>
                    &quot;Try Before You Buy&quot; systématisé
                  </h5>
                  <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-[var(--accent)]/20 border border-[var(--accent)]/40 rounded-lg px-6 py-3 text-center w-full">
                        <span className="text-[var(--accent)] font-bold">Fin de partie sur BGA</span>
                      </div>
                      <div className="text-[var(--accent)]">↓</div>
                      <div className="bg-[var(--foreground)]/5 rounded-lg p-4 text-center w-full">
                        <strong>&quot;Tu as adoré cette partie ?&quot;</strong>
                        <p className="text-sm opacity-60 mt-1">Commande le jeu physique — code promo BGAPLAYER -10%</p>
                      </div>
                      <div className="text-[var(--accent)]">↓</div>
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <div className="bg-[var(--foreground)]/5 rounded-lg p-3 text-center text-sm">
                          <strong>Boutique Asmodee</strong>
                          <p className="text-xs opacity-50">Lien direct</p>
                        </div>
                        <div className="bg-[var(--foreground)]/5 rounded-lg p-3 text-center text-sm">
                          <strong>Retailers partenaires</strong>
                          <p className="text-xs opacity-50">Amazon, FNAC, etc.</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm opacity-60 mt-4">
                      Tracking d&apos;attribution : mesurer le taux de conversion numérique→physique par titre
                    </p>
                  </div>
                  <Callout type="insight">
                    <strong>Co-lancement systématique :</strong> chaque nouveau jeu Asmodee sort simultanément en boîte ET sur BGA. Le digital devient le showroom.
                  </Callout>
                </div>

                {/* Board Game Cafés */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">5.2</span>
                    Programme &quot;Cafés-Jeux&quot; — Opportunité B2B
                  </h5>
                  <div className="bg-gradient-to-r from-[var(--bot-bubble-bg)] to-[var(--background)] rounded-2xl p-6 border border-[var(--foreground)]/10">
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold text-[var(--accent)]">7 500+</span>
                      <p className="opacity-60">board game cafés dans le monde</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-semibold mb-2">Abonnement &quot;BGA Pro&quot;</h6>
                        <p className="text-sm opacity-60 mb-2">200-500€/an pour les établissements</p>
                        <ul className="space-y-1 text-sm opacity-70">
                          <li>• Accès catalogue complet sur tablettes/écrans</li>
                          <li>• Fonctionnalité &quot;Scan & Play&quot;</li>
                          <li>• Commission sur ventes physiques générées</li>
                        </ul>
                      </div>
                      <div className="bg-[var(--accent)]/10 rounded-lg p-4">
                        <h6 className="font-semibold mb-2 text-[var(--accent)]">Scan & Play</h6>
                        <div className="space-y-2 text-sm">
                          <p>1. Scanner QR code d&apos;une boîte physique</p>
                          <p>2. Lancer le tutoriel digital sur BGA</p>
                          <p>3. Jouer la première partie guidée</p>
                          <p>4. Acheter la boîte sur place</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Phygitale */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">5.3</span>
                    Data phygitale — Mine d&apos;or pour Asmodee
                  </h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <strong className="text-sm">Jeux les plus joués</strong>
                      <p className="text-xs opacity-50 mt-1">→ Signal de demande pour les rééditions</p>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">⚠️</div>
                      <strong className="text-sm">Fort taux d&apos;abandon</strong>
                      <p className="text-xs opacity-50 mt-1">→ Signal de problème de game design</p>
                    </div>
                    <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">🔗</div>
                      <strong className="text-sm">Combinaisons de jeux</strong>
                      <p className="text-xs opacity-50 mt-1">→ Recommandation de bundles physiques</p>
                    </div>
                  </div>
                  <Callout type="action">
                    <strong>Livrable :</strong> un dashboard trimestriel aux équipes éditoriales Asmodee avec ces insights.
                    Prouver la valeur de BGA au board.
                  </Callout>
                </div>
              </div>
            </Tab>

            {/* ============================================ */}
            {/* PILIER 6 — EXPANSION GÉOGRAPHIQUE */}
            {/* ============================================ */}
            <Tab icon="🌏" title="Expansion Géo" tagline="L'Asie comme relais de croissance">
              <div className="space-y-8">
                {/* Japan */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">6.1</span>
                    🇯🇵 Japon (Priorité 1)
                  </h5>
                  <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5 border border-[var(--accent)]/30">
                    <p className="text-sm opacity-70 mb-4">
                      Culture du jeu de société en pleine explosion + pouvoir d&apos;achat élevé.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Localisation complète (UI + 100 jeux top)</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Partenariats éditeurs japonais (Oink Games, Japon Brand)</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Campagne avec YouTubeurs/VTubers gaming japonais</li>
                    </ul>
                    <div className="mt-4 bg-[var(--accent)]/10 rounded-lg p-3 text-sm text-center">
                      <strong>Objectif :</strong> <span className="text-[var(--accent)] font-bold">500K utilisateurs japonais</span> enregistrés d&apos;ici 2027
                    </div>
                  </div>
                </div>

                {/* Korea & SEA */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">6.2</span>
                    🇰🇷 Corée du Sud & Asie du Sud-Est (Priorité 2)
                  </h5>
                  <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Pricing adapté (PPP)</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Intégration paiements locaux (KakaoPay, GrabPay)</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Partenariats avec les chaînes de board game cafés locales</li>
                    </ul>
                  </div>
                </div>

                {/* Brazil / LATAM */}
                <div>
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-1 rounded-full">6.3</span>
                    🇧🇷 Brésil / Amérique Latine (Priorité 3)
                  </h5>
                  <div className="bg-[var(--bot-bubble-bg)] rounded-xl p-5">
                    <p className="text-sm opacity-70 mb-3">
                      Marché en croissance rapide, communauté passionnée mais sensible au prix.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Pricing localisé indispensable</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Partenariats communauté locale</li>
                      <li className="flex items-start gap-2"><span className="text-[var(--accent)]">→</span> Localisation portugais prioritaire</li>
                    </ul>
                  </div>
                </div>

                <Callout type="insight">
                  <strong>Le levier PPP :</strong> un abonnement à $42/an est accessible aux US, prohibitif au Brésil ou en Inde.
                  Le pricing localisé est le pré-requis à toute expansion géographique. C&apos;est le pilier 2 (Conversion) qui rend le pilier 6 possible.
                </Callout>
              </div>
            </Tab>
          </StrategyTabs>
        </div>
      </section>

      {/* ============================================ */}
      {/* KPI DASHBOARD */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-2 text-center">5. Tableau de bord Growth</h3>
            <p className="opacity-60 text-center mb-8">Les KPIs que je piloterai au quotidien</p>
          </RevealOnScroll>

          <KPIDashboard
            rows={[
              { kpi: "Utilisateurs enregistrés", baseline: "~10M", target2026: "15M", target2028: "25M", highlight: true },
              { kpi: "MAU (Monthly Active Users)", baseline: "À mesurer", target2026: "+30%", target2028: "+100%" },
              { kpi: "Conversion Free→Paid", baseline: "~5%", target2026: "6,5%", target2028: "8%", highlight: true },
              { kpi: "ARPU Premium", baseline: "~$35/an", target2026: "$40/an", target2028: "$45/an" },
              { kpi: "Rétention J28", baseline: "~5,5%", target2026: "8%", target2028: "12%", highlight: true },
              { kpi: "Part mobile des parties", baseline: "~30%", target2026: "40%", target2028: "50%" },
              { kpi: "Trafic organique", baseline: "~9%", target2026: "15%", target2028: "25%", highlight: true },
              { kpi: "NPS", baseline: "À mesurer", target2026: ">50", target2028: ">60" },
            ]}
          />
        </div>
      </section>

      {/* ============================================ */}
      {/* PLAN 90 JOURS */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold mb-2 text-center">6. Mon plan à 90 jours</h3>
            <p className="opacity-60 text-center mb-12">Parce qu&apos;un plan sans priorisation n&apos;est qu&apos;une wishlist.</p>
          </RevealOnScroll>

          <Timeline>
            <TimelineMonth month={1} title="Diagnostic & Quick Wins" label="Jours 1-30">
              <TimelineItem status="ready">Audit complet GA4/Mixpanel : comprendre les vrais funnels, identifier les drop-offs</TimelineItem>
              <TimelineItem status="quick-win" highlight>Lancer les flows email prioritaires (welcome + win-back)</TimelineItem>
              <TimelineItem status="ready">Mettre en place le tracking d&apos;attribution phygital</TimelineItem>
            </TimelineMonth>

            <TimelineMonth month={2} title="Fondations" label="Jours 31-60">
              <TimelineItem>Lancer le pricing localisé sur 5 marchés test</TimelineItem>
              <TimelineItem highlight>Déployer le nouvel onboarding (questionnaire + reco)</TimelineItem>
              <TimelineItem>Recruter 20 ambassadeurs Tier 2 pour le programme pilote</TimelineItem>
              <TimelineItem>Livrer le premier dashboard data phygital aux équipes Asmodee</TimelineItem>
            </TimelineMonth>

            <TimelineMonth month={3} title="Accélération" label="Jours 61-90">
              <TimelineItem highlight>Lancer la première &quot;Saison&quot; BGA (Season Pass v1)</TimelineItem>
              <TimelineItem>Démarrer les campagnes SEO (100 premières landing pages jeux)</TimelineItem>
              <TimelineItem>Négocier les premiers partenariats cafés-jeux (10 établissements pilotes)</TimelineItem>
              <TimelineItem>Présenter les premiers résultats au board avec roadmap validée</TimelineItem>
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
            <div className="text-6xl mb-8 text-[var(--accent)]">🎲</div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed">
              <TypewriterText text="Le jeu de société, c'est de la connexion humaine. BGA a prouvé qu'on pouvait la préserver à travers un écran. Mon job : faire en sorte que 25 millions de personnes le découvrent." />
            </blockquote>
            <p className="mt-8 text-xl opacity-60">
              BGA a le produit, Asmodee a le catalogue —{" "}
              <span className="text-[var(--accent)]">il manque la machine de croissance.</span>
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
                href="mailto:charles.bonnet@pm.me?subject=Candidature%20Growth%20Officer%20Board%20Game%20Arena&body=Bonjour%20Charles,%0A%0AJ'ai%20vu%20votre%20page%20de%20candidature%20pour%20BGA%20et%20j'aimerais%20échanger%20avec%20vous."
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
              🎲
            </motion.span>
            {" "}et du code
          </p>
        </div>
      </footer>
    </div>
  );
}
