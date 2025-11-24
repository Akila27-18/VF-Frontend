// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";

/* Components */
import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuickActions from "../components/dashboard/QuickActions";
import ExpenseCard from "../components/ExpenseCard";
import AddExpenseModal from "../components/AddExpenseModal";
import SplitBillModal from "../components/SplitBillModal";
import SafeAside from "../components/SafeAside";
import SummaryCard from "../components/dashboard/SummaryCard";
import SmartInsights from "../components/dashboard/SmartInsights";
import PieChartCard from "../components/dashboard/PieChartCard";


/* Images */
import heroImg from "../assets/dashboard/hero.jpg";
import addExpenseImg from "../assets/dashboard/add-expense.jpg";
import splitBillImg from "../assets/dashboard/split-bill.jpg";
import insightsImg from "../assets/dashboard/insights.jpg";
import paymentsImg from "../assets/dashboard/payments.jpg";

/* API */
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showSplit, setShowSplit] = useState(false);

  const dashboardUsers = ["Alice", "Bob", "Charlie"];

  // Fetch expenses
  useEffect(() => {
    if (!token) return;
    const fetchExpenses = async () => {
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
    };
    fetchExpenses();
  }, [token]);

  const categories = useMemo(() => {
    const setCats = new Set(expenses.map((e) => e.category || "Other"));
    return ["All", ...Array.from(setCats)];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = expenses;
    if (filteredCategory !== "All")
      list = list.filter((e) => (e.category || "Other") === filteredCategory);
    if (q)
      list = list.filter(
        (e) => (e.title || "").toLowerCase().includes(q)
      );
    return list;
  }, [expenses, filteredCategory, search]);

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
            "#FF6A00", "#FF7F26", "#FF934D", "#FFA873",
            "#FFBD99", "#FFD2BF"
          ].slice(0, Object.keys(totals).length),
        },
      ],
    };
  }, [expenses]);

  const saveExpensesLocal = (data) => {
    setExpenses(data);
    localStorage.setItem("expenses", JSON.stringify(data));
  };

  const handleAddExpense = async (expense) => {
    try {
      const res = await apiFetch("/expenses/", {
        method: "POST",
        body: JSON.stringify(expense),
      });
      saveExpensesLocal([res, ...expenses]);
      setShowAdd(false);
    } catch (err) {
      alert("Error adding expense: " + err.message);
      if (err.message.toLowerCase().includes("token")) logout();
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-8 min-h-screen bg-orange-50">
      <DashboardHeader
        title="Welcome back"
        subtitle="Overview of your shared and personal finances."
        image={heroImg}
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActions img={addExpenseImg} title="Add Expense" onClick={() => setShowAdd(true)} />
        <QuickActions img={insightsImg} title="Insights" onClick={() => navigate("/dashboard/insights")} />
        <QuickActions img={paymentsImg} title="Payments" onClick={() => navigate("/dashboard/payments")} />
        <QuickActions img={splitBillImg} title="Split Bill" onClick={() => setShowSplit(true)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SummaryCard expenses={expenses} />
        <SmartInsights expenses={expenses} />
      </div>

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
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search here..."
          className="border rounded px-3 py-1 text-sm"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading && <div className="text-center py-6">Loading...</div>}
          {!loading && filteredExpenses.length === 0 && (
            <div className="p-4 bg-orange-200 rounded shadow text-center">No expenses found</div>
          )}
          {filteredExpenses.map((e) => (
            <ExpenseCard
              key={e.id}
              expense={e}
              onEdit={(updated) =>
                saveExpensesLocal(expenses.map((ex) => (ex.id === updated.id ? updated : ex)))
              }
            />
          ))}
          <PieChartCard data={pieData} />
        </div>

        <div className="order-first lg:order-last">
          <SafeAside
            wsUrl={`${import.meta.env.VITE_BACKEND_URL.replace(/^http/, "ws")}/ws/chat/`}
            stockSymbols={["GOOGL","AMZN","AAPL","TSLA","MSFT","RELIANCE","TCS","HDFC"]}
          />
        </div>
      </div>

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
