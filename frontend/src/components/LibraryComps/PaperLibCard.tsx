import { useEffect, useState } from "react";
import LibPaperModal from "./LibPaperModal";
import Spinner from "../Spinner";

const PaperLibCard = ({ paper, onPaperChange }) => {
  const [isLibPaperModalOpen, setIsLibPaperModalOpen] = useState(false);
  const openLibModal = () => setIsLibPaperModalOpen(true);
  const closeLibModal = () => setIsLibPaperModalOpen(false);

  return (
    <div onClick={openLibModal} className="group relative h-40 w-28 min-w-[7rem] cursor-pointer rounded-md bg-white text-black shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-[-1deg] hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)]">
      <div className="flex h-40 w-full flex-col items-center justify-start space-y-2 overflow-hidden bg-red-500 p-2 text-center">
        {paper ? (
          <>
            <p className="line-clamp-6 break-words text-xs font-semibold leading-tight">{paper.title}</p>
            {/* <p>{paper.authors.join(", ")}</p> */}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition duration-300 rounded-md" />
      <LibPaperModal isOpen={isLibPaperModalOpen} onClose={closeLibModal} paper={paper} onPaperChange={onPaperChange} />
    </div>
  )
}

export default PaperLibCard
