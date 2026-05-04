import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { PROJECTS } from "@/lib/journey";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Archive — Henry Adams" },
      { name: "description", content: "Eight case studies across strategy, operations, finance, and process design." },
    ],
  }),
});

function ProjectsPage() {
  return (
    <div className="min-h-screen bg-vellum text-ink">
      <SiteNav />
      <div className="fixed inset-0 survey-grid opacity-40 pointer-events-none z-0" />
      <main className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-16 font-mono text-[10px] uppercase tracking-widest text-clay">
            <span>Sub-survey 02 · The Archive</span>
            <span>{PROJECTS.length} plates</span>
          </div>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-16 max-w-5xl">
            Eight projects, mapped in the same hand as the journey.
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
            {PROJECTS.map((p) => (
              <Link
                key={p.slug}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group block bg-vellum p-8 md:p-10 hover:bg-vellum-deep transition-colors"
              >
                <div className="flex justify-between items-start mb-8 font-mono text-[10px] uppercase tracking-widest text-clay">
                  <span>Case {p.index}</span>
                  <span>{p.status}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl leading-[1] tracking-tighter mb-5 group-hover:text-rust transition-colors">{p.title}</h2>
                <p className="text-base text-ink/80 leading-relaxed mb-6 max-w-prose">{p.blurb}</p>
                <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-clay">
                  <span>{p.category}</span>
                  <span className="group-hover:text-rust">Open ↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
