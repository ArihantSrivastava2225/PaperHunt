import { useEffect, useState } from "react";
import LibPaperModal from "./LibPaperModal";
import Spinner from "../Spinner";

const PaperLibCard = ({ paper, onPaperChange }) => {
  const [isLibPaperModalOpen, setIsLibPaperModalOpen] = useState(false);
  const openLibModal = () => setIsLibPaperModalOpen(true);
  const closeLibModal = () => setIsLibPaperModalOpen(false);

  return (
    <div onClick={openLibModal} className="group relative w-28 h-40 rounded-md text-black bg-white shadow-2xl transform transition-all duration-300 min-w-[100px] hover:scale-105 hover:rotate-[-1deg] hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
      <div className="bg-red-500 w-21 h-40 overflow-x-hidden flex flex-col flex-wrap text-wrap justify-start items-center p-2 space-y-2">
        {paper ? (
          <>
            <p className="font-semibold">{paper.title}</p>
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
