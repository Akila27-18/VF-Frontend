import React, { useState } from "react";
import API from "../lib/api"; // axios instance

export default function SplitBillModal({ onClose, onAdd, users }) {
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [paidBy, setPaidBy] = useState("");

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((u) => u !== user)
        : [...prev, user]
    );
  };

  const handleSubmit = async () => {
    if (!title || !total || !selectedUsers.length || !paidBy)
      return alert("Please fill all fields");

    const amount = Number(total);
    const perPerson = amount / selectedUsers.length;

    const newExpenses = selectedUsers.map((user) => ({
      title,
      amount: perPerson,
      category: "Shared",
      shared: true,
      participants: selectedUsers,
      paidBy,
      date: new Date().toISOString().split("T")[0],
    }));

    try {
      const res = await API.post("/expenses", { expenses: newExpenses });
      onAdd(res.data.expenses);
      onClose();

      // reset form
      setTitle("");
      setTotal("");
      setSelectedUsers([]);
      setPaidBy("");
    } catch (err) {
      console.error(err);
      alert("Failed to save expenses. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-semibold mb-3">Split Bill</h2>

        <input
          className="border p-2 mb-3 w-full"
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 mb-3 w-full"
          placeholder="Total amount"
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />

        <div className="mb-3">
          <div className="font-medium mb-1">Select Participants</div>
          {users.map((user) => (
            <label key={user} className="block">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user)}
                onChange={() => toggleUser(user)}
              />
              <span className="ml-2">{user}</span>
            </label>
          ))}
        </div>

        <div className="mb-3">
          <div className="font-medium mb-1">Paid By</div>
          <select
            className="border p-2 w-full"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-orange-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
