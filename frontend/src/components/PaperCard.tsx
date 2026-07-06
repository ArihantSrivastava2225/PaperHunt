import { useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import AISummaryModal from "../components/AISummary/AISummaryModal";
import AddPaperModal from "./LibraryComps/AddPaperModal";

const PaperCard = ({ title, doi, authors, pdfLink }) => {
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [cached, setCached] = useState(false);
  const [isAISummaryModalOpen, setIsAISummaryModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openAISummaryModal = () => setIsAISummaryModalOpen(true);
  const closeAISummaryModal = () => setIsAISummaryModalOpen(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAISummary = async () => {
    openAISummaryModal();
    setCached(false);
    setLoading(true);
    const res = await fetch('/api/summary', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, authors, pdfLink }),
    })
    const data = await res.json();
    if (res.ok) {
      setAiSummary(data.summary);
      console.log(data.summary);
      if (data.cached) {
        setCached(true);
        setLoading(false);
      }
    } else {
      console.error(data.error);
    }
  }

  useEffect(() => {
    setLoading(false);
    console.log('AI Summary : ', aiSummary);
  }, [aiSummary]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
        {title}
      </h2>
      {authors && (
        <p className="text-gray-600 text-sm mt-1">
          {Array.isArray(authors) ? authors.join(", ") : authors}
        </p>
      )}
      {doi && (
        <p className="text-gray-400 text-xs mt-1">
          DOI: <a href={doi} target="_blank" className="text-gray-500">{doi}</a>
        </p>
      )}

      <div className="flex items-center gap-3 mt-4">
        {pdfLink && (
          <a
            href={pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
          >
            <FileText className="h-4 w-4" /> View PDF
          </a>
        )}
        <Button
          size="sm"
          variant="outline"
          className="text-blue-600 border-blue-400 hover:bg-blue-50 rounded-lg"
          onClick={handleAISummary}
        >
          <ExternalLink className="h-4 w-4 mr-1" /> AI Summary
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="text-blue-600 border-blue-400 hover:bg-blue-50 rounded-lg"
          onClick={openModal}
        >
          <ExternalLink className="h-4 w-4 mr-1" /> Add to Library
        </Button>

        <AISummaryModal isOpen={isAISummaryModalOpen} onClose={closeAISummaryModal} title={title} summary={aiSummary} loading={loading} />
        <AddPaperModal isOpen={isModalOpen} onClose={closeModal} paper={{ title, authors, doi, pdfLink }} />
      </div>
    </div>
  );
};

export default PaperCard;
