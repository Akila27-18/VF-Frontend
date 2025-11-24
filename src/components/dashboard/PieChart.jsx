import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ expenses }) {
  if (!expenses || expenses.length === 0) return null;

  const categories = {};

  // Group expenses by category
  expenses.forEach((e) => {
    const category = e.category || "Other";
    categories[category] = (categories[category] || 0) + Number(e.amount || 0);
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          "#FF6A00",
          "#FFD6B8",
          "#6C63FF",
          "#00C49F",
          "#FFB700",
          "#FF3D71",
          "#28C2FF",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Spending Breakdown</h3>
      <Pie data={data} />
    </div>
  );
}
