import { useEffect, useState } from "react";
import Modal from "react-modal";
import Spinner from "@/components/Spinner";
import { Copy, X, Check } from "lucide-react";

// Accessibility (React Modal requirement)
Modal.setAppElement("#root");

interface AISummaryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  summary?: string;
  loading?: boolean;
}

const AISummaryModal: React.FC<AISummaryModalProps> = ({
  isOpen = false,
  onClose = () => { },
  title = "AI Summary",
  summary = "",
  loading = false,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(isOpen);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/modal/close`, {
        method: "PUT",
      });
      console.log("Modal closed");
    } catch (error) {
      console.error("Error closing modal:", error);
    }
    setModalOpen(false);
    onClose?.();
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={handleClose}
      contentLabel="AI Summary"
      className="outline-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Research Summary
          </h2>
          <p className="text-sm text-gray-500 mt-1 truncate max-w-2xl font-medium">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && summary && (
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-full transition-colors tooltip"
              title="Copy Summary"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-white/50 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Spinner />
            <p className="text-gray-500 animate-pulse">Generating concise summary...</p>
          </div>
        ) : (
          <div className="prose prose-blue max-w-none">
            {summary ? (
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {summary}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                <p>No summary available for this paper.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
          onClick={handleClose}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transform hover:scale-[1.02] transition-all font-medium shadow-lg shadow-gray-200"
        >
          Close Preview
        </button>
      </div>
    </Modal>
  );
};

export default AISummaryModal;
