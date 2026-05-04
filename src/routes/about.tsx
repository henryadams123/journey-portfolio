import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Methodology — Henry Adams" },
      { name: "description", content: "Background, skills, and approach." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-vellum text-ink">
      <SiteNav />
      <div className="fixed inset-0 survey-grid opacity-40 pointer-events-none z-0" />
      <main className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-6">Methodology · Author</div>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-12">Henry Adams.</h1>
          <p className="font-serif text-2xl leading-relaxed mb-10">
            Economics graduate (Univ. of Oregon, 2025) and incoming M.Eng. in Engineering Management at CU Boulder via the Lockheed Martin Engineering Management Program. Dual U.S. and Australian citizen. Comfortable in Excel, R, and on a chairlift before sunrise.
          </p>

          <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-ink/10 pt-12">
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-clay mb-4">Technical</h2>
              <ul className="font-serif text-lg space-y-2">
                <li>Excel — financial modeling, budgeting, trackers</li>
                <li>R programming · data visualization</li>
                <li>Process mapping & swim lane diagrams</li>
                <li>CRM platforms (Salesforce)</li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-clay mb-4">Domain</h2>
              <ul className="font-serif text-lg space-y-2">
                <li>Financial analysis & sector research</li>
                <li>Clean energy & deep tech</li>
                <li>Startup incubation & program design</li>
                <li>Stakeholder reporting</li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-clay mb-4">Certifications</h2>
              <ul className="font-serif text-lg space-y-2">
                <li>Certified Pool Operator (CPO)</li>
                <li>Red Cross Lifeguard / CPR / AED / First Aid</li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-clay mb-4">Other</h2>
              <ul className="font-serif text-lg space-y-2">
                <li>Dual U.S. / Australian citizenship</li>
                <li>Competitive alpine ski racing</li>
                <li>Team leadership · field operations</li>
              </ul>
            </div>
          </div>

          <div className="mt-20 border-t border-ink/10 pt-12">
            <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-4">Contact</div>
            <div className="font-serif text-2xl">
              <a href="mailto:henryadams0123@gmail.com" className="hover:text-rust">henryadams0123@gmail.com</a>
              <span className="text-clay"> · </span>
              720-725-2618
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
