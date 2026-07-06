import React, { useEffect, useState } from "react";

type ResearchNewsItem = {
  title: string;
  link: string;
  description?: string;
  source?: string;
  pubDate: string;
};

const ResearchNewsSection: React.FC = () => {
  const [news, setNews] = useState<ResearchNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/hots/academic-research-news");
        const data = await res.json();
        if (data.success) setNews(data.results);
      } catch (error) {
        console.error("Error fetching research news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-4 text-center text-gray-500 shadow sm:p-6">
        Fetching latest research updates...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-md sm:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Latest Research Highlights
      </h2>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-gray-100 p-4 transition hover:bg-gray-50"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            className="break-words text-lg font-medium text-blue-600 hover:underline"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-700 mt-1">
              {item.description?.slice(0, 150)}...
            </p>
            <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:justify-between">
              <span>{item.source}</span>
              <span>{new Date(item.pubDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchNewsSection;
