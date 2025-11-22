import React, { useEffect, useState, useRef } from "react";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // show only 3 initially
  const [error, setError] = useState("");

  const loaderRef = useRef(null);

  const API_KEY =
    import.meta.env.VITE_FINNHUB_API_KEY ||
    process.env.REACT_APP_FINNHUB_API_KEY;

  useEffect(() => {
    if (!API_KEY) {
      setError("Missing API Key. Add VITE_FINNHUB_API_KEY in .env");
      return;
    }

    fetch(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Invalid API response");
          return;
        }
        setNews(data.slice(0, 20)); // load 20 but display 3
      })
      .catch(() => setError("Failed to load news."));
  }, [API_KEY]);

  // Auto-load more news when reaching bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 2); // load 2 more
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-96">
      <h2 className="font-semibold text-orange-700 text-lg mb-3">Live Financial News</h2>

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {news.length === 0 && !error && (
        <div className="text-gray-500 text-sm">Loading news...</div>
      )}

      <ul className="space-y-3">
        {news.slice(0, visibleCount).map((item, index) => (
          <li key={index} className="border-b pb-2">
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

      {/* invisible trigger for infinite scroll */}
      <div ref={loaderRef} className="h-6"></div>
    </div>
  );
}
