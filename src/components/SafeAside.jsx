// src/components/SafeAside.jsx
import React, { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { apiFetch } from "../lib/api";
import { Sparklines, SparklinesLine } from "react-sparklines";

// Logos
const LOGOS = {
  GOOGL: "/logos/google.jpg",
  AMZN: "/logos/amzn.jpg",
  AAPL: "/logos/aapl.jpg",
  TSLA: "/logos/tsla.jpg",
  MSFT: "/logos/msft.jpg",
  "RELIANCE.NS": "/logos/reliance.jpg",
  "TCS.NS": "/logos/tcs.jpg",
  "HDFCBANK.NS": "/logos/hdfc.jpg",
  "BTC-USD": "/logos/btc.jpg",
  "ETH-USD": "/logos/eth.jpg",
};

// Symbol mapping for backend
const mapSymbol = (s) => {
  if (s === "RELIANCE") return "RELIANCE.NS";
  if (s === "TCS") return "TCS.NS";
  if (s === "HDFC") return "HDFCBANK.NS";
  return s;
};

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";

export default function SafeAside({ wsUrl, stockSymbols = [] }) {
  const { connected, messages } = useWebSocket(wsUrl);
  const [stocks, setStocks] = useState(
    stockSymbols.map((s) => ({
      symbol: s,
      price: null,
      change: null,
      percent: null,
      spark: [],
    }))
  );
  const [profitInput, setProfitInput] = useState({});
  const [news, setNews] = useState([]);
  const [newsVisible, setNewsVisible] = useState(2);
  const loaderRef = useRef(null);

  // ----------------- WebSocket stock updates -----------------
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const latest = messages[messages.length - 1];

    // Expect backend message: { symbol, price, change, percent, spark }
    if (latest.symbol && latest.price != null) {
      setStocks((prev) =>
        prev.map((s) =>
          s.symbol === latest.symbol
            ? { ...s, ...latest }
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

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {stocks.map((stock) => {
            const up = stock.change > 0;
            const logo = LOGOS[mapSymbol(stock.symbol)] || "/logos/default.jpg";

            return (
              <div key={stock.symbol} className="flex items-center justify-between p-2 border-b last:border-none">
                <img src={logo} alt={stock.symbol} className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-sm">
                    <span className="font-bold">₹{stock.price?.toFixed(2) ?? "..."}</span>
                    {stock.change != null && (
                      <span className={`ml-2 ${up ? "text-green-500" : "text-red-500"}`}>
                        {up ? "▲" : "▼"} {stock.percent?.toFixed(2) ?? 0}%
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-16 text-black p-1 rounded text-xs"
                      value={profitInput[stock.symbol] || ""}
                      onChange={(e) =>
                        setProfitInput((prev) => ({
                          ...prev,
                          [stock.symbol]: e.target.value,
                        }))
                      }
                    />
                    {profitInput[stock.symbol] && (
                      <div className="text-xs">
                        💰 P/L:{" "}
                        <span className={up ? "text-green-400" : "text-red-400"}>
                          {(profitInput[stock.symbol] * stock.change).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-28 h-10">
                  <Sparklines data={stock.spark || []}>
                    <SparklinesLine
                      color={up ? "green" : "red"}
                      style={{ fill: "none", strokeWidth: 2 }}
                    />
                  </Sparklines>
                </div>
              </div>
            );
          })}
        </div>
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
