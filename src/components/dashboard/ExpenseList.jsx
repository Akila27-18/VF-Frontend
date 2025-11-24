// src/components/ExpenseList.jsx
import React, { useEffect, useState, useContext } from "react";
import ExpenseCard from "./ExpenseCard";
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";

const categories = ["All", "Food", "Transport", "Shopping", "Bills", "Health", "Other"];

export default function ExpenseList() {
  const { accessToken, logout } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("All");

  const load = async () => {
    try {
      const data = await apiFetch("/expenses/");
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Expense load failed", e);
      if (String(e.message).toLowerCase().includes("token")) {
        logout();
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const filtered = filter === "All" ? list : list.filter((e) => e.category === filter);

  const handleEdit = async (exp) => {
    try {
      await apiFetch(`/expenses/${exp.id}/`, { method: "PUT", body: JSON.stringify(exp) });
      load();
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/expenses/${id}/`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-4">
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded p-2">
        {categories.map((c) => (<option key={c}>{c}</option>))}
      </select>

      {filtered.map((exp) => (
        <ExpenseCard key={exp.id} expense={exp} onEdit={handleEdit} onDelete={handleDelete} />
      ))}

      {filtered.length === 0 && <p className="text-gray-500">No expenses found.</p>}
    </div>
  );
}
