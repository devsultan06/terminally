"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4" : "py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`glass px-6 rounded-2xl border border-zinc-800/50 flex justify-between items-center h-16 transition-all duration-300 ${
            isScrolled ? "bg-black/60 shadow-2xl" : "bg-zinc-900/20 shadow-none"
          }`}
        >
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 relative flex items-center justify-center overflow-hidden rounded-lg group-hover:scale-110 transition-transform">
                <img
                  src="/logo.png"
                  alt="Terminally"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                Terminally
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em]">
              <button
                onClick={() => scrollToSection("features")}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Workflow
              </button>
              <button
                onClick={() => scrollToSection("safety")}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Safety
              </button>
              <Link
                href="/docs"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Docs
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href="https://github.com/devsultan06/terminally"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
              </svg>
              Star Site
            </a>
            <button
              onClick={() => scrollToSection("install")}
              className="px-6 py-2 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-all text-xs uppercase tracking-tight"
            >
              Install CLI
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2"
            >
              <div className="space-y-1.5">
                <div
                  className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`}
                />
                <div
                  className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "w-4 ml-auto"}`}
                />
                <div
                  className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden glass absolute top-full left-0 right-0 mt-2 mx-6 p-8 flex flex-col gap-6 border border-zinc-800 shadow-3xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-9xl select-none -z-10">
              MENU
            </div>
            <button
              onClick={() => scrollToSection("features")}
              className="text-zinc-400 hover:text-white text-left font-black uppercase tracking-widest"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-zinc-400 hover:text-white text-left font-black uppercase tracking-widest"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection("safety")}
              className="text-zinc-400 hover:text-white text-left font-black uppercase tracking-widest"
            >
              Safety
            </button>
            <Link
              href="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-zinc-400 hover:text-white text-left font-black uppercase tracking-widest"
            >
              Docs
            </Link>
            <hr className="border-zinc-800" />
            <button
              onClick={() => scrollToSection("install")}
              className="w-full py-4 bg-orange-500 text-black font-black rounded-xl uppercase tracking-widest"
            >
              Install CLI
            </button>
            <a
              href="https://github.com/devsultan06/terminally"
              className="text-zinc-500 text-center text-xs font-bold uppercase tracking-widest pt-2 italic"
            >
              Star on GitHub
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
