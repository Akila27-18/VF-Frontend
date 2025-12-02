import React from "react";
import { motion } from "framer-motion";

export default function SavingsGoals({ goals = [] }) {
// choose color based on percent
const barColor = (p) => {
if (p >= 85) return "linear-gradient(90deg, #22C55E, #86EFAC)"; // green
if (p >= 50) return "linear-gradient(90deg, #FF6A00, #FFA86B)"; // orange
return "linear-gradient(90deg, #EF4444, #FCA5A5)"; // red
};

// currency format helper
const fmt = (n) => (n !== undefined ? n.toLocaleString("en-IN") : "0");

return ( <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"> <div className="font-semibold mb-3">Savings Goals</div>

```
  <div className="space-y-4">
    {goals.map((g, i) => {
      const percent = Number(g.percent) || 0;

      return (
        <motion.div
          key={g.id || i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Label Row */}
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium">{g.title || "Unnamed Goal"}</div>
            <div className="text-sm text-gray-500">{percent}%</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: barColor(percent) }}
            />
          </div>

          {/* Summary */}
          {g.saved !== undefined && g.target !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              ₹{fmt(g.saved)} / ₹{fmt(g.target)}
            </div>
          )}
        </motion.div>
      );
    })}

    {/* Empty State */}
    {goals.length === 0 && (
      <div className="text-sm text-gray-500 py-2">
        No savings goals added yet.
      </div>
    )}
  </div>
</div>

);
}
