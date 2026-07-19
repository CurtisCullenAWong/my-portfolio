import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { Icon } from "@iconify/react";

import { Constellation, constellations } from "../../data/portfolioData";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

// A deterministic scatter of faint background stars for the starfield.
function useStarfield(count: number, seed: number): Star[] {
  return useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: count }, (_: unknown, i: number): Star => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 1.4 + 0.3,
      opacity: rand() * 0.4 + 0.05,
    }));
  }, [count, seed]);
}

function Starfield({ count, seed }: { count: number; seed: number }) {
  const stars = useStarfield(count, seed);
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `}} />
      {stars.map((star: Star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[#e8e6e3]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${2.5 + (star.id % 4) * 0.8}s ease-in-out infinite`,
            animationDelay: `${(star.id % 6) * 0.5}s`,
            willChange: "opacity",
          }}
        />
      ))}
    </>
  );
}

// A single constellation rendered as a free-floating figure — no box, no
// background — just its star-lines and perk nodes suspended in the sky.
function ConstellationFigure({
  constellation,
  hovered,
  setHovered,
  pinned,
  setPinned,
  focused,
  onStarClick,
}: {
  constellation: Constellation;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  pinned: number | null;
  setPinned: (i: number | null) => void;
  focused: number | null;
  onStarClick: (i: number) => void;
}) {
  const focusPerk = focused !== null ? constellation.perks[focused] : null;
  const zoom = focusPerk ? 3.6 : 1;
  const fx = focusPerk ? focusPerk.x : 50;
  const fy = focusPerk ? focusPerk.y : 50;

  // DOM container ref to mutate elements directly outside React render cycles
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();

    const update = () => {
      const container = containerRef.current;
      if (!container) return;

      const t = (performance.now() - startTime) / 1000;

      // Select nodes directly
      const starEls = container.querySelectorAll<HTMLDivElement>("[data-star-idx]");
      const lineEls = container.querySelectorAll<SVGLineElement>("[data-edge-a]");

      // Calculate new offsets at 60fps
      const offsets = constellation.perks.map((_, i) => {
        const freqX = 0.4 + (i % 3) * 0.15;
        const freqY = 0.45 + ((i + 1) % 3) * 0.15;
        const phaseX = i * 1.3;
        const phaseY = i * 1.9;
        const amp = 1.0;

        return {
          x: Math.sin(t * freqX + phaseX) * amp,
          y: Math.cos(t * freqY + phaseY) * amp,
        };
      });

      // Update star positions on the DOM
      starEls.forEach((el) => {
        const idxAttr = el.getAttribute("data-star-idx");
        if (idxAttr === null) return;
        const idx = parseInt(idxAttr, 10);
        const perk = constellation.perks[idx];
        const offset = offsets[idx];
        if (perk && offset) {
          el.style.left = `${perk.x + offset.x}%`;
          el.style.top = `${perk.y + offset.y}%`;
        }
      });

      // Update connecting SVG lines on the DOM
      lineEls.forEach((el) => {
        const aAttr = el.getAttribute("data-edge-a");
        const bAttr = el.getAttribute("data-edge-b");
        if (aAttr === null || bAttr === null) return;
        const a = parseInt(aAttr, 10);
        const b = parseInt(bAttr, 10);

        const p1 = constellation.perks[a];
        const p2 = constellation.perks[b];
        const o1 = offsets[a];
        const o2 = offsets[b];

        if (p1 && p2 && o1 && o2) {
          el.setAttribute("x1", (p1.x + o1.x).toFixed(3));
          el.setAttribute("y1", (p1.y + o1.y).toFixed(3));
          el.setAttribute("x2", (p2.x + o2.x).toFixed(3));
          el.setAttribute("y2", (p2.y + o2.y).toFixed(3));
        }
      });

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [constellation]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `translate(${50 - zoom * fx}%, ${50 - zoom * fy}%) scale(${zoom})`,
        transformOrigin: "0 0",
        transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
    >
      {/* Connecting star-lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        shapeRendering="geometricPrecision"
      >
        {constellation.edges.map(([a, b], edgeIdx) => {
          const p1 = constellation.perks[a];
          const p2 = constellation.perks[b];
          const lit = hovered === a || hovered === b || pinned === a || pinned === b;
          return (
            <line
              key={edgeIdx}
              data-edge-a={a}
              data-edge-b={b}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={lit ? "#8b8b8b" : "#3a3b3f"}
              strokeWidth={lit ? (0.4 / zoom) : (0.2 / zoom)}
              style={{ transition: "stroke 0.25s, stroke-width 0.25s" }}
            />
          );
        })}
      </svg>

      {/* Perk star nodes */}
      {constellation.perks.map((perk, i) => {
        const isHovered = hovered === i;
        const isPinned = pinned === i;
        const isZoomed = focused === i;
        // Modal is open when: hovering, manually pinned, or zoomed into this star
        const showModal = isHovered || isPinned || isZoomed;

        return (
          <div
            key={perk.name}
            data-star-idx={i}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${perk.x}%`,
              top: `${perk.y}%`,
              transform: `translate(-50%, -50%) scale(${1 / zoom})`,
              transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "transform",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => {
              e.stopPropagation();
              // Toggle pin; also trigger the zoom navigation
              setPinned(isPinned ? null : i);
              onStarClick(i);
            }}
          >
            <div
              className="relative flex items-center justify-center pointer-events-none"
            >
              {/* Hit target */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-auto" style={{ width: 100, height: 100 }} />

              {/* Outer halo glow */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{
                  width: perk.major ? 96 : 72,
                  height: perk.major ? 96 : 72,
                  background: "radial-gradient(circle, rgba(232,230,227,0.18) 0%, rgba(232,230,227,0) 70%)",
                  opacity: showModal ? 1 : perk.major ? 0.75 : 0.4,
                }}
              />

              {/* Star body — disc that holds the icon */}
              <div
                className="relative flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: perk.major ? 44 : 32,
                  height: perk.major ? 44 : 32,
                  background: showModal
                    ? "radial-gradient(circle at 40% 35%, #f0ede8, #b8b5b0)"
                    : "radial-gradient(circle at 40% 35%, #d4d1cc, #6e6c69)",
                  boxShadow: showModal
                    ? "0 0 16px 4px rgba(232,230,227,0.5), inset 0 1px 2px rgba(255,255,255,0.35)"
                    : isPinned
                      ? "0 0 10px 3px rgba(232,230,227,0.28)"
                      : "inset 0 1px 1px rgba(255,255,255,0.18)",
                  transform: showModal ? "scale(1.35)" : "scale(1)",
                }}
              >
                {/* Icon — fades in smoothly */}
                <motion.div
                  animate={{ opacity: showModal ? 1 : perk.major ? 0.65 : 0.45, scale: showModal ? 1 : 0.9 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <Icon
                    icon={perk.icon}
                    width={perk.major ? 28 : 20}
                    height={perk.major ? 28 : 20}
                    className="text-[#0c0d0f]"
                  />
                </motion.div>
              </div>

              {/* Perk modal — shown on hover, pin, or zoom.
                Flips below the star when y < 32 % to avoid top-edge cropping. */}
              <AnimatePresence>
                {showModal && (() => {
                  const above = perk.y >= 32;
                  const initY = above ? 8 : -8;
                  const exitY = above ? 5 : -5;
                  return (
                    <motion.div
                      key="modal"
                      initial={{ opacity: 0, y: initY, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: exitY, scale: 0.92 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-none z-30 flex-col transition-all duration-300"
                      style={{
                        width: isZoomed ? 320 : 240,
                        ...(above
                          ? { bottom: "100%", marginBottom: 8 }
                          : { top: "100%", marginTop: 8 }),
                      }}
                    >
                      {/* Stem rendered BEFORE the box when modal is below the star,
                      so the line visually connects upward toward the star core. */}
                      {!above && <div className="w-px h-4 bg-[#2a2a2e] mx-auto" />}

                      <div className="border border-[#2e2e32] bg-[#0c0d0f]/97 p-5">
                        {/* Icon */}
                        <div className="flex items-center justify-center mb-4">
                          <div className={`${isZoomed ? "w-18 h-18" : "w-14 h-14"} border border-[#2e2e32] flex items-center justify-center bg-[#111214] transition-all duration-300`}>
                            <Icon icon={perk.icon} width={isZoomed ? 38 : 28} height={isZoomed ? 38 : 28} className="text-[#9a9aa8]" />
                          </div>
                        </div>
                        {/* Divider */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-px flex-1 bg-[#2a2a2e]" />
                          <div className="w-1.5 h-1.5 rotate-45 bg-[#3a3a40]" />
                          <div className="h-px flex-1 bg-[#2a2a2e]" />
                        </div>
                        <div className={`font-['Cinzel',serif] ${isZoomed ? "text-base" : "text-sm"} tracking-widest uppercase text-[#e8e6e3] text-center leading-snug transition-all duration-300`}>
                          {perk.name}
                        </div>
                        <div className={`font-['Inter',sans-serif] ${isZoomed ? "text-xs md:text-sm" : "text-xs"} tracking-wide text-[#5c5c66] mt-2 text-center transition-all duration-300`}>
                          {perk.desc}
                        </div>
                        {(isPinned || isZoomed) && (
                          <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="h-px w-6 bg-[#2a2a2e]" />
                            <span className="font-['Inter',sans-serif] text-[9px] tracking-[0.25em] uppercase text-[#3e3e48]">Attuned</span>
                            <div className="h-px w-6 bg-[#2a2a2e]" />
                          </div>
                        )}
                      </div>

                      {/* Stem rendered AFTER the box when modal is above the star. */}
                      {above && <div className="w-px h-4 bg-[#2a2a2e] mx-auto" />}
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SkillTrees() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<{ c: number; p: number } | null>(null);
  const [pinned, setPinned] = useState<{ c: number; p: number } | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parallax tilt via motion values so pointer movement never re-renders the
  // React tree (which would interrupt transitions and flicker hover state).
  const tiltX = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });

  const n = constellations.length;

  // Keep the zoom when moving between constellations: map the focused star
  // onto the equivalent index of the destination constellation.
  const carryFocus = (destIdx: number) => {
    if (focused === null) return null;
    const maxPerk = constellations[destIdx].perks.length - 1;
    return Math.min(focused, maxPerk);
  };

  const goTo = (idx: number) => {
    setActive(idx);
    setFocused(carryFocus(idx));
    setHover(null);
    setPinned(null);
  };

  // Signed shortest offset from the active card, so the ring wraps around.
  const relativeOffset = (i: number) => {
    let rel = i - active;
    if (rel > n / 2) rel -= n;
    if (rel < -n / 2) rel += n;
    return rel;
  };

  // Derive mild scene-tilt values for the constellation ring from the same
  // spring values that drive the starfield parallax.
  const ringRotateX = useTransform(tiltX, v => v * 0.35);
  const ringRotateY = useTransform(tiltY, v => v * 0.35);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = null;
    // Only treat as a drag if horizontal movement dominates and exceeds threshold
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      didDrag.current = true;
      goTo((active + (dx < 0 ? 1 : -1) + n) % n);
    }
  };

  // Pointer-driven parallax tilt for genuine depth.
  const handlePointerMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-py * 10);
    tiltY.set(px * 14);
  };

  const current = constellations[active];

  const activeStarIndex = (() => {
    if (focused !== null) return focused;
    if (pinned && pinned.c === active) return pinned.p;
    if (hover && hover.c === active) return hover.p;
    return null;
  })();
  const activePerk = activeStarIndex !== null ? current.perks[activeStarIndex] : null;

  return (
    <section
      id="skills"
      className="relative h-dvh border-b border-[#222] lg:snap-start overflow-hidden flex flex-col"
      style={{ background: "radial-gradient(circle at 50% 50%, #080614 0%, #030308 70%, #010103 100%)" }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes starFloat-0 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(4px, -4px); } }
        @keyframes starFloat-1 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(-4px, 3px); } }
        @keyframes starFloat-2 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(3px, 5px); } }
        @keyframes starFloat-3 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(-3px, -4px); } }
      `}} />
      {/* Ambient Cosmic Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-[70vw] h-[70vw] rounded-full bg-[#120e2e]/12 blur-[140px] mix-blend-screen" />
      </div>
      {/* Compact header — minimal vertical footprint */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="shrink-0 text-center pt-4 pb-1"
      >
        <h2 className="font-['Cinzel',serif] text-lg md:text-2xl text-[#e8e6e3] tracking-widest uppercase">
          Technical Expertise
        </h2>
      </motion.div>

      {/* Stage fills all remaining height, full viewport width */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => { tiltX.set(0); tiltY.set(0); }}
          onClick={() => {
            if (didDrag.current) { didDrag.current = false; return; }
            setFocused(null);
            setPinned(null);
          }}
          className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {/* Night sky — subtle parallax translate with active navigation offset */}
          <motion.div
            className="absolute inset-0 pointer-events-none scale-115"
            animate={{
              x: active * -40,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-full h-full"
              style={{ x: tiltY, y: tiltX }}
            >
              <Starfield count={160} seed={99} />
            </motion.div>
          </motion.div>

          {/* Constellation ring — gets the same tilt as the sky so constellations
              move with the pointer in 3-D perspective. Each constellation also has
              its own local transformPerspective for the individual rotateY effect. */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              transformPerspective: 1800,
              rotateX: ringRotateX,
              rotateY: ringRotateY,
            }}
          >
            {/* active first in DOM (lower z-stack) → sides on top for hit-testing */}
            {[active, ...Array.from({ length: n }, (_: unknown, k: number) => k).filter((k: number) => k !== active)].map((i: number) => {
              const rel = relativeOffset(i);
              const isActive = rel === 0;

              // Side trees stay large enough to always be visible.
              const sideScale = isMobile ? 0.55 : 0.72;
              // Negative gap pulls sides behind the active tree so all three are
              // simultaneously visible. -0.30 = sides overlap the active by 30 %
              // of active width, keeping them reachable on narrow viewports too.
              const gap = isMobile ? -0.45 : -0.30;
              const xPct = isActive ? 0 : rel * (0.5 / sideScale + gap / sideScale + 0.5) * 100;

              return (
                <motion.div
                  key={constellations[i].category}
                  className="absolute aspect-square pointer-events-none"
                  style={{
                    width: isMobile ? "min(85vh, 85vw)" : "min(90vh, 90vw, 58rem)",
                    top: "50%",
                    left: "50%",
                    marginLeft: isMobile ? "calc(-1 * min(42.5vh, 42.5vw))" : "calc(-1 * min(45vh, 45vw, 29rem))",
                    marginTop: isMobile ? "calc(-1 * min(42.5vh, 42.5vw))" : "calc(-1 * min(45vh, 45vw, 29rem))",
                    transformPerspective: 1400,
                    zIndex: 1,
                  }}
                  animate={{
                    x: `${xPct}%`,
                    rotateY: rel * -36,
                    scale: isActive ? 1 : sideScale,
                    opacity: Math.abs(rel) > 1 ? 0 : isActive ? 1 : 0.42,
                  }}
                  transition={{
                    x: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    rotateY: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    opacity: {
                      duration: Math.abs(rel) > 1 ? 0.15 : 0.3,
                      delay: Math.abs(rel) > 1 ? 0 : 0.25,
                    }
                  }}
                >
                  <div className="w-full h-full pointer-events-none">
                    {/* Background nav overlay — catches clicks on empty space of non-active constellations */}
                    {!isActive && (
                      <div
                        className="absolute pointer-events-auto cursor-pointer"
                        style={{
                          width: "60%",
                          height: "60%",
                          left: "20%",
                          top: "20%",
                        }}
                        onClick={(e) => { e.stopPropagation(); goTo(i); }}
                      />
                    )}
                    <ConstellationFigure
                      constellation={constellations[i]}
                      hovered={(hover && hover.c === i) ? hover.p : null}
                      setHovered={(p) => setHover(p === null ? null : { c: i, p })}
                      pinned={(pinned && pinned.c === i) ? pinned.p : null}
                      setPinned={(p) => setPinned(p === null ? null : { c: i, p })}
                      focused={isActive ? focused : null}
                      onStarClick={
                        isActive
                          ? (idx) => setFocused((f) => (f === idx ? null : idx))
                          : (idx) => { setActive(i); setFocused(idx); setHover(null); setPinned(null); }
                      }
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Mobile details drawer */}
      <AnimatePresence>
        {activePerk && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden absolute bottom-20 left-4 right-4 z-40 border border-[#2e2e32] bg-[#0c0d0f]/97 p-5 text-center shadow-lg"
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFocused(null);
                setPinned(null);
                setHover(null);
              }}
              className="absolute top-2.5 right-2.5 text-[#6e6e78] hover:text-[#e8e6e3] p-1 cursor-pointer"
              aria-label="Close details"
            >
              <Icon icon="lucide:x" width={16} height={16} />
            </button>

            {/* Content */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 border border-[#2e2e32] flex items-center justify-center bg-[#111214] shrink-0">
                <Icon icon={activePerk.icon} width={24} height={24} className="text-[#9a9aa8]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-['Cinzel',serif] text-sm tracking-widest uppercase text-[#e8e6e3] truncate">
                  {activePerk.name}
                </h4>
                <p className="font-['Inter',sans-serif] text-[11px] tracking-wide text-[#8a8a93] mt-1 leading-relaxed">
                  {activePerk.desc}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active constellation label — overlaid at the bottom of the sky */}
      <div className="shrink-0 text-center pb-4 flex items-center justify-center gap-6 z-10 relative">
        <button
          onClick={(e) => { e.stopPropagation(); goTo((active - 1 + n) % n); }}
          className="p-2 text-[#5a5a62] hover:text-[#e8e6e3] active:text-[#e8e6e3] transition-colors cursor-pointer"
          aria-label="Previous Constellation"
        >
          <Icon icon="lucide:chevron-left" width={18} height={18} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-baseline justify-center gap-3 select-none"
          >
            <h3 className="font-['Cinzel',serif] text-base md:text-xl tracking-[0.2em] uppercase text-[#e8e6e3]">
              {current.category}
            </h3>
            <p className="font-['Inter',sans-serif] text-[10px] tracking-[0.3em] uppercase text-[#6a6a6a] hidden sm:inline">
              {current.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={(e) => { e.stopPropagation(); goTo((active + 1) % n); }}
          className="p-2 text-[#5a5a62] hover:text-[#e8e6e3] active:text-[#e8e6e3] transition-colors cursor-pointer"
          aria-label="Next Constellation"
        >
          <Icon icon="lucide:chevron-right" width={18} height={18} />
        </button>
      </div>
    </section>
  );
}
