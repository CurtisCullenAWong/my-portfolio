import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";

import { ATTRIBUTES, VITALS, TIMELINE } from "../../data/portfolioData";

function AnimatedCounter({ value, inView }: { value: number; inView: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) {
      setDisplayValue(0);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value, inView]);

  return <>{displayValue}</>;
}

import { animate } from "motion/react";

function StatBar({ 
  label, 
  value, 
  glyph, 
  delay, 
  onHover, 
  isHovered 
}: { 
  label: string; 
  value: number; 
  glyph: string; 
  delay: number;
  onHover: (hovered: boolean) => void;
  isHovered: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div 
      ref={ref} 
      className="space-y-1.5 cursor-pointer group"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-['Cinzel',serif] text-[8px] tracking-widest w-4 text-right transition-colors duration-200 ${isHovered ? "text-[#e8e6e3]" : "text-[#4b5563]"}`}>{glyph}</span>
          <span className={`font-['Inter',sans-serif] text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${isHovered ? "text-[#e8e6e3]" : "text-[#8a8a93]"}`}>{label}</span>
        </div>
        <span className={`font-['Cinzel',serif] text-[10px] tracking-wider transition-colors duration-200 ${isHovered ? "text-[#e8e6e3]" : "text-[#a1a1aa]"}`}>
          <AnimatedCounter value={value} inView={inView} />
        </span>
      </div>
      <div className={`h-px relative overflow-hidden transition-colors duration-300 ${isHovered ? "bg-[#252530]" : "bg-[#16161a]"}`}>
        <motion.div
          className={`absolute inset-y-0 left-0 h-full bg-gradient-to-r ${isHovered ? "from-[#56565e] via-[#e8e6e3]/50 to-[#8a8a92]" : "from-[#3a3a46] via-[#e8e6e3]/20 to-[#56565e]"} bg-[length:200%_100%]`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{
            animation: "sweep 3s linear infinite",
          }}
        />
        {/* Tick marks every 25% */}
        {[25, 50, 75].map((pct) => (
          <div key={pct} className="absolute top-0 bottom-0 w-px bg-[#1e1e22]" style={{ left: `${pct}%` }} />
        ))}
      </div>
    </div>
  );
}

function AlchemicalCircle({ hoveredAttr }: { hoveredAttr: number | null }) {
  const nodes = [
    { name: "AQUA",   rune: "ᛟ", color: "#38bdf8", label: "Frontend",   x: 100,    y: 40,     lx: 100, ly: 20,  anchor: "middle" }, 
    { name: "IGNIS",  rune: "ᚠ", color: "#f97316", label: "Backend",    x: 157.06, y: 81.46,  lx: 174, ly: 78,  anchor: "start" },  
    { name: "TERRA",  rune: "ᛗ", color: "#10b981", label: "Mobile",     x: 135.28, y: 148.54, lx: 152, ly: 164, anchor: "start" },   
    { name: "AER",    rune: "ᚷ", color: "#a855f7", label: "UI / UX",    x: 64.72,  y: 148.54, lx: 48,  ly: 164, anchor: "end" },  
    { name: "AETHER", rune: "ᛃ", color: "#eab308", label: "Agentic AI", x: 42.94,  y: 81.46,  lx: 26,  ly: 78,  anchor: "end" }, 
  ];

  const activeColor = hoveredAttr !== null ? nodes[hoveredAttr].color : "#3a3a46";

  return (
    <svg viewBox="-80 -40 360 280" className="w-[75vmin] sm:w-[65vmin] lg:w-[50vmin] max-w-[420px] lg:max-w-[480px] aspect-[360/280] overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="center-glow-about" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={activeColor} stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
        </radialGradient>
        <filter id="glow-filter-about" filterUnits="userSpaceOnUse" x="-80" y="-40" width="360" height="280">
          <feGaussianBlur stdDeviation="1.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Central glow */}
      <circle cx="100" cy="100" r="85" fill="url(#center-glow-about)" className="transition-all duration-700" />

      {/* Outer rotating rune ring */}
      <motion.g 
        animate={{ rotate: 360 }} 
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        style={{ originX: "100px", originY: "100px" }}
      >
        <circle cx="100" cy="100" r="83" fill="none" stroke="#252530" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="77" fill="none" stroke="#252530" strokeWidth="0.5" />
        
        <path id="circlePathAbout" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" fill="none" />
        <text fill="#4b5563" fontSize="5.2" letterSpacing="3.5px" className="font-['Cinzel',serif] select-none transition-colors duration-300">
          <textPath href="#circlePathAbout" startOffset="0%">
            ᚠ ARTIFICER ᚦ SCHOLAR ᚲ ARCHITECT ᛉ SENTINEL ᛟ AETHER ᚠ ARTIFICER ᚦ SCHOLAR ᚲ ARCHITECT ᛉ SENTINEL ᛟ AETHER
          </textPath>
        </text>
      </motion.g>

      {/* Middle counter-rotating ring with tick marks */}
      <motion.g 
        animate={{ rotate: -360 }} 
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        style={{ originX: "100px", originY: "100px" }}
      >
        <circle cx="100" cy="100" r="70" fill="none" stroke="#2a2a35" strokeWidth="0.8" />
        {/* Tick marks every 15 degrees */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          const r1 = 70;
          const r2 = i % 2 === 0 ? 65 : 67;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * r1}
              y1={100 + Math.sin(a) * r1}
              x2={100 + Math.cos(a) * r2}
              y2={100 + Math.sin(a) * r2}
              stroke="#2e2e38"
              strokeWidth="0.5"
            />
          );
        })}
      </motion.g>

      {/* Intersecting Triangles (Hexagram) - static/slow rotation */}
      <motion.g
        animate={{ rotate: 180 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        style={{ originX: "100px", originY: "100px" }}
      >
        <polygon points="100,25 165,137.5 35,137.5" fill="none" stroke="#22222a" strokeWidth="0.6" />
        <polygon points="100,175 35,62.5 165,62.5" fill="none" stroke="#22222a" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#22222a" strokeWidth="0.5" strokeDasharray="3, 3" />
      </motion.g>

      {/* Inner geometric layers */}
      <circle cx="100" cy="100" r="45" fill="none" stroke="#252532" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="42" fill="none" stroke="#252532" strokeWidth="0.4" />
      <circle cx="100" cy="100" r="18" fill="none" stroke="#252532" strokeWidth="0.8" />
      
      {/* Pentagram lines connecting the 5 nodes */}
      <polygon 
        points="100,40 135.28,148.54 42.94,81.46 157.06,81.46 64.72,148.54" 
        fill="none" 
        stroke="#22222c" 
        strokeWidth="0.6" 
      />

      {/* Spokes and glowing highlights */}
      {nodes.map((node, i) => {
        const isHovered = hoveredAttr === i;
        return (
          <g key={node.name}>
            {/* Connection line */}
            <line
              x1="100"
              y1="100"
              x2={node.x}
              y2={node.y}
              stroke={isHovered ? node.color : "#252532"}
              strokeWidth={isHovered ? 1.5 : 0.6}
              className="transition-all duration-300"
              filter={isHovered ? "url(#glow-filter-about)" : undefined}
            />
            
            {/* Outer node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={isHovered ? 7 : 4.8}
              fill="#0a0a0c"
              stroke={isHovered ? node.color : "#3f3f4e"}
              strokeWidth={isHovered ? 1.5 : 0.9}
              className="transition-all duration-300"
              filter={isHovered ? "url(#glow-filter-about)" : undefined}
            />

            {/* Rune character in node */}
            <text
              x={node.x}
              y={node.y + 1.5}
              textAnchor="middle"
              fill={isHovered ? node.color : "#64748b"}
              fontSize="4.5"
              className="font-mono transition-colors duration-300 select-none"
            >
              {node.rune}
            </text>
          </g>
        );
      })}

      {/* Node Labels - ALWAYS visible with soft ambient glow, brightened when active */}
      {nodes.map((node, i) => {
        const isHovered = hoveredAttr === i;
        const opacity = isHovered ? 1 : 0.75;
        const fillColor = isHovered ? node.color : "#94a3b8";
        return (
          <g key={`label-${node.name}`}>
            <text
              x={node.lx}
              y={node.ly}
              textAnchor={node.anchor as any}
              fill={fillColor}
              fontSize="5.5"
              fontWeight={isHovered ? "bold" : "600"}
              className="font-['Cinzel',serif] tracking-[0.2em] select-none transition-all duration-300"
              filter={isHovered ? "url(#glow-filter-about)" : undefined}
              opacity={opacity}
            >
              {node.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Center Jewel */}
      <circle 
        cx="100" 
        cy="100" 
        r="7.5" 
        fill={hoveredAttr !== null ? nodes[hoveredAttr].color : "#1a1a24"} 
        stroke="#3a3a48" 
        strokeWidth="0.8" 
        className="transition-colors duration-500"
      />
      <circle cx="100" cy="100" r="2.5" fill="#0a0a0c" />
    </svg>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [hoveredAttr, setHoveredAttr] = useState<number | null>(null);
  const [portraitHovered, setPortraitHovered] = useState(false);

  // Mouse tilt logic
  const tiltX = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-py * 12);
    tiltY.set(px * 16);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const portraitRotateX = useTransform(tiltX, v => v * 0.55);
  const portraitRotateY = useTransform(tiltY, v => v * 0.55);

  const circleRotateX = useTransform(tiltX, v => v * 0.7);
  const circleRotateY = useTransform(tiltY, v => v * 0.7);

  return (
    <section
      id="about"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-dvh lg:h-dvh flex flex-col justify-center border-b border-[#1a1a1e] lg:snap-start py-10 md:py-12 lg:py-4 overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />

      {/* Foggy mountain background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486184885347-1464b5f10296?w=2400&h=1600&fit=crop&auto=format"
          alt="Misty mountain vista"
          className="w-full h-full object-cover opacity-20 grayscale-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/70 to-[#0a0a0c]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-transparent to-[#0a0a0c]/80" />
      </div>

      {/* Dynamic interactive alchemical circle watermark */}
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center lg:justify-end px-4 lg:pl-0 lg:pr-8 xl:pr-16 pointer-events-none transition-opacity duration-300 overflow-visible"
        style={{
          opacity: hoveredAttr !== null ? 0.45 : 0.22,
          rotateX: circleRotateX,
          rotateY: circleRotateY,
          transformPerspective: 1200
        }}
      >
        <AlchemicalCircle hoveredAttr={hoveredAttr} />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-6 md:gap-10 lg:gap-12 items-center py-4 lg:py-2">

        {/* Left — Portrait */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full flex flex-col items-center lg:items-start gap-4 lg:gap-4"
        >
          {/* Portrait frame with 3D tilt and expandable corners on hover */}
          <motion.div 
            className="relative w-full max-w-[200px] sm:max-w-[230px] lg:max-w-[220px] xl:max-w-[260px]"
            onMouseEnter={() => setPortraitHovered(true)}
            onMouseLeave={() => setPortraitHovered(false)}
            style={{ 
              rotateX: portraitRotateX, 
              rotateY: portraitRotateY, 
              transformPerspective: 1000 
            }}
          >
            {/* Rune border corners */}
            {[
              { pos: "top-0 left-0", cls: "border-t border-l", x: -4, y: -4 },
              { pos: "top-0 right-0", cls: "border-t border-r", x: 4, y: -4 },
              { pos: "bottom-0 left-0", cls: "border-b border-l", x: -4, y: 4 },
              { pos: "bottom-0 right-0", cls: "border-b border-r", x: 4, y: 4 }
            ].map((corner, i) => (
              <motion.div 
                key={i} 
                className={`absolute ${corner.pos} w-4 h-4 border-[#3a3a46] ${corner.cls} z-10`}
                animate={{ x: portraitHovered ? corner.x : 0, y: portraitHovered ? corner.y : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            ))}

            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden bg-[#0e0e12]">
              <img
                src="https://images.unsplash.com/photo-1590142035743-0ffa020065e6?w=600&h=800&fit=crop&auto=format"
                alt="Mountain silhouette — character portrait placeholder"
                className="w-full h-full object-cover opacity-55 grayscale-[0.4] scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/80 via-transparent to-transparent" />
            </div>

            {/* Portrait overlay label */}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="font-['Cinzel',serif] text-[8px] tracking-[0.4em] text-[#6a6a72] uppercase">
                Character Portrait
              </p>
            </div>
          </motion.div>

          {/* Vitals grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full max-w-[200px] sm:max-w-[230px] lg:max-w-[220px] xl:max-w-[260px]">
            {VITALS.map(({ label, value }) => (
              <div key={label} className="border border-[#1a1a20] p-2 sm:p-2.5 bg-[#0c0c0e]/70 hover:bg-[#121217] hover:border-[#2a2a35] transition-all duration-300">
                <p className="font-['Cinzel',serif] text-sm sm:text-base text-[#e8e6e3] leading-none mb-1">{value}</p>
                <p className="font-['Inter',sans-serif] text-[8.5px] sm:text-[9px] tracking-[0.18em] text-[#71717a] uppercase truncate">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Character sheet */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          className="w-full flex flex-col space-y-4 lg:space-y-4 xl:space-y-5"
        >
          {/* Header */}
          <div className="space-y-1">
            <p className="font-['Inter',sans-serif] text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-[#646473]">Full-Stack Developer & Project Manager</p>
            <h2 className="font-['Cinzel',serif] text-[clamp(1.5rem,3vw,2.5rem)] text-[#e8e6e3] tracking-wide leading-tight">The Artificer</h2>
            <div className="h-px w-16 bg-[#252530]" />
          </div>

          {/* Lore bio */}
          <div className="space-y-2 border-l border-[#22222a] pl-3.5 sm:pl-4">
            <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">A detail-oriented Full-Stack Developer and Project Manager experienced in leading cross-platform projects. He bridges gaps between complex technical requirements and user-friendly outcomes.</p>
            <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#8a8a93] leading-relaxed">Committed to delivering quality code and efficient project workflows through orchestrated problem solving and technical mastery. His experience spans logistics, mobile, and AI-integrated applications across web and mobile platforms.</p>
          </div>

          {/* Attributes */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-4">
              <p className="font-['Cinzel',serif] tracking-[0.4em] uppercase text-[10.5px] sm:text-[11px] text-[#71717a]">Attributes</p>
              <div className="flex-1 h-px bg-[#1e1e24]" />
            </div>
            <div className="space-y-2 sm:space-y-2.5">
              {ATTRIBUTES.map((attr, i) => (
                <StatBar 
                  key={attr.label} 
                  {...attr} 
                  delay={0.3 + i * 0.1} 
                  isHovered={hoveredAttr === i}
                  onHover={(hovered) => setHoveredAttr(hovered ? i : null)}
                />
              ))}
            </div>
          </div>

          {/* Education & Experience — Responsive Timeline */}
          <div className="space-y-2.5 sm:space-y-3 pt-1">
            <div className="flex items-center gap-4">
              <p className="font-['Cinzel',serif] tracking-[0.4em] uppercase text-[10px] sm:text-[10.5px] text-[#71717a]">Experience & Education</p>
              <div className="flex-1 h-px bg-[#1e1e24]" />
            </div>
            
            <div className="relative pt-1 px-1 pb-1">
              {/* Horizontal connector line — visible on sm and up */}
              <div className="hidden sm:block absolute top-[14px] left-3 right-3 h-px bg-[#22222a] z-0" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3 relative z-10">
                {TIMELINE.map((entry, idx) => (
                  <div key={idx} className="group border-l border-[#22222a] sm:border-l-0 pl-3 sm:pl-0 sm:pt-0.5">
                    {/* Diamond node on line — visible on sm and up */}
                    <div className="hidden sm:flex items-center mb-2 pl-0.5">
                      <div className="w-[8px] h-[8px] rotate-45 border border-[#4a4a58] bg-[#0a0a0c] group-hover:border-[#a1a1aa] group-hover:bg-[#16161c] transition-all duration-200 z-10 shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
                    </div>
                    {/* Entry details */}
                    <div className="space-y-0.5">
                      <p className="font-['Inter',sans-serif] text-[8.5px] tracking-[0.18em] text-[#8a8a93] uppercase">{entry.year}</p>
                      <h4 className="font-['Cinzel',serif] text-[10.5px] sm:text-[11.5px] tracking-wide text-[#e8e6e3] group-hover:text-white transition-colors duration-200 leading-snug font-medium">{entry.title}</h4>
                      <p className="font-['Inter',sans-serif] text-[10px] text-[#a1a1aa] leading-snug">{entry.org}</p>
                      <p className="font-['Inter',sans-serif] text-[8.5px] sm:text-[9px] tracking-wide text-[#71717a] italic leading-relaxed">{entry.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
