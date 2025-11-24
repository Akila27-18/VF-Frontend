// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuickActions from "../components/dashboard/QuickActions";
import ExpenseCard from "../components/ExpenseCard";
import AddExpenseModal from "../components/AddExpenseModal";
import SplitBillModal from "../components/SplitBillModal";
import SafeAside from "../components/SafeAside";
import SummaryCard from "../components/dashboard/SummaryCard";
import SmartInsights from "../components/dashboard/SmartInsights";
import PieChartCard from "../components/dashboard/PieChartCard";
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";

import heroImg from "../assets/dashboard/hero.jpg";
import addExpenseImg from "../assets/dashboard/add-expense.jpg";
import splitBillImg from "../assets/dashboard/split-bill.jpg";
import insightsImg from "../assets/dashboard/insights.jpg";
import paymentsImg from "../assets/dashboard/payments.jpg";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showSplit, setShowSplit] = useState(false);

  const dashboardUsers = ["Alice", "Bob", "Charlie"];

  // Fetch expenses on mount
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const data = await apiFetch("/expenses/");
        setExpenses(data);
        localStorage.setItem("expenses", JSON.stringify(data)); // persist
      } catch (err) {
        console.error(err);
        if (err.message.toLowerCase().includes("token")) logout();
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  // ------------------ Add Expense ------------------
  const handleAddExpense = async (expense) => {
    try {
      // POST to backend
      const saved = await apiFetch("/expenses/", {
        method: "POST",
        body: JSON.stringify(expense),
      });

      const updated = [saved, ...expenses];
      setExpenses(updated);
      localStorage.setItem("expenses", JSON.stringify(updated));
    } catch (err) {
      console.error("Add expense failed:", err);
      throw err;
    }
  };

  // ------------------ Delete Expense ------------------
  const handleDeleteExpense = async (id) => {
    try {
      await apiFetch(`/expenses/${id}/`, { method: "DELETE" });
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      localStorage.setItem("expenses", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Pie chart data
  const pieData = {
    labels: [...new Set(expenses.map((e) => e.category || "Other"))],
    datasets: [
      {
        data: expenses.reduce((acc, e) => {
          acc[e.category || "Other"] = (acc[e.category || "Other"] || 0) + Number(e.amount);
          return acc;
        }, {}),
      },
    ],
  };

  return (
    <div className="space-y-6 px-4 md:px-8 min-h-screen bg-orange-50">
      <DashboardHeader title="Welcome back" subtitle="Overview of your finances." image={heroImg} />

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActions img={addExpenseImg} title="Add Expense" onClick={() => setShowAdd(true)} />
        <QuickActions img={insightsImg} title="Insights" />
        <QuickActions img={paymentsImg} title="Payments" />
        <QuickActions img={splitBillImg} title="Split Bill" onClick={() => setShowSplit(true)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SummaryCard expenses={expenses} />
        <SmartInsights expenses={expenses} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading && <div className="text-center py-6">Loading...</div>}
          {!loading && expenses.length === 0 && <div>No expenses yet</div>}
          {expenses.map((e) => (
            <ExpenseCard key={e.id} expense={e} onDelete={handleDeleteExpense} />
          ))}
          <PieChartCard data={pieData} />
        </div>

        <div className="order-first lg:order-last">
          <SafeAside
            wsUrl={`${import.meta.env.VITE_BACKEND_URL.replace(/^http/, "ws")}/ws/dashboard/`}
            stockSymbols={["GOOGL","AMZN","AAPL","TSLA","MSFT","RELIANCE","TCS","HDFC"]}
          />
        </div>
      </div>

      <AddExpenseModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAddExpense} />
      <SplitBillModal open={showSplit} onClose={() => setShowSplit(false)} users={dashboardUsers} onAdd={(newExpenses) => setExpenses([...newExpenses, ...expenses])} />
    </div>
  );
}
