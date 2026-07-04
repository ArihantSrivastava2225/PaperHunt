import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

const Navbar = () => {
  const loggedIn = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="h-6 w-6 text-primary group-hover:animate-pulse-glow transition-all" />
            <span className="text-2xl font-heading font-bold text-glow-cyan">
              PaperHunt
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </div>

          <Button
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary hover:glow-cyan transition-all"
          >
            {loggedIn ? (
              <Link to="/discover">
                Get Started
              </Link>
            ) : (
              <Link to="/signin">
                Login
              </Link>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
