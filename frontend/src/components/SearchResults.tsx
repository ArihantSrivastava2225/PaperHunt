import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Sparkles } from "lucide-react";
import AISummaryModal from "./AISummaryModal";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
}

const mockPapers: Paper[] = [
  {
    id: "1",
    title: "Attention Is All You Need: Transformer Architecture for Neural Machine Translation",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year: 2017,
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
  },
  {
    id: "2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee"],
    year: 2018,
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...",
  },
  {
    id: "3",
    title: "Generative Adversarial Networks for Image Synthesis and Style Transfer",
    authors: ["Ian Goodfellow", "Jean Pouget-Abadie", "Mehdi Mirza"],
    year: 2014,
    abstract: "We propose a new framework for estimating generative models via an adversarial process...",
  },
];

const SearchResults = () => {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  return (
    <>
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-glow-cyan">
              Recent Discoveries
            </h2>
            <p className="text-muted-foreground">
              Explore groundbreaking research papers from the scientific cosmos
            </p>
          </div>

          <div className="grid gap-6">
            {mockPapers.map((paper, index) => (
              <div
                key={paper.id}
                className="glass-card rounded-2xl p-6 hover:glow-soft transition-all duration-300 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-heading font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {paper.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <span>{paper.authors.join(", ")}</span>
                      <span>•</span>
                      <span>{paper.year}</span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {paper.abstract}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => setSelectedPaper(paper)}
                        variant="outline"
                        className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Summary
                      </Button>
                      <Button
                        variant="outline"
                        className="border-border hover:bg-muted/50 transition-all"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AISummaryModal
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
      />
    </>
  );
};

export default SearchResults;
