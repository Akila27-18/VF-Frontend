// src/components/dashboard/SummaryCard.jsx
import React, { useMemo } from "react";

export default function SummaryCard({ expenses = [] }) {
  const summary = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { total: 0, thisMonth: 0, lastMonth: 0, largestCategory: "N/A", count: 0 };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12;

    let thisMonthSum = 0;
    let lastMonthSum = 0;
    const categoryTotals = {};

    expenses.forEach((e) => {
      const amt = Number(e.amount || 0);
      const d = e.date ? new Date(e.date) : new Date();
      if (d.getMonth() === currentMonth) thisMonthSum += amt;
      if (d.getMonth() === lastMonth) lastMonthSum += amt;
      const cat = e.category || "Other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    });

    const largestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

    return { total, thisMonth: thisMonthSum, lastMonth: lastMonthSum, largestCategory, count: expenses.length };
  }, [expenses]);

  const trend = summary.thisMonth - summary.lastMonth;
  const trendLabel = trend >= 0 ? `▲ ₹${trend.toFixed(2)}` : `▼ ₹${Math.abs(trend).toFixed(2)}`;
  const trendColor = trend >= 0 ? "text-red-600" : "text-green-600";

  return (
    <div className="bg-white shadow rounded-xl p-4 space-y-3">
      <h3 className="text-lg font-semibold">Summary</h3>

      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-bold">₹{summary.total.toFixed(2)}</div>
          <div className="text-sm text-gray-500">Total spent</div>
        </div>
        <div className={`text-sm font-medium ${trendColor}`}>{trendLabel}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        <div>
          <div className="font-medium">This month</div>
          <div>₹{summary.thisMonth.toFixed(2)}</div>
        </div>
        <div>
          <div className="font-medium">Top category</div>
          <div>{summary.largestCategory}</div>
        </div>
        <div>
          <div className="font-medium">Transactions</div>
          <div>{summary.count}</div>
        </div>
        <div>
          <div className="font-medium">Last month</div>
          <div>₹{summary.lastMonth.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
