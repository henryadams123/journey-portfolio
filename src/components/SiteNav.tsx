import { Link } from "@tanstack/react-router";
import { Magnetic } from "@/components/Magnetic";

export function SiteNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex justify-between items-center bg-vellum/80 backdrop-blur-sm border-b border-ink/10">
      <Link to="/" className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-widest uppercase text-clay">Index.00</span>
        <span className="font-serif text-base md:text-lg tracking-tight">Henry Adams</span>
      </Link>
      <div className="flex items-center gap-6 md:gap-10">
        <Link to="/" className="font-mono text-[10px] md:text-xs uppercase tracking-widest hover:text-clay transition-colors">Survey</Link>
        <Link to="/projects" className="font-mono text-[10px] md:text-xs uppercase tracking-widest hover:text-clay transition-colors">Archive</Link>
        <Link to="/about" className="font-mono text-[10px] md:text-xs uppercase tracking-widest hover:text-clay transition-colors">Methodology</Link>
        <Magnetic className="hidden md:inline-block">
          <a href="mailto:henryadams0123@gmail.com" data-cursor="hover" className="inline-block px-4 py-1.5 border border-ink rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-ink hover:text-vellum transition-all">
            Contact
          </a>
        </Magnetic>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 mt-32 px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-clay">
      <div className="space-y-1">
        <div className="font-mono text-[10px] tracking-widest uppercase">Relief_Mapping_System v2.0</div>
        <div className="font-serif text-sm">Henry Adams · Arvada, CO · 720-725-2618</div>
      </div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-right">
        <a href="mailto:henryadams0123@gmail.com" className="block hover:text-ink">henryadams0123@gmail.com</a>
        <a href="https://linkedin.com/in/henry-adams-5208a2237" target="_blank" rel="noreferrer" className="block hover:text-ink">linkedin / henry-adams</a>
      </div>
    </footer>
  );
}
