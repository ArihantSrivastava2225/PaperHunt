import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const loggedIn = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-cyan-300 transition group-hover:bg-blue-700">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-sans text-2xl font-bold tracking-normal text-slate-950">PaperHunt</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, path]) => (
              <Link key={label} to={path} className="font-medium text-slate-600 transition hover:text-blue-600">
                {label}
              </Link>
            ))}
          </div>

          <Button
            asChild
            className="h-10 rounded-lg bg-slate-950 px-4 text-white hover:bg-blue-700"
          >
            <Link to={loggedIn ? "/discover" : "/signin"}>
              {loggedIn ? "Open workspace" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
