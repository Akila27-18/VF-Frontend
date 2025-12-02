import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/* Components */
import DashboardHeader from "./dashboard/DashboardHeader";
import QuickActions from "./dashboard/QuickActions";
import WeeklyTrend from "./dashboard/WeeklyTrend";
import ExpenseCard from "./ExpenseCard";
import AddExpenseModal from "./AddExpenseModal";
import ChatPanel from "./ChatPanel";
import NewsFeed from "./NewsFeed";
import SplitBillModal from "./SplitBillModal";
import MultiStockWidget from "./dashboard/MultiStockWidget";


/* Assets */
import heroImg from "../assets/dashboard/hero.jpg";
import addExpenseImg from "../assets/dashboard/add-expense.jpg";
import splitBillImg from "../assets/dashboard/split-bill.jpg";
import insightsImg from "../assets/dashboard/insights.jpg";
import paymentsImg from "../assets/dashboard/payments.jpg";

const COLORS = ["#FF6A00", "#FFD6B8", "#F0F0F0", "#FFA86B"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [trend, setTrend] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const dashboardUsers = ["Alice", "Bob", "Charlie"];

  /** Initialize expenses from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      const data = JSON.parse(saved);
      setExpenses(data);
      updateSummaryAndTrend(data);
    }
  }, []);

  /** Update summary/trend */
  const updateSummaryAndTrend = (data) => {
    const categoryMap = {};
    data.forEach((e) => {
      const cat = e.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
    });
    const total = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;

    setSummary(
      Object.entries(categoryMap).map(([name, raw]) => ({
        name,
        raw,
        value: Math.round((raw / total) * 100),
      }))
    );

    // Weekly trend
    const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = new Date();
    const weekly = weekDays.map((d) => ({ day: d, spend: 0 }));

    data.forEach((e) => {
      if (!e.date) return;
      const expenseDate = new Date(e.date);
      const diffDays = Math.floor((today.getTime() - expenseDate.getTime()) / (1000*60*60*24));
      if (diffDays >= 0 && diffDays < 7) {
        weekly[expenseDate.getDay()].spend += Number(e.amount || 0);
      }
    });
    setTrend(weekly);
  };

  const saveExpenses = (data) => {
    setExpenses(data);
    localStorage.setItem("expenses", JSON.stringify(data));
    updateSummaryAndTrend(data);
  };

  const handleAddExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: expense.date || new Date().toISOString().split("T")[0],
    };
    saveExpenses([newExpense, ...expenses]);
    setShowAdd(false);
  };

  const handleEditExpense = (updatedExpense) => {
    const updated = expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e));
    saveExpenses(updated);
  };

  const handleDeleteExpense = (id) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(expenses);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    saveExpenses(reordered);
  };

  const quickActions = [
    { img: addExpenseImg, title: "Add Expense", onClick: () => setShowAdd(true) },
    { img: insightsImg, title: "Insights", onClick: () => navigate("/dashboard/insights") },
    { img: paymentsImg, title: "Payments", onClick: () => navigate("/dashboard/payments") },
    { img: splitBillImg, title: "Split Bill", onClick: () => setShowSplit(true) },
  ];

  return (
    <div className="space-y-6 px-4 md:px-8" style={{
        background:
          "linear-gradient(135deg, #fff 0%, #fff7f2 40%, #ffe6d5 100%)",
      }}>
      <DashboardHeader
        title="Welcome back"
        subtitle="Overview of your shared and personal finances."
        image={heroImg}
        action={{ label: "View Insights", onClick: () => navigate("/dashboard/insights") }}
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((a, i) => <QuickActions key={i} {...a} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
             <PieChart>
  <Pie
    data={summary}
    dataKey="raw"
    nameKey="name"
    outerRadius={80}
    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
  >
    {summary.map((entry, i) => (
      <Cell key={i} fill={COLORS[i % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip formatter={(value) => `₹${parseFloat(value).toFixed(2)}`} />
  <Legend verticalAlign="bottom" height={36} />
</PieChart>

            </ResponsiveContainer>
          </div>

          {/* Weekly Trend */}
          <WeeklyTrend data={trend} color={COLORS[0]} />

          {/* Drag-and-Drop Expenses */}
          {expenses.length > 0 && (
  <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="expenses">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-4 overflow-y-auto rounded-xl p-2"
          style={{ maxHeight: "700px" }} // adjust number of cards visible
        >
          {expenses.map((expense, idx) => (
            <Draggable key={expense.id} draggableId={expense.id.toString()} index={idx}>
              {(prov) => (
                <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="expense-card">
                  <ExpenseCard
                    expense={expense}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
)}

        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <ChatPanel wsUrl="ws://localhost:5000/ws/chat/" />
          <NewsFeed />

          <div className="bg-white rounded-xl shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium p-4">Featured</div>
            </div>
            <div className="grid gap-3">
              <MultiStockWidget symbols={["GOOGL","AMZN","AAPL","TSLA","MSFT","RELIANCE.NS","TCS.NS","HDFCBANK.NS"]} />
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
      <AddExpenseModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAddExpense} />
      <SplitBillModal
        open={showSplit}
        users={dashboardUsers}
        onClose={() => setShowSplit(false)}
        onAdd={(newExpenses) => saveExpenses([...newExpenses, ...expenses])}
      />
    </div>
  );
}
