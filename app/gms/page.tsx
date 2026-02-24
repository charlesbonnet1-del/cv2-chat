"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import {
  ScrollSection,
  ParallaxLayer,
  FadeIn,
  ScrollRevealText,
  HorizontalScroll,
  ProgressLine,
  MinimalStat,
  ComparisonRow,
  ChapterMarker,
  TimelineStep,
  SkillPill,
  SideNav,
} from "../cuure/components";

const NAV_ITEMS = [
  { id: "marche", label: "Marché" },
  { id: "forces", label: "Forces GMS" },
  { id: "concurrence", label: "Concurrence" },
  { id: "vision", label: "La Vision" },
  { id: "roadmap", label: "Roadmap" },
  { id: "apport", label: "Pourquoi moi" },
];

// ============================================
// MAIN PAGE — Scroll-driven narrative
// ============================================
export default function GMSPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(heroProgress, [0, 0.5], [0, -50]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden transition-colors duration-300">
      <ProgressLine />
      <SideNav items={NAV_ITEMS} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-12 py-6">
        <motion.a
          href="/"
          className="text-sm opacity-30 hover:opacity-100 transition-opacity"
          whileHover={{ x: -3 }}
        >
          &larr; Retour
        </motion.a>
        <ThemeToggle />
      </nav>

      {/* ============================================ */}
      {/* HERO — Full screen, just the essential */}
      {/* ============================================ */}
      <div ref={heroRef}>
        <ScrollSection className="relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            <FadeIn delay={0.2}>
              <span className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-[var(--accent)] block mb-8">
                Direction Marketing Abonnement &mdash; Candidature 2026
              </span>
            </FadeIn>

            <FadeIn delay={0.4}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
                Pourquoi{" "}
                <span className="text-[var(--accent)]">moi</span>
                <br />
                pour{" "}
                <span className="text-[var(--accent)]">GMS</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.6}>
              <p className="text-lg md:text-xl opacity-40 max-w-lg mx-auto leading-relaxed">
                De l&apos;éditeur de presse au hub de services médicaux intelligents.
                <br />
                Une stratégie pour transformer les actifs GMS en croissance récurrente.
              </p>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="flex flex-wrap justify-center gap-3 mt-12">
                {[
                  "Subscription Economics",
                  "Membership as a Service",
                  "IA & AEO",
                ].map((skill) => (
                  <SkillPill key={skill} label={skill} />
                ))}
              </div>
            </FadeIn>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase">
                Scroll
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </ScrollSection>
      </div>

      {/* ============================================ */}
      {/* CHAPTER 1 — Diagnostic Marché */}
      {/* ============================================ */}
      <ScrollSection id="marche">
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="01"
            title="Diagnostic Marché"
            subtitle="Un marché sous tension qui crée des opportunités structurelles."
          />
        </div>
      </ScrollSection>

      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-24">
            <ParallaxLayer speed={0.1}>
              <MinimalStat value="+8,2%" label="Inflation médicale en Europe 2026" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2}>
              <MinimalStat value="1,4 Md€" label="Économies imposées sur le médicament" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.15}>
              <MinimalStat value="+5,4%" label="Croissance marché médicament FR/an" />
            </ParallaxLayer>
          </div>

          <FadeIn>
            <ScrollRevealText
              text="La pression sur le modèle publicitaire est structurelle. L'abonnement devient vital — pour les éditeurs médicaux comme pour les médecins qui ont besoin de se former à distance."
              className="text-lg md:text-2xl leading-relaxed mb-16 max-w-3xl mx-auto"
            />
          </FadeIn>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                issue: "Budgets promos pharma en baisse",
                impact: "Pression sur le modèle pub → l'abonnement devient vital",
              },
              {
                issue: "Démographie médicale dégradée",
                impact: "Besoin de formation à distance → opportunité DPC / e-learning",
              },
              {
                issue: "France 2030 + Doctrine Numérique",
                impact: "Obligation d'interopérabilité → avantage aux acteurs intégrés",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 py-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{item.issue}</p>
                    <p className="text-xs opacity-40 mt-1">{item.impact}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <p className="text-sm text-[var(--accent)] opacity-80 text-center mt-8 max-w-md mx-auto">
              Ces tensions sont des leviers. GMS est positionné pour en profiter — à condition d&apos;accélérer.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 2 — Forces de GMS */}
      {/* ============================================ */}
      <ScrollSection id="forces">
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="02"
            title="Les Forces de GMS"
            subtitle="Un portefeuille rare que peu savent monétiser à sa pleine valeur."
          />
        </div>
      </ScrollSection>

      {/* Portfolio stats */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-24">
            <ParallaxLayer speed={0.15}>
              <MinimalStat numericValue={7} value="7" label="Marques éditoriales" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.25}>
              <MinimalStat numericValue={150} value="150" label="Événements par an" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.1}>
              <MinimalStat value="15 000" label="Articles en fonds de catalogue" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2}>
              <MinimalStat value="12 000" label="E-learners actifs" />
            </ParallaxLayer>
          </div>

          {/* Brand breakdown */}
          <FadeIn>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-12 opacity-60">
              Le portefeuille
            </h3>
          </FadeIn>
          <div className="space-y-4 max-w-3xl mx-auto mb-24">
            {[
              {
                brand: "Egora",
                role: "Tunnel d'acquisition #1",
                detail: "25 000 ex. hebdo — 2M pages vues/mois — 98 000 PS inscrits",
              },
              {
                brand: "LRP + LRP-MG",
                role: "Navire amiral",
                detail: "31 000 ex. mensuels — 15 000 articles en fonds — Référence DPC",
              },
              {
                brand: "Concours pluripro",
                role: "Blue ocean",
                detail: "7 000 ex. mensuels — Cible MSP — Monopole éditorial interpro",
              },
              {
                brand: "Événementiel",
                role: "Ancrage terrain",
                detail: "150 événements/an — 2 100 visiteurs JNMG — 56 partenaires labo",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="right">
                <div className="flex items-start gap-6 py-4 border-b border-[var(--foreground)]/5 last:border-0">
                  <div className="shrink-0 w-32 text-right">
                    <p className="font-bold text-sm text-[var(--accent)]">{item.brand}</p>
                    <p className="text-[10px] font-mono tracking-wider uppercase opacity-30 mt-0.5">
                      {item.role}
                    </p>
                  </div>
                  <p className="text-sm opacity-50 leading-relaxed">{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CA breakdown */}
          <FadeIn>
            <h4 className="text-sm font-mono tracking-[0.2em] uppercase opacity-30 mb-8 text-center">
              Répartition du CA — 9,6 M€
            </h4>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            {[
              { pct: "29,2%", label: "Publicité" },
              { pct: "28,1%", label: "Abonnements" },
              { pct: "18,7%", label: "Formation DPC" },
              { pct: "13,6%", label: "Autres" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[var(--accent)] mb-1">
                    {item.pct}
                  </p>
                  <p className="text-xs opacity-40">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="max-w-xl mx-auto">
              <ComparisonRow
                before="Abo + DPC = 47% du CA aujourd'hui"
                after="Objectif : 60% en 24 mois"
                delay={0}
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-sm text-[var(--accent)] opacity-80 text-center mt-8 max-w-md mx-auto">
              L&apos;abonnement et la formation sont déjà le socle. Ils doivent devenir le moteur.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 3 — Paysage Concurrentiel */}
      {/* ============================================ */}
      <ScrollSection id="concurrence">
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="03"
            title="Paysage Concurrentiel"
            subtitle="4 types de menaces, 1 positionnement unique à défendre."
          />
        </div>
      </ScrollSection>

      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-16">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--foreground)]/10">
                    <th className="text-left py-3 px-2 font-normal opacity-40" />
                    <th className="text-left py-3 px-2 font-normal opacity-40">Type</th>
                    <th className="text-left py-3 px-2 font-normal opacity-40">Atout clé</th>
                    <th className="text-left py-3 px-2 font-normal opacity-40">Prix</th>
                    <th className="text-left py-3 px-2 font-normal opacity-40">Menace</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--foreground)]/5">
                    <td className="py-3 px-2 font-medium opacity-60">GPS / Quotidien du Médecin</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Frontal</td>
                    <td className="py-3 px-2 opacity-50 text-xs">85 000 PS/jour</td>
                    <td className="py-3 px-2 opacity-50 text-xs">172 €/an</td>
                    <td className="py-3 px-2 text-xs font-semibold opacity-70">Élevée</td>
                  </tr>
                  <tr className="border-b border-[var(--foreground)]/5">
                    <td className="py-3 px-2 font-medium opacity-60">Medscape (WebMD)</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Gratuit</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Audience mondiale + IA</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Gratuit</td>
                    <td className="py-3 px-2 text-xs font-semibold opacity-70">Élevée</td>
                  </tr>
                  <tr className="border-b border-[var(--foreground)]/5">
                    <td className="py-3 px-2 font-medium opacity-60">PulseLife (ex-360 medics)</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Disrupteur</td>
                    <td className="py-3 px-2 opacity-50 text-xs">IA clinique temps réel</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Freemium</td>
                    <td className="py-3 px-2 text-xs font-bold text-[var(--accent)]">Critique</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium opacity-60">Influenceurs / Hurker</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Indirect</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Proximité, format court</td>
                    <td className="py-3 px-2 opacity-50 text-xs">Gratuit</td>
                    <td className="py-3 px-2 text-xs font-semibold opacity-50">Modérée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="max-w-2xl mx-auto text-center py-8 border-t border-[var(--foreground)]/10">
              <p className="text-base md:text-lg opacity-60 leading-relaxed mb-4">
                GMS est le seul acteur à combiner{" "}
                <span className="text-[var(--accent)] font-semibold">profondeur scientifique</span>
                {" "}+{" "}
                <span className="text-[var(--accent)] font-semibold">certification DPC</span>
                {" "}+{" "}
                <span className="text-[var(--accent)] font-semibold">événementiel terrain</span>.
              </p>
              <p className="text-sm opacity-30">
                C&apos;est un avantage compétitif durable — à condition de le rendre visible.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 4 — La Vision */}
      {/* ============================================ */}
      <ScrollSection id="vision">
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="04"
            title="La Vision en 3 Axes"
            subtitle="Transformer le portefeuille en moteur de croissance récurrente."
          />
        </div>
      </ScrollSection>

      {/* Axe 1 — Membership as a Service */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 block mb-2">
              Axe 1
            </span>
            <h3 className="text-2xl md:text-4xl font-bold mb-2">Membership as a Service</h3>
            <p className="opacity-40 mb-12">Fusionner abonnement et formation dans un forfait &laquo; Compétence Totale &raquo;</p>
          </FadeIn>

          <FadeIn>
            <ScrollRevealText
              text="L'abonnement LRP et la formation DPC sont aujourd'hui vendus en silos. Un médecin qui souscrit aux deux paie plus cher, navigue sur deux plateformes distinctes, et ne perçoit pas la valeur intégrée du groupe GMS. Le bundle change tout."
              className="text-lg md:text-xl leading-relaxed mb-16 opacity-80"
            />
          </FadeIn>

          {/* Before / After */}
          <FadeIn>
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <span className="text-xs font-mono tracking-wider uppercase opacity-30 text-right">
                  Aujourd&apos;hui
                </span>
                <span />
                <span className="text-xs font-mono tracking-wider uppercase text-[var(--accent)] opacity-60">
                  Demain — 349 €/an
                </span>
              </div>
            </div>
          </FadeIn>

          <ComparisonRow before="Abo LRP = 210-250 €/an (isolé)" after="LRP + LRP-MG + 2 DPC/an inclus" delay={0} />
          <ComparisonRow before="DPC vendu séparément par SFP" after="Invitation JNMG incluse" delay={0.05} />
          <ComparisonRow before="JNMG = inscription à part" after="SSO unique groupe SFP Expansion" delay={0.1} />
          <ComparisonRow before="Pas de SSO inter-plateformes" after="Upselling naturel sur 12K e-learners" delay={0.15} />
          <ComparisonRow before="Cross-sell quasi inexistant" after="Barrière à la sortie ×3" delay={0.2} />

        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="w-px h-24 bg-[var(--foreground)] opacity-10" />
      </div>

      {/* Axe 2 — IA Propriétaire & AEO */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 block mb-2">
              Axe 2
            </span>
            <h3 className="text-2xl md:text-4xl font-bold mb-2">IA Propriétaire & AEO</h3>
            <p className="opacity-40 mb-12">Transformer 15 000 articles en avantage concurrentiel technologique</p>
          </FadeIn>

          <FadeIn>
            <ScrollRevealText
              text="PulseLife répond aux questions cliniques en temps réel. La parade ne peut pas être éditoriale — elle doit être technologique. GMS a l'actif : 15 000 articles sourcés, validés, signés par des médecins. Il faut maintenant le connecter."
              className="text-lg md:text-xl leading-relaxed mb-16 opacity-80"
            />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Assistant IA */}
            <FadeIn direction="left">
              <div>
                <h4 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 mb-6">
                  Assistant IA propriétaire
                </h4>
                <div className="space-y-4">
                  {[
                    "Chatbot réservé abonnés premium",
                    "Réponses sourcées sur le corpus GMS",
                    'Ex : « Protocole suivi pathologie X selon LRP 2024-2026 ? »',
                    "Différenciation vs PulseLife : sources vérifiées + éditorial humain",
                    "Rétention : raison n°1 de rester abonné",
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.07}>
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                        <p className="text-sm opacity-60">{item}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* AEO */}
            <FadeIn direction="right">
              <div>
                <h4 className="text-sm font-mono tracking-[0.2em] uppercase opacity-30 mb-6">
                  Answer Engine Optimization
                </h4>
                <div className="space-y-4">
                  {[
                    "Le SEO de 2026 : être cité par Perplexity, Claude, ChatGPT",
                    "Données structurées + métadonnées sémantiques sur chaque article",
                    "CV auteurs vérifiés = signal d'autorité E-E-A-T médical",
                    "Chaque citation IA = tunnel vers le paywall",
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.07}>
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] opacity-20 mt-2 shrink-0" />
                        <p className="text-sm opacity-50">{item}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="w-px h-24 bg-[var(--foreground)] opacity-10" />
      </div>

      {/* Axe 3 — Conquête Exercice Coordonné */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 block mb-2">
              Axe 3
            </span>
            <h3 className="text-2xl md:text-4xl font-bold mb-2">Conquête Exercice Coordonné</h3>
            <p className="opacity-40 mb-12">Concours pluripro = blue ocean à monétiser via les contrats groupe</p>
          </FadeIn>

          <FadeIn>
            <ScrollRevealText
              text="Les MSP et centres de santé explosent en France. Concours pluripro est le seul magazine interprofessionnel dédié à ce segment. Aucun concurrent direct. La stratégie : passer de l'abonnement individuel au contrat groupe."
              className="text-lg md:text-xl leading-relaxed mb-16 opacity-80"
            />
          </FadeIn>

          {/* MSP Network Effect — Visual */}
          <FadeIn>
            <h4 className="text-sm font-mono tracking-[0.2em] uppercase opacity-30 mb-8 text-center">
              L&apos;effet réseau du contrat groupe
            </h4>
          </FadeIn>
          <div className="max-w-2xl mx-auto mb-12">
            {/* Big stat */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.span
                className="text-7xl md:text-9xl font-bold text-[var(--accent)] tabular-nums"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                3 200
              </motion.span>
              <p className="text-sm opacity-30 mt-3 font-mono tracking-wider uppercase">
                MSP en France — marché quasi vierge
              </p>
            </motion.div>

            {/* Multiplier chain */}
            <div className="space-y-0 mb-12">
              {[
                {
                  step: "01",
                  title: "1 contrat groupe signé",
                  sub: "1 structure, 1 décision d'achat collective",
                  value: "1×",
                },
                {
                  step: "02",
                  title: "~8 professionnels actifs",
                  sub: "Abonnés inclus — médecins, infirmiers, kiné, pharmaciens",
                  value: "8×",
                },
                {
                  step: "03",
                  title: "Rétention structurelle",
                  sub: "L'outil devient infrastructure du cabinet — barrière à la sortie maximale",
                  value: "∞",
                },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.12} direction="left">
                  <div className="flex items-center gap-6 py-5 border-b border-[var(--foreground)]/5 last:border-0">
                    <span className="text-xs font-mono opacity-20 w-6 shrink-0">{item.step}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs opacity-40 mt-0.5">{item.sub}</p>
                    </div>
                    <motion.span
                      className="text-2xl font-bold text-[var(--accent)] tabular-nums shrink-0"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.12 }}
                    >
                      {item.value}
                    </motion.span>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Reach comparison bars */}
            <FadeIn delay={0.5}>
              <p className="text-xs font-mono tracking-[0.2em] uppercase opacity-20 text-center mb-6">
                Portée par type de contrat
              </p>
              <div className="space-y-5">
                {[
                  { label: "Abonnement individuel", pct: 12 },
                  { label: "Contrat groupe (5 structures)", pct: 52 },
                  { label: "Réseau 50 MSP pilotes", pct: 100 },
                ].map((bar, i) => (
                  <div key={i} className="space-y-1.5">
                    <span className="text-xs opacity-50">{bar.label}</span>
                    <div className="h-1 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ opacity: 0.35 + i * 0.3 }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.15 * i, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <p className="text-sm text-[var(--accent)] opacity-80 text-center max-w-md mx-auto">
              Canal de prospection : la JexCo. Cible : coordonnateurs de MSP.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 5 — Roadmap 24 mois */}
      {/* ============================================ */}
      <ScrollSection id="roadmap">
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="05"
            title="Roadmap 24 mois"
            subtitle="3 phases pour passer à l'exécution, sans attendre."
          />
        </div>
      </ScrollSection>

      <HorizontalScroll>
        <TimelineStep
          period="Phase 1 — M1 à M4"
          title="Quick Wins"
          items={[
            "Audit CRM + segmentation base abonnés",
            "Lancement campagne anti-churn IA",
            "SSO unifié sites GMS / SFP Expansion",
            "Capsules vidéo résumés d'articles",
            "Structuration données AEO",
          ]}
        />
        <TimelineStep
          period="Phase 2 — M5 à M12"
          title="Construction"
          items={[
            "Lancement forfait Compétence Totale",
            "Prototype assistant IA propriétaire",
            "Contrats groupe MSP (pilote 50 structures)",
            "Refonte tunnel Egora → conversion LRP",
            "Optimisation mobile-first",
          ]}
        />
        <TimelineStep
          period="Phase 3 — M13 à M24"
          title="Accélération"
          highlight
          items={[
            "IA propriétaire en production",
            "Scaling contrats groupe (200 MSP)",
            "Abonnement pluriannuel avec incentive",
            "Programme ambassadeurs médecins",
          ]}
        />
      </HorizontalScroll>

      {/* ============================================ */}
      {/* CHAPTER 6 — Pourquoi moi */}
      {/* ============================================ */}
      <ScrollSection id="apport">
        <div className="max-w-4xl mx-auto w-full">
          <ChapterMarker
            number="06"
            title="Pourquoi moi"
            subtitle="7+ ans en marketing abonnement B2C — les résultats parlent."
          />
        </div>
      </ScrollSection>

      {/* Key stats */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-24">
            <ParallaxLayer speed={0.1}>
              <MinimalStat numericValue={28} prefix="+" suffix="%" value="+28%" label="Croissance recrutement abonnés — Lagardère Media News" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2}>
              <MinimalStat value="+5,3%" label="Croissance cash sur le portefeuille — Stratégie repricing" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.15}>
              <MinimalStat numericValue={11000} value="11 000" label="Abonnés JDNews en 12 mois — Lancement from scratch" />
            </ParallaxLayer>
          </div>

          {/* Transferable skills */}
          <FadeIn>
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase opacity-30 mb-8 text-center max-w-3xl mx-auto">
              Compétences directement transférables
            </h3>
          </FadeIn>
          <div className="max-w-3xl mx-auto mb-16">
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <span className="text-xs font-mono tracking-wider uppercase opacity-30 text-right">Mon parcours</span>
                <span />
                <span className="text-xs font-mono tracking-wider uppercase text-[var(--accent)] opacity-60">Chez GMS</span>
              </div>
            </div>
            <ComparisonRow
              before="Portfolio multi-titres JDD, JDNews"
              after="Portfolio LRP, Egora, Concours pluripro"
              delay={0}
            />
            <ComparisonRow
              before="Repricing & unit economics"
              after="Optimisation ARPU"
              delay={0.05}
            />
            <ComparisonRow
              before="Lancement JDNews : 0 → 11 000 abonnés"
              after="Nouveaux bundles Compétence Totale"
              delay={0.1}
            />
            <ComparisonRow
              before="Culture tech : Claude Code, Python, Next.js"
              after="Pilotage IA propriétaire GMS"
              delay={0.15}
            />
          </div>

          {/* Value props */}
          <div className="max-w-2xl mx-auto space-y-12">
            {[
              {
                title: "7+ ans en Growth & Subscription",
                desc: "Médias numériques, gestion solo de portfolio multi-titres, croissance mesurable et documentée.",
              },
              {
                title: "Track record en repricing",
                desc: "+5,3% de croissance cash sans churn. Exactement le défi GMS sur l'ARPU.",
              },
              {
                title: "Expérience lancement from scratch",
                desc: "JDNews de 0 à 11 000 abonnés en 12 mois. L'ADN nécessaire pour les nouveaux bundles à créer.",
              },
              {
                title: "Double culture data + créativité",
                desc: "Ex-joueur de poker professionnel. Pensée probabiliste, gestion du risque, décision sous incertitude.",
              },
              {
                title: "Maîtrise technique & IA",
                desc: "Projets Claude Code, Python, Next.js. Capacité à piloter le projet d'IA propriétaire de l'intérieur.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm opacity-40 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA — Final */}
      {/* ============================================ */}
      <ScrollSection className="min-h-[80vh]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Construisons
              <br />
              ensemble
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="opacity-30 mb-4 max-w-md mx-auto text-sm md:text-base leading-relaxed">
              Le futur de l&apos;abonnement médical intelligent.
            </p>
            <p className="opacity-50 mb-12 max-w-md mx-auto text-sm md:text-base leading-relaxed">
              GMS a les actifs. Il faut maintenant la stratégie pour les transformer
              en croissance récurrente. Je suis prêt à la mettre en œuvre.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:charles.bonnet@pm.me?subject=Candidature Direction Marketing Abonnement — GMS"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Contactez-moi
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/charlesbonn3t/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[var(--foreground)]/10 rounded-full font-semibold opacity-60 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </motion.a>
            </div>
          </FadeIn>

          <motion.p
            className="mt-20 text-xs opacity-15 font-mono"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            viewport={{ once: true }}
          >
            Charles Bonnet &middot; {new Date().getFullYear()} &middot; Built with Next.js & Framer Motion
          </motion.p>
        </div>
      </ScrollSection>
    </div>
  );
}
