"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

const TerminalMockup = () => {
  const [text, setText] = useState("");
  const fullText = "create a new react app with vite";
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowAI(true), 500);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-window bg-[#0a0a0a] border border-zinc-800 w-full max-w-2xl mx-auto mt-12 overflow-hidden shadow-2xl">
      <div className="terminal-header border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="dot dot-red" />
          <div className="dot dot-yellow" />
          <div className="dot dot-green" />
        </div>
        <div className="text-zinc-500 text-[10px] md:text-xs">
          terminally — bash — 80x24
        </div>
        <div className="w-12" />
      </div>
      <div className="p-6 min-h-[320px] text-sm md:text-base text-left font-mono">
        <div className="flex items-start gap-2 mb-4">
          <span className="text-orange-500 font-bold">🤖</span>
          <span className="text-white">What do you want to do?</span>
        </div>
        <div className="flex items-center gap-2 mb-6 text-zinc-300">
          <span className="text-orange-500 font-bold">{">"}</span>
          <span>{text}</span>
          {!showAI && <span className="cursor" />}
        </div>

        {showAI && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
              <div className="text-zinc-500 mb-2 text-xs uppercase tracking-wider font-sans">
                Suggested Command
              </div>
              <div className="text-green-400">
                npm create vite@latest my-app
                <br />
                cd my-app
                <br />
                npm install
                <br />
                npm run dev
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors font-sans uppercase tracking-tight">
                Explain this command? (y/n)
              </button>
              <button className="text-xs px-3 py-1.5 bg-orange-500 text-black font-bold rounded-md hover:bg-orange-400 transition-colors font-sans uppercase tracking-tight">
                Run this? (y/n)
              </button>
            </div>

            <div className="text-[10px] text-zinc-600 italic font-sans">
              * Risk Analysis: Low. File system write in local directory only.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <motion.div
    whileHover={{ y: -5, borderColor: "rgba(249, 115, 22, 0.4)" }}
    className="p-8 glass flex flex-col gap-4 border border-zinc-800/50 transition-all text-left group"
  >
    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const StepCard = ({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) => (
  <div className="relative p-6 rounded-2xl border border-zinc-800 group hover:border-zinc-700 transition-colors">
    <div className="text-7xl font-black text-white/10 absolute -top-8 -left-3 select-none group-hover:text-orange-500/20 transition-colors">
      {number}
    </div>
    <h3 className="text-lg font-bold mb-2 relative z-10 text-white">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed relative z-10">
      {desc}
    </p>
  </div>
);

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g terminally");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle URL fragments on load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen grid-bg selection:bg-orange-500/30">
      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-orange-500/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 inline-block border border-orange-500/20">
              The Intelligent Command Line
            </span>
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[0.95] max-w-4xl mx-auto">
              Your terminal,
              <br />
              <span className="text-orange-500 italic">reimagined</span> with
              AI.
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
              Stop context switching between StackOverflow, ChatGPT, and your
              shell. Describe what you want, get the correct commands, and
              understand{" "}
              <span className="text-white border-b border-zinc-700 italic">
                why
              </span>{" "}
              they work. Terminally is the AI-powered bridge to your system.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button
                onClick={() => scrollToSection("install")}
                className="w-full md:w-auto px-10 py-4.5 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 transition-all glow-orange text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              >
                GET STARTED FREE
              </button>
              <Link
                href="/docs"
                className="w-full md:w-auto px-10 py-4.5 glass text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg border border-white/10 flex items-center justify-center"
              >
                VIEW DOCUMENTATION
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, type: "spring" }}
          >
            <TerminalMockup />
          </motion.div>

          {/* Quick Install */}
          <motion.div
            id="install"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 max-w-2xl mx-auto px-4"
          >
            <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/80 rounded-[2rem] p-3 flex flex-col md:flex-row items-center gap-4 group hover:border-orange-500/30 transition-all duration-500 shadow-3xl">
              <div className="flex items-center gap-4 px-6 flex-1 w-full md:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide py-3 md:py-0">
                <span className="text-orange-500 font-bold select-none font-mono">
                  $
                </span>
                <code className="text-zinc-200 font-mono text-sm md:text-base">
                  npm install -g terminally
                </code>
              </div>
              <button
                onClick={handleCopy}
                className="w-full md:w-auto bg-white text-black hover:bg-zinc-200 px-8 py-3.5 rounded-[1.5rem] text-sm transition-all whitespace-nowrap font-black uppercase tracking-tight shadow-lg active:scale-95 flex items-center justify-center min-w-[140px]"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -5 }}
                      className="text-green-600 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      COPIED!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      COPY COMMAND
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-8 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
              <span>✓ MACOS</span>
              <span>✓ LINUX</span>
              <span>✓ WINDOWS (WSL)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="py-32 px-6 border-t border-zinc-900 bg-[#080808]/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
              Execution Flow.
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-lg leading-relaxed">
              Terminally isn't just a generator; it's a safety layer between
              your intent and your operating system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard
              number="01"
              title="Describe Task"
              desc="User inputs natural language into the interactive terminally mode."
            />
            <StepCard
              number="02"
              title="AI Generation"
              desc="Command is generated with a risk assessment and breakdown."
            />
            <StepCard
              number="03"
              title="Safe Preview"
              desc="Simulate the outcome to see file changes before execution."
            />
            <StepCard
              number="04"
              title="Smart Run"
              desc="Execute confirmed commands. AI auto-fixes any runtime errors."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-32 px-6 border-t border-zinc-900 relative overflow-hidden bg-black"
      >
        <div className="absolute inset-0 grid-bg-dots opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white leading-none">
                Core Product
                <br />
                <span className="text-orange-500">Intelligence.</span>
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Everything you need to master your shell without the
                memorization headache.
              </p>
            </div>
            <div className="hidden md:block pb-2">
              <a
                href="#install"
                className="text-orange-500 font-bold border-b border-orange-500/20 hover:border-orange-500 transition-all pb-1 uppercase tracking-widest text-xs"
              >
                Explore Roadmap →
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🧠"
              title="NL → Command"
              description="Stop memorizing flags. Describe your task in English and get production-ready shell scripts instantly. Terminally is your AI shell co-pilot."
            />
            <FeatureCard
              icon="🛡️"
              title="Risk Detection"
              description="Analyzes commands for destructive patterns like root deletions or process kills before execution."
            />
            <FeatureCard
              icon="🔍"
              title="Simulation Mode"
              description="Preview effects before running. See which files change, which ports open, and what processes are targeted."
            />
            <FeatureCard
              icon="🛠️"
              title="Error Recovery"
              description="If a command fails, Terminally captures stderr, diagnoses the issue, and suggests a one-line correction."
            />
            <FeatureCard
              icon="🏠"
              title="Context Awareness"
              description="Adapts to your environment by detecting Git status, package files, Docker configs, and OS type."
            />
            <FeatureCard
              icon="🎓"
              title="Built-in Learning"
              description="Educational breakdown for every command. Understand flags and logic while you work."
            />
          </div>
        </div>
      </section>

      {/* Safety Deep Dive */}
      <section id="safety" className="py-32 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto glass p-8 md:p-20 border border-zinc-800/80 flex flex-col lg:flex-row items-center gap-16 shadow-inner">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black tracking-widest uppercase mb-8 border border-red-500/20">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />{" "}
              Safety Protocol Active
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter leading-tight text-white uppercase italic">
              Safety first.
              <br />
              Second, and third.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-light">
              The terminal shouldn't be a danger zone. Terminally categorizes
              every command by risk level. High-risk operations like{" "}
              <code className="text-red-400 bg-red-400/5 px-2 py-0.5 rounded border border-red-500/10 font-mono">
                sudo
              </code>{" "}
              or
              <code className="text-red-400 bg-red-400/5 px-2 py-0.5 rounded border border-red-500/10 ml-2 font-mono">
                rm -rf
              </code>{" "}
              require manual typing of{" "}
              <span className="text-white font-bold underline">YES</span> to
              proceed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Zero auto-execution",
                "Dangerous flag analysis",
                "PID Target detection",
                "Permission safeguarding",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-zinc-300 font-mono text-xs"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="w-full max-w-sm aspect-square bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-800/50 p-12 flex items-center justify-center relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000" />
              <div className="absolute top-0 right-0 p-8 text-zinc-900 font-black text-9xl select-none italic">
                AI
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                }}
                className="text-[10rem] filter drop-shadow-[0_0_50px_rgba(249,115,22,0.4)] relative z-10"
              >
                🛡️
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 px-6 border-t border-zinc-900 bg-[#060606]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white">
            Built by developers.
            <br />
            <span className="text-zinc-600 italic underline decoration-orange-500/30">
              For developers.
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-12 leading-relaxed font-light max-w-2xl mx-auto">
            Terminally is 100% open source and community-driven. We believe the
            future of the terminal is open, safe, and powered by collective
            intelligence. Join thousands of engineers building a safer shell.
          </p>
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-wrap gap-8 items-center justify-center">
              <a
                href="https://github.com/terminally"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-white transition-colors">
                  <svg
                    className="w-6 h-6 text-white group-hover:text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
              </a>
              <div className="h-10 w-px bg-zinc-800 hidden md:block" />
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?u=${i}`}
                      alt="contributor"
                      className="w-full h-full grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-black bg-orange-500 flex items-center justify-center text-[10px] font-black text-black">
                  +24
                </div>
              </div>
            </div>

            <Link
              href="/docs?tab=contributing"
              className="px-10 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-[0.3em] text-white transition-all shadow-2xl hover:scale-105"
            >
              Join the movement
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-6 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-orange-500/20 blur-[100px] -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-[ -0.05em] text-white">
            Upgrade your
            <br />
            shell experience.
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button
              onClick={() => scrollToSection("install")}
              className="w-full md:w-auto px-16 py-6 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all text-xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
            >
              INSTALL TERMINALLY
            </button>
            <Link
              href="/docs"
              className="w-full md:w-auto px-12 py-6 glass text-white font-bold rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-xl flex items-center justify-center"
            >
              VIEW DOCUMENTATION
            </Link>
          </div>
          <p className="mt-12 text-zinc-500 font-mono text-sm tracking-widest uppercase font-bold">
            Open Source & Free
          </p>
        </motion.div>
      </section>
    </div>
  );
}
