import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ATTRIBUTES = [
  { label: "Frontend Mastery", value: 92, glyph: "I" },
  { label: "Backend Design",   value: 78, glyph: "II" },
  { label: "Mobile Craft",     value: 72, glyph: "III" },
  { label: "UI / UX Sensibility", value: 86, glyph: "IV" },
  { label: "Agentic AI",       value: 68, glyph: "V" },
];

const VITALS = [
  { label: "Years Active",    value: "5+" },
  { label: "Projects Shipped", value: "15+" },
  { label: "Technologies",    value: "30+" },
  { label: "Origin",          value: "PH" },
];

function StatBar({ label, value, glyph, delay }: { label: string; value: number; glyph: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-['Cinzel',serif] text-[8px] text-[#4b5563] tracking-widest w-4 text-right">{glyph}</span>
          <span className="font-['Inter',sans-serif] text-[10px] md:text-xs text-[#8a8a93] tracking-[0.2em] uppercase">{label}</span>
        </div>
        <span className="font-['Cinzel',serif] text-[10px] text-[#a1a1aa] tracking-wider">{value}</span>
      </div>
      <div className="h-px bg-[#16161a] relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 h-full"
          style={{ background: "linear-gradient(to right, #3a3a46, #56565e)" }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Tick marks every 25% */}
        {[25, 50, 75].map((pct) => (
          <div key={pct} className="absolute top-0 bottom-0 w-px bg-[#1e1e22]" style={{ left: `${pct}%` }} />
        ))}
      </div>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-dvh lg:h-dvh flex flex-col justify-center lg:overflow-hidden border-b border-[#1a1a1e] lg:snap-start py-16 lg:py-0"
    >
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

      {/* Subtle rune watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-end pr-4 pointer-events-none opacity-[0.03]">
        <svg viewBox="0 0 200 200" className="w-[60vmin] h-[60vmin]" aria-hidden>
          <circle cx="100" cy="100" r="90" fill="none" stroke="#e8e6e3" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="65" fill="none" stroke="#e8e6e3" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#e8e6e3" strokeWidth="0.5" />
          {[0,45,90,135,180,225,270,315].map(d => {
            const a = d * Math.PI / 180;
            return <line key={d} x1="100" y1="100" x2={100 + Math.cos(a)*90} y2={100 + Math.sin(a)*90} stroke="#e8e6e3" strokeWidth="0.3" />;
          })}
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-20 items-center py-12">

        {/* Left — Portrait */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start gap-6"
        >
          {/* Portrait frame */}
          <div className="relative w-full max-w-[280px]">
            {/* Rune border corners */}
            {[["top-0 left-0", "border-t border-l"], ["top-0 right-0", "border-t border-r"], ["bottom-0 left-0", "border-b border-l"], ["bottom-0 right-0", "border-b border-r"]].map(([pos, cls], i) => (
              <div key={i} className={`absolute ${pos} w-5 h-5 border-[#2a2a34] ${cls} z-10`} />
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
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-['Cinzel',serif] text-[8px] tracking-[0.4em] text-[#6a6a72] uppercase">
                Character Portrait
              </p>
            </div>
          </div>

          {/* Vitals grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
            {VITALS.map(({ label, value }) => (
              <div key={label} className="border border-[#1a1a20] p-3 bg-[#0c0c0e]/60">
                <p className="font-['Cinzel',serif] text-[18px] text-[#e8e6e3] leading-none mb-1">{value}</p>
                 <p className="font-['Inter',sans-serif] text-[9px] tracking-[0.2em] text-[#6a6a72] uppercase">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Character sheet */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <p className="font-['Inter',sans-serif] text-[9px] tracking-[0.45em] uppercase text-[#4e4e5b]">Entry level developer</p>
            <h2 className="font-['Cinzel',serif] text-[clamp(1.6rem,3.5vw,3rem)] text-[#e8e6e3] tracking-wide leading-tight">The Artificer</h2>
            <div className="h-px w-16 bg-[#252530]" />
          </div>

          {/* Lore bio */}
          <div className="space-y-3 border-l border-[#1a1a20] pl-5">
            <p className="font-['Inter',sans-serif] text-sm text-[#a1a1aa] leading-relaxed"> A Full-Stack Developer who builds web and mobile applications from frontend to backend. He focuses on creating software that is reliable, easy to use, and maintainable.</p>
            <p className="font-['Inter',sans-serif] text-sm text-[#8a8a93] leading-relaxed">His experience includes projects for small businesses, logistics companies, and personal ventures. In addition to software development, he works with Figma to design user interfaces and uses AI tools to automate repetitive tasks and improve development workflows.</p>
          </div>

          {/* Attributes */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="font-['Cinzel',serif] tracking-[0.4em] uppercase text-[12px] text-[#4e4e5b]">Attributes</p>
              <div className="flex-1 h-px bg-[#161618]" />
            </div>
            <div className="space-y-4">
              {ATTRIBUTES.map((attr, i) => (
                <StatBar key={attr.label} {...attr} delay={0.3 + i * 0.1} />
              ))}
            </div>
          </div>

          {/* Perk tags */}
          {/* <div className="flex flex-wrap gap-2 pt-2">
            {["React Adept", "Laravel Sage", "Flutter Initiate", "Cloud Walker", "AI Conjurer", "Design Touched"].map((perk) => (
              <span
                key={perk}
                className="font-['Cinzel',serif] text-[8px] tracking-[0.25em] uppercase text-[#303038] border border-[#1e1e24] px-3 py-1.5"
              >
                {perk}
              </span>
            ))}
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
