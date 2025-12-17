import { Github, Twitter, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative border-t border-primary/20 overflow-hidden">
      {/* Twinkling stars overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-2xl font-heading font-bold text-glow-cyan">
                PaperHunt
              </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Your AI-powered telescope for exploring the universe of research papers. 
              Discover, understand, and connect knowledge across the scientific cosmos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">
              Explore
            </h3>
            <ul className="space-y-2">
              {["Home", "Discover", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">
              Resources
            </h3>
            <ul className="space-y-2">
              {["Documentation", "API", "Blog", "Support"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 PaperHunt. Navigating the knowledge cosmos.
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <Github className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
