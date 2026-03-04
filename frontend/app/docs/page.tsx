"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface Section {
  title: string;
  content: string;
  code?: string | { [key: string]: string };
  prompt?: string;
  isArchitecture?: boolean;
  type?: "info" | "warning" | "success";
}

interface DocCategory {
  id: string;
  title: string;
  sections: Section[];
}

const docsContent: DocCategory[] = [
  {
    id: "installation",
    title: "Installation",
    sections: [
      {
        title: "System Requirements",
        content:
          "Terminally is designed to be cross-platform and extremely lightweight. Ensure your environment meets these minimums:\n\n• Node.js: v18.0.0 or higher\n• OS: macOS, Linux, or Windows (via WSL/WSL2)\n• Shells: zsh (recommended), bash, or fish",
      },
      {
        title: "Primary Install",
        content:
          "The fastest way to get Terminally on your system. Choose your preferred package manager.",
        code: {
          pnpm: "pnpm add -g terminally",
          npm: "npm install -g terminally",
          yarn: "yarn global add terminally",
          bun: "bun add -g terminally",
        },
      },
      {
        title: "From Source",
        content:
          "For developers wanting to hack on Terminally or run the absolute latest build from main.",
        code: "git clone https://github.com/devsultan06/terminally/termai.git\ncd termai\nnpm install\nnpm run build\nnpm link",
      },
      {
        title: "Verify Installation",
        content:
          "Run the version command to ensure the binary is correctly mapped to your path.",
        code: "terminally --version",
      },
    ],
  },
  {
    id: "quick-start",
    title: "Quick Start",
    sections: [
      {
        title: "Step 1: Run Interactive Mode",
        content:
          "Launch the AI-powered wrapper by simply typing the command name.",
        code: "terminally",
      },
      {
        title: "Step 2: Ask a Question",
        content: "Once inside, use natural language. No need for flags yet.",
        prompt: "create a new react app with vite and tailwind",
      },
      {
        title: "Step 3: Review & Run",
        content:
          "Terminally will generate the command, assess the risk, and offer an explanation. Review it, then type 'y' to execute.",
      },
    ],
  },
  {
    id: "interactive-mode",
    title: "Interactive Mode",
    sections: [
      {
        title: "How It Works",
        content:
          "In interactive mode, Terminally stays active, maintaining context between commands. It scans your directory for .git, package.json, and OS signals to ensure the generated commands actually work in your specific environment.",
      },
      {
        title: "Special Commands",
        content:
          "Use these slash-commands inside the interactive prompt for quick actions:\n\n• /help — Show all commands\n• /history — View recent AI prompts and generated commands to build on top of them.\n• /config — Open the configuration dashboard to toggle safety and explanation modes.\n• /simulate — Toggle dry-run mode. Predictive modeling of command impact.\n• /explain — Force a deep-dive explanation of the currently staged command.\n• /exit — Return to your standard shell prompt.",
      },
    ],
  },
  {
    id: "safety-system",
    title: "Safety System",
    sections: [
      {
        title: "The Philosophy",
        content:
          "Terminally follows a 'Human-in-the-Loop' philosophy. It will never, under any circumstances, execute a command without your explicit confirmation. You are always the final gatekeeper.",
      },
      {
        title: "Risk Detection Engine",
        content:
          "Our risk engine scans for destructive patterns including:\n\n• Recursive deletions (rm -rf)\n• Superuser elevation (sudo)\n• Process termination (kill -9)\n• Network & Firewall modifications",
      },
      {
        title: "Double Confirmation",
        content:
          "For 'High Risk' operations, a simple 'y' isn't enough. You must manually type the full word 'YES' to proceed. This prevents accidental keystrokes from causing data loss.",
      },
    ],
  },
  {
    id: "simulation-mode",
    title: "Simulation Mode",
    sections: [
      {
        title: "Visual Dry-Runs",
        content:
          "Simulation Mode is our 'Pre-Check' system. It attempts to predict the outcome of a command before it touches your hardware.",
      },
      {
        title: "What is Simulated?",
        content:
          "• File Count: How many files will be deleted or moved.\n• Space Impact: Estimated disk space change.\n• Processes: Which PIDs will be targeted for termination.\n• Git: Which branches or commits will be pushed/deleted.",
        code: 'terminally --simulate "cleanup all logs older than 7 days"',
      },
    ],
  },
  {
    id: "error-recovery",
    title: "Error Recovery",
    sections: [
      {
        title: "Smart Diagnosis",
        content:
          "If a command fails, Terminally doesn't just show a stack trace. It captures the stderr, sends it to the AI, and generates a context-aware fix.",
      },
      {
        title: "Example Recovery",
        content:
          "If you try to start a server and get 'EADDRINUSE', Terminally identifies the conflict and suggests a command to find and kill the process occupying the port.",
        code: "lsof -i :3000\nkill -9 <PID>",
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    sections: [
      {
        title: "Config Location",
        content:
          "Your settings are stored locally in a clear JSON format. You can edit it manually or via the CLI.",
        code: "~/.terminally/config.json",
      },
      {
        title: "Fields Breakdown",
        content:
          "• autoExplain: Always show the breakdown of why a command was chosen.\n• safeMode: Enable/Disable high-risk detection (Not recommended to disable).\n• autoErrorFix: Automatically trigger AI diagnosis on failed commands.\n• defaultShell: Force zsh, bash, or fish syntax.",
      },
    ],
  },
  {
    id: "api-keys",
    title: "API Keys",
    sections: [
      {
        title: "Setting Your Key",
        content:
          "Terminally uses high-performance LLMs to generate commands. You can provide your own key to remove usage limits.",
        code: "terminally config set apiKey YOUR_KEY",
      },
      {
        title: "Privacy Policy",
        content:
          "We only send the prompt and the immediate directory structure (filenames, not content) to the AI to ensure accurate command generation. No personal files or sensitive data are ever uploaded.",
      },
    ],
  },
  {
    id: "context-awareness",
    title: "Context Awareness",
    sections: [
      {
        title: "Environment Intelligence",
        content:
          "Terminally doesn't just generate commands; it understands your system state. It automatically detects:\n\n• Git Repositories: Current branch, staged files, last commit.\n• Project Type: Node.js (package.json), Python (venv/requirements), Docker, etc.\n• OS Specifics: macOS vs Linux package managers (brew vs apt).\n• Shell Syntax: Automatically adapts to your current shell ($SHELL).",
      },
    ],
  },
  {
    id: "cli-reference",
    title: "CLI Reference",
    sections: [
      {
        title: "Main Commands",
        content:
          '• terminally: Launch interactive mode.\n• terminally ask "...": Generate a command without entering interactive mode.\n• terminally config: View or set local configurations.\n• terminally doctor: Check for system dependencies and environment salud.\n• terminally --version: View current build version.',
      },
      {
        title: "Flags",
        content:
          "• --explain: Automatically show the explanation for every generated command.\n• --simulate: Toggle dry-run mode for the next execution.\n• --no-confirm: Run without manual typing (Use with caution!).",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    sections: [
      {
        title: "Our Principles",
        content:
          "Terminally is built to be a 'Low-Privilege' assistant. We never inject background scripts or run commands without your visual approval. Every character that reaches your shell is first presented to you on-screen.\n\n• Zero Auto-Execution: No command runs unless you press 'Y'.\n• No Secret Injections: We don't append tracking or telemetry to your shell strings.\n• Local Scoping: Terminally only scans the directory it is launched from.",
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    sections: [
      {
        title: "Information Flow",
        content:
          "Terminally works as a pipeline, ensuring your intent is safely translated into valid code.",
        isArchitecture: true,
      },
      {
        title: "The Core Engine",
        content:
          "Terminally is split into specialized modules for maximum safety and speed:\n\n1. CLI Layer: The interactive terminal interface.\n2. Context Scanner: Detects OS, Shell, and Project environment.\n3. AI Service: Communicates with LLMs for command generation.\n4. Risk Engine: Scans generated strings for dangerous patterns.\n5. Execution Layer: Safely runs confirmed strings via child_process.",
      },
    ],
  },
  {
    id: "changelog",
    title: "Changelog",
    sections: [
      {
        title: "v1.0.4 — The Safety Update",
        content:
          "• Added: New Risk Detection Engine (RDE).\n• Added: 'YES' confirmation for destructive commands.\n• Improved: Context-aware responses for multi-file Git repos.\n• Fixed: ZSH completion conflicts.",
      },
      {
        title: "v1.0.0 — Initial Launch",
        content:
          "• Core NLP to Shell pipeline.\n• Interactive 'terminally' mode.\n• Base configuration system.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Trust",
    sections: [
      {
        title: "Data Transmission",
        content:
          "Terminally only sends the prompt text and the current directory's file structure (filenames only) to the AI service. We NEVER scan file contents, credentials, or `.env` files. Your source code stays on your machine.",
      },
      {
        title: "Enterprise Readiness",
        content:
          "You can configure Terminally to use your own private LLM instance via the global config, ensuring that no data ever reaches public infrastructure.",
      },
    ],
  },
  {
    id: "roadmap",
    title: "Roadmap",
    sections: [
      {
        title: "Future Vision",
        content:
          "• v1.1: Multi-step automation (e.g. 'Build, Deploy, and Verify').\n• v1.2: Local-only inference for air-gapped environments.\n• v1.5: Team libraries for sharing custom company aliases.\n• v2.0: Full IDE terminal replacement.",
      },
    ],
  },
  {
    id: "contributing",
    title: "Contributing",
    sections: [
      {
        title: "How to Help",
        content:
          "We welcome contributions from everyone! You can help by:\n\n• Reporting bugs in our GitHub Issues.\n• Suggesting new AI features or safety rules.\n• Improving documentation.\n• Submitting pull requests for bug fixes or new modules.",
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    sections: [
      {
        title: "Common Questions",
        content:
          "Q: Does it work offline?\nA: Not yet. Command generation requires an internet connection for AI inference.\n\nQ: Is it safe for production?\nA: Yes, because it requires manual confirmation for every single action.\n\nQ: Does it support PowerShell?\nA: Official support is currently for WSL, Bash, ZSH, and Fish.",
      },
    ],
  },
];

const CodeHighlight = ({ code }: { code: string }) => {
  // Simple CLI syntax highlighter
  const parts = code.split(/(\s+)/);
  return (
    <>
      {parts.map((part, i) => {
        if (/^(npm|pnpm|yarn|bun|git|terminally|lsof|kill)$/.test(part)) {
          return (
            <span key={i} className="text-purple-400 font-bold">
              {part}
            </span>
          );
        }
        if (
          /^(install|add|create|push|commit|checkout|clone|run|global|set|ask|doctor)$/.test(
            part,
          )
        ) {
          return (
            <span key={i} className="text-green-400 italic">
              {part}
            </span>
          );
        }
        if (/^-/.test(part)) {
          return (
            <span key={i} className="text-orange-400">
              {part}
            </span>
          );
        }
        if (part.includes("terminally-")) {
          return (
            <span
              key={i}
              className="text-blue-400 underline decoration-blue-500/30"
            >
              {part}
            </span>
          );
        }
        return (
          <span key={i} className="text-zinc-300">
            {part}
          </span>
        );
      })}
    </>
  );
};

const CodeBlock = ({ code }: { code: string | { [key: string]: string } }) => {
  const [activePkg, setActivePkg] = useState(
    typeof code === "object" ? Object.keys(code)[0] : "pnpm",
  );
  const [copied, setCopied] = useState(false);

  const displayCode = typeof code === "string" ? code : code[activePkg];

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl mb-8 group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-900/20">
        <div className="flex items-center gap-4">
          {typeof code === "object" ? (
            <div className="flex gap-1 p-1 bg-black/40 rounded-lg border border-zinc-800">
              {Object.keys(code).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setActivePkg(pkg)}
                  className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                    activePkg === pkg
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {pkg}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-500">
              <Terminal size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                CLI
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white relative group"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Check size={16} className="text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Copy size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="p-6 font-mono text-sm relative">
        <div className="flex items-start gap-4">
          <span className="text-orange-500 font-bold select-none">$</span>
          <div className="text-zinc-300 leading-relaxed block overflow-x-auto scrollbar-hide">
            <CodeHighlight code={displayCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

function DocsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("installation");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && docsContent.some((c) => c.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      {/* Sidebar / Category Bar */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="lg:sticky lg:top-40 lg:h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-4 scrollbar-hide">
          <div className="mb-8 lg:mb-12 overflow-x-auto lg:overflow-visible scrollbar-hide">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 lg:mb-6 whitespace-nowrap lg:whitespace-normal">
              Documentation
            </h3>
            <nav className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
              {docsContent.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-left px-5 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                    activeTab === item.id
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                      : "text-zinc-500 hover:text-white border-transparent"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden lg:block glass p-6 border-zinc-800/50">
            <p className="text-[10px] text-zinc-500 font-bold mb-2 uppercase italic tracking-widest">
              Latest Release
            </p>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              v1.0.4 — The Safety Update is now live.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {docsContent
              .find((c) => c.id === activeTab)
              ?.sections.map((section, idx) => (
                <div key={idx} className="mb-20">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">
                    {section.title}
                  </h2>
                  <div className="text-zinc-400 text-lg leading-relaxed font-light mb-8 whitespace-pre-wrap">
                    {section.content}
                  </div>

                  {section.isArchitecture && (
                    <div className="my-12 p-8 border border-zinc-800 rounded-3xl bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden">
                      <div className="flex flex-col items-center gap-6 relative z-10">
                        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 px-4 text-center">
                          <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-[10px] font-black text-orange-400 uppercase tracking-widest w-full md:w-auto">
                            User Intent
                          </div>
                          <div className="text-zinc-700 md:rotate-0 rotate-90">
                            →
                          </div>
                          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest w-full md:w-auto">
                            Context Check
                          </div>
                          <div className="text-zinc-700 md:rotate-0 rotate-90">
                            →
                          </div>
                          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-[10px] font-black text-purple-400 uppercase tracking-widest w-full md:w-auto">
                            AI Engine
                          </div>
                        </div>
                        <div className="text-zinc-700 text-xl font-light">
                          ↓
                        </div>
                        <div className="px-10 py-6 border-2 border-red-500/40 bg-red-500/5 rounded-2xl text-center group">
                          <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2 animate-pulse">
                            Safety Barrier
                          </div>
                          <div className="text-white font-mono text-sm uppercase">
                            Risk Assessment Engine
                          </div>
                        </div>
                        <div className="text-zinc-700 text-xl font-light">
                          ↓
                        </div>
                        <div className="w-full flex justify-center">
                          <div className="px-8 py-4 bg-green-500/20 border border-green-500/40 rounded-xl text-center">
                            <div className="text-xs font-black text-green-500 uppercase tracking-widest mb-1">
                              Final Result
                            </div>
                            <div className="text-white text-xs font-mono">
                              Shell Execution
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Background subtle connections */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="grid-bg-dots h-full" />
                      </div>
                    </div>
                  )}

                  {section.code && <CodeBlock code={section.code} />}

                  {section.prompt && (
                    <div className="bg-zinc-900/40 border border-orange-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        Example Prompt
                      </p>
                      <p className="text-white text-xl italic font-serif leading-relaxed">
                        "{section.prompt}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 grid-bg">
      <Suspense
        fallback={<div className="text-white text-center">Loading Docs...</div>}
      >
        <DocsContent />
      </Suspense>
    </div>
  );
}
