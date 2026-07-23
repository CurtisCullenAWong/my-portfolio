import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy, Check, Eye, Download, ExternalLink, X, FileText,
  Mail, Phone, MapPin, ArrowUpRight, Github, Linkedin
} from "lucide-react";
import { DEEDS, TOMES, FREELANCE_SERVICES } from "../../data/portfolioData";

type Tab = "overview" | "directory" | "documents" | "services";

export function Footer() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<{ title: string; url: string } | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(key);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const copyFreelanceCard = () => {
    const cardData = `Curtis Cullen A. Wong - General Development Services
Role: Full-Stack Developer & Project Manager
Location: Parañaque City, PH
Contact: (+63) 999-488-5479 | curtiscullenagustinwong@gmail.com
GitHub: https://github.com/CurtisCullenAWong

Services Offered:
1. Full-Stack Web Apps (Next.js, React, TypeScript, Tailwind, Supabase, Laravel)
2. Cross-Platform Mobile Apps (React Native, Expo, Flutter, SQLite)
3. Desktop Utilities & Systems (Tauri, Rust, React, Node.js)
4. AI Systems & APIs (Ollama LLM, Voice TTS, Python, MongoDB, Docker)`;

    handleCopy(cardData, "freelance-card");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "directory", label: "Profiles & Links" },
    { id: "documents", label: "Resume & Documents" },
    { id: "services", label: "Freelance Services" },
  ];

  return (
    <footer
      id="contact"
      className="relative min-h-dvh lg:h-dvh w-full flex flex-col justify-between lg:snap-start lg:snap-always shrink-0 select-none overflow-hidden bg-[#0a0a0c] border-t border-[#1a1a22]"
    >
      {/* Soft Ambient Radial Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1a1a2e]/20 blur-[140px] rounded-full" />
      </div>

      {/* FULL WIDTH TOP BAR / SECTION HEADER */}
      <div className="px-6 md:px-12 xl:px-16 pt-6 sm:pt-8 md:pt-10 pb-4 border-b border-[#16161e] flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2.5 h-2.5 bg-[#e8e6e3] rotate-45" />
            <span className="font-['Inter',sans-serif] text-xs uppercase tracking-[0.3em] text-[#71717a]">
              Connect & Details
            </span>
          </div>
          <h2 className="font-['Cinzel',serif] text-2xl sm:text-3xl md:text-4xl text-[#e8e6e3] tracking-wide font-normal">
            Contact & Profiles
          </h2>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex items-center gap-1.5 bg-[#101016] border border-[#22222e] p-1 rounded-md overflow-x-auto scrollbar-hide shrink-0">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded text-xs font-['Inter',sans-serif] tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-[#22222e] text-[#e8e6e3] font-medium shadow-sm"
                    : "text-[#8a8a93] hover:text-[#e8e6e3] hover:bg-[#161620]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN BODY — FULL SCREEN FLEX-1 GRID */}
      <div className="px-6 md:px-12 xl:px-16 py-6 md:py-8 flex-1 min-h-0 relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8 xl:gap-12 items-stretch overflow-y-auto lg:overflow-hidden">

        {/* LEFT COLUMN — PROFILE & DIRECT CONTACT DETAILS */}
        <div className="flex flex-col justify-between gap-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-4">
            <div>
              <p className="font-['Inter',sans-serif] text-xs text-[#8a8a93] uppercase tracking-[0.25em]">
                Full-Stack Developer & Project Manager
              </p>
              <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#e8e6e3] font-medium tracking-wide mt-1">
                Curtis Cullen A. Wong
              </h3>
            </div>

            <p className="font-['Inter',sans-serif] text-sm md:text-base text-[#9a9aa5] leading-relaxed font-light">
              Magna Cum Laude IT graduate specializing in full-stack web applications, cross-platform mobile development, and agentic AI systems. Committed to delivering production-ready, clean, scalable software solutions.
            </p>

            {/* Direct Contact Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 border border-[#1e1e28] bg-[#0e0e14] rounded-md space-y-2 group hover:border-[#3a3a4c] transition-all">
                <div className="flex items-center justify-between text-[#8a8a93]">
                  <span className="font-['Inter',sans-serif] text-[11px] uppercase tracking-wider">Email Address</span>
                  <Mail size={14} className="group-hover:text-[#e8e6e3] transition-colors" />
                </div>
                <a
                  href="mailto:curtiscullenagustinwong@gmail.com"
                  className="font-['Inter',sans-serif] text-xs sm:text-sm font-medium text-[#e8e6e3] block truncate hover:underline"
                >
                  curtiscullenagustinwong@gmail.com
                </a>
                <button
                  onClick={() => handleCopy("curtiscullenagustinwong@gmail.com", "left-email")}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#71717a] hover:text-[#e8e6e3] transition-colors cursor-pointer"
                >
                  {copiedItem === "left-email" ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                  <span>{copiedItem === "left-email" ? "Copied to clipboard" : "Copy email"}</span>
                </button>
              </div>

              <div className="p-3.5 border border-[#1e1e28] bg-[#0e0e14] rounded-md space-y-2 group hover:border-[#3a3a4c] transition-all">
                <div className="flex items-center justify-between text-[#8a8a93]">
                  <span className="font-['Inter',sans-serif] text-[11px] uppercase tracking-wider">Phone / Mobile</span>
                  <Phone size={14} className="group-hover:text-[#e8e6e3] transition-colors" />
                </div>
                <a
                  href="tel:+639994885479"
                  className="font-['Inter',sans-serif] text-xs sm:text-sm font-medium text-[#e8e6e3] block hover:underline"
                >
                  (+63) 999-488-5479
                </a>
                <button
                  onClick={() => handleCopy("+639994885479", "left-phone")}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#71717a] hover:text-[#e8e6e3] transition-colors cursor-pointer"
                >
                  {copiedItem === "left-phone" ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                  <span>{copiedItem === "left-phone" ? "Copied to clipboard" : "Copy phone number"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Location & Status Card */}
          <div className="p-4 border border-[#1a1a24] bg-[#0d0d12] rounded-md space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8a8a93]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#a1a1aa]" />
                <span className="font-['Inter',sans-serif] tracking-wider uppercase">Parañaque City, PH</span>
              </div>
              <span className="text-[#10b981] font-medium tracking-wider uppercase text-[10px]">Open to Opportunities</span>
            </div>
            <p className="font-['Inter',sans-serif] text-xs text-[#71717a] leading-relaxed">
              Available for full-time roles, freelance projects, or contract work. Responds to inquiries within 24 hours. Open to remote, hybrid, or on-site arrangements.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN — INTERACTIVE DISPLAY VIEW */}
        <div className="flex flex-col justify-between overflow-y-auto scrollbar-hide pr-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center space-y-4"
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="font-['Cinzel',serif] text-lg text-[#e8e6e3] tracking-wide font-medium border-b border-[#1c1c26] pb-2">
                    Professional Summary & Overview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Primary Role", value: "Full-Stack Developer & Project Manager" },
                      { label: "Location Base", value: "Parañaque City, Philippines" },
                      { label: "Specializations", value: "Next.js, React Native, Supabase, AI Workflows" },
                      { label: "Education & Distinction", value: "BS IT · Magna Cum Laude · Dean's Lister" },
                      { label: "Availability", value: "Full-Time, Freelance, Contract" },
                      { label: "Response Window", value: "Within 24 Hours" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 border border-[#1a1a24] bg-[#0c0c12] rounded space-y-1">
                        <span className="font-['Inter',sans-serif] text-[10px] uppercase tracking-wider text-[#71717a] block">
                          {item.label}
                        </span>
                        <span className="font-['Inter',sans-serif] text-xs sm:text-sm font-medium text-[#e8e6e3] block">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border border-[#1e1e2a] bg-[#0f0f16] rounded-md space-y-2">
                    <h4 className="font-['Cinzel',serif] text-xs text-[#a1a1aa] uppercase tracking-wider font-semibold">
                      Work Ethic & Soft Skills
                    </h4>
                    <p className="font-['Inter',sans-serif] text-xs md:text-sm text-[#9a9aa5] leading-relaxed">
                      Adaptable, hardworking, and solution-driven with a positive mindset and strong coachability. Experienced in managing technical roadmaps from initial user design through architecture, database design, and cloud deployment.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILES & LINKS */}
              {activeTab === "directory" && (
                <div className="space-y-3">
                  <h3 className="font-['Cinzel',serif] text-lg text-[#e8e6e3] tracking-wide font-medium border-b border-[#1c1c26] pb-2">
                    Professional Directory & Links
                  </h3>
                  <div className="space-y-2.5">
                    {DEEDS.map((deed, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-4 p-3.5 border border-[#1a1a24] bg-[#0d0d14] hover:bg-[#12121c] hover:border-[#2e2e40] transition-all rounded-md group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 border border-[#222230] bg-[#12121a] flex items-center justify-center rounded shrink-0 group-hover:border-[#4e4e60] transition-colors">
                            {deed.icon}
                          </div>
                          <div className="min-w-0">
                            <a
                              href={deed.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-['Inter',sans-serif] text-sm font-medium text-[#e8e6e3] group-hover:text-white truncate block hover:underline"
                            >
                              {deed.name}
                            </a>
                            <p className="font-['Inter',sans-serif] text-xs text-[#8a8a93] truncate mt-0.5">
                              {deed.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {deed.copyValue && (
                            <button
                              onClick={() => handleCopy(deed.copyValue!, `deed-${i}`)}
                              className="p-2 border border-[#222230] bg-[#12121a] text-[#71717a] hover:text-[#e8e6e3] hover:border-[#3a3a4c] rounded transition-all cursor-pointer"
                              title="Copy to clipboard"
                            >
                              {copiedItem === `deed-${i}` ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
                            </button>
                          )}
                          <a
                            href={deed.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-[#222230] bg-[#12121a] text-[#71717a] hover:text-[#e8e6e3] hover:border-[#3a3a4c] rounded transition-all cursor-pointer"
                            title="Visit link"
                          >
                            <ArrowUpRight size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: RESUME & DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="space-y-3">
                  <h3 className="font-['Cinzel',serif] text-lg text-[#e8e6e3] tracking-wide font-medium border-b border-[#1c1c26] pb-2">
                    Resume & Resource Documents
                  </h3>
                  <div className="space-y-3">
                    {TOMES.map((tome, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[#1a1a24] bg-[#0d0d14] hover:bg-[#12121c] hover:border-[#2e2e40] transition-all rounded-md"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="w-9 h-9 border border-[#222230] bg-[#12121a] flex items-center justify-center rounded shrink-0">
                            {tome.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-['Cinzel',serif] text-sm font-semibold text-[#e8e6e3] truncate">
                              {tome.name}
                            </h4>
                            <span className="font-['Inter',sans-serif] text-[10px] text-[#71717a] uppercase tracking-wider block mt-0.5">
                              {tome.type}
                            </span>
                            <p className="font-['Inter',sans-serif] text-xs text-[#8a8a93] leading-relaxed mt-1 font-light">
                              {tome.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {(tome as any).pdfUrl ? (
                            <>
                              <button
                                onClick={() => setPreviewPdf({ title: tome.name, url: (tome as any).pdfUrl })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#2e2e3e] bg-[#14141e] text-xs text-[#e8e6e3] hover:bg-[#1e1e2c] hover:border-[#4e4e60] transition-all rounded cursor-pointer font-['Inter',sans-serif]"
                              >
                                <Eye size={13} />
                                Preview
                              </button>
                              <a
                                href={(tome as any).pdfUrl}
                                download
                                className="p-1.5 border border-[#222230] bg-[#12121a] text-[#71717a] hover:text-[#e8e6e3] hover:border-[#3a3a4c] rounded transition-all cursor-pointer"
                                title="Download Document"
                              >
                                <Download size={14} />
                              </a>
                            </>
                          ) : (
                            <a
                              href={tome.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#2e2e3e] bg-[#14141e] text-xs text-[#e8e6e3] hover:bg-[#1e1e2c] hover:border-[#4e4e60] transition-all rounded cursor-pointer font-['Inter',sans-serif]"
                            >
                              View GitHub <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: FREELANCE SERVICES */}
              {activeTab === "services" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1c1c26] pb-2">
                    <h3 className="font-['Cinzel',serif] text-lg text-[#e8e6e3] tracking-wide font-medium">
                      General Development Services
                    </h3>
                    <button
                      onClick={copyFreelanceCard}
                      className="inline-flex items-center gap-1.5 text-xs font-['Inter',sans-serif] px-3 py-1 border border-[#2e2e3e] bg-[#14141e] text-[#e8e6e3] hover:bg-[#1e1e2c] transition-all rounded cursor-pointer"
                    >
                      {copiedItem === "freelance-card" ? (
                        <>
                          <Check size={12} className="text-[#10b981]" />
                          <span>Card Info Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Service Summary</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FREELANCE_SERVICES.services.map((srv, i) => (
                      <div
                        key={i}
                        className="p-3.5 border border-[#1a1a24] bg-[#0d0d14] hover:bg-[#12121c] hover:border-[#2e2e40] transition-all rounded-md space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 border border-[#222230] bg-[#12121a] flex items-center justify-center rounded shrink-0">
                              {srv.icon}
                            </div>
                            <h4 className="font-['Cinzel',serif] text-sm font-semibold text-[#e8e6e3]">
                              {srv.title}
                            </h4>
                          </div>
                          <p className="font-['Inter',sans-serif] text-xs text-[#8a8a93] leading-relaxed font-light">
                            {srv.desc}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-2 border-t border-[#161622]">
                          {srv.stack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-['Inter',sans-serif] text-[10px] text-[#71717a] bg-[#121218] px-2 py-0.5 rounded border border-[#1c1c28]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* FULL WIDTH BOTTOM BAR / FOOTER LINKS & COPYRIGHT */}
      <div className="px-6 md:px-12 xl:px-16 py-4 border-t border-[#16161e] bg-[#08080a] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative z-10 text-xs font-['Inter',sans-serif] text-[#71717a]">
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/CurtisCullenAWong"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#e8e6e3] transition-colors"
          >
            <Github size={13} />
            <span>GitHub</span>
          </a>
          <span className="text-[#22222e]">•</span>
          <a
            href="https://www.linkedin.com/in/curtis-cullen-wong-3a9434367"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#e8e6e3] transition-colors"
          >
            <Linkedin size={13} />
            <span>LinkedIn</span>
          </a>
          <span className="text-[#22222e]">•</span>
          <a
            href="mailto:curtiscullenagustinwong@gmail.com"
            className="flex items-center gap-1.5 hover:text-[#e8e6e3] transition-colors"
          >
            <Mail size={13} />
            <span>Email</span>
          </a>
        </div>

        <div className="text-center sm:text-right text-[#525260] tracking-wider uppercase text-[10px]">
          <span>&copy; {new Date().getFullYear()} Curtis C. A. Wong. All rights reserved.</span>
        </div>
      </div>

      {/* PDF Inline Preview Modal */}
      <AnimatePresence>
        {previewPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#0a0a0c]/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-[#0c0c0f] border border-[#252532] rounded-md shadow-2xl overflow-hidden"
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#121216] border-b border-[#1e1e26] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} className="text-[#8a8a93] shrink-0" />
                  <h3 className="font-['Cinzel',serif] text-sm md:text-base text-[#e8e6e3] tracking-wide truncate">
                    {previewPdf.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <a
                    href={previewPdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-['Inter',sans-serif] text-[11px] text-[#8a8a93] hover:text-[#e8e6e3] uppercase tracking-wider px-2.5 py-1 border border-[#252530] rounded-sm hover:border-[#3a3a48] transition-colors"
                  >
                    <ExternalLink size={12} />
                    <span className="hidden sm:inline">Open New Tab</span>
                  </a>
                  <a
                    href={previewPdf.url}
                    download
                    className="flex items-center gap-1.5 font-['Inter',sans-serif] text-[11px] text-[#8a8a93] hover:text-[#e8e6e3] uppercase tracking-wider px-2.5 py-1 border border-[#252530] rounded-sm hover:border-[#3a3a48] transition-colors"
                  >
                    <Download size={12} />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button
                    onClick={() => setPreviewPdf(null)}
                    className="p-1 text-[#71717a] hover:text-white transition-colors cursor-pointer ml-1"
                    title="Close Preview"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal PDF Viewport Body */}
              <div className="flex-1 w-full h-full bg-[#0a0a0c] relative">
                <iframe
                  src={previewPdf.url}
                  title={previewPdf.title}
                  className="w-full h-full border-0 bg-[#0a0a0c]"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
