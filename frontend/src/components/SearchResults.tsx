import {
  ArrowRight,
  BookMarked,
  Bot,
  Briefcase,
  FileSearch,
  Library,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const productAreas = [
  {
    title: "Discover",
    description: "Search papers by topic, author, or idea and move from broad curiosity to useful sources.",
    icon: FileSearch,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    title: "AI Summaries",
    description: "Turn dense abstracts into quick reading cues before you invest time in a full paper.",
    icon: Bot,
    tone: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Research News",
    description: "Keep up with current breakthroughs, trends, and academic updates in one feed.",
    icon: Newspaper,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Opportunities",
    description: "Create and find projects, research roles, and collaborations with clear requirements.",
    icon: Briefcase,
    tone: "bg-amber-50 text-amber-700",
  },
];

const workflow = [
  "Search for papers and topics",
  "Use AI to preview relevance",
  "Save useful work to your library",
  "Follow news and join opportunities",
];

const SearchResults = () => {
  return (
    <main className="bg-white text-slate-950">
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Research workspace
            </p>
            <h2 className="font-sans text-3xl font-bold tracking-normal text-slate-950 md:text-5xl">
              Everything a researcher needs after the first search.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              PaperHunt is designed for the full research loop: finding material, understanding it quickly,
              staying current, and turning curiosity into real academic work.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {productAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-md ${area.tone}`}>
                  <area.icon className="h-6 w-6" />
                </div>
                <h3 className="font-sans text-xl font-bold tracking-normal text-slate-950">{area.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20">
        <div className="container mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">
              Guided flow
            </p>
            <h2 className="font-sans text-3xl font-bold tracking-normal text-slate-950 md:text-4xl">
              Move from question to action without switching tools.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The homepage now reflects the actual product: a clean research operating system, not just a
              search box. The private workspace still handles the heavy workflows after sign in.
            </p>
          </div>

          <div className="grid gap-4">
            {workflow.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="font-semibold text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="rounded-lg bg-slate-950 p-8 text-white md:p-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-cyan-400/15 text-cyan-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="font-sans text-3xl font-bold tracking-normal md:text-4xl">
                Built for focused academic work.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                Public visitors get a clear story, while signed-in users get access to the real workspace:
                discovery, library, news, and opportunities behind protected routes.
              </p>
              <Link
                to="/signin"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-50"
              >
                Open your workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: "Organized saved papers", icon: Library },
                { label: "Better reading decisions", icon: BookMarked },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans text-lg font-bold tracking-normal text-slate-950">{item.label}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    Keep research work structured so users can return to it when they are ready to read,
                    share, or collaborate.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchResults;
