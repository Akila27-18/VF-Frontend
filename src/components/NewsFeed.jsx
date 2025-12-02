import React, { useEffect, useState } from "react";
import API from "../lib/api"; // axios instance pointing to your backend

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get("/news"); // your backend route
        if (!Array.isArray(res.data)) throw new Error("Invalid API response");
        setNews(res.data.slice(0, 4)); // first 4 news
      } catch (err) {
        console.error(err);
        setError("Failed to load news.");
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold text-lg mb-3">Live Financial News</h2>

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {news.length === 0 && !error && <div className="text-gray-500 text-sm">Loading news...</div>}

      <ul className="space-y-3">
        {news.map((item, index) => (
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
    </div>
  );
}
