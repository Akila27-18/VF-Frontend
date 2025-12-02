import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category || "Other");
  const [shared, setShared] = useState(expense.shared || false);

  const handleSave = () => {
    onEdit({ ...expense, title, amount: parseFloat(amount), category, shared });
    setIsEditing(false);
  };

  const formattedAmount = parseFloat(isEditing ? amount : expense.amount).toFixed(2);

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      {/* Category Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${shared ? "bg-[#FFF7F2]" : "bg-gray-100"}`}>
        <div className="text-[#FF6A00] font-bold">{category?.[0] || "E"}</div>
      </div>

      {/* Expense Info */}
      <div className="flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-1 text-sm"
              placeholder="Title"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded p-1 text-sm"
              placeholder="Amount"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded p-1 text-sm"
              placeholder="Category"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} />
              Shared
            </label>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="font-medium">{expense.title}</div>
              <div className="text-sm text-gray-500">{expense.date || ""}</div>
            </div>
            <div className="text-sm text-gray-500">
              {expense.category} • {expense.shared ? "Shared" : "Personal"}
            </div>
          </>
        )}
      </div>

      {/* Amount */}
      <div className="font-semibold mr-2">₹{formattedAmount}</div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-1">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 text-xs font-semibold hover:underline"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 text-xs font-semibold hover:underline"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded hover:bg-orange-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="px-2 py-1 bg-gray-800 text-white text-xs font-semibold rounded hover:bg-gray-900"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
