import React, { useMemo } from "react";

export default function SmartInsights({ expenses = [], largeExpenseThreshold = 0.4 }) {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) 
      return ["No expenses yet — add your first transaction."];

    const now = new Date();
    const month = now.getMonth();
    const lastMonth = (month - 1 + 12) % 12;

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;
    const byCategory = {};

    expenses.forEach((e) => {
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
    if (Math.abs(diff) < 1) lines.push("Monthly spending is stable compared to last month.");
    else if (diff > 0) lines.push(`Spending up ₹${diff.toLocaleString("en-IN", { minimumFractionDigits: 2 })} vs last month.`);
    else lines.push(`Good — spending down ₹${Math.abs(diff).toLocaleString("en-IN", { minimumFractionDigits: 2 })} vs last month.`);

    // Top category
    lines.push(`Top category: ${topCategory[0]} (₹${topCategory[1].toLocaleString("en-IN", { minimumFractionDigits: 2 })})`);

    // Large expense detection
    const biggest = [...expenses].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];
    if (biggest && thisMonthTotal > 0 && Number(biggest.amount) > thisMonthTotal * largeExpenseThreshold) {
      lines.push(`⚠ Large one-time expense: ₹${Number(biggest.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })} (may skew this month's total).`);
    }

    // Suggestions
    lines.push("💡 Suggestion: Set a weekly budget and review categories above to reduce overspend.");
    lines.push("💡 Tip: Click 'Split Bill' to split shared expenses.");

    return lines;
  }, [expenses, largeExpenseThreshold]);

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">Smart Insights</h3>
      <div className="space-y-2">
        {insights.map((t, i) => (
          <div key={i} className={`p-2 rounded text-sm ${t.startsWith("⚠") ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-700"}`}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
