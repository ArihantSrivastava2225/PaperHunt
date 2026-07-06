import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PaperCard from '@/components/PaperCard';
import Spinner from '@/components/Spinner';
import SideBar from '@/components/SideBar';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`, { credentials: 'include' }
      );
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.results);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Updated searchResults : ', searchResults);
    setLoading(false);
  }, [searchResults]);

  return (
    <div className="flex">
      <SideBar />

      <main className="flex-1 ml-64 min-h-screen bg-gradient-to-b from-slate-50 to-white p-10">
        {/* Search bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-center bg-white p-3 rounded-2xl shadow-md border border-gray-200">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search research papers, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 h-12 border-none focus:ring-0 bg-transparent text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-8 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg hover:shadow-blue-300/50 transition-all"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-5xl mx-auto mt-12 px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid gap-6">
              {searchResults.map((paper) => (
                <PaperCard key={paper.doi} {...paper} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-24 text-lg">
              Start exploring by searching research papers.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Discover
