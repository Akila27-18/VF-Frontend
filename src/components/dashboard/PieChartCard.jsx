// src/components/dashboard/PieChartCard.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartCard({ data }) {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center">
        <div className="text-sm text-gray-500">No data for chart</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h4 className="font-semibold text-gray-700 mb-3">Spending Breakdown</h4>
      <div style={{ width: "220px", margin: "0 auto" }}>
        <Pie data={data} options={{ plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } }, maintainAspectRatio: true }} />
      </div>
    </div>
  );
}
