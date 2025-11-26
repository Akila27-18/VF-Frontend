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

  // -------------------------
  // Fetch all expenses
  // -------------------------
  const load = async () => {
    if (!accessToken) return;

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
    load();
    const interval = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [accessToken]);

  const filtered = filter === "All" ? list : list.filter((e) => e.category === filter);

  // -------------------------
  // Update expense
  // -------------------------
  const handleEdit = async (exp) => {
    try {
      const payload = {
        title: exp.title,
        amount: Number(exp.amount),
        category: exp.category,
        shared: exp.shared ?? false,
      };

      await apiFetch(`/expenses/${exp.id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      load(); // refresh list
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  // -------------------------
  // Delete expense
  // -------------------------
  const handleDelete = async (id) => {
    try {
      await apiFetch(`/expenses/${id}/`, {
        method: "DELETE",
        noJson: true, // prevent JSON parse errors
      });

      load(); // refresh list
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-4">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded p-2"
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

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
