"use client";

import { useRef, ReactNode, useEffect, useState, useCallback } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useInView,
    useMotionValueEvent,
    MotionValue,
} from "framer-motion";

// ============================================
// SCROLL SECTION — Full viewport sticky section
// ============================================
export function ScrollSection({
    children,
    className = "",
    id,
}: {
    children?: ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section
            id={id}
            className={`relative min-h-screen flex items-center justify-center px-6 md:px-12 ${className}`}
        >
            {children}
        </section>
    );
}

// ============================================
// PARALLAX LAYER — Moves at different scroll speed
// ============================================
export function ParallaxLayer({
    children,
    speed = 0.5,
    className = "",
}: {
    children?: ReactNode;
    speed?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <motion.div ref={ref} style={{ y: smoothY }} className={className}>
            {children}
        </motion.div>
    );
}

// ============================================
// FADE IN ON SCROLL — Content appears as you scroll
// ============================================
export function FadeIn({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: {
    children?: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-15%" });

    const dirs = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: -40, y: 0 },
        right: { x: 40, y: 0 },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, ...dirs[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {children}
        </motion.div>
    );
}

// ============================================
// SCROLL REVEAL TEXT — Words appear one by one
// ============================================
export function ScrollRevealText({
    text,
    className = "",
}: {
    text: string;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "start 0.3"],
    });

    const words = text.split(" ");

    return (
        <div ref={ref} className={`flex flex-wrap gap-x-[0.3em] ${className}`}>
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                    <ScrollWord key={i} progress={scrollYProgress} range={[start, end]}>
                        {word}
                    </ScrollWord>
                );
            })}
        </div>
    );
}

function ScrollWord({
    children,
    progress,
    range,
}: {
    children: ReactNode;
    progress: MotionValue<number>;
    range: [number, number];
}) {
    const opacity = useTransform(progress, range, [0.15, 1]);
    return <motion.span style={{ opacity }}>{children}</motion.span>;
}

// ============================================
// ANIMATED NUMBER — Counts up when visible
// ============================================
export function AnimatedNumber({
    value,
    suffix = "",
    prefix = "",
    duration = 2,
    className = "",
}: {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

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

    return (
        <span ref={ref} className={className}>
            {prefix}
            {count}
            {suffix}
        </span>
    );
}

// ============================================
// STICKY SCROLL SEQUENCE — Pin content, reveal items
// ============================================
export function StickySequence({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`relative ${className}`}>
            <div className="sticky top-0 min-h-screen flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

// ============================================
// HORIZONTAL SCROLL SECTION
// ============================================
export function HorizontalScroll({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

    if (isMobile) {
        return (
            <div className={`px-6 py-12 space-y-16 ${className}`}>
                {children}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className={`flex gap-8 md:gap-16 px-6 md:px-12 ${className}`}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}

// ============================================
// PROGRESS LINE — Vertical scroll progress indicator
// ============================================
export function ProgressLine() {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            className="fixed top-0 left-0 w-[2px] h-full bg-[var(--accent)] origin-top z-50"
            style={{ scaleY }}
        />
    );
}

// ============================================
// MINIMAL STAT — Clean single stat display
// ============================================
export function MinimalStat({
    value,
    label,
    suffix = "",
    prefix = "",
    numericValue,
}: {
    value: string;
    label: string;
    suffix?: string;
    prefix?: string;
    numericValue?: number;
}) {
    return (
        <FadeIn className="text-center">
            <div className="text-5xl md:text-7xl font-bold text-[var(--accent)] mb-2 tracking-tight">
                {numericValue !== undefined ? (
                    <AnimatedNumber value={numericValue} prefix={prefix} suffix={suffix} />
                ) : (
                    value
                )}
            </div>
            <p className="text-sm md:text-base opacity-40 max-w-[200px] mx-auto">{label}</p>
        </FadeIn>
    );
}

// ============================================
// COMPARISON ROW — Before/after minimal display
// ============================================
export function ComparisonRow({
    before,
    after,
    delay = 0,
}: {
    before: string;
    after: string;
    delay?: number;
}) {
    return (
        <FadeIn delay={delay} className="flex items-center gap-4 md:gap-8 py-4 border-b border-[var(--foreground)]/5 last:border-0">
            <span className="flex-1 text-right text-sm md:text-base opacity-40 line-through decoration-1">
                {before}
            </span>
            <span className="text-[var(--accent)] text-lg shrink-0">&rarr;</span>
            <span className="flex-1 text-sm md:text-base font-medium">{after}</span>
        </FadeIn>
    );
}

// ============================================
// CHAPTER MARKER — Section transition
// ============================================
export function ChapterMarker({
    number,
    title,
    subtitle,
}: {
    number: string;
    title: string;
    subtitle?: string;
}) {
    return (
        <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase mb-4 block">
                {number}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-base md:text-lg opacity-40 max-w-xl mx-auto">
                    {subtitle}
                </p>
            )}
        </FadeIn>
    );
}

// ============================================
// TIMELINE ITEM — Minimal horizontal timeline step
// ============================================
export function TimelineStep({
    period,
    title,
    items,
    highlight = false,
}: {
    period: string;
    title: string;
    items: string[];
    highlight?: boolean;
}) {
    return (
        <FadeIn
            className={`w-full md:min-w-[40vw] lg:min-w-[30vw] shrink-0 ${highlight ? "text-[var(--accent)]" : ""
                }`}
        >
            <span className="text-xs tracking-[0.2em] uppercase opacity-40 block mb-2">
                {period}
            </span>
            <h4 className="text-xl md:text-2xl font-bold mb-4">{title}</h4>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-sm opacity-60 flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-1 shrink-0">&#8226;</span>
                        {item}
                    </li>
                ))}
            </ul>
        </FadeIn>
    );
}

// ============================================
// KPI ROW — Minimal current → target display
// ============================================
export function KPIRow({
    label,
    current,
    target,
    delay = 0,
}: {
    label: string;
    current: string;
    target: string;
    delay?: number;
}) {
    return (
        <FadeIn
            delay={delay}
            className="grid grid-cols-3 gap-4 py-4 border-b border-[var(--foreground)]/5 last:border-0 items-center"
        >
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm opacity-40 text-center">{current}</span>
            <span className="text-sm font-bold text-[var(--accent)] text-right">
                {target}
            </span>
        </FadeIn>
    );
}

// ============================================
// SKILL PILL — Minimal tag
// ============================================
export function SkillPill({ label }: { label: string }) {
    return (
        <span className="px-4 py-2 rounded-full border border-[var(--foreground)]/10 text-xs md:text-sm opacity-50 whitespace-nowrap">
            {label}
        </span>
    );
}

// ============================================
// SIDE NAV — Discreet left navigation
// ============================================
export function SideNav({
    items,
}: {
    items: { id: string; label: string }[];
}) {
    const [activeId, setActiveId] = useState<string>("");
    const [visible, setVisible] = useState(false);
    const { scrollYProgress } = useScroll();

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        setVisible(v > 0.05);
    });

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        items.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveId(id);
                },
                { rootMargin: "-40% 0px -40% 0px" }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [items]);

    const handleClick = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <motion.nav
            className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }}
            transition={{ duration: 0.4 }}
        >
            {items.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => handleClick(id)}
                    className={`text-left text-[10px] tracking-wider uppercase transition-all duration-300 leading-tight max-w-[100px] ${activeId === id
                        ? "text-[var(--accent)] opacity-80 translate-x-1"
                        : "opacity-20 hover:opacity-50"
                        }`}
                >
                    {label}
                </button>
            ))}
        </motion.nav>
    );
}
