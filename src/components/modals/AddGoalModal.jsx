import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AddGoalModal({ open, onClose, onAdd }) {
const [form, setForm] = useState({
title: "",
target: "",
saved: "",
deadline: "",
});

useEffect(() => {
if (open) {
setForm({ title: "", target: "", saved: "", deadline: "" });
}
}, [open]);

// Close modal on Esc key
useEffect(() => {
const handleKeyDown = (e) => {
if (e.key === "Escape") onClose();
};
if (open) window.addEventListener("keydown", handleKeyDown);
return () => window.removeEventListener("keydown", handleKeyDown);
}, [open, onClose]);

const handleSave = () => {
if (!form.title.trim()) {
alert("Goal title is required");
return;
}
if (form.target <= 0 || isNaN(form.target)) {
alert("Target amount must be a positive number");
return;
}
if (form.saved < 0 || isNaN(form.saved)) {
alert("Saved amount must be zero or positive");
return;
}
onAdd(form);
onClose();
};

if (!open) return null;

return ( <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
<motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
> <h3 className="font-semibold mb-4 text-lg">Add Savings Goal</h3>

```
    <div className="flex flex-col gap-3">
      <input
        value={form.title}
        onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
        placeholder="Goal Title"
        className="border rounded px-3 py-2"
      />
      <input
        value={form.target}
        type="number"
        onChange={(e) => setForm((s) => ({ ...s, target: Number(e.target.value) }))}
        placeholder="Target Amount (₹)"
        className="border rounded px-3 py-2"
        min="0.01"
        step="0.01"
      />
      <input
        value={form.saved}
        type="number"
        onChange={(e) => setForm((s) => ({ ...s, saved: Number(e.target.value) }))}
        placeholder="Amount Saved (₹)"
        className="border rounded px-3 py-2"
        min="0"
        step="0.01"
      />
      <input
        value={form.deadline}
        onChange={(e) => setForm((s) => ({ ...s, deadline: e.target.value }))}
        placeholder="Deadline (YYYY-MM-DD)"
        className="border rounded px-3 py-2"
        type="date"
      />
    </div>

    <div className="flex justify-end gap-3 mt-5">
      <button onClick={onClose} className="px-4 py-2 rounded border">
        Cancel
      </button>
      <button onClick={handleSave} className="px-4 py-2 bg-[#FF6A00] text-white rounded">
        Save Goal
      </button>
    </div>
  </motion.div>
</div>

);
}
