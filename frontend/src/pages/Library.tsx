import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { IoLibraryOutline } from 'react-icons/io5';
import ShelfSection from '@/components/LibraryComps/ShelfSection';
import AllPapersSection from '@/components/LibraryComps/AllPapersSection';
import PaperLibCard from '@/components/LibraryComps/PaperLibCard';
import useLibraryPapers from '@/hooks/papersLib.js';
import SideBar from '../components/SideBar'

const Library = () => {
    const [libView, setLibView] = useState('shelves');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [gotSearchResult, setGotSearchResult] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async() => {
            if(searchTerm.trim() !== ""){
                try{
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/book/search`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ searchTerm: searchTerm.trim() }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        setGotSearchResult(true);
                        setSearchResults(data.data);
                    } else {
                        setGotSearchResult(false);
                        setSearchResults([]);
                    }
                }catch(error){
                    // console.error("Search error:", error);
                    setGotSearchResult(false);
                    setSearchResults([]);
                }
            }else{
                // Clear search results if empty input
                setGotSearchResult(false);
                setSearchResults([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const { currentlyReading, nextUp, finished } = useLibraryPapers(reloadTrigger);

    const onPaperChange = () => {
        setReloadTrigger(prev => !prev);  //toggles to trigger useEffect
    }

    return (
        <div className='flex'>
            <SideBar />
            <div className='flex flex-col justify-center items-center bg-white/10 w-full min-h-screen ml-14 pt-20 pb-10'>
            <section className='w-[80%] space-y-2 mt-7'>
                <h1 className='mb-6 font-bold floating-animation flex gap-3.5 justify-center items-center'>
                    <IoLibraryOutline />
                    <span>Library</span>
                </h1>
                <p className='font-semibold text-2xl'>
                    Keep the story going ...
                </p>
                <p className=''>Greater you immerse yourself in the world of literature, the more vividly you begin to live lives beyond your own</p>
            </section>

            <section className='w-[94%] bg-orange-50 rounded-2xl !p-4'>
                <div className='flex justify-between items-center bg-white/50 rounded-2xl'>
                    <div>
                        <button className='!text-[#9ca3af] hover:!text-[#a16207] !bg-white hover:!bg-[#f5e8dc]' onClick={() => setLibView("shelves")}>Shelves</button>
                        <button className='!text-[#9ca3af] hover:!text-[#a16207] !bg-white hover:!bg-[#f5e8dc]' onClick={() => setLibView("allBooks")}>All Your Books</button>
                    </div>
                    <div className='flex justify-center items-center w-1/2'>
                        <CiSearch />
                        <input
                            type="text"
                            value={searchTerm}
                            placeholder="Enter title or author of book you want to find"
                            className="w-full"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <section className='w-[94%] h-[900px] grid grid-cols-1 grid-rows-3 gap-4'>
                    {gotSearchResult ? (
                        <>
                            {searchResults.length > 0 ? (
                                <div>
                                    <div className="text-xl font-semibold mb-3 !text-[#a16207]">Search Results</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {searchResults.map((paper, index) => (
                                            <PaperLibCard key={index} paper={paper} onPaperChange={onPaperChange} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p>No Results</p>
                            )}
                        </>
                    ) : (
                        <>
                        </>
                    )}
                    {libView === "shelves" ? (
                        <>
                            <ShelfSection title="Currently reading" papers={currentlyReading} onPaperChange={onPaperChange} />
                            <ShelfSection title="Next up" papers={nextUp} onPaperChange={onPaperChange} />
                            <ShelfSection title="Finished" papers={finished} onPaperChange={onPaperChange} />
                        </>
                    ) : (
                        <AllPapersSection />
                    )}
                </section>
            </section>
        </div>
        </div>
    )
}

export default Library
