// src/components/AddExpenseModal.jsx
import React, { useState } from "react";
import { apiFetch } from "../lib/api";

export default function AddExpenseModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    setError("");
    const amt = parseFloat(amount);

    if (!title.trim() || isNaN(amt) || amt <= 0) {
      setError("Please enter a valid title and amount.");
      return;
    }

    setLoading(true);
    try {
      const newExpense = await apiFetch("/expenses/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          amount: amt,
          category: category.trim() || "Other",
          shared: false,
        }),
      });

      onAdd?.(newExpense);
      onClose?.();

      setTitle("");
      setAmount("");
      setCategory("");
      setError("");
    } catch (err) {
      console.error("AddExpenseModal API error:", err);
      setError(err.message || "Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading || !title.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Add Expense</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-4 py-2 rounded text-white ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
