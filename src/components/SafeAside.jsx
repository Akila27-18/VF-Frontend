// src/components/SafeAside.jsx
import React, { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { apiFetch } from "../lib/api";

export default function SafeAside({ wsUrl, stockSymbols = [] }) {
  const { connected, messages } = useWebSocket(wsUrl);

  const [stocks, setStocks] = useState(
    stockSymbols.map((s) => ({ symbol: s, price: null, change: null }))
  );
  const [news, setNews] = useState([]);
  const [newsVisible, setNewsVisible] = useState(2);
  const loaderRef = useRef(null);

  // ----------------- Stock updates -----------------
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const latest = messages[messages.length - 1];
    if (latest.symbol && latest.price) {
      setStocks((prev) =>
        prev.map((s) =>
          s.symbol === latest.symbol
            ? { ...s, price: latest.price, change: latest.change }
            : s
        )
      );
    }
  }, [messages]);

  // ----------------- Fetch news -----------------
  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await apiFetch("/news/");
        if (Array.isArray(data)) setNews(data.slice(0, 20));
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    }
    fetchNews();
  }, []);

  // ----------------- Infinite scroll for news -----------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setNewsVisible((v) => v + 2);
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Stocks */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-orange-700">Live Market Updates</h2>
          <div className={`text-xs ${connected ? "text-green-600" : "text-red-500"}`}>
            {connected ? "Live" : "Offline"}
          </div>
        </div>
        <ul className="space-y-2">
          {stocks.map((s) => (
            <li key={s.symbol} className="flex justify-between text-sm">
              <span>{s.symbol}</span>
              <span>
                {s.price !== null ? `₹${s.price.toFixed(2)}` : "Loading..."}{" "}
                {s.change !== null && (
                  <span
                    className={`ml-1 ${
                      s.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ({s.change >= 0 ? "+" : ""}
                    {s.change.toFixed(2)})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Financial News */}
      <div className="bg-white rounded-xl shadow p-4 max-h-96 overflow-auto">
        <h2 className="font-semibold text-orange-700 mb-2">Live Financial News</h2>

        {news.length === 0 && <div className="text-gray-500 text-sm">Loading news...</div>}

        <ul className="space-y-2">
          {news.slice(0, newsVisible).map((item, idx) => (
            <li key={item.id || idx} className="border-b pb-1">
              <a
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm italic text-orange-600 hover:underline"
              >
                {item.title || item.headline}
              </a>
              {item.datetime && (
                <div className="text-gray-500 text-xs">
                  {new Date(item.datetime * 1000).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div ref={loaderRef} className="h-4"></div>
      </div>
    </div>
  );
}
