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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
      <h2 className="break-words text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600 sm:text-xl">
        {title}
      </h2>
      {authors && (
        <p className="mt-1 break-words text-sm text-gray-600">
          {Array.isArray(authors) ? authors.join(", ") : authors}
        </p>
      )}
      {doi && (
        <p className="mt-1 break-all text-xs text-gray-400">
          DOI: <a href={doi} target="_blank" className="text-gray-500">{doi}</a>
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {pdfLink && (
          <a
            href={pdfLink}
            target="_blank"
            rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <FileText className="h-4 w-4" /> View PDF
          </a>
        )}
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-lg border-blue-400 text-blue-600 hover:bg-blue-50 sm:w-auto"
          onClick={handleAISummary}
        >
          <ExternalLink className="h-4 w-4 mr-1" /> AI Summary
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-lg border-blue-400 text-blue-600 hover:bg-blue-50 sm:w-auto"
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
