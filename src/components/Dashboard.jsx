// src/components/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* Dashboard components */
import DashboardHeader from "./dashboard/DashboardHeader";
import QuickActions from "./dashboard/QuickActions";
import ExpenseCard from "./ExpenseCard";
import AddExpenseModal from "./AddExpenseModal";
import SplitBillModal from "./SplitBillModal";
import SafeAside from "./SafeAside";
import SummaryCard from "./dashboard/SummaryCard";
import SmartInsights from "./dashboard/SmartInsights";
import PieChartCard from "./dashboard/PieChartCard";
import PieChart from "./dashboard/PieChart";

/* Images */
import heroImg from "../assets/dashboard/hero.jpg";
import addExpenseImg from "../assets/dashboard/add-expense.jpg";
import splitBillImg from "../assets/dashboard/split-bill.jpg";
import insightsImg from "../assets/dashboard/insights.jpg";
import paymentsImg from "../assets/dashboard/payments.jpg";
import ChatPanel from "./ChatPanel";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showSplit, setShowSplit] = useState(false);

  const dashboardUsers = ["Alice", "Bob", "Charlie"];

  /* ----------------- Auth ----------------- */
  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  };

  /* ----------------- Fetch expenses ----------------- */
  useEffect(() => {
    const token = getTokenOrRedirect();
    if (!token) return;

    const saved = localStorage.getItem("expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
      setLoading(false);
    }

    async function fetchExpenses() {
      try {
        const res = await fetch(`${API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch expenses");
        const data = await res.json();
        setExpenses(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
        localStorage.setItem("expenses", JSON.stringify(data));
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  /* ----------------- Categories ----------------- */
  const categories = useMemo(() => {
    const setCats = new Set(expenses.map((e) => e.category || "Other"));
    return ["All", ...Array.from(setCats)];
  }, [expenses]);

  /* ----------------- Filters ----------------- */
  const filteredExpenses = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = expenses;
    if (filteredCategory !== "All")
      list = list.filter((e) => (e.category || "Other") === filteredCategory);
    if (q)
      list = list.filter(
        (e) => (e.description || e.title || "").toLowerCase().includes(q)
      );
    return list;
  }, [expenses, filteredCategory, search]);

  /* ----------------- Pie chart (orange-only) ----------------- */
  const pieData = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      totals[cat] = (totals[cat] || 0) + Number(e.amount || 0);
    });
    return {
      labels: Object.keys(totals),
      datasets: [
        {
          data: Object.values(totals),
          backgroundColor: [
            "#FF6A00",
            "#FF7F26",
            "#FF934D",
            "#FFA873",
            "#FFBD99",
            "#FFD2BF",
          ].slice(0, Object.keys(totals).length),
        },
      ],
    };
  }, [expenses]);

  /* ----------------- CRUD ----------------- */
  const saveExpensesLocal = (data) => {
    setExpenses(data);
    localStorage.setItem("expenses", JSON.stringify(data));
  };

  const handleAddExpense = async (expense) => {
    const token = getTokenOrRedirect();
    if (!token) return;
    const payload = { ...expense, userId: localStorage.getItem("userId") };
    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add expense");
      const created = await res.json();
      saveExpensesLocal([created, ...expenses]);
    } catch (err) {
      alert("Failed to add expense");
      console.error(err);
    } finally {
      setShowAdd(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    const token = getTokenOrRedirect();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete expense");
      saveExpensesLocal(expenses.filter((e) => e.id !== id));
    } catch (err) {
      alert("Failed to delete expense");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-8 min-h-screen bg-orange-50">
      {/* Header */}
      <DashboardHeader
        title="Welcome back"
        subtitle="Overview of your shared and personal finances."
        image={heroImg}
      />

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActions img={addExpenseImg} title="Add Expense" onClick={() => setShowAdd(true)} />
        <QuickActions img={insightsImg} title="Insights" onClick={() => navigate("/dashboard/insights")} />
        <QuickActions img={paymentsImg} title="Payments" onClick={() => navigate("/dashboard/payments")} />
        <QuickActions img={splitBillImg} title="Split Bill" onClick={() => setShowSplit(true)} />
      </div>

      {/* Summary + SmartInsights */}
      <div className="grid md:grid-cols-2 gap-6">
        <SummaryCard expenses={expenses} />
        <SmartInsights expenses={expenses} />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilteredCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border ${
                filteredCategory === cat
                  ? "bg-white text-orange-500 border-orange-200"
                  : "bg-orange-500 text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search here..."
            className="border rounded px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* Main + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <PieChartCard data={pieData} />
          {loading && expenses.length === 0 && (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
              <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
            </div>
          )}
          {!loading && filteredExpenses.length === 0 ? (
            <div className="p-4 bg-orange-200 rounded shadow text-center">No expenses found</div>
          ) : (
            filteredExpenses.map((e) => (
              <ExpenseCard
                key={e.id}
                expense={e}
                onEdit={(updated) =>
                  saveExpensesLocal(expenses.map((ex) => (ex.id === updated.id ? updated : ex)))
                }
                onDelete={handleDeleteExpense}
              />
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="order-first lg:order-last">
          <SafeAside
            wsUrl={`${API_URL.replace(/^http/, "ws")}/ws/chat/`}
          
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
        onAdd={(newExpenses) => saveExpensesLocal([...newExpenses, ...expenses])}
      />
    </div>
  );
}
