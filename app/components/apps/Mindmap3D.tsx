"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line, Float } from "@react-three/drei";
import * as THREE from "three";

// Theme configuration (synced with cv2-chat)
const THEME_LIGHT = {
  bg: "#F9F7F1",
  dark: "#2D2D2D",
  accent: "#EA580C",
  level0: "#FFFFFF",
  level1: "#EA580C",
  level2: "#F59E0B",
  level3: "#44403C",
};

const THEME_DARK = {
  bg: "#0C0A09",
  dark: "#E7E5E4",
  accent: "#F97316",
  level0: "#1C1917",
  level1: "#F97316",
  level2: "#FBBF24",
  level3: "#A8A29E",
};

const FONT_STACK = '"Consolas", "Monaco", "Lucida Console", "Courier New", monospace';

// Mindmap data structure
const createMindmapData = (theme: typeof THEME_LIGHT) => ({
  id: "root",
  label: "CHARLES BONNET",
  color: theme.level0,
  level: 0,
  children: [
    {
      id: "growth",
      label: "GROWTH & STRATEGY",
      color: theme.level1,
      level: 1,
      children: [
        {
          id: "valmonde",
          label: "Hyper-Growth (Valmonde)",
          level: 2,
          color: theme.level2,
          children: [
            { id: "v1", label: "Scaling: Subs x17", level: 3, color: theme.level3 },
            { id: "v2", label: "PMF: Newsletter = 5x Rev", level: 3, color: theme.level3 },
          ],
        },
        {
          id: "lagardere",
          label: "Revenue Ops (Lagardère)",
          level: 2,
          color: theme.level2,
          children: [
            { id: "l2", label: "Reporting Vivendi Board", level: 3, color: theme.level3 },
            { id: "l3", label: "Pricing Strategy", level: 3, color: theme.level3 },
          ],
        },
      ],
    },
    {
      id: "ai",
      label: "AI ENGINEERING",
      color: theme.level1,
      level: 1,
      children: [
        {
          id: "arch",
          label: "AI Architecture",
          level: 2,
          color: theme.level2,
          children: [
            { id: "aa1", label: "Agent Building (GPTs & Gems)", level: 3, color: theme.level3 },
            { id: "aa2", label: "RAG & Prompt Eng.", level: 3, color: theme.level3 },
            { id: "aa3", label: "Vibe Coding Apps", level: 3, color: theme.level3 },
          ],
        },
        {
          id: "certif",
          label: "Education",
          level: 2,
          color: theme.level2,
          children: [
            { id: "c1", label: "CEGOS: AI Marketing", level: 3, color: theme.level3 },
            { id: "c2", label: "INSEAD: Web3", level: 3, color: theme.level3 },
          ],
        },
      ],
    },
    {
      id: "mindset",
      label: "MINDSET & EDGE",
      color: theme.level1,
      level: 1,
      children: [
        {
          id: "poker",
          label: "Ex High-Stakes Poker Pro",
          level: 2,
          color: theme.level2,
          children: [
            { id: "p1", label: "Risk Mgmt & EV", level: 3, color: theme.level3 },
            { id: "p2", label: "Uncertainty decisions", level: 3, color: theme.level3 },
            { id: "p3", label: "Competitive Mindset", level: 3, color: theme.level3 },
          ],
        },
        {
          id: "innov",
          label: "Continuous Innovation",
          level: 2,
          color: theme.level2,
          children: [
            { id: "i1", label: "Web3/AI Governance", level: 3, color: theme.level3 },
          ],
        },
      ],
    },
    {
      id: "media",
      label: "SUBSCRIPTION EXPERTISE",
      color: theme.level1,
      level: 1,
      children: [
        {
          id: "sub_models",
          label: "Subscription Models",
          level: 2,
          color: theme.level2,
          children: [
            { id: "sm1", label: "Pricing: +29% (Repricing)", level: 3, color: theme.level3 },
            { id: "sm2", label: "Offer Structure Design", level: 3, color: theme.level3 },
          ],
        },
        {
          id: "paywall",
          label: "Paywall Strategy",
          level: 2,
          color: theme.level2,
          children: [
            { id: "pw1", label: "Dynamic Paywalls", level: 3, color: theme.level3 },
            { id: "pw2", label: "Freemium vs Premium", level: 3, color: theme.level3 },
          ],
        },
        {
          id: "retention",
          label: "Retention",
          level: 2,
          color: theme.level2,
          children: [
            { id: "ret1", label: "Anti-Churn Segmentation", level: 3, color: theme.level3 },
            { id: "ret2", label: "LTV Maximization", level: 3, color: theme.level3 },
          ],
        },
        {
          id: "acquisition",
          label: "Acquisition",
          level: 2,
          color: theme.level2,
          children: [
            { id: "acq1", label: "Landing Pages", level: 3, color: theme.level3 },
            { id: "acq2", label: "Conversion Funnels", level: 3, color: theme.level3 },
          ],
        },
        {
          id: "ed_align",
          label: "Editorial Alignment",
          level: 2,
          color: theme.level2,
          children: [
            { id: "ea1", label: "Journalistic constraints vs Business", level: 3, color: theme.level3 },
          ],
        },
      ],
    },
  ],
});

type NodeData = {
  id: string;
  label: string;
  color: string;
  level: number;
  children?: NodeData[];
  position?: THREE.Vector3;
  parent?: string;
};

// Planet Node Component
function PlanetNode({ 
  data, 
  position, 
  onClick, 
  isOpen, 
  isVisible = true, 
  theme 
}: { 
  data: NodeData; 
  position: THREE.Vector3; 
  onClick?: (id: string) => void; 
  isOpen: boolean; 
  isVisible?: boolean; 
  theme: typeof THEME_LIGHT;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  if (!isVisible) return null;

  let size = 0.6;
  if (data.level === 1) size = 0.5;
  if (data.level === 2) size = 0.35;
  if (data.level === 3) size = 0.15;

  const baseColor = new THREE.Color(data.color);
  const borderColor = data.level === 0 ? theme.dark : data.color;

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(data.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={baseColor}
            roughness={1}
            metalness={0}
            emissive={baseColor}
            emissiveIntensity={hovered || isOpen ? 0.3 : 0}
            flatShading={false}
          />
        </mesh>

        <Html
          distanceFactor={12}
          position={[0, size * 1.4, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: theme.bg,
              padding: data.level === 3 ? "4px 8px" : "8px 12px",
              borderRadius: "4px",
              border: `1px solid ${borderColor}`,
              color: theme.dark,
              fontSize: data.level === 3 ? "11px" : data.level === 0 ? "16px" : "13px",
              fontFamily: FONT_STACK,
              whiteSpace: "nowrap",
              fontWeight: "bold",
              boxShadow: hovered || isOpen
                ? `3px 3px 0px ${borderColor}`
                : `2px 2px 0px rgba(0,0,0,0.1)`,
              transition: "all 0.1s ease-out",
              transform: hovered || isOpen ? "translate(-1px, -1px)" : "none",
            }}
          >
            {data.label}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function Branch({ 
  start, 
  end, 
  isVisible, 
  theme 
}: { 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  isVisible: boolean; 
  theme: typeof THEME_LIGHT;
}) {
  if (!isVisible) return null;
  return (
    <Line
      points={[start, end]}
      color={theme.level3}
      lineWidth={1}
      transparent
      opacity={0.2}
    />
  );
}

function SolarSystem3Level({ theme, mindmapData }: { theme: typeof THEME_LIGHT; mindmapData: NodeData }) {
  const [openNodes, setOpenNodes] = useState(["root", "growth"]);

  const toggleNode = (id: string) => {
    setOpenNodes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const layout = useMemo(() => {
    const nodes: (NodeData & { position: THREE.Vector3; parent?: string })[] = [];
    const links: { start: THREE.Vector3; end: THREE.Vector3; parentId: string }[] = [];
    const rootPos = new THREE.Vector3(0, 0, 0);

    nodes.push({ ...mindmapData, position: rootPos });

    if (mindmapData.children) {
      mindmapData.children.forEach((l1, i) => {
        const radiusL1 = 5;
        const angleL1 = (i / mindmapData.children!.length) * Math.PI * 2;
        const posL1 = new THREE.Vector3(
          Math.cos(angleL1) * radiusL1,
          Math.sin(angleL1 * 2) * 0.5,
          Math.sin(angleL1) * radiusL1
        );

        nodes.push({ ...l1, position: posL1, parent: "root" });
        links.push({ start: rootPos, end: posL1, parentId: "root" });

        if (l1.children) {
          l1.children.forEach((l2, j) => {
            const radiusL2 = 2.5;
            const angleL2 = (j / l1.children!.length) * Math.PI * 2 + angleL1 + Math.PI / 4;
            const posL2 = new THREE.Vector3(
              posL1.x + Math.cos(angleL2) * radiusL2,
              posL1.y + Math.sin(angleL2) * 1,
              posL1.z + Math.sin(angleL2) * radiusL2
            );

            nodes.push({ ...l2, position: posL2, parent: l1.id });
            links.push({ start: posL1, end: posL2, parentId: l1.id });

            if (l2.children) {
              l2.children.forEach((l3, k) => {
                const radiusL3 = 1.5;
                const angleL3 = (k / l2.children!.length) * Math.PI * 2 + angleL2 + Math.PI / 2;
                const posL3 = new THREE.Vector3(
                  posL2.x + Math.cos(angleL3) * radiusL3,
                  posL2.y + Math.sin(angleL3 * 3) * 0.5,
                  posL2.z + Math.sin(angleL3) * radiusL3
                );

                nodes.push({ ...l3, position: posL3, parent: l2.id });
                links.push({ start: posL2, end: posL3, parentId: l2.id });
              });
            }
          });
        }
      });
    }
    return { nodes, links };
  }, [mindmapData]);

  return (
    <group>
      {layout.links.map((link, i) => (
        <Branch
          key={i}
          start={link.start}
          end={link.end}
          isVisible={openNodes.includes(link.parentId)}
          theme={theme}
        />
      ))}
      {layout.nodes.map((node) => {
        const isVisible = node.level === 0 || (node.parent && openNodes.includes(node.parent));
        const isOpen = openNodes.includes(node.id);
        return (
          <PlanetNode
            key={node.id}
            data={node}
            position={node.position}
            onClick={node.children ? toggleNode : undefined}
            isOpen={isOpen}
            isVisible={isVisible}
            theme={theme}
          />
        );
      })}
    </group>
  );
}

export default function Mindmap3D() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is set on root element
    const checkDarkMode = () => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const theme = darkMode ? THEME_DARK : THEME_LIGHT;
  const mindmapData = useMemo(() => createMindmapData(theme), [theme]);

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: theme.bg, minHeight: '100%' }}
    >
      {/* Header */}
      <div
        className="absolute top-4 left-4 z-10 pointer-events-none"
        style={{ paddingTop: '60px' }}
      >
        <div style={{ color: theme.dark, fontFamily: FONT_STACK }}>
          <h1 className="text-xl md:text-2xl font-extrabold m-0 tracking-tight">
            CHARLES BONNET
          </h1>
          <p
            className="text-xs font-bold uppercase mt-1"
            style={{ color: theme.accent }}
          >
            // Digital Brain Architecture
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="absolute bottom-4 left-4 z-10 text-xs pointer-events-none"
        style={{ color: theme.dark, opacity: 0.5, fontFamily: FONT_STACK }}
      >
        Click nodes to expand • Drag to rotate • Scroll to zoom
      </div>

      <Canvas camera={{ position: [0, 8, 25], fov: 45 }} style={{ height: '100%' }}>
        <color attach="background" args={[theme.bg]} />
        <ambientLight intensity={2.5} />
        <SolarSystem3Level theme={theme} mindmapData={mindmapData} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxDistance={50}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}
