import React, { useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api"; 

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2);
  const [error, setError] = useState("");

  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // apiFetch returns raw JSON
        const data = await apiFetch("/news/");

        if (!Array.isArray(data)) {
          throw new Error("Invalid news API response");
        }

        setNews(data.slice(0, 20)); // load up to 20
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load news");
      }
    };

    fetchNews();
  }, []);

  // Infinite scroll: reveal 2 more items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 2);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-96">
      <h2 className="font-semibold text-orange-700 text-lg mb-3">
        Live Financial News
      </h2>

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {!error && news.length === 0 && (
        <div className="text-gray-500 text-sm">Loading news...</div>
      )}

      <ul className="space-y-3">
        {news.slice(0, visibleCount).map((item) => (
          <li key={item.id || item.headline} className="border-b pb-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium italic text-orange-600 hover:underline"
            >
              {item.headline}
            </a>
            <div className="text-gray-500 text-xs">
              {new Date(item.datetime * 1000).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {/* invisible infinite-scroll trigger */}
      <div ref={loaderRef} className="h-6"></div>
    </div>
  );
}
