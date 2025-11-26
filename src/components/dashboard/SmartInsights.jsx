// src/components/dashboard/SmartInsights.jsx
import React, { useMemo, useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import WeeklyTrend from "./WeeklyTrend";
import Timeline from "./Timeline";
import { useWebSocket } from "../../hooks/useWebSocket";
import { WS_DASHBOARD } from "../../lib/ws";

export default function SmartInsights({ expenses = [] }) {
  // ---------- WebSocket for live updates ----------
  const { messages } = useWebSocket(WS_DASHBOARD);
  const [liveExpenses, setLiveExpenses] = useState(expenses);

  // Merge parent expenses with WebSocket updates
  useEffect(() => {
    setLiveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    messages.forEach((msg) => {
      switch (msg.type) {
        case "new_expense":
          setLiveExpenses((prev) => [msg.data, ...prev]);
          break;
        case "update_expense":
          setLiveExpenses((prev) =>
            prev.map((e) => (e.id === msg.data.id ? msg.data : e))
          );
          break;
        case "delete_expense":
          setLiveExpenses((prev) =>
            prev.filter((e) => e.id !== msg.data.id)
          );
          break;
        default:
          break;
      }
    });
  }, [messages]);

  // ---------- Prepare Smart Insights ----------
  const insights = useMemo(() => {
    if (!liveExpenses || liveExpenses.length === 0) 
      return ["No expenses yet — add your first transaction."];

    const now = new Date();
    const month = now.getMonth();
    const lastMonth = (month - 1 + 12) % 12;

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;
    const byCategory = {};

    liveExpenses.forEach((e) => {
      const amt = Number(e.amount || 0);
      const d = e.date ? new Date(e.date) : now;
      if (!isNaN(d.getTime())) {
        if (d.getMonth() === month) thisMonthTotal += amt;
        if (d.getMonth() === lastMonth) lastMonthTotal += amt;
      }
      const cat = e.category || "Other";
      byCategory[cat] = (byCategory[cat] || 0) + amt;
    });

    const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats[0] || ["N/A", 0];

    const lines = [];

    // Monthly trend
    const diff = thisMonthTotal - lastMonthTotal;
    if (Math.abs(diff) < 1)
      lines.push("Monthly spending is stable compared to last month.");
    else if (diff > 0)
      lines.push(
        `Spending up ₹${diff.toLocaleString("en-IN", { minimumFractionDigits: 2 })} vs last month.`
      );
    else
      lines.push(
        `Good — spending down ₹${Math.abs(diff).toLocaleString("en-IN", { minimumFractionDigits: 2 })} vs last month.`
      );

    // Top category
    lines.push(
      `Top category: ${topCategory[0]} (₹${topCategory[1].toLocaleString("en-IN", { minimumFractionDigits: 2 })})`
    );

    // Large expense detection
    const biggest = [...liveExpenses].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];
    if (biggest && thisMonthTotal > 0 && Number(biggest.amount) > thisMonthTotal * 0.4) {
      lines.push(
        `⚠ Large one-time expense: ₹${Number(biggest.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })} (may skew this month's total).`
      );
    }

    // Suggestions
    lines.push("💡 Suggestion: Set a weekly budget and review categories above to reduce overspend.");
    lines.push("💡 Tip: Click 'Split Bill' to split shared expenses.");

    return lines;
  }, [liveExpenses]);

  // ---------- Prepare Weekly Data ----------
  const weeklyData = useMemo(() => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekly = weekDays.map((d) => ({ day: d, spend: 0 }));

    liveExpenses.forEach((e) => {
      if (!e.date) return;
      const d = new Date(e.date);
      const diff = (today - d) / (1000 * 60 * 60 * 24);
      if (diff >= 0 && diff < 7) weekly[d.getDay()].spend += Number(e.amount || 0);
    });

    weekly.forEach((w) => (w.spend = Number(w.spend.toFixed(2))));
    return weekly;
  }, [liveExpenses]);

  // ---------- Prepare Timeline Data ----------
  const timelineEvents = useMemo(() => {
    return [...liveExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((e) => ({
        title: `${e.title} - ₹${Number(e.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        time: new Date(e.date).toLocaleString(),
      }));
  }, [liveExpenses]);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <SummaryCard expenses={liveExpenses} />

      {/* Weekly Trend */}
      <WeeklyTrend data={weeklyData} />

      {/* Timeline */}
      <Timeline events={timelineEvents} />

      {/* Smart AI Insights */}
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Smart Insights</h3>
        <div className="space-y-2">
          {insights.map((t, i) => (
            <div
              key={i}
              className={`p-2 rounded text-sm ${
                t.startsWith("⚠")
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
