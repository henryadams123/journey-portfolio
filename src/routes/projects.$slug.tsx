import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { PROJECTS } from "@/lib/journey";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  component: ProjectPage,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — Henry Adams` },
          { name: "description", content: loaderData.project.blurb },
        ]
      : [{ title: "Case Study — Henry Adams" }],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex items-center justify-center bg-vellum text-ink p-8">
        <div className="text-center space-y-4">
          <p className="font-serif text-2xl">{error.message}</p>
          <button
            className="font-mono text-xs uppercase tracking-widest border border-ink rounded-full px-5 py-2"
            onClick={() => { router.invalidate(); reset(); }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => {
    const { slug } = Route.useParams();
    return (
      <div className="min-h-screen flex items-center justify-center bg-vellum text-ink p-8">
        <div className="text-center space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-clay">Plate not catalogued</p>
          <p className="font-serif text-2xl">No case study at /{slug}</p>
          <Link to="/projects" className="inline-block font-mono text-xs uppercase tracking-widest border border-ink rounded-full px-5 py-2">
            Back to archive
          </Link>
        </div>
      </div>
    );
  },
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <div className="min-h-screen bg-vellum text-ink">
      <SiteNav />
      <div className="fixed inset-0 survey-grid opacity-40 pointer-events-none z-0" />
      <main className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Link to="/projects" className="font-mono text-[10px] uppercase tracking-widest text-clay hover:text-ink">
            ← Archive
          </Link>
          <div className="mt-8 flex justify-between items-end font-mono text-[10px] uppercase tracking-widest text-clay">
            <span>Case {project.index}</span>
            <span>{project.status} · {project.category}</span>
          </div>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[0.95] tracking-tighter mb-10">{project.title}</h1>

          <div className="aspect-[16/9] bg-elevation/40 border border-ink/15 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 paper-grain opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2 text-clay">
                <div className="font-mono text-[10px] uppercase tracking-widest">Plate {project.index} · Working Render</div>
                <div className="font-serif italic text-2xl">Documentation in progress</div>
              </div>
            </div>
          </div>

          <p className="font-serif text-2xl leading-relaxed max-w-prose mb-12">{project.blurb}</p>

          <div className="grid md:grid-cols-3 gap-8 border-t border-ink/10 pt-10 mb-16">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-2">Discipline</div>
              <div className="font-serif text-lg">{project.category}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-2">Status</div>
              <div className="font-serif text-lg">{project.status}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-2">Author</div>
              <div className="font-serif text-lg">Henry Adams</div>
            </div>
          </div>

          <div className="border-t border-ink/10 pt-8 prose prose-stone max-w-none">
            <p className="font-serif text-lg italic text-clay">
              Detailed write-up — methodology, artifacts, and outcomes — is being prepared. This is a placeholder station while the full survey is drafted.
            </p>
          </div>

          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            className="mt-20 group flex justify-between items-center border-t border-ink/10 pt-8"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-2">Next plate</div>
              <div className="font-serif text-2xl group-hover:text-rust transition-colors">{next.title}</div>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest group-hover:text-rust">→</span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
