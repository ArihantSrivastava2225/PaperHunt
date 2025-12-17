import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, BookOpen } from "lucide-react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
}

interface AISummaryModalProps {
  paper: Paper | null;
  onClose: () => void;
}

const relatedPapers = [
  "GPT-3: Language Models are Few-Shot Learners",
  "ResNet: Deep Residual Learning for Image Recognition",
  "AlphaGo: Mastering the Game of Go with Deep Neural Networks",
];

const AISummaryModal = ({ paper, onClose }: AISummaryModalProps) => {
  useEffect(() => {
    if (paper) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [paper]);

  if (!paper) return null;

  return (
    <Dialog open={!!paper} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto holographic-border bg-card/95 backdrop-blur-xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-glow-cyan pr-8">
            {paper.title}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-2">
            <span>{paper.authors.join(", ")}</span>
            <span>•</span>
            <span>{paper.year}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* AI Summary Section */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-glow-purple">
                AI-Generated Summary
              </h3>
            </div>
            <p className="text-foreground/90 leading-relaxed">
              This groundbreaking paper introduces a novel approach that revolutionizes the field. 
              The authors present compelling evidence through rigorous experimentation and demonstrate 
              significant improvements over existing methods. Key innovations include advanced 
              architectural designs and optimization techniques that achieve state-of-the-art results 
              across multiple benchmarks.
            </p>
          </div>

          {/* Key Points */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Key Points
            </h3>
            <ul className="space-y-3">
              {[
                "Introduces innovative methodology with significant performance gains",
                "Comprehensive evaluation on standard benchmarks",
                "Novel approach to addressing existing limitations",
                "Practical applications across multiple domains"
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Papers */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-heading font-semibold mb-4">
              Related Papers
            </h3>
            <div className="space-y-3">
              {relatedPapers.map((title, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">
                      {title}
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground font-heading glow-cyan transition-all"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Paper
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-border hover:bg-muted/50"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISummaryModal;
