// src/components/SplitBillModal.jsx
import React, { useState } from "react";
import { apiFetch } from "../lib/api";

export default function SplitBillModal({ open, onClose, users, onAdd }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleToggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((u) => u !== user)
        : [...prev, user]
    );
  };

  const handleSubmit = async () => {
    setError("");
    const amt = parseFloat(amount);
    if (!title || !amt || selectedUsers.length === 0) {
      setError("Please fill all fields and select users.");
      return;
    }

    const splitAmount = amt / (selectedUsers.length + 1); // include yourself
    const newExpenses = [];

    setLoading(true);
    try {
      // create an expense for yourself
      const yourExpense = await apiFetch("/expenses/", {
        method: "POST",
        body: JSON.stringify({
          title,
          amount: splitAmount,
          category: "Shared",
          shared: true,
        }),
      });
      newExpenses.push(yourExpense);

      // create expenses for selected users
      for (let u of selectedUsers) {
        const expense = await apiFetch("/expenses/", {
          method: "POST",
          body: JSON.stringify({
            title: `${title} (shared with ${u})`,
            amount: splitAmount,
            category: "Shared",
            shared: true,
          }),
        });
        newExpenses.push(expense);
      }

      onAdd(newExpenses); // update dashboard
      onClose();
      setAmount("");
      setTitle("");
      setSelectedUsers([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create split expenses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Split a Bill</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Total Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex flex-wrap gap-2">
          {users.map((u) => (
            <button
              key={u}
              onClick={() => handleToggleUser(u)}
              className={`px-3 py-1 rounded ${
                selectedUsers.includes(u)
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700"
          >
            {loading ? "Splitting..." : "Split Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}
