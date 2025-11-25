// src/components/NewsFeed.jsx
import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

export default function NewsFeed({ wsUrl }) {
  const { connected, messages } = useWebSocket(wsUrl);
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2);
  const loaderRef = useRef(null);

  // ----------------- Update news from WebSocket -----------------
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const latest = messages[messages.length - 1];
    if (latest.type === "news_update" && Array.isArray(latest.data)) {
      setNews(latest.data.slice(0, 20));
    }
  }, [messages]);

  // ----------------- Infinite scroll -----------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((prev) => prev + 2);
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-96">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold text-orange-700 text-lg">Live Financial News</h2>
        <span className={`text-xs ${connected ? "text-green-600" : "text-red-500"}`}>
          {connected ? "Live" : "Offline"}
        </span>
      </div>

      {news.length === 0 && (
        <div className="text-gray-500 text-sm">Loading news...</div>
      )}

      <ul className="space-y-3">
        {news.slice(0, visibleCount).map((item) => (
          <li key={item.id} className="border-b pb-2">
            <div className="font-medium italic text-orange-600">{item.title}</div>
            <div className="text-gray-500 text-xs">{item.summary}</div>
          </li>
        ))}
      </ul>

      <div ref={loaderRef} className="h-6"></div>
    </div>
  );
}
