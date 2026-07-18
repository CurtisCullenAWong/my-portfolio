import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Diamond } from "lucide-react";

const projects = [
  {
    title: "Vista AIMS",
    subtitle: "Asset & Inventory Management System",
    description: "Developed a cross-platform app for real-time inventory management of assets and consumables, built during the Boss Cargo Express internship.",
    tags: ["React Native", "Expo", "Supabase"],
    status: "Shipped",
    url: "#",
    preview: "https://images.unsplash.com/photo-1597407068889-782ba11fb621?w=1200&h=800&fit=crop&auto=format",
  },
  {
    title: "Rate Matrix",
    subtitle: "Logistics Pricing Platform",
    description: "Developed an audit-ready logistics platform for managing complex shipping rates and client metrics, enabling structured rate management across carriers.",
    tags: ["React.js", "Laravel"],
    status: "Shipped",
    url: "#",
    preview: "https://images.unsplash.com/photo-1780764818910-80526d8aeb6d?w=1200&h=800&fit=crop&auto=format",
  },
  {
    title: "BCE Corporate Website",
    subtitle: "Full-Stack Web App & ATS",
    description: "Engineered a real-time corporate web app and ATS featuring interactive map components, traffic analytics, and a trained AI chatbot with LLM/cloud fallback and custom TTS voice integration.",
    tags: ["Next.js", "Supabase", "Ollama", "Kokoro TTS"],
    status: "Shipped",
    url: "#",
    preview: "https://images.unsplash.com/photo-1475139441338-693e7dbe20b6?w=1200&h=800&fit=crop&auto=format",
  },
  {
    title: "EasyTrack",
    subtitle: "Real-Time Delivery & Booking App",
    description: "Led development of a mobile and web application for real-time messaging, delivery tracking, luggage booking, and AI analytics — built for EGC-GHE and AirAsia as a thesis project.",
    tags: ["React Native", "Flutter", "Supabase", "Google Cloud"],
    status: "Shipped",
    url: "#",
    preview: "https://images.unsplash.com/photo-1429305336325-b84ace7eba3b?w=1200&h=800&fit=crop&auto=format",
  },
  {
    title: "Still Cafè POS",
    subtitle: "Point-of-Sale & Inventory App",
    description: "Built a reliable and practical point-of-sale and inventory management application designed specifically for boutique coffee shops and small cafes.",
    tags: ["React Native", "Expo", "SQLite"],
    status: "Shipped",
    url: "#",
    preview: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop&auto=format",
  },
  {
    title: "Detailed Spotify Playlists",
    subtitle: "Power-User Music Library Manager",
    description: "A personal, power-user workspace to organize, sort, group, and clean up your Spotify music library. Analyzes song metadata and audio features to help users restructure their library.",
    tags: ["React", "Spotify Web API"],
    status: "In Progress",
    url: "#",
    preview: "https://images.unsplash.com/photo-1655058402270-de7dd5838ed5?w=1200&h=800&fit=crop&auto=format",
  },
  {
    title: "GeoDetect",
    subtitle: "AI Geographical Analysis App",
    description: "Developed a cross-platform mobile application providing in-depth, structured AI analysis of a user's current geographical coordinates.",
    tags: ["Flutter", "Google Maps API"],
    status: "Shipped",
    url: "#",
    preview: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=800&fit=crop&auto=format",
  },
];

export function ProjectLogs() {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeProject = hovered !== null ? projects[hovered] : null;

  return (
    <section
      id="projects"
      className="relative min-h-dvh lg:h-dvh flex flex-col lg:overflow-hidden border-b border-[#1a1a1e] lg:snap-start"
    >
      {/* Section header */}
      <div className="shrink-0 flex items-center gap-5 px-6 md:px-12 pt-8 pb-5">
        <div className="w-3.5 h-3.5 border border-[#3a3a44] rotate-45 flex items-center justify-center shrink-0">
          <div className="w-1 h-1 bg-[#3a3a44] rotate-45" />
        </div>
        <h2 className="font-['Cinzel',serif] text-xl md:text-2xl text-[#e8e6e3] tracking-[0.2em] uppercase">
          Project Logs
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#222228] to-transparent" />
        <span className="font-['Inter',sans-serif] text-[9px] tracking-[0.3em] text-[#5a5a62] uppercase">
          {projects.length} entries
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] lg:overflow-hidden">

        {/* Left — Project list */}
        <div className="overflow-y-visible lg:overflow-y-auto scrollbar-hide border-r border-[#161618] flex flex-col">
          {projects.map((project, idx) => {
            const isHovered = hovered === idx;
            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                className="relative group cursor-pointer border-b border-[#111114] px-6 md:px-10 py-6 transition-colors duration-200"
                style={{ background: isHovered ? "rgba(26,26,30,0.8)" : "transparent" }}
              >
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#3a3a48]"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ originY: 0 }}
                />

                <div className="flex items-start gap-4">
                  <div className="pt-[5px] shrink-0">
                    <Diamond
                      size={10}
                      className="fill-current transition-colors duration-200"
                      style={{ color: isHovered ? "#6a6a72" : "#282830" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-['Cinzel',serif] text-base md:text-lg text-[#d8d6d3] tracking-wide leading-tight">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <span
                          className="font-['Inter',sans-serif] text-[8px] tracking-[0.2em] uppercase"
                          style={{ color: project.status === "In Progress" ? "#a1a1aa" : "#5a5a62" }}
                        >
                          {project.status}
                        </span>
                        <motion.div
                          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ArrowUpRight size={12} className="text-[#4a4a54]" />
                        </motion.div>
                      </div>
                    </div>
                    <p className="font-['Inter',sans-serif] text-[10px] md:text-xs text-[#6a6a72] tracking-wider mb-3">
                      {project.subtitle}
                    </p>
                    <p
                      className="font-['Inter',sans-serif] text-xs md:text-sm text-[#9ca3af] leading-relaxed overflow-hidden transition-all duration-300"
                      style={{ maxHeight: isHovered ? "5rem" : "0", opacity: isHovered ? 1 : 0 }}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                      {project.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="font-['Inter',sans-serif] text-[9px] tracking-[0.18em] uppercase text-[#6a6a72] transition-colors duration-200"
                          style={{ color: isHovered ? "#9ca3af" : undefined }}>
                          {tIdx > 0 && <span className="mr-3 text-[#3a3a40]">·</span>}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right — Preview panel */}
        <div className="hidden lg:flex items-center justify-center relative overflow-hidden bg-[#080809]">
          <AnimatePresence mode="wait">
            {activeProject ? (
              <motion.div
                key={activeProject.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {/* Blurred background image */}
                <img
                  src={activeProject.preview}
                  alt={`${activeProject.title} preview`}
                  className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale-[0.5]"
                  style={{ filter: "blur(8px) grayscale(0.5)", transform: "scale(1.05)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080809]/90 via-[#080809]/50 to-[#080809]/70" />

                {/* Browser mockup frame */}
                <div className="absolute inset-8 flex flex-col">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0e0e10]/90 border border-[#1e1e24] border-b-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                    </div>
                    <div className="flex-1 h-5 bg-[#131316] border border-[#1a1a20] mx-3 flex items-center px-3">
                      <span className="font-['Inter',sans-serif] text-[9px] text-[#2a2a32] tracking-wider truncate">
                        ccawong.dev/{activeProject.title.toLowerCase().replace(/\s/g, "-")}
                      </span>
                    </div>
                    <a
                      href={activeProject.url}
                      className="flex items-center gap-1.5 font-['Inter',sans-serif] text-[9px] tracking-[0.2em] uppercase text-[#3a3a46] hover:text-[#8a8a92] transition-colors duration-200 whitespace-nowrap"
                    >
                      Visit <ArrowUpRight size={9} />
                    </a>
                  </div>

                  {/* Viewport */}
                  <div className="flex-1 border border-[#1e1e24] relative overflow-hidden bg-[#0a0a0c]/60">
                    <img
                      src={activeProject.preview}
                      alt={`${activeProject.title} website preview`}
                      className="w-full h-full object-cover opacity-40 grayscale-[0.3]"
                      style={{ filter: "grayscale(0.3) brightness(0.55)" }}
                    />
                    {/* Info overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0a0a0c] to-transparent">
                      <p className="font-['Cinzel',serif] text-[9px] tracking-[0.35em] text-[#2e2e38] uppercase mb-1">
                        {activeProject.subtitle}
                      </p>
                      <h3 className="font-['Cinzel',serif] text-xl text-[#c8c6c3] tracking-wide mb-2">
                        {activeProject.title}
                      </h3>
                      <div className="flex gap-3">
                        {activeProject.tags.map((tag) => (
                          <span key={tag} className="font-['Inter',sans-serif] text-[8px] tracking-[0.2em] uppercase text-[#2a2a34] border border-[#1c1c22] px-2 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center gap-4 text-center px-12"
              >
                {/* Placeholder rune */}
                <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-10" aria-hidden>
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#e8e6e3" strokeWidth="0.6" />
                  <circle cx="40" cy="40" r="22" fill="none" stroke="#e8e6e3" strokeWidth="0.4" />
                  {[0, 90, 180, 270].map(d => {
                    const a = d * Math.PI / 180;
                    return <line key={d} x1="40" y1="40" x2={40 + Math.cos(a) * 36} y2={40 + Math.sin(a) * 36} stroke="#e8e6e3" strokeWidth="0.3" />;
                  })}
                  <circle cx="40" cy="40" r="4" fill="none" stroke="#e8e6e3" strokeWidth="0.4" />
                </svg>
                <p className="font-['Cinzel',serif] text-[10px] tracking-[0.4em] text-[#1e1e24] uppercase">
                  Hover a project
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export { ProjectLogs as QuestLog };
