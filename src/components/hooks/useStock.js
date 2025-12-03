import { useState, useEffect } from "react";
import API from "./api";

export function useStock(symbols = ["AAPL", "TSLA", "MSFT"]) {
  const [stocks, setStocks] = useState({});

  const fetchStocks = async () => {
    const newStocks = {};
    for (const sym of symbols) {
      try {
        const res = await API.get(`/stock/${sym}`);
        newStocks[sym] = res.data;
      } catch (err) {
        console.error(`Error fetching ${sym}`, err);
      }
    }
    setStocks(newStocks);
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 10000);
    return () => clearInterval(interval);
  }, [symbols]);

  return stocks;
}
