// src/components/ExpenseList.jsx
import React, { useEffect, useState } from "react";
import ExpenseCard from "../ExpenseCard";
import axios from "axios";

const categories = ["All", "Food", "Travel", "Shopping", "Bills", "Health", "Other"];
const API_URL = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";

export default function ExpenseList() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("All");

  const token = localStorage.getItem("token");

  const load = async () => {
    if (!token) return window.location.href = "/login";

    try {
      const res = await axios.get(`${API_URL}/expenses/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data);
    } catch (e) {
      console.error("Expense load failed", e);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000); // Auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filtered =
    filter === "All" ? list : list.filter((e) => e.category === filter);

  const handleEdit = async (exp) => {
    try {
      await axios.put(`${API_URL}/expenses/${exp.id}/`, exp, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded p-2"
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* Expense Cards */}
      {filtered.map((exp) => (
        <ExpenseCard
          key={exp.id}
          expense={exp}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {filtered.length === 0 && (
        <p className="text-gray-500">No expenses found.</p>
      )}
    </div>
  );
}
