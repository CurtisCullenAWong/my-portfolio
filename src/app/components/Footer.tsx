import { useState } from "react";
import { motion } from "motion/react";

export function Footer() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulate network request
    setTimeout(() => {
      setFormStatus("sent");
    }, 1500);
  };

  return (
    <footer id="contact" className="relative min-h-dvh lg:h-dvh py-16 md:py-20 px-6 md:px-12 max-w-2xl mx-auto flex flex-col items-center justify-center lg:snap-start lg:overflow-hidden">
      {/* Night sky background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1429305336325-b84ace7eba3b?w=2000&h=1400&fit=crop&auto=format"
          alt="Night sky"
          className="w-full h-full object-cover opacity-15 grayscale-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]" />
      </div>
      
      <div className="relative z-10 w-full text-center mb-8 md:mb-12 shrink-0">
        <h2 className="font-['Cinzel',serif] text-xl md:text-2xl text-[#e8e6e3] tracking-widest uppercase mb-2">
          Send Courier
        </h2>
        <div className="h-[1px] w-12 bg-[#444] mx-auto mb-4"></div>
        <p className="font-['Inter',sans-serif] text-[#8b8b8b] text-[10px] md:text-xs tracking-wide uppercase">
          Awaiting your correspondence.
        </p>
      </div>

      {/* Minimalist Skyrim Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full relative bg-[#0d0e10]/90 border border-[#252530] p-6 md:p-8 shrink-0 overflow-y-auto max-h-[60vh] scrollbar-hide"
      >
        <form className="relative flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-['Cinzel',serif] text-[10px] text-[#8b8b8b] uppercase tracking-widest">
              Name
            </label>
            <input 
              type="text" 
              id="name" 
              required
              disabled={formStatus !== "idle"}
              className="bg-transparent border-b border-[#333] px-2 py-1 text-[#e8e6e3] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#e8e6e3] transition-colors disabled:opacity-50"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-['Cinzel',serif] text-[10px] text-[#8b8b8b] uppercase tracking-widest">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              required
              disabled={formStatus !== "idle"}
              className="bg-transparent border-b border-[#333] px-2 py-1 text-[#e8e6e3] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#e8e6e3] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="font-['Cinzel',serif] text-[10px] text-[#8b8b8b] uppercase tracking-widest">
              Message
            </label>
            <textarea 
              id="message" 
              rows={3}
              required
              disabled={formStatus !== "idle"}
              className="bg-transparent border-b border-[#333] px-2 py-1 text-[#e8e6e3] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#e8e6e3] transition-colors resize-none disabled:opacity-50"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={formStatus !== "idle"}
            className="mt-2 font-['Inter',sans-serif] text-[10px] tracking-[0.2em] uppercase py-2.5 px-6 border border-[#444] text-[#e8e6e3] hover:bg-[#e8e6e3] hover:text-[#0a0a0c] transition-colors self-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formStatus === "idle" && "Dispatch"}
            {formStatus === "sending" && "Dispatching..."}
            {formStatus === "sent" && "Delivered"}
          </button>
        </form>
      </motion.div>

      <div className="flex items-center gap-6 mt-12 md:mt-16 font-['Cinzel',serif] text-xs tracking-widest uppercase text-[#8a8a93] shrink-0 relative z-10">
        <a href="#" className="hover:text-[#e8e6e3] transition-colors duration-200">
          GitHub
        </a>
        <span className="text-[#3a3a40]">•</span>
        <a href="#" className="hover:text-[#e8e6e3] transition-colors duration-200">
          Email
        </a>
      </div>

      <div className="mt-4 text-center text-[#5a5a62] font-['Inter',sans-serif] text-[10px] uppercase tracking-widest shrink-0 relative z-10">
        <p>&copy; {new Date().getFullYear()} Curtis C. A. Wong</p>
      </div>
    </footer>
  );
}
