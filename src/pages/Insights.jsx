// src/components/dashboard/Insights.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PieChartCard from "../components/dashboard/PieChartCard";
import SmartInsights from "../components/dashboard/SmartInsights";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";

export default function Insights() {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------ AUTH ------------ */
  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return token;
  };

  /* ------------ FETCH EXPENSES ------------ */
  useEffect(() => {
    async function fetchExpenses() {
      const token = getTokenOrRedirect();
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch expenses");

        const data = await res.json();
        setExpenses(data);
        prepareCategoryData(data);
        prepareWeeklyData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  /* ------------ CATEGORY DATA ------------ */
  const prepareCategoryData = (data) => {
    const categories = {};
    data.forEach((e) => {
      const cat = e.category || "Other";
      categories[cat] = (categories[cat] || 0) + Number(e.amount || 0);
    });

    setCategoryData({
      labels: Object.keys(categories),
      datasets: [{ data: Object.values(categories), backgroundColor: ["#FF6A00", "#FFD6B8", "#F0F0F0", "#FFA86B", "#6C63FF", "#00C49F"] }],
    });
  };

  /* ------------ WEEKLY DATA ------------ */
  const prepareWeeklyData = (data) => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekly = weekDays.map((d) => ({ day: d, spend: 0 }));

    data.forEach((e) => {
      if (!e.date) return;
      const d = new Date(e.date);
      const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (diff >= 0 && diff < 7) {
        weekly[d.getDay()].spend += Number(e.amount || 0);
      }
    });

    weekly.forEach((d) => (d.spend = Number(d.spend.toFixed(2))));
    setWeeklyData(weekly);
  };

  return (
    <div className="space-y-6 px-4 md:px-8">
      <h1 className="text-2xl font-bold">Insights</h1>

      {loading && <div className="text-gray-600">Loading insights...</div>}

      {/* Category Pie Chart */}
      <PieChartCard data={categoryData} />

      {/* Weekly Spending Bar Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Weekly Spending</h2>
        {weeklyData.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="spend" fill="#FF6A00" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-gray-500 text-sm">No weekly data</div>
        )}
      </div>

      {/* Smart Insights */}
      <SmartInsights expenses={expenses} />
    </div>
  );
}
