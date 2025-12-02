import React, { useState } from "react";
import { motion } from "framer-motion";

import AddGoalModal from "./modals/AddGoalModal";
import editIcon from "../assets/icons/edit.png";
import deleteIcon from "../assets/icons/delete.png";
import defaultGoal from "../assets/dashboard/goal-default.jpg";

export default function GoalsPage() {
const [goals, setGoals] = useState([
{
id: 1,
title: "Emergency Fund",
target: 50000,
saved: 15000,
deadline: "2025-12-30",
img: defaultGoal,
},
{
id: 2,
title: "Goa Trip",
target: 20000,
saved: 6000,
deadline: "2025-06-01",
img: defaultGoal,
},
]);

const [openAdd, setOpenAdd] = useState(false);

const addGoal = (goal) => {
const newGoal = {
id: Date.now(),
...goal,
img: defaultGoal,
};
setGoals((prev) => [newGoal, ...prev]);
};

const deleteGoal = (id) => {
setGoals((prev) => prev.filter((g) => g.id !== id));
};

return ( <div className="px-4 md:px-8 py-6 space-y-6">
{/* Header */}
<motion.div
initial={{ opacity: 0, y: -6 }}
animate={{ opacity: 1, y: 0 }}
className="flex items-center justify-between"
> <h2 className="text-2xl font-bold">Savings Goals</h2>

```
    <button
      onClick={() => setOpenAdd(true)}
      className="px-4 py-2 bg-[#FF6A00] text-white rounded-xl hover:bg-[#E85D00] transition"
    >
      + Add Goal
    </button>
  </motion.div>

  {/* Goals Grid */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {goals.map((goal) => (
      <GoalCard
        key={goal.id}
        goal={goal}
        onDelete={deleteGoal}
        onEdit={() => {}}
      />
    ))}
  </div>

  <AddGoalModal
    open={openAdd}
    onClose={() => setOpenAdd(false)}
    onAdd={addGoal}
  />
</div>

);
}

/* --------------------------------
Goal Card Component
-----------------------------------*/

function GoalCard({ goal, onDelete, onEdit }) {
const { title, target, saved, deadline, img } = goal;

const percent = Math.min(100, Math.round((saved / target) * 100));

const barColor =
percent >= 85 ? "#22C55E" : percent >= 50 ? "#FF6A00" : "#EF4444";

return (
<motion.div
whileHover={{ y: -4 }}
className="bg-white rounded-xl shadow p-4 transition"
>
<img
src={img}
alt="goal"
className="w-full h-32 object-cover rounded-lg mb-3"
onError={(e) => (e.target.src = defaultGoal)}
/>

```
  <div className="font-semibold text-lg">{title}</div>

  <div className="text-sm text-[#6F6F6F] mb-2">
    Target: ₹{target.toLocaleString()}
  </div>

  {/* Progress Bar */}
  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
    <div
      className="h-3 rounded-full transition-all"
      style={{
        width: `${percent}%`,
        backgroundColor: barColor,
      }}
    />
  </div>

  <div className="flex justify-between text-sm mb-3">
    <div>Saved: ₹{saved.toLocaleString()}</div>
    <div className="font-medium">{percent}%</div>
  </div>

  <div className="text-xs text-[#6F6F6F] mb-3">
    Deadline: {formatDate(deadline)}
  </div>

  {/* Actions */}
  <div className="flex justify-end gap-3">
    <img
      src={editIcon}
      alt="edit"
      className="w-5 cursor-pointer opacity-70 hover:opacity-100"
      onClick={onEdit}
    />
    <img
      src={deleteIcon}
      alt="delete"
      className="w-5 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => onDelete(goal.id)}
    />
  </div>
</motion.div>

);
}

/* --------------------------------
Utility: Format date as DD MMM, YYYY
-----------------------------------*/
function formatDate(dateStr) {
try {
const d = new Date(dateStr);
return d.toLocaleDateString("en-IN", {
day: "2-digit",
month: "short",
year: "numeric",
});
} catch {
return dateStr;
}
}
