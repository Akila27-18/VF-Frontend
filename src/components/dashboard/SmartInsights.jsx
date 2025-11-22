// src/components/dashboard/SmartInsights.jsx
import React, { useMemo } from "react";

export default function SmartInsights({ expenses = [] }) {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) return ["No expenses yet — add your first transaction."];

    // totals
    const now = new Date();
    const month = now.getMonth();
    const lastMonth = (month - 1 + 12) % 12;

    let thisMonth = 0;
    let lastMonthTotal = 0;
    const byCategory = {};

    expenses.forEach((e) => {
      const amt = Number(e.amount || 0);
      const d = e.date ? new Date(e.date) : new Date();
      if (d.getMonth() === month) thisMonth += amt;
      if (d.getMonth() === lastMonth) lastMonthTotal += amt;
      const cat = e.category || "Other";
      byCategory[cat] = (byCategory[cat] || 0) + amt;
    });

    const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats[0] || ["N/A", 0];

    const lines = [];

    // month trend
    const diff = thisMonth - lastMonthTotal;
    if (Math.abs(diff) < 1) lines.push("Monthly spending is stable compared to last month.");
    else if (diff > 0) lines.push(`Spending up ₹${diff.toFixed(2)} vs last month.`);
    else lines.push(`Good — spending down ₹${Math.abs(diff).toFixed(2)} vs last month.`);

    // top category
    lines.push(`Top category: ${topCategory[0]} (₹${topCategory[1].toFixed(2)})`);

    // anomaly detection - any single expense > 40% of month
    const biggest = [...expenses].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];
    if (biggest && thisMonth > 0 && Number(biggest.amount) > thisMonth * 0.4) {
      lines.push(`⚠ Large one-time expense: ₹${Number(biggest.amount).toFixed(2)} (may skew this month's total).`);
    }

    // suggestions
    lines.push("Suggestion: Set a weekly budget and review categories above to reduce overspend.");
    lines.push("Tip: Click 'Split Bill' to split shared expenses.");

    return lines;
  }, [expenses]);

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">Smart Insights</h3>
      <div className="space-y-2">
        {insights.map((t, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
