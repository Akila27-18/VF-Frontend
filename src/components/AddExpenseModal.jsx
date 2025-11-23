import React, { useState, useEffect } from "react";

const defaultCategories = ["Food", "Housing", "Utilities", "Transport", "Entertainment", "Other"];
const API_URL = "https://vf-backend-1.onrender.com";

export default function AddExpenseModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(defaultCategories[0]);
  const [date, setDate] = useState("");
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle("");
      setAmount("");
      setCategory(defaultCategories[0]);
      setDate(new Date().toISOString().split("T")[0]);
      setShared(false);
    }
  }, [open]);

  const getToken = () => localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || isNaN(amount)) return alert("Please enter valid title and amount");

    const token = getToken();
    if (!token) return alert("Please login first");

    const payload = {
      description: title,
      amount: Number(amount),
      category,
      date,
      shared,
    };

    try {
      const res = await fetch(`${API_URL}/expenses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      const newExpense = await res.json();
      onAdd(newExpense);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding expense");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>✕</button>
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-2 py-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded px-2 py-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2 py-1">
              {defaultCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2 py-1" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} id="shared-checkbox" />
            <label htmlFor="shared-checkbox" className="text-sm">Shared Expense</label>
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">Add Expense</button>
        </form>
      </div>
    </div>
  );
}
