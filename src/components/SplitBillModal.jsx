// src/components/SplitBillModal.jsx
import React, { useState } from "react";
import { apiFetch } from "../lib/api";

export default function SplitBillModal({ open, onClose, users = [], onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserToggle = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUsers.length) {
      setError("Select at least one user");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const splitAmount = Number(amount) / selectedUsers.length;
      const newExpenses = await Promise.all(
        selectedUsers.map(() =>
          apiFetch("/expenses/", {
            method: "POST",
            body: JSON.stringify({
              title,
              amount: splitAmount,
              category: "Split Bill",
            }),
          })
        )
      );

      onAdd(newExpenses);
      setTitle("");
      setAmount("");
      setSelectedUsers([]);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Split Bill</h2>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Total Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <button
                key={user}
                type="button"
                onClick={() => handleUserToggle(user)}
                className={`px-3 py-1 rounded border ${
                  selectedUsers.includes(user)
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {user}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-orange-500 text-white"
              disabled={loading}
            >
              {loading ? "Splitting..." : "Split Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
