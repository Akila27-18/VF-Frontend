// src/components/ExpenseCard.jsx
import React, { useState, useEffect } from "react";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(expense.title || "");
  const [amount, setAmount] = useState(expense.amount || 0);
  const [category, setCategory] = useState(expense.category || "Other");

  useEffect(() => {
    setTitle(expense.title || "");
    setAmount(expense.amount || 0);
    setCategory(expense.category || "Other");
  }, [expense]);

  const handleSave = () => {
    const amt = Number(amount);
    const cat = category.trim() || "Other";
    const t = title.trim();

    if (!t || amt <= 0) return;

    onEdit({
      ...expense,
      title: t,
      amount: amt,
      category: cat,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-orange-100 rounded-xl shadow p-4 flex justify-between items-center">
      <div className="flex-1 pr-2">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-1 text-sm"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded p-1 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>
          </div>
        ) : (
          <div>
            <div className="font-medium">{expense.title}</div>
            <div className="text-sm text-gray-500">{expense.category}</div>
            <div className="font-semibold">
              ₹{Number(expense.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(expense.created_at).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-start">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-600 text-xs font-medium">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="text-gray-600 text-xs">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              aria-label="Edit Expense"
              className="text-gray-800 hover:text-orange-600 text-lg"
            >
              ✍️
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              aria-label="Delete Expense"
              className="text-red-600 hover:text-red-800 text-lg"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
