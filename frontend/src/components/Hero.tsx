import { ArrowRight, BookOpen, Briefcase, Newspaper, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ResearchNetworkScene from "./ResearchNetworkScene";

const Hero = () => {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-white pt-24 text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.12),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#eef7ff_100%)]" />
      <ResearchNetworkScene className="absolute inset-0 z-0 opacity-80" />
      <div className="absolute inset-y-0 left-0 z-[1] w-full bg-gradient-to-r from-white via-white/95 to-white/40 md:w-[70%] lg:w-[62%]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="container relative z-10 mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            AI-assisted research discovery
          </div>

          <h1 className="max-w-4xl font-sans text-4xl font-bold leading-[1.05] tracking-normal text-slate-950 sm:text-5xl md:text-6xl xl:text-7xl">
            Find the right papers, news, and research opportunities faster.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            PaperHunt brings paper search, AI summaries, research news, saved libraries, and collaboration
            opportunities into one focused workspace for students and researchers.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-lg bg-slate-950 px-6 text-white hover:bg-blue-700">
              <Link to="/signin">
                Start exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-lg border-slate-300 bg-white/80 px-6 text-slate-800 hover:bg-slate-50"
            >
              <Link to="/about">See how it works</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "Discover papers", icon: Search },
            { label: "Track research news", icon: Newspaper },
            { label: "Build your library", icon: BookOpen },
            { label: "Find opportunities", icon: Briefcase },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
