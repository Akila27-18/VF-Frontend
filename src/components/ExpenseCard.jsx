import React, { useState } from "react";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category || "Other");

  const handleSave = () => {
    onEdit({
      ...expense,
      description,
      amount: Number(amount),
      category,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-orange-100 rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded p-1"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded p-1"
            />

            {/* Category Select */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded p-1"
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
            <div>{expense.description}</div>
            <div className="text-sm text-gray-500">{expense.category}</div>
            <div className="font-semibold">₹{expense.amount}</div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-500 text-xs">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 text-xs">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-xl">✍️</button>
            <button onClick={() => onDelete(expense.id)} className="text-xl">👉🏻🗑️</button>
          </>
        )}
      </div>
    </div>
  );
}
