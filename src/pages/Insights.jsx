import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#FF6A00", "#FFA86B", "#FFD6B8", "#6C63FF", "#00C49F", "#F0F0F0"];

export default function Insights() {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    const data = saved ? JSON.parse(saved) : [];

    setExpenses(data);
    updateCategoryData(data);
    updateWeeklyData(data);
  }, []);

  /** Format numbers as INR */
  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { minimumFractionDigits: 2 })
      : "0.00";

  /** Summarize expenses by category */
  const updateCategoryData = (data) => {
    const map = {};

    data.forEach((e) => {
      const category = e.category || "Other";
      const amt = Number(e.amount) || 0;
      map[category] = (map[category] || 0) + amt;
    });

    const entries = Object.entries(map).map(([name, raw]) => ({
      name,
      value: Number(raw.toFixed(2)),
    }));

    const total = entries.reduce((a, b) => a + b.value, 0) || 1;

    const formatted = entries.map((e) => ({
      ...e,
      percent: Number(((e.value / total) * 100).toFixed(2)),
    }));

    setCategoryData(formatted);
  };

  /** Weekly spending trend (Sun–Sat) */
  const updateWeeklyData = (data) => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    const base = weekDays.map((d) => ({ day: d, spend: 0 }));

    data.forEach((e) => {
      if (!e.date) return;

      const expenseDate = new Date(e.date);
      const diffDays =
        (today.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24);

      // keep last 7 days (including today)
      if (diffDays >= 0 && diffDays < 7) {
        const idx = expenseDate.getDay();
        base[idx].spend = Number((base[idx].spend + Number(e.amount || 0)).toFixed(2));
      }
    });

    setWeeklyData(base);
  };

  return (
    <div className="space-y-6 px-4 md:px-8 pb-8">
      <h1 className="text-2xl font-bold">Insights</h1>

      {/* CATEGORY PIE CHART */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Expenses by Category</h2>

        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${percent.toFixed(2)}%`
                }
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(v) => `₹${fmt(v)}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-500 text-sm">No expenses yet</div>
        )}
      </div>

      {/* WEEKLY BAR CHART */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Weekly Spending (Last 7 Days)</h2>

        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(v) => `₹${fmt(v)}`} />
              <Tooltip formatter={(value) => `₹${fmt(value)}`} />
              <Bar dataKey="spend" fill="#FF6A00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-500 text-sm">No weekly data</div>
        )}
      </div>

      {/* SUMMARY TABLE */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Category Summary</h2>

        {categoryData.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b font-semibold">
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">Percent</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((c) => (
                <tr key={c.name} className="border-b">
                  <td className="py-2 px-2">{c.name}</td>
                  <td className="py-2 px-2">₹{fmt(c.value)}</td>
                  <td className="py-2 px-2">{c.percent.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm">No expenses yet</div>
        )}
      </div>
    </div>
  );
}
