import { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

// Stock logos
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

// Map frontend symbols to backend-compatible symbols
const mapSymbol = (s) => {
  if (s === "RELIANCE") return "RELIANCE.NS";
  if (s === "TCS") return "TCS.NS";
  if (s === "HDFC") return "HDFCBANK.NS";
  return s;
};

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";

export default function MultiStockWidget({ symbols }) {
  const [stocks, setStocks] = useState({});
  const [profitInput, setProfitInput] = useState({});

  const fetchStock = async (symbol) => {
    const backendSymbol = mapSymbol(symbol);

    try {
      const res = await fetch(`${API_URL}/api/stock/${backendSymbol}`);
      const json = await res.json();

      if (!json) return null;

      return {
        uiSymbol: symbol,           // frontend label
        backendSymbol: backendSymbol,
        price: Number(json.price ?? 0),
        change: Number(json.change ?? 0),
        percent: Number(json.percent ?? 0),
        spark: Array.isArray(json.spark) ? json.spark : [],
      };
    } catch (err) {
      console.error("Failed to fetch stock:", backendSymbol, err);
      return null;
    }
  };

  const loadAll = async () => {
    const results = await Promise.all(symbols.map((s) => fetchStock(s)));
    const mapped = {};

    symbols.forEach((s, i) => {
      mapped[s] = results[i];
    });

    setStocks(mapped);
  };

  useEffect(() => {
    // Stable effect: JSON.stringify avoids unnecessary refetch
    loadAll();
    const interval = setInterval(loadAll, 10000);
    return () => clearInterval(interval);
  }, [JSON.stringify(symbols)]);

  return (
    <div className="p-4 rounded-xl shadow bg-white text-orange-500">
      <h2 className="font-bold text-lg mb-3">📈 Live Market Updates</h2>

      <div className="overflow-y-auto max-h-[250px]">
        {symbols.map((symbol) => {
          const stock = stocks[symbol];

          if (!stock) {
            return (
              <div key={symbol} className="py-2 text-gray-500">
                Loading {symbol}...
              </div>
            );
          }

          const up = stock.change > 0;
          const logo =
            LOGOS[stock.backendSymbol] ||
            LOGOS[stock.uiSymbol] ||
            "/logos/default.jpg";

          return (
            <div
              key={symbol}
              className="p-2 flex justify-between items-center border-b last:border-none"
            >
              <img
                src={logo}
                alt={symbol}
                className="w-10 h-10 rounded-full mr-3"
              />

              <div className="flex-1">
                <div className="font-semibold">{symbol}</div>

                <div className="text-sm">
                  <span className="font-bold">
                    ${stock.price.toFixed(2)}
                  </span>
                  <span className={`ml-2 ${up ? "text-green-500" : "text-red-500"}`}>
                    {up ? "▲" : "▼"} {stock.percent.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-1 flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="w-16 text-black p-1 rounded text-xs"
                    value={profitInput[symbol] || ""}
                    onChange={(e) =>
                      setProfitInput((prev) => ({
                        ...prev,
                        [symbol]: e.target.value,
                      }))
                    }
                  />

                  {profitInput[symbol] && (
                    <div className="text-xs">
                      💰 P/L:{" "}
                      <span className={up ? "text-green-400" : "text-red-400"}>
                        {(profitInput[symbol] * stock.change).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-28 h-10">
                <Sparklines data={stock.spark}>
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
  );
}
