import { useEffect, useState, useRef } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

const LOGOS = {
GOOGL: "/logos/google.jpg",
AMZN: "/logos/amzn.jpg",
AAPL: "/logos/aapl.jpg",
TSLA: "/logos/tsla.jpg",
MSFT: "/logos/msft.jpg",
"BTC-USD": "/logos/btc.jpg",
"ETH-USD": "/logos/eth.jpg",
"RELIANCE.NS": "/logos/reliance.jpg",
"TCS.NS": "/logos/tcs.jpg",
"HDFCBANK.NS": "/logos/hdfc.jpg",
};

export default function MultiStockWidget({ symbols = [] }) {
const [data, setData] = useState({});
const [profitInput, setProfitInput] = useState({});
const [dark, setDark] = useState(() => {
const saved = localStorage.getItem("multi-widget-dark");
return saved ? JSON.parse(saved) : false;
});

const containerRef = useRef(null);
const cardHeight = 92;
const visibleCount = 4;

const convert = (s) => {
if (s.startsWith("NSE:")) return s.replace("NSE:", "") + ".NS";
if (s.includes("USD")) return s.replace("USD", "-USD");
return s;
};

const fetchStock = async (symbol) => {
try {
const sym = convert(symbol);
const res = await fetch(`http://localhost:5000/api/stock/${sym}`);
const json = await res.json();

  if (!json.chart?.result) return null;

  const result = json.chart.result[0];
  const prices = result.indicators.quote[0].close;

  const last = prices.at(-1);
  const prev = prices.at(-2);
  const change = last - prev;

  return {
    symbol: sym,
    price: last,
    change,
    percent: ((change / prev) * 100).toFixed(2),
    spark: prices.slice(-20),
  };
} catch (err) {
  console.warn("Failed loading stock:", symbol);
  return null;
}

};

const loadAll = async () => {
const results = await Promise.all(symbols.map(fetchStock));
const mapped = {};
symbols.forEach((s, i) => (mapped[s] = results[i]));
setData(mapped);
};

useEffect(() => {
loadAll();
const interval = setInterval(loadAll, 10000);
return () => clearInterval(interval);
}, [symbols]);

useEffect(() => {
localStorage.setItem("multi-widget-dark", JSON.stringify(dark));
}, [dark]);

return (
<div
className={`p-4 rounded-xl shadow transition ${
        dark ? "bg-black text-orange-400" : "bg-white text-orange-500"
      }`}
>
{/* Header */} <div className="flex justify-between items-center mb-3"> <h2 className="font-bold text-lg">📈 Live Market Updates</h2>

```
    <button
      onClick={() => setDark((prev) => !prev)}
      className="px-3 py-1 text-sm rounded bg-gray-300 text-black hover:bg-gray-400 transition"
    >
      {dark ? "Light" : "Dark"}
    </button>
  </div>

  {/* Scrollable Stock List */}
  <div
    ref={containerRef}
    className="overflow-y-auto"
    style={{ maxHeight: `${cardHeight * visibleCount}px` }}
  >
    {symbols.map((symbol) => {
      const stock = data[symbol];

      if (!stock)
        return (
          <div
            key={symbol}
            className="p-3 flex items-center gap-4 animate-pulse border-b last:border-none"
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-3 w-36 bg-gray-300 rounded"></div>
            </div>
            <div className="w-28 h-10 bg-gray-300 rounded"></div>
          </div>
        );

      const up = stock.change > 0;

      return (
        <div
          key={symbol}
          className="p-3 flex items-center justify-between border-b last:border-none animate-[fadeIn_0.3s]"
        >
          {/* Logo */}
          <img
            src={LOGOS[stock.symbol]}
            alt=""
            className="w-10 h-10 rounded-full mr-3 shadow"
          />

          {/* Details */}
          <div className="flex-1">
            <div className="font-semibold">{stock.symbol}</div>

            <div className="text-sm">
              <span className="font-bold">${stock.price.toFixed(2)}</span>
              <span
                className={`ml-2 font-medium ${
                  up ? "text-green-500" : "text-red-500"
                } animate-pulse`}
              >
                {up ? "▲" : "▼"} {stock.percent}%
              </span>
            </div>

            {/* Profit Calculator */}
            <div className="mt-1 flex gap-2 items-center">
              <input
                type="number"
                placeholder="Qty"
                className="w-16 text-black p-1 rounded text-xs"
                onChange={(e) =>
                  setProfitInput({
                    ...profitInput,
                    [symbol]: e.target.value,
                  })
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

          {/* Sparkline */}
          <div className="w-28 h-10 ml-3">
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
