import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-zinc-900 text-left bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg border border-white/5">
              <img
                src="/logo.png"
                alt="Terminally"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">
              Terminally
            </span>
          </div>
          <p className="text-zinc-500 max-w-sm mb-8 font-light">
            Empowering developers to work faster and safer inside the terminal.
            Built for the next generation of engineers.
          </p>
          <div className="flex gap-6">
            {["Twitter", "GitHub", "Discord"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-zinc-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
            Product
          </h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li>
              <Link
                href="/#features"
                className="hover:text-white transition-colors text-left"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="hover:text-white transition-colors text-left"
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                href="/docs#safety-system"
                className="hover:text-white transition-colors text-left"
              >
                Safety Protocol
              </Link>
            </li>
            <li>
              <Link
                href="/docs#changelog"
                className="hover:text-white transition-colors text-left"
              >
                Changelog
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Team Plans
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
            Resources
          </h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li>
              <Link href="/docs" className="hover:text-white transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link
                href="/docs#privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                CLI Reference
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Community
              </a>
            </li>
            <li>
              <a
                href="https://github.com/terminally-ai"
                className="hover:text-white transition-colors"
              >
                Open Source
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-700 text-[10px] font-bold tracking-widest uppercase select-none">
          © {new Date().getFullYear()} TERMINALLY SYSTEMS INC. DEPLOYED IN
          PRODUCTION.
        </p>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-zinc-700 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-zinc-700 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
