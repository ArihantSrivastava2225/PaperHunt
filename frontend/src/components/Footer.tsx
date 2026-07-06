import { Github, Mail, Sparkles, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 text-slate-700">
      <div className="container mx-auto max-w-6xl py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-cyan-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-sans text-2xl font-bold tracking-normal text-slate-950">PaperHunt</span>
            </Link>
            <p className="max-w-md leading-7 text-slate-600">
              A focused research workspace for discovering papers, understanding them faster, tracking news,
              and finding academic opportunities.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-sans font-bold tracking-normal text-slate-950">Explore</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Sign in", "/signin"],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-slate-600 transition hover:text-blue-600">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-sans font-bold tracking-normal text-slate-950">Workspace</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Discover", "/discover"],
                ["Library", "/library"],
                ["News", "/hots"],
                ["Opportunities", "/research-opportunities"],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-slate-600 transition hover:text-blue-600">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Copyright 2026 PaperHunt. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {[
              { label: "Twitter", icon: Twitter },
              { label: "GitHub", icon: Github },
              { label: "Email", icon: Mail },
            ].map((item) => (
              <a
                key={item.label}
                href="#"
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
