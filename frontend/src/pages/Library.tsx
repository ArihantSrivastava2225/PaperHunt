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
        <div className='min-h-screen bg-white'>
            <SideBar />
            <div className='flex min-h-screen w-full flex-col items-center px-4 pb-28 pt-8 sm:px-6 lg:pb-10 lg:pl-72 lg:pr-10 lg:pt-20'>
            <section className='mt-7 w-full max-w-5xl space-y-2'>
                <h1 className='mb-6 flex items-center justify-center gap-3.5 text-center font-bold floating-animation'>
                    <IoLibraryOutline />
                    <span>Library</span>
                </h1>
                <p className='text-2xl font-semibold sm:text-3xl'>
                    Keep the story going ...
                </p>
                <p className='text-sm text-gray-600 sm:text-base'>Greater you immerse yourself in the world of literature, the more vividly you begin to live lives beyond your own</p>
            </section>

            <section className='mt-8 w-full max-w-7xl rounded-2xl bg-orange-50 !p-3 sm:!p-4'>
                <div className='flex flex-col gap-3 rounded-2xl bg-white/50 p-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex flex-wrap gap-2'>
                        <button className='!text-[#9ca3af] hover:!text-[#a16207] !bg-white hover:!bg-[#f5e8dc]' onClick={() => setLibView("shelves")}>Shelves</button>
                        <button className='!text-[#9ca3af] hover:!text-[#a16207] !bg-white hover:!bg-[#f5e8dc]' onClick={() => setLibView("allBooks")}>All Your Books</button>
                    </div>
                    <div className='flex w-full items-center rounded-xl bg-white px-3 sm:max-w-xl'>
                        <CiSearch />
                        <input
                            type="text"
                            value={searchTerm}
                            placeholder="Enter title or author of book you want to find"
                            className="w-full min-w-0 bg-transparent px-2 py-2 text-sm outline-none sm:text-base"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <section className='mt-6 w-full space-y-8'>
                    {gotSearchResult ? (
                        <>
                            {searchResults.length > 0 ? (
                                <div>
                                    <div className="text-xl font-semibold mb-3 !text-[#a16207]">Search Results</div>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
