import { useEffect, useState } from "react";

const useLibraryPapers = (trigger) => {
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const [nextUp, setNextUp] = useState([]);
    const [finished, setFinished] = useState([]);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const res = await fetch(`/api/user/library/papers`, { credentials: 'include' });
                const data = await res.json();

                //Categories books based on 'category
                const current = [];
                const upcoming = [];
                const done = [];

                data.papers.forEach((paper) => {
                    if (paper.category === "currently-reading") current.push(paper);
                    else if (paper.category === "next-up") upcoming.push(paper);
                    else if (paper.category === "finished") done.push(paper);
                })

                setCurrentlyReading(current);
                setNextUp(upcoming);
                setFinished(done);
            } catch (error) {
                console.error("Error fetching library:", error);
            }
        };

        fetchLibrary();
    }, [trigger]);

    console.log("Library Papers - Currently Reading:", currentlyReading);
    console.log("Library Papers - Next Up:", nextUp);
    console.log("Library Papers - Finished:", finished);
    return { currentlyReading, nextUp, finished };
};

export default useLibraryPapers;