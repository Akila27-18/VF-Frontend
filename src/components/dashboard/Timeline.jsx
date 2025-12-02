import React from "react";
import { motion } from "framer-motion";

export default function Timeline({ events = [] }) {
return ( <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"> <div className="font-semibold mb-3">Recent Activity</div>

```
  <div className="space-y-4">
    {events.map((ev, i) => (
      <motion.div
        key={ev.id || i}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: i * 0.05 }}
        className="flex items-start gap-3"
      >
        {/* Dot or Icon */}
        {ev.icon ? (
          <img
            src={ev.icon}
            alt=""
            className="w-5 h-5 mt-1 opacity-90"
          />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] mt-2" />
        )}

        <div className="flex-1">
          <div className="text-sm font-medium leading-tight">
            {ev.title || "Untitled Event"}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {ev.time || "Unknown time"}
          </div>
        </div>
      </motion.div>
    ))}

    {/* Empty state */}
    {events.length === 0 && (
      <div className="text-sm text-gray-500 py-2">No recent activity.</div>
    )}
  </div>
</div>


);
}
