import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ expenses }) {
  if (!expenses || expenses.length === 0) return null;

  const categories = {};

  // Group by category
  expenses.forEach((e) => {
    const category = e.category || "Other";
    categories[category] = (categories[category] || 0) + e.amount;
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
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
