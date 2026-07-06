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
      className="absolute left-1/2 top-1/2 flex h-[85vh] w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl outline-none"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 bg-gray-50/50 p-4 sm:p-6">
        <div className="min-w-0">
          <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
            AI Research Summary
          </h2>
          <p className="mt-1 max-w-2xl truncate text-sm font-medium text-gray-500">
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
      <div className="flex-1 space-y-4 overflow-y-auto bg-white/50 p-4 sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Spinner />
            <p className="text-gray-500 animate-pulse">Generating concise summary...</p>
          </div>
        ) : (
          <div className="prose prose-blue max-w-none">
            {summary ? (
              <div className="whitespace-pre-line text-base leading-relaxed text-gray-700 sm:text-lg">
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
      <div className="flex justify-end border-t border-gray-100 bg-gray-50 p-4">
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
