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
      <div className="p-6 bg-white shadow rounded-lg text-center text-gray-500">
        Fetching latest research updates...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Latest Research Highlights
      </h2>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-md hover:bg-gray-50 transition border border-gray-100"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-blue-600 hover:underline"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-700 mt-1">
              {item.description?.slice(0, 150)}...
            </p>
            <div className="text-xs text-gray-500 mt-2 flex justify-between">
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
