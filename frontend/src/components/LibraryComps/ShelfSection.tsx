import { useState, useEffect } from "react";
import PaperLibCard from "./PaperLibCard";
import Spinner from "../Spinner";

const ShelfSection = ({ title, papers, onPaperChange }) => {
  const [showSpinner, setShowSpinner] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="!my-8 h-[30%] w-[96%]">
      <div className="text-xl font-semibold mb-3 !text-[#a16207]">{title}</div>

      {papers.length>0 ? (
        <div className="flex items-end space-x-4 !px-2 pt-2 overflow-x-auto hide-scrollbar">
        {papers.map((paper, idx) => (
          <PaperLibCard key={idx} paper={paper} onPaperChange={onPaperChange} />
        ))}
      </div>
      ) : (
        <>
      {showSpinner ? (
        <Spinner />
      ) : (
        <>
          <div className="h-40" />
        </>
      )}
    </>
      )}

      <div className="bg-amber-800 h-4 w-full rounded-t-md"></div> Shelf base
    </div>
  );
};

export default ShelfSection;
