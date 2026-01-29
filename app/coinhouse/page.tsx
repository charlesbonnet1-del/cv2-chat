"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

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
      {/* Toggle */}
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

      {/* Comparison items */}
      <div className="space-y-3">
        {comparisons.map((item, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              x: activeTab === "crypto" ? 10 : 0,
            }}
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
// EXPANDABLE IDEA CARD COMPONENT
// ============================================
function IdeaCard({
  number,
  title,
  details,
  result,
  delay,
}: {
  number: number;
  title: string;
  details: string[];
  result: string;
  delay: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        layout
        className="bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ borderColor: "var(--accent)" }}
      >
        <motion.div layout className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {number}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {title}
                </h3>
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[var(--foreground)] opacity-50"
                >
                  ↓
                </motion.span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 ml-14"
              >
                <ul className="space-y-2 mb-4">
                  {details.map((detail, index) => (
                    <li key={index} className="text-[var(--foreground)] opacity-70 flex items-start gap-2">
                      <span className="text-[var(--accent)]">→</span>
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg p-3">
                  <p className="text-[var(--accent)] text-sm">
                    <span className="font-semibold">Ce que j&apos;ai fait :</span> {result}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </RevealOnScroll>
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

      if (scrollPercent < 0.15) {
        setMessage("Bienvenue !");
      } else if (scrollPercent < 0.35) {
        setMessage("Ces chiffres sont réels, vérifiables.");
      } else if (scrollPercent < 0.55) {
        setMessage("Mêmes mécaniques, nouveau terrain.");
      } else if (scrollPercent < 0.75) {
        setMessage("J'ai d'autres idées, on en parle ?");
      } else if (scrollPercent < 0.9) {
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
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
              Pourquoi{" "}
              <span className="text-[var(--accent)]">moi</span>
              <br />
              pour{" "}
              <span className="text-[var(--accent)]">Coinhouse</span>
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
            <KPICard
              value={17}
              prefix="x"
              label="Croissance parc abonnés en 5 ans"
              delay={0}
            />
            <KPICard
              value={28}
              prefix="+"
              suffix="%"
              label="Croissance recrutement 2025"
              delay={0.1}
            />
            <KPICard
              value={107}
              prefix="+"
              suffix="%"
              label="Performance landing pages"
              delay={0.2}
            />
            <KPICard
              value={21}
              prefix="+"
              suffix="%"
              label="ARPU (revenu par utilisateur)"
              delay={0.3}
            />
            <KPICard
              value={140}
              suffix="+"
              label="Scénarios d'automation IA en production"
              delay={0.4}
            />
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
              Presse → Crypto :{" "}
              <span className="text-[var(--accent)]">mêmes mécaniques</span>
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
      {/* IDEAS SECTION */}
      {/* ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              3 idées pour <span className="text-[var(--accent)]">Coinhouse</span>
            </h2>
            <p className="text-[var(--foreground)] opacity-50 text-center mb-12 max-w-2xl mx-auto">
              Pas des concepts vagues. Des stratégies éprouvées, adaptées à votre contexte.
            </p>
          </RevealOnScroll>

          <div className="space-y-4">
            <IdeaCard
              number={1}
              title="Scoring comportemental des prospects"
              details={[
                "Identifier les signaux d'intention (pages vues, simulateur utilisé, temps passé)",
                "Prioriser les leads haute valeur pour l'équipe commerciale",
                "Automatiser la qualification pour focus humain sur le closing",
              ]}
              result="+28% conversion grâce à la segmentation fine"
              delay={0}
            />
            <IdeaCard
              number={2}
              title="Séquences nurturing par profil"
              details={[
                "Parcours différenciés : curieux / éduqué / prêt à investir",
                "Contenu adapté : pédagogie pour les premiers, produits pour les derniers",
                "Timing intelligent basé sur l'engagement",
              ]}
              result="140+ scénarios automation, cycle réduit de 3j à 2h"
              delay={0.1}
            />
            <IdeaCard
              number={3}
              title="Programme anti-churn proactif"
              details={[
                "Détecter les signaux de désengagement avant la perte",
                "Réactivation ciblée par canal préféré (email, push, SMS)",
                "Win-back automatisé avec offres personnalisées",
              ]}
              result="Matrice 18 scénarios rétention, churn stable malgré +29% prix"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONVICTION SECTION */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[var(--bot-bubble-bg)]/30">
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
      <section className="py-24 px-6">
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
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.a>

              <motion.a
                href="/"
                className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 font-medium px-6 py-4 rounded-full border border-[var(--foreground)]/20 hover:border-[var(--accent)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Voir mon CV complet
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </motion.a>
            </div>

            {/* Easter egg */}
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
          <p className="opacity-50 text-sm">
            Charles Bonnet — {new Date().getFullYear()}
          </p>
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
