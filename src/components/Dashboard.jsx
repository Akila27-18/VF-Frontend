// src/components/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuickActions from "../components/dashboard/QuickActions";
import ExpenseCard from "../components/ExpenseCard";
import AddExpenseModal from "../components/AddExpenseModal";
import SplitBillModal from "../components/SplitBillModal";
import SafeAside from "../components/SafeAside";
import SmartInsights from "../components/dashboard/SmartInsights";
import PieChartCard from "../components/dashboard/PieChartCard";

import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";
import { WS_DASHBOARD } from "../lib/ws";

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

  // ------------------ Fetch Expenses ------------------
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const data = await apiFetch("/expenses/");
        setExpenses(data);
        localStorage.setItem("expenses", JSON.stringify(data));
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

  // ------------------ Edit Expense ------------------
  const handleEditExpense = async (updated) => {
    try {
      const saved = await apiFetch(`/expenses/${updated.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          title: updated.title,
          amount: updated.amount,
          category: updated.category,
        }),
      });
      const newExpenses = expenses.map((e) => (e.id === saved.id ? saved : e));
      setExpenses(newExpenses);
      localStorage.setItem("expenses", JSON.stringify(newExpenses));
    } catch (err) {
      console.error("Edit expense failed:", err);
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

  // ------------------ Pie Chart Data ------------------
  const pieData = {
    labels: [...new Set(expenses.map((e) => e.category || "Other"))],
    datasets: [
      {
        data: expenses.reduce((acc, e) => {
          const cat = e.category || "Other";
          acc[cat] = (acc[cat] || 0) + Number(e.amount);
          return acc;
        }, {}),
      },
    ],
  };

  return (
    <div className="space-y-6 px-4 md:px-8 min-h-screen bg-orange-50">
      {/* Header */}
      <DashboardHeader
        title="Welcome back"
        subtitle="Overview of your finances."
        image={heroImg}
      />

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActions img={addExpenseImg} title="Add Expense" onClick={() => setShowAdd(true)} />
        <QuickActions img={insightsImg} title="Insights" />
        <QuickActions img={paymentsImg} title="Payments" />
        <QuickActions img={splitBillImg} title="Split Bill" onClick={() => setShowSplit(true)} />
      </div>

      {/* Main Insights & Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Expenses, Insights, Pie Chart */}
        <div className="lg:col-span-2 space-y-6">
          <SmartInsights expenses={expenses} />

          {loading && <div className="text-center py-6">Loading...</div>}
          {!loading && expenses.length === 0 && <div>No expenses yet</div>}
          {expenses.map((e) => (
            <ExpenseCard
              key={e.id}
              expense={e}
              onDelete={handleDeleteExpense}
              onEdit={handleEditExpense}
            />
          ))}

          <PieChartCard data={pieData} />
        </div>

        {/* Right Column: SafeAside (Stocks + News) */}
        <div className="order-first lg:order-last">
          <SafeAside
            wsUrl={WS_DASHBOARD}
            stockSymbols={["GOOGL","AMZN","AAPL","TSLA","MSFT","RELIANCE","TCS","HDFC"]}
          />
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAddExpense} />
      <SplitBillModal
        open={showSplit}
        onClose={() => setShowSplit(false)}
        users={dashboardUsers}
        onAdd={(newExpenses) => setExpenses([...newExpenses, ...expenses])}
      />
    </div>
  );
}
