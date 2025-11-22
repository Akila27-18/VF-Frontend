// frontend/src/components/dashboard/MultiStockWidget.jsx
import { useEffect, useState, useRef } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

// Stock logos (public folder /public/logos/)
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

function MultiStockWidget({ symbols }) {
  const [data, setData] = useState({});
  const [profitInput, setProfitInput] = useState({});
  const containerRef = useRef(null);

  const fetchStock = async (symbol) => {
    const backendSymbol = mapSymbol(symbol);
    try {
      const res = await fetch(`http://localhost:5000/api/stock/${backendSymbol}`);
      const json = await res.json();
      console.log("Stock fetched:", backendSymbol, json);

      if (!json) return null;

      // Use backend mock structure
      return {
        symbol: backendSymbol,
        price: json.price,
        change: json.change,
        percent: json.percent,
        spark: json.spark,
      };
    } catch (err) {
      console.error("Failed to fetch stock", backendSymbol, err);
      return null;
    }
  };

  const loadAll = async () => {
    const output = {};
    for (const s of symbols) {
      output[s] = await fetchStock(s);
    }
    setData(output);
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 rounded-xl shadow bg-white text-orange-500">
      <h2 className="font-bold text-lg mb-3">📈 Live Market Updates</h2>

      <div ref={containerRef} className="overflow-y-auto max-h-[250px]">
        {symbols.map((symbol) => {
          const stock = data[symbol];
          if (!stock) return <div key={symbol}>Loading {symbol}...</div>;

          const up = stock.change > 0;

          return (
            <div key={symbol} className="p-2 flex justify-between border-b last:border-none">
              <img src={LOGOS[stock.symbol]} alt={symbol} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="font-semibold">{symbol}</div>
                <div className="text-sm">
                  <span className="font-bold">${stock.price.toFixed(2)}</span>
                  <span className={`ml-2 ${up ? "text-green-500" : "text-red-500"}`}>
                    {up ? "▲" : "▼"} {stock.percent}%
                  </span>
                </div>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="w-16 text-black p-1 rounded text-xs"
                    onChange={(e) =>
                      setProfitInput({ ...profitInput, [symbol]: e.target.value })
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
                  <SparklinesLine color={up ? "green" : "red"} style={{ fill: "none", strokeWidth: 2 }} />
                </Sparklines>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MultiStockWidget;
