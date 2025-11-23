// src/components/SplitBillModal.jsx
import React, { useState, useEffect } from "react";

const API_URL = "https://vf-backend-1.onrender.com";

export default function SplitBillModal({ open, onClose, users = [], onAdd }) {
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [paidBy, setPaidBy] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setTotal("");
      setSelectedUsers([]);
      setPaidBy("");
    }
  }, [open]);

  const getToken = () => localStorage.getItem("token");

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleSubmit = async () => {
    if (!title || !total || !selectedUsers.length || !paidBy) {
      return alert("Please fill all fields");
    }

    const amount = Number(total);
    const perPerson = amount / selectedUsers.length;
    const token = getToken();
    if (!token) return alert("Please login first");

    try {
      // Create individual expenses for each participant
      const newExpenses = [];
      for (const user of selectedUsers) {
        if (user === paidBy) continue;
        const payload = {
          description: title,
          amount: perPerson,
          category: "Shared",
          shared: true,
          participants: selectedUsers,
          paidBy,
          date: new Date().toISOString().split("T")[0],
        };

        const res = await fetch(`${API_URL}/expenses/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to add shared expense");

        const createdExpense = await res.json();
        newExpenses.push(createdExpense);
      }

      onAdd(newExpenses); // Update frontend state
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error splitting bill");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Split Bill</h2>
        <div className="mb-3">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="Dinner, Utilities..."
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Total Amount</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="₹0"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Participants</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {users.map((user) => (
              <button
                key={user}
                onClick={() => toggleUser(user)}
                className={`px-2 py-1 rounded text-sm border ${
                  selectedUsers.includes(user)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Paid By</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          >
            <option value="">Select payer</option>
            {selectedUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Split
          </button>
        </div>
      </div>
    </div>
  );
}
