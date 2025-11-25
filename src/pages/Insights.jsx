// src/components/pages/Insights.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PieChartCard from "../components/dashboard/PieChartCard";
import SmartInsights from "../components/dashboard/SmartInsights";


export default function Insights() {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- Load expenses from localStorage ----------------
  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) setExpenses(JSON.parse(stored));
    setLoading(false);

    // Listen to storage events to auto-update when Dashboard changes expenses
    const handleStorage = (e) => {
      if (e.key === "expenses") {
        setExpenses(JSON.parse(e.newValue || "[]"));
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ---------------- Compute category & weekly data whenever expenses change ----------------
  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    // -------- Pie Chart Data --------
    const categories = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      categories[cat] = (categories[cat] || 0) + Number(e.amount || 0);
    });
    setCategoryData({
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            "#FF6A00",
            "#FFD6B8",
            "#F0F0F0",
            "#FFA86B",
            "#6C63FF",
            "#00C49F",
            "#FFB6C1",
            "#87CEFA",
          ],
        },
      ],
    });

    // -------- Weekly Bar Chart Data --------
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekly = weekDays.map((d) => ({ day: d, spend: 0 }));

    expenses.forEach((e) => {
      const d = new Date(e.date || e.created_at);
      const diff = (today - d) / (1000 * 60 * 60 * 24);
      if (diff >= 0 && diff < 7) {
        weekly[d.getDay()].spend += Number(e.amount || 0);
      }
    });
    weekly.forEach((w) => (w.spend = Number(w.spend.toFixed(2))));
    setWeeklyData(weekly);
  }, [expenses]);

  return (
    <div className="space-y-6 px-4 md:px-8 min-h-screen bg-orange-50">
      <h1 className="text-2xl font-bold">Insights</h1>

      {loading && <div className="text-gray-600">Loading insights...</div>}

      {/* Category Pie Chart */}
      <PieChartCard data={categoryData} />

      {/* Weekly Spending */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Weekly Spending</h2>

        {weeklyData.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Bar dataKey="spend" fill="#FF6A00" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-500 text-sm">No weekly data</div>
        )}
      </div>

      {/* Smart AI Insights */}
      <SmartInsights expenses={expenses} />
    </div>
  );
}
