import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import SideBar from "@/components/SideBar";
import ResearchNewsSection from "@/components/HotsComps/ResearchNewsSection";
import { toast } from "sonner";

interface NewsItem {
    url: string;
    image?: string;
    title: string;
    description?: string;
    source: string;
    publishedAt: string;
}

const Hots: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("/api/hots/news");
                const data = await res.json();
                if (data.success) {
                    setNews(data.news);
                    toast.success("Latest news fetched!");
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                toast.error("Failed to fetch news.");
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <SideBar />

            <div className="min-h-screen w-full overflow-y-auto px-4 pb-28 pt-8 sm:px-6 lg:py-8 lg:pl-72 lg:pr-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🔥 Hots</h1>
                            <p className="text-gray-500 mt-1">Trending research news and highlights.</p>
                        </div>
                    </div>

                    {/* 🔬 Latest Research News Section */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 Latest Research News</h2>
                        {loading && news.length === 0 ? (
                            <div className="flex justify-center p-8">
                                <Spinner />
                            </div>
                        ) : news.length === 0 ? (
                            <p className="text-gray-500">No news available at the moment.</p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {news.map((n, index) => (
                                    <a
                                        key={index}
                                        href={n.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col h-full border border-gray-100"
                                    >
                                        {n.image && (
                                            <div className="h-48 mb-4 overflow-hidden rounded-xl bg-gray-100">
                                                <img
                                                    src={n.image}
                                                    alt={n.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                        )}
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{n.title}</h3>
                                        <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">
                                            {n.description || "No description available."}
                                        </p>
                                        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs font-medium text-gray-500">
                                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md">{n.source}</span>
                                            <span>{new Date(n.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Academic Research Section  */}
                    <div className="mt-12">
                        <ResearchNewsSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hots;
