"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ============================================
// ANIMATED STAT COMPONENT
// ============================================
export function AnimatedStat({
  value,
  suffix = "",
  prefix = "",
  label,
  highlight = false,
  duration = 2,
}: {
  value: number | string;
  suffix?: string;
  prefix?: string;
  label: string;
  highlight?: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isNumber = typeof value === "number";

  useEffect(() => {
    if (!isInView || !isNumber) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * (value as number)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration, isNumber]);

  return (
    <motion.div
      ref={ref}
      className={`text-center p-4 rounded-xl ${
        highlight
          ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
          : "bg-[var(--bot-bubble-bg)]"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`text-3xl md:text-4xl font-bold mb-1 ${
          highlight ? "text-[var(--accent)]" : "text-[var(--foreground)]"
        }`}
      >
        {prefix}
        {isNumber ? count : value}
        {suffix}
      </div>
      <p className="text-sm opacity-60">{label}</p>
    </motion.div>
  );
}

// ============================================
// ACCORDION COMPONENT
// ============================================
export function Accordion({ children }: { children: ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[var(--foreground)]/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-[var(--bot-bubble-bg)] hover:bg-[var(--bot-bubble-bg)]/80 transition-colors"
      >
        <span className="font-semibold text-lg">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[var(--accent)]"
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 bg-[var(--background)]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FLIP CARD COMPONENT
// ============================================
export function FlipCard({
  front,
  back,
}: {
  front: ReactNode;
  back: ReactNode;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-[320px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 p-6 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
          <p className="text-xs opacity-40 mt-4">Cliquez pour retourner</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-[var(--bot-bubble-bg)] border border-[var(--accent)]/30 p-6 overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// CALLOUT COMPONENT
// ============================================
export function Callout({
  type = "insight",
  children,
}: {
  type?: "insight" | "action" | "proof" | "personal";
  children: ReactNode;
}) {
  const styles = {
    insight: "border-blue-500/30 bg-blue-500/10",
    action: "border-[var(--accent)]/30 bg-[var(--accent)]/10",
    proof: "border-green-500/30 bg-green-500/10",
    personal: "border-purple-500/30 bg-purple-500/10",
  };

  const icons = {
    insight: "💡",
    action: "🎯",
    proof: "✅",
    personal: "💬",
  };

  return (
    <div className={`border rounded-lg p-4 mt-4 ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}

// ============================================
// STRATEGY TABS COMPONENT
// ============================================
export function StrategyTabs({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Array.isArray(children) ? children : [children];

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[var(--foreground)]/10 pb-4">
        {tabs.map((tab: any, index: number) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === index
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bot-bubble-bg)] opacity-60 hover:opacity-100"
            }`}
          >
            <span className="mr-2">{tab.props.icon}</span>
            {tab.props.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {tabs[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Tab({
  icon,
  title,
  tagline,
  children,
}: {
  icon: string;
  title: string;
  tagline: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-4">
        <h4 className="text-xl font-bold text-[var(--accent)]">{title}</h4>
        <p className="opacity-60">{tagline}</p>
      </div>
      {children}
    </div>
  );
}

// ============================================
// TIMELINE COMPONENT
// ============================================
export function Timeline({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

export function TimelineMonth({
  month,
  title,
  label,
  children,
}: {
  month: number;
  title: string;
  label?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 pb-8 border-l-2 border-[var(--foreground)]/20 last:border-transparent"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Month indicator */}
      <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
        {month}
      </div>

      <div className="ml-4">
        <h4 className="text-lg font-bold mb-1">
          {label || `Jours ${(month - 1) * 30 + 1}-${month * 30}`} : {title}
        </h4>
        <div className="space-y-2">{children}</div>
      </div>
    </motion.div>
  );
}

export function TimelineItem({
  children,
  highlight = false,
  status,
}: {
  children: ReactNode;
  highlight?: boolean;
  status?: "ready" | "quick-win";
}) {
  return (
    <motion.div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        highlight
          ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
          : "bg-[var(--bot-bubble-bg)]"
      }`}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-[var(--accent)]">
        {status === "quick-win" ? "⚡" : "○"}
      </span>
      <span className={highlight ? "text-[var(--accent)]" : ""}>{children}</span>
    </motion.div>
  );
}

// ============================================
// FUNNEL STEP COMPONENT
// ============================================
export function FunnelStep({
  level,
  name,
  price,
  features,
  trigger,
  highlight = false,
}: {
  level: number;
  name: string;
  price: string;
  features: string[];
  trigger: string;
  highlight?: boolean;
}) {
  const widths = ["100%", "80%", "60%"];

  return (
    <motion.div
      className={`mx-auto p-4 rounded-xl border ${
        highlight
          ? "bg-[var(--accent)]/10 border-[var(--accent)]/50"
          : "bg-[var(--bot-bubble-bg)] border-[var(--foreground)]/10"
      }`}
      style={{ width: widths[level - 1] || "100%" }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: level * 0.1 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-bold ${highlight ? "text-[var(--accent)]" : ""}`}>
          {name}
        </h4>
        <span className="text-sm opacity-60">{price}</span>
      </div>
      <ul className="text-sm opacity-70 mb-2">
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>
      <p className="text-xs opacity-50">Déclencheur : {trigger}</p>
    </motion.div>
  );
}

export function FunnelArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-2">
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-[var(--accent)] text-2xl"
      >
        ↓
      </motion.div>
      <span className="text-xs opacity-50 text-center max-w-[200px]">{label}</span>
    </div>
  );
}

// ============================================
// GENERIC DATA TABLE COMPONENT
// ============================================
export function DataTable({
  headers,
  dataKeys,
  rows,
}: {
  headers: string[];
  dataKeys: string[];
  rows: {
    name: string;
    highlight?: boolean;
    data: Record<string, string>;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--foreground)]/10">
            <th className="text-left p-3 font-semibold">Plateforme</th>
            {headers.map((h) => (
              <th key={h} className="text-left p-3 font-semibold opacity-60">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.name}
              className={`border-b border-[var(--foreground)]/5 ${
                row.highlight
                  ? "bg-[var(--accent)]/10"
                  : "hover:bg-[var(--bot-bubble-bg)]"
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <td className={`p-3 font-semibold ${row.highlight ? "text-[var(--accent)]" : ""}`}>
                {row.name}
              </td>
              {dataKeys.map((key) => (
                <td key={key} className="p-3 opacity-70">
                  {row.data[key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// KPI DASHBOARD TABLE COMPONENT
// ============================================
export function KPIDashboard({
  rows,
}: {
  rows: {
    kpi: string;
    baseline: string;
    target2026: string;
    target2028: string;
    highlight?: boolean;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--foreground)]/10">
            <th className="text-left p-3 font-semibold">KPI</th>
            <th className="text-left p-3 font-semibold opacity-60">Baseline 2025</th>
            <th className="text-left p-3 font-semibold text-[var(--accent)]">Cible 2026</th>
            <th className="text-left p-3 font-semibold text-[var(--accent)]">Cible 2028</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.kpi}
              className={`border-b border-[var(--foreground)]/5 ${
                row.highlight ? "bg-[var(--accent)]/10" : "hover:bg-[var(--bot-bubble-bg)]"
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <td className={`p-3 font-semibold ${row.highlight ? "text-[var(--accent)]" : ""}`}>
                {row.kpi}
              </td>
              <td className="p-3 opacity-50">{row.baseline}</td>
              <td className="p-3 font-medium">{row.target2026}</td>
              <td className="p-3 font-medium text-[var(--accent)]">{row.target2028}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// TRIGGER CARD COMPONENT
// ============================================
export function TriggerCard({
  trigger,
  action,
}: {
  trigger: string;
  action: string;
}) {
  return (
    <motion.div
      className="bg-[var(--bot-bubble-bg)] border border-[var(--foreground)]/10 rounded-lg p-3"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ borderColor: "var(--accent)" }}
    >
      <p className="text-sm font-medium mb-1">
        <span className="text-[var(--accent)]">Si :</span> {trigger}
      </p>
      <p className="text-sm opacity-60">
        <span className="text-green-500">→</span> {action}
      </p>
    </motion.div>
  );
}

// ============================================
// PYRAMID CHART COMPONENT
// ============================================
export function PyramidChart({
  levels,
}: {
  levels: { label: string; width: string }[];
}) {
  return (
    <div className="flex flex-col items-center gap-2 my-4">
      {levels.map((level, i) => (
        <motion.div
          key={i}
          className="bg-[var(--accent)]/20 border border-[var(--accent)]/30 rounded-lg p-2 text-center text-sm"
          style={{ width: level.width }}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
        >
          {level.label}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// HORIZONTAL BAR CHART COMPONENT
// ============================================
export function BarChart({
  data,
}: {
  data: { country: string; value: number; highlight?: boolean }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3 my-4">
      {data.map((item, i) => (
        <div key={item.country} className="flex items-center gap-3">
          <span className="w-24 text-sm">{item.country}</span>
          <div className="flex-1 h-6 bg-[var(--foreground)]/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                item.highlight ? "bg-[var(--accent)]" : "bg-[var(--foreground)]/60"
              }`}
              initial={{ width: 0 }}
              whileInView={{ width: `${(item.value / maxValue) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          </div>
          <span className={`text-sm font-semibold ${item.highlight ? "text-[var(--accent)]" : ""}`}>
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EMAIL FLOW TABLE COMPONENT
// ============================================
export function EmailFlowTable({
  flows,
}: {
  flows: {
    name: string;
    trigger: string;
    content: string;
    objective: string;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--foreground)]/10">
            <th className="text-left p-3 font-semibold">Flow</th>
            <th className="text-left p-3 font-semibold opacity-60">Déclencheur</th>
            <th className="text-left p-3 font-semibold opacity-60">Contenu</th>
            <th className="text-left p-3 font-semibold opacity-60">Objectif</th>
          </tr>
        </thead>
        <tbody>
          {flows.map((flow, i) => (
            <motion.tr
              key={flow.name}
              className="border-b border-[var(--foreground)]/5 hover:bg-[var(--bot-bubble-bg)]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <td className="p-3 font-semibold text-[var(--accent)]">{flow.name}</td>
              <td className="p-3 opacity-70">{flow.trigger}</td>
              <td className="p-3 opacity-70">{flow.content}</td>
              <td className="p-3 opacity-70">{flow.objective}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
