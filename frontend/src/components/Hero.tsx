import { useState } from "react";
import { Sparkles } from "lucide-react";
import nebulaBg from "@/assets/nebula-bg.jpg";
import StarfieldBackground from "./StarfieldBackground";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${nebulaBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <StarfieldBackground />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-float">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Research Discovery</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-glow-cyan leading-tight">
            Find, Understand, and Explore
            <br />
            <span className="text-glow-purple">Research Papers with AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Navigate the cosmos of scientific knowledge with intelligent search and AI-powered summaries
          </p>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Machine Learning", "Quantum Computing", "Climate Change", "Neural Networks"].map((topic) => (
              <button
                key={topic}
                className="px-4 py-2 rounded-full bg-muted/30 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-sm transition-all hover:glow-soft"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
