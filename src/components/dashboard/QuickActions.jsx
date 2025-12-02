import React from "react";
import { motion } from "framer-motion";

export default function QuickActions({ img, title, onClick }) {
return (
<motion.button
whileHover={{ y: -6, scale: 1.04 }}
whileTap={{ scale: 0.97 }}
onClick={onClick}
className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-3 text-center transition"
aria-label={title}
>
{img ? (
<img
src={img}
alt={title || "action-icon"}
className="w-14 h-14 object-contain"
onError={(e) => (e.target.style.display = "none")}
/>
) : ( <div className="w-14 h-14 bg-gray-100 rounded" />
)}


  <div className="font-medium text-sm mt-1">{title}</div>
</motion.button>

);
}
