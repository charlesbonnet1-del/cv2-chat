"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import {
  ScrollSection,
  ParallaxLayer,
  FadeIn,
  ScrollRevealText,
  AnimatedNumber,
  HorizontalScroll,
  ProgressLine,
  MinimalStat,
  ComparisonRow,
  ChapterMarker,
  TimelineStep,
  KPIRow,
  SkillPill,
} from "./components";

// ============================================
// MAIN PAGE — Scroll-driven narrative
// ============================================
export default function CuurePage() {
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
                Head of Growth &mdash; Candidature 2026
              </span>
            </FadeIn>

            <FadeIn delay={0.4}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
                Pourquoi{" "}
                <span className="text-[var(--accent)]">moi</span>
                <br />
                pour{" "}
                <span className="text-[var(--accent)]">Cuure</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.6}>
              <p className="text-lg md:text-xl opacity-40 max-w-lg mx-auto leading-relaxed">
                Depuis 2019, je transforme des lecteurs en abonnés.
                <br />
                Prêt à transformer des curieux santé en abonnés fidèles.
              </p>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="flex flex-wrap justify-center gap-3 mt-12">
                {[
                  "Subscription Economics",
                  "Content Strategy",
                  "A/B Testing",
                  "Product-Led Growth",
                  "Data-Driven",
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
      {/* CHAPTER 1 — Résultats */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="01"
            title="Mes résultats"
            subtitle="Des chiffres concrets, mesurés, documentés. 8+ ans en subscription economics."
          />
        </div>
      </ScrollSection>

      {/* Stats grid — full breathing room */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            <ParallaxLayer speed={0.15}>
              <MinimalStat numericValue={17} prefix="x" value="x17" label="Croissance parc abonnés en 5 ans" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.25}>
              <MinimalStat numericValue={28} prefix="+" suffix="%" value="+28%" label="Croissance recrutement 2025" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.1}>
              <MinimalStat numericValue={107} prefix="+" suffix="%" value="+107%" label="Performance landing pages" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2}>
              <MinimalStat numericValue={21} prefix="+" suffix="%" value="+21%" label="ARPU (revenu par utilisateur)" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.3}>
              <MinimalStat numericValue={29} prefix="+" suffix="%" value="+29%" label="Repricing sans churn" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.15}>
              <FadeIn className="flex items-center justify-center h-full">
                <p className="text-center text-lg md:text-xl opacity-30 leading-relaxed">
                  Et maintenant&nbsp;?
                  <br />
                  <span className="text-[var(--accent)] opacity-100 font-semibold">
                    Direction Cuure.
                  </span>
                </p>
              </FadeIn>
            </ParallaxLayer>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 2 — Transfert de compétences */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-4xl mx-auto w-full">
          <ChapterMarker
            number="02"
            title={`Média \u2192 Nutraceutique`}
            subtitle="Le produit change, les fondamentaux restent. Acquisition, conversion, rétention."
          />
        </div>
      </ScrollSection>

      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <ScrollRevealText
              text="La nutrition personnalisée est un défi éditorial : vulgariser des sujets complexes, séquencer l'information, accompagner la montée en compétence. C'est exactement ce que je fais depuis 6+ ans dans les médias."
              className="text-lg md:text-2xl leading-relaxed mb-16"
            />
          </FadeIn>

          <div className="mb-4">
            <div className="grid grid-cols-3 gap-4 mb-2">
              <span className="text-xs font-mono tracking-wider uppercase opacity-30 text-right">Ce que j&apos;ai fait</span>
              <span />
              <span className="text-xs font-mono tracking-wider uppercase text-[var(--accent)] opacity-60">Ce que je ferai</span>
            </div>
          </div>

          <ComparisonRow before="Funnel abonnement presse" after="Funnel subscription D2C Cuure" delay={0} />
          <ComparisonRow before="Scoring leads (chaud/froid)" after="Scoring prospects (curieux/engagés)" delay={0.05} />
          <ComparisonRow before="Churn & rétention abonnés" after="Churn & rétention M2/M3" delay={0.1} />
          <ComparisonRow before="LTV / CAC" after="LTV / CAC" delay={0.15} />
          <ComparisonRow before="Nurturing email séquentiel" after="Marketing automation CRM" delay={0.2} />
          <ComparisonRow before="Upsell (basic→premium)" after="Upsell Cuure → Cuure Precision" delay={0.25} />
          <ComparisonRow before="Pédagogie éditoriale complexe" after="Pédagogie santé & nutrition" delay={0.3} />
          <ComparisonRow before="Vulgarisation sujets techniques" after="Vulgarisation microbiote & biomarqueurs" delay={0.35} />
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 3 — Diagnostic marché */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="03"
            title="Où en est Cuure ?"
            subtitle="J'ai analysé votre marché, vos concurrents, vos avis Trustpilot et votre stack technique."
          />
        </div>
      </ScrollSection>

      {/* Market stats */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-24">
            <ParallaxLayer speed={0.1}>
              <MinimalStat value="2.9 Mds€" label="Marché FR compléments alimentaires 2025" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2}>
              <MinimalStat value="30.9 Mds$" label="Nutrition personnalisée mondiale 2030" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.15}>
              <MinimalStat value="14.4%" label="CAGR projeté du marché" />
            </ParallaxLayer>
          </div>

          {/* Cuure stats */}
          <FadeIn>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-12 opacity-60">Cuure aujourd&apos;hui</h3>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-24">
            <MinimalStat numericValue={15} suffix="M€" value="15M€" label="CA estimé 2025" />
            <MinimalStat numericValue={93} suffix="K" value="93K" label="Abonnés actifs" />
            <MinimalStat numericValue={56} value="56" label="NPS (moy. secteur: 30)" />
            <MinimalStat numericValue={5} value="5" label="Pays européens" />
          </div>

          {/* Competitive positioning */}
          <FadeIn className="mb-16">
            <h4 className="text-sm font-mono tracking-[0.2em] uppercase opacity-30 mb-8 text-center">
              Positionnement compétitif
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--foreground)]/10">
                    <th className="text-left py-3 px-2 font-normal opacity-40" />
                    <th className="text-left py-3 px-2 font-normal opacity-40">Prix</th>
                    <th className="text-left py-3 px-2 font-normal opacity-40">Science</th>
                    <th className="text-left py-3 px-2 font-normal opacity-40">Friction</th>
                    <th className="text-left py-3 px-2 font-normal opacity-40">Personnalisation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--foreground)]/5">
                    <td className="py-3 px-2 font-bold text-[var(--accent)]">Cuure</td>
                    <td className="py-3 px-2 opacity-60">~35€/mois</td>
                    <td className="py-3 px-2 opacity-60">Déclaratif</td>
                    <td className="py-3 px-2 opacity-60">Nulle</td>
                    <td className="py-3 px-2 opacity-60">Forte</td>
                  </tr>
                  <tr className="border-b border-[var(--foreground)]/5">
                    <td className="py-3 px-2 font-medium opacity-60">Zoe</td>
                    <td className="py-3 px-2 opacity-40">200€+</td>
                    <td className="py-3 px-2 opacity-40">Biologique</td>
                    <td className="py-3 px-2 opacity-40">Haute</td>
                    <td className="py-3 px-2 opacity-40">Très forte</td>
                  </tr>
                  <tr className="border-b border-[var(--foreground)]/5">
                    <td className="py-3 px-2 font-medium opacity-60">Vitl</td>
                    <td className="py-3 px-2 opacity-40">~40€</td>
                    <td className="py-3 px-2 opacity-40">ADN opt.</td>
                    <td className="py-3 px-2 opacity-40">Moyenne</td>
                    <td className="py-3 px-2 opacity-40">Moyenne</td>
                  </tr>
                  <tr className="border-b border-[var(--foreground)]/5">
                    <td className="py-3 px-2 font-medium opacity-60">iHerb</td>
                    <td className="py-3 px-2 opacity-40">Variable</td>
                    <td className="py-3 px-2 opacity-40">Non</td>
                    <td className="py-3 px-2 opacity-40">Nulle</td>
                    <td className="py-3 px-2 opacity-40">Nulle</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium opacity-60">Blueprint</td>
                    <td className="py-3 px-2 opacity-40">~330€</td>
                    <td className="py-3 px-2 opacity-40">Protocole (n=1)</td>
                    <td className="py-3 px-2 opacity-40">Haute</td>
                    <td className="py-3 px-2 opacity-40">Faible</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm opacity-40 mt-6 text-center max-w-xl mx-auto">
              Cuure a le meilleur ratio accessibilité / personnalisation du marché.
              Le défi n&apos;est pas le produit &mdash; c&apos;est le funnel de conversion et le referral.
            </p>
          </FadeIn>

          {/* Frictions */}
          <FadeIn>
            <h4 className="text-sm font-mono tracking-[0.2em] uppercase opacity-30 mb-8 text-center">
              Frictions identifiées
            </h4>
          </FadeIn>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { issue: "Confusion abonnement vs achat unique", impact: "Avis négatifs récurrents, churn M2 élevé" },
              { issue: "Bug Apple Pay (adresse écrasée)", impact: "Erreurs d'expédition, frustration client" },
              { issue: "Absence de confirmation d'engagement", impact: "Sentiment de tromperie au 2ème prélèvement" },
              { issue: "Pas de programme referral structuré", impact: "NPS 56 non capitalisé" },
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
              Ces frictions sont des opportunités immédiates. Chacune a une solution concrète.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 4 — SWOT (Minimal) */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker number="04" title="Forces & Opportunités" />
        </div>
      </ScrollSection>

      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Forces */}
            <div>
              <FadeIn>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase opacity-30 mb-8">Forces</h3>
              </FadeIn>
              <div className="space-y-6">
                {[
                  { title: "Quiz 5 min + algo", desc: "Personnalisation sans friction" },
                  { title: "NPS 56", desc: "Exceptionnel pour du D2C subscription" },
                  { title: "Stack Bubble.io", desc: "Agilité supérieure aux concurrents" },
                  { title: "FS-3B (Tribiotique)", desc: "Innovation propriétaire brevetée" },
                  { title: "Sachets personnalisés", desc: "Branding premium, engagement visuel" },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.08} direction="left">
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs opacity-40 mt-0.5">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Opportunités */}
            <div>
              <FadeIn>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 mb-8">
                  Opportunités
                </h3>
              </FadeIn>
              <div className="space-y-6">
                {[
                  { title: "Referral inexploité", desc: "60%+ de promoteurs actifs, 0 programme structuré" },
                  { title: "Expansion biologique", desc: "Biomarqueurs réels = pricing premium (x2.5 ARPU)" },
                  { title: "GEO (IA générative)", desc: "95% des users d'IA utilisent aussi Google, taux de conv ~7%" },
                  { title: "Expansion EU", desc: "Allemagne et Pays-Bas, marchés sous-pénétrés" },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.08} direction="right">
                    <div>
                      <p className="font-semibold text-sm text-[var(--accent)]">{item.title}</p>
                      <p className="text-xs opacity-40 mt-0.5">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>

          {/* Faiblesses → Solutions */}
          <div className="mt-24">
            <FadeIn>
              <h3 className="text-xs font-mono tracking-[0.2em] uppercase opacity-30 mb-8 text-center">
                Faiblesses &rarr; Solutions
              </h3>
            </FadeIn>
            <div className="max-w-2xl mx-auto space-y-3">
              <ComparisonRow before="Abonnement caché" after="Transparence proactive" delay={0} />
              <ComparisonRow before="Bug Apple Pay" after="Fix workflow Bubble 2-3j" delay={0.1} />
              <ComparisonRow before="Test déclaratif seulement" after="Hybridation biomarqueurs" delay={0.2} />
              <ComparisonRow before="Pas de referral" after="Programme gamifié Dropbox-like" delay={0.3} />
            </div>
          </div>

          {/* Menaces */}
          <div className="mt-24">
            <FadeIn>
              <h3 className="text-xs font-mono tracking-[0.2em] uppercase opacity-30 mb-8 text-center">
                Menaces à anticiper
              </h3>
            </FadeIn>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { title: "Zoe et le premium", desc: "Approche biologique crédibilise la deep science" },
                { title: "Régulation EU", desc: "Disparités de dosages autorisés entre pays" },
                { title: "Fatigue subscription", desc: "Consommateur sur-sollicité → différenciation par la valeur" },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] opacity-20 mt-2 shrink-0" />
                    <div>
                      <p className="font-medium text-sm opacity-60">{item.title}</p>
                      <p className="text-xs opacity-30 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 5 — Le Plan */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="05"
            title="Le Plan en 3 Mouvements"
            subtitle="2 Quick Wins opérationnels + 1 stratégie structurelle pour passer de 15M€ à 25M€ ARR"
          />
        </div>
      </ScrollSection>

      {/* Quick Win 1 — Conversion Checkout */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 block mb-2">
              Quick Win #1
            </span>
            <h3 className="text-2xl md:text-4xl font-bold mb-2">Conversion Checkout</h3>
            <p className="opacity-40 mb-12">+18-25% de conversion, implémentable en 6 semaines</p>
          </FadeIn>

          <FadeIn>
            <ScrollRevealText
              text="La friction checkout coûte à Cuure entre 18% et 25% de ses conversions. Confusion abonnement, bug Apple Pay, absence de confirmation d'engagement."
              className="text-lg md:text-xl leading-relaxed mb-16 opacity-80"
            />
          </FadeIn>

          <div className="space-y-8 mb-16">
            {[
              { num: "01", title: "Confirmation explicite", desc: "Écran interstitiel « Vous souscrivez un abonnement de XX€/mois ». Les marques D2C qui l'ajoutent voient -60 à -80% d'avis négatifs." },
              { num: "02", title: "Fix Apple Pay", desc: "Vérification forcée de l'adresse de livraison post-auth. Sur Bubble.io : workflow conditionnel, 2-3 jours de dev." },
              { num: "03", title: "Transparence proactive", desc: "Calendrier des prélèvements + rappel email 48h avant. Transformer le « piège perçu » en « service attentionné »." },
              { num: "04", title: "A/B test engagement", desc: "Tester « 3 mois puis flexible » vs « sans engagement » pour mesurer l'impact LTV sans augmenter la friction." },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1} direction="right">
                <div className="flex items-start gap-6">
                  <span className="text-[var(--accent)] font-mono text-sm opacity-40 mt-1 shrink-0 w-6">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm opacity-50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Impact metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <MinimalStat value="+18-25%" label="Taux de conversion" />
            <MinimalStat value="-60%" label="Avis négatifs checkout" />
            <MinimalStat value="-15-20%" label="Churn mois 2" />
            <MinimalStat value="6 sem." label="Délai d'implémentation" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="w-px h-24 bg-[var(--foreground)] opacity-10" />
      </div>

      {/* Quick Win 2 — Programme Referral */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 block mb-2">
              Quick Win #2
            </span>
            <h3 className="text-2xl md:text-4xl font-bold mb-2">Programme Referral</h3>
            <p className="opacity-40 mb-12">+30% d&apos;acquisition organique, ROI x3 vs paid</p>
          </FadeIn>

          <FadeIn>
            <ScrollRevealText
              text="NPS de 56 = 60%+ de promoteurs actifs. Pourtant, aucun programme de referral structuré. C'est comme avoir une Ferrari dans le garage sans les clés."
              className="text-lg md:text-xl leading-relaxed mb-16 opacity-80"
            />
          </FadeIn>

          <div className="space-y-8 mb-16">
            {[
              { num: "01", title: "Double récompense", desc: "Parrain : 1 mois offert. Filleul : -30% première commande. CAC estimé : 8-12€ vs 25-35€ en paid." },
              { num: "02", title: "Gamification par paliers", desc: "3 filleuls → « Ambassadeur » + accès anticipé. 5 → consultation nutritionniste. 10 → abonnement annuel offert." },
              { num: "03", title: "Déclenchement au pic", desc: "Après le 3ème mois (efficacité ressentie maximale). Automatisé via marketing automation." },
              { num: "04", title: "Social proof natif", desc: "Widget « X personnes de votre ville prennent Cuure » + QR code referral sur chaque sachet." },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1} direction="right">
                <div className="flex items-start gap-6">
                  <span className="text-[var(--accent)] font-mono text-sm opacity-40 mt-1 shrink-0 w-6">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm opacity-50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Unit economics comparison */}
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h5 className="text-xs font-mono tracking-[0.2em] uppercase opacity-30 mb-6">
                  Acquisition payante (actuel)
                </h5>
                <div className="space-y-3">
                  {[
                    { label: "CAC moyen", value: "25-35€" },
                    { label: "Payback period", value: "~2 mois" },
                    { label: "Rétention M3", value: "~55%" },
                    { label: "LTV/CAC", value: "~4x" },
                  ].map((m) => (
                    <div key={m.label} className="flex justify-between text-sm py-2 border-b border-[var(--foreground)]/5">
                      <span className="opacity-40">{m.label}</span>
                      <span className="opacity-60">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 mb-6">
                  Referral (projection)
                </h5>
                <div className="space-y-3">
                  {[
                    { label: "CAC moyen", value: "8-12€" },
                    { label: "Payback period", value: "<1 mois" },
                    { label: "Rétention M3", value: "~70%" },
                    { label: "LTV/CAC", value: "~10x" },
                  ].map((m) => (
                    <div key={m.label} className="flex justify-between text-sm py-2 border-b border-[var(--accent)]/10">
                      <span className="opacity-40">{m.label}</span>
                      <span className="font-bold text-[var(--accent)]">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-sm text-[var(--accent)] opacity-80 text-center mt-12 max-w-md mx-auto">
              Objectif : 30% de l&apos;acquisition via referral à M+6, soit ~2 800 nouveaux abonnés/mois.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="w-px h-24 bg-[var(--foreground)] opacity-10" />
      </div>

      {/* Stratégie LT — Expansion Biologique */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 block mb-2">
              Stratégie long terme
            </span>
            <h3 className="text-2xl md:text-4xl font-bold mb-2">Expansion Biologique</h3>
            <p className="opacity-40 mb-12">x2.5 sur le panier moyen &mdash; Cuure Precision</p>
          </FadeIn>

          <FadeIn>
            <ScrollRevealText
              text="Transformer Cuure d'un « quiz + sachets » en une plateforme de santé personnalisée data-driven, en intégrant des biomarqueurs réels. La précision de Zoe au prix de Cuure."
              className="text-lg md:text-xl leading-relaxed mb-16 opacity-80"
            />
          </FadeIn>
        </div>
      </section>

      {/* Horizontal timeline */}
      <HorizontalScroll>
        <TimelineStep
          period="M1 — M3"
          title="Partenariat Labo"
          items={[
            "Partenariat avec un labo d'analyses (type Cerascreen)",
            "Kit bilan micronutritionnel : 15 biomarqueurs clés",
            "Intégration API → CRM Bubble",
            "Prix cible du test : 49€ (subventionné dans l'abonnement annuel)",
          ]}
        />
        <TimelineStep
          period="M3 — M6"
          title="Algorithme Augmenté"
          items={[
            "Enrichir l'algo avec données biologiques réelles",
            "Passer de 40 questions déclaratives à scoring hybride",
            "Différenciation radicale vs Vitl et concurrents",
            "Recalibration automatique des formules (1x/an)",
          ]}
        />
        <TimelineStep
          period="M6 — M12"
          title="Monétisation Premium"
          highlight
          items={[
            "Lancement « Cuure Precision » : 89-119€/mois",
            "Inclus : 1 bilan/an + formule adaptée + suivi nutritionniste",
            "Upsell 15-20% de la base active",
            "ARPU : 35€ → 55€/mois en moyenne pondérée",
          ]}
        />
      </HorizontalScroll>

      {/* Financial projection */}
      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <MinimalStat numericValue={15} suffix="M€" value="15M€" label="CA actuel (est. 2025)" />
            <MinimalStat numericValue={19} suffix="M€" value="19M€" label="Avec Quick Wins seuls" />
            <ParallaxLayer speed={0.1}>
              <MinimalStat numericValue={25} suffix="M€" value="25M€" label="Avec Cuure Precision" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.15}>
              <MinimalStat value="2.5x" label="Panier moyen premium" />
            </ParallaxLayer>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 6 — Stratégie YouTube */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-5xl mx-auto w-full">
          <ChapterMarker
            number="06"
            title="Stratégie YouTube"
            subtitle="Canal d'acquisition #1 — Le modèle Finary appliqué à la nutrition personnalisée"
          />
        </div>
      </ScrollSection>

      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <ScrollRevealText
              text="La chaîne YouTube de Cuure est centrée produit : vidéos publicitaires, pas de visage identifiable, pas de stratégie value-first. Résultat : faible croissance organique, pas d'effet compound. Il faut pivoter vers le modèle Finary."
              className="text-lg md:text-2xl leading-relaxed mb-16"
            />
          </FadeIn>

          {/* Le modèle Finary */}
          <FadeIn>
            <h4 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--accent)] opacity-60 mb-8">
              Le modèle Finary : pourquoi ça marche
            </h4>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FadeIn delay={0}>
              <div>
                <p className="font-semibold text-sm">Contenu éducatif pur</p>
                <p className="text-xs opacity-40 mt-1">Analyses, interviews &mdash; jamais de pub produit directe</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div>
                <p className="font-semibold text-sm">Visage = le CEO</p>
                <p className="text-xs opacity-40 mt-1">Mounir Laggoune est la chaîne. Confiance, récurrence, identification</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <p className="font-semibold text-sm">Formats récurrents</p>
                <p className="text-xs opacity-40 mt-1">Finary Talks, analyses patrimoine, Shorts &mdash; 600K abonnés, 75M+ vues</p>
              </div>
            </FadeIn>
          </div>

          {/* Plan d'action */}
          <FadeIn>
            <h4 className="text-sm font-mono tracking-[0.2em] uppercase opacity-30 mb-8">
              Plan d&apos;action YouTube 2026
            </h4>
          </FadeIn>
          <div className="space-y-8 mb-16">
            {[
              { num: "01", title: "Recruter une égérie-expert(e)", desc: "Un(e) nutritionniste charismatique, crédible scientifiquement et à l'aise en caméra. Le « Mounir de la nutrition ». Budget : 3-5K€/mois." },
              { num: "02", title: "Pivoter vers du contenu value-first", desc: "80% éducatif / 20% produit. Exemples : « 5 carences que 90% des Français ignorent », « J'ai analysé mon microbiote : voici les résultats »." },
              { num: "03", title: "Formats récurrents calqués sur Finary", desc: "Hebdo : « Le Bilan Nutrition » (analyse du régime d'un abonné). Bi-mensuel : « Cuure Talks » (interview experts). Shorts : extraits pour TikTok et Reels." },
              { num: "04", title: "SEO YouTube + GEO", desc: "Cibler les requêtes à forte intention : « meilleur complément magnésium », « vitamine D dosage ». Optimiser pour les citations dans les IA génératives." },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1} direction="right">
                <div className="flex items-start gap-6">
                  <span className="text-[var(--accent)] font-mono text-sm opacity-40 mt-1 shrink-0 w-6">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm opacity-50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Projection */}
          <div className="grid grid-cols-3 gap-8 md:gap-12 mb-12">
            <MinimalStat value="10K" label="Abonnés à M+6" />
            <MinimalStat value="100K+" label="Abonnés à M+18" />
            <MinimalStat value="< 5€" label="CAC YouTube" />
          </div>

          <FadeIn delay={0.3}>
            <p className="text-sm text-[var(--accent)] opacity-80 text-center max-w-md mx-auto">
              Mon expérience : lancement de VA Plus chez Valmonde, chaîne passée de 0 à ~500K abonnés. Content-to-acquisition, SEO vidéo, conversion viewer &rarr; subscriber.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 7 — KPIs */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-4xl mx-auto w-full">
          <ChapterMarker
            number="07"
            title="KPIs de pilotage"
          />
        </div>
      </ScrollSection>

      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <span className="text-xs font-mono tracking-wider uppercase opacity-30">Métrique</span>
            <span className="text-xs font-mono tracking-wider uppercase opacity-30 text-center">Actuel</span>
            <span className="text-xs font-mono tracking-wider uppercase text-[var(--accent)] opacity-60 text-right">Cible</span>
          </div>
          <KPIRow label="Conversion Checkout" current="~3-4%" target="5-6%" delay={0} />
          <KPIRow label="MRR" current="~1.25M€/mois" target="2M€/mois" delay={0.05} />
          <KPIRow label="Referral Rate" current="<2%" target="8-10%" delay={0.1} />
          <KPIRow label="Churn M2" current="~20%" target="12%" delay={0.15} />
          <KPIRow label="ARPU" current="~35€/mois" target="55€/mois" delay={0.2} />
        </div>
      </section>

      {/* ============================================ */}
      {/* CHAPTER 8 — Ce que j'apporte */}
      {/* ============================================ */}
      <ScrollSection>
        <div className="max-w-4xl mx-auto w-full">
          <ChapterMarker number="08" title="Ce que j'apporte" />
        </div>
      </ScrollSection>

      <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto space-y-12">
          {[
            { title: "8+ ans en Growth & Subscription", desc: "Médias numériques, gestion solo de portfolio, croissance mesurable et documentée." },
            { title: "Track record prouvé", desc: "+28% recrutement, +5.3% cash growth, x17 parc abonnés. Pas des projections — des résultats." },
            { title: "Maîtrise du stack D2C", desc: "Analytics, A/B testing, CRM. La stack de Cuure, c'est mon terrain de jeu quotidien." },
            { title: "Double culture data + créativité", desc: "Ex-joueur de poker professionnel. Pensée probabiliste, gestion du risque, prise de décision sous incertitude." },
            { title: "Vision product-led growth", desc: "Alignée avec l'ADN tech de Cuure (Bubble, no-code, IA). Le produit comme premier canal d'acquisition." },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm opacity-40 leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA — Final */}
      {/* ============================================ */}
      <ScrollSection className="min-h-[80vh]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Parlons-en autour
              <br />
              d&apos;un café
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="opacity-30 mb-12 max-w-md mx-auto text-sm md:text-base leading-relaxed">
              J&apos;ai les compétences, la vision et l&apos;envie.
              Ce document n&apos;est qu&apos;un aperçu de ce que je peux apporter à Cuure.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:charles.bonnet@pm.me?subject=Candidature Head of Growth — Cuure"
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
