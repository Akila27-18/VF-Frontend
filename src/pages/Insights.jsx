// src/components/dashboard/Insights.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import PieChartCard from "../components/dashboard/PieChartCard";
import SmartInsights from "../components/dashboard/SmartInsights";

import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export default function Insights() {
  const { accessToken, logout } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: []
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------ FETCH EXPENSES USING apiFetch ------------ */
  useEffect(() => {
    async function fetchExpenses() {
      if (!accessToken) return;

      try {
        const data = await apiFetch("/expenses/");
        setExpenses(data);

        prepareCategoryData(data);
        prepareWeeklyData(data);
      } catch (err) {
        console.error("Failed to load insights:", err);

        // Token expired? → logout and redirect
        if (err.message?.toLowerCase().includes("token")) {
          logout();
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, [accessToken]);

  /* ------------ CATEGORY DATA (Pie Chart) ------------ */
  const prepareCategoryData = (data) => {
    const categories = {};

    data.forEach((e) => {
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
            "#00C49F"
          ]
        }
      ]
    });
  };

  /* ------------ WEEKLY DATA (Bar Chart) ------------ */
  const prepareWeeklyData = (data) => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekly = weekDays.map((d) => ({ day: d, spend: 0 }));

    data.forEach((e) => {
      if (!e.date) return;
      const d = new Date(e.date);

      const diff = (today - d) / (1000 * 60 * 60 * 24);
      if (diff >= 0 && diff < 7) {
        weekly[d.getDay()].spend += Number(e.amount || 0);
      }
    });

    weekly.forEach((w) => (w.spend = Number(w.spend.toFixed(2))));

    setWeeklyData(weekly);
  };

  return (
    <div className="space-y-6 px-4 md:px-8">
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
