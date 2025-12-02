import React from "react";
import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export default function WeeklyTrend({ data = [], color = "#FF6A00" }) {
return (
<motion.div
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow mt-6"
> <h4 className="font-semibold mb-2">Weekly Spending</h4>

```
  <div style={{ width: "100%", height: 160 }}>
    {data.length > 0 ? (
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e7e7e7"
            className="dark:opacity-20"
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            stroke="#888"
          />
          <YAxis
            tickFormatter={(v) => `₹${v}`}
            tick={{ fontSize: 12 }}
            stroke="#888"
          />

          <Tooltip
            formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
            contentStyle={{
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="spend"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center h-full">
        No weekly data available.
      </div>
    )}
  </div>
</motion.div>


);
}
