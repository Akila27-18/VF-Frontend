import React, { useEffect, useState, useContext } from "react";
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export default function Payments() {
  const { token, logout } = useContext(AuthContext);
  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [userMap, setUserMap] = useState({}); // id → username
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users once to map IDs → usernames
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await apiFetch("/users/");
        const map = {};
        users.forEach((u) => {
          map[u.id] = u.username;
        });
        setUserMap(map);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch shared budgets
  useEffect(() => {
    if (!token) return;

    const fetchBudgets = async () => {
      try {
        const data = await apiFetch("/budgets/");
        setSharedBudgets(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        if (err.message.toLowerCase().includes("token")) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [token]);

  // Calculate who owes whom
  const calculateOwed = (budget) => {
    if (!budget.participants || budget.participants.length === 0) return [];

    const splitAmount = budget.total_amount / budget.participants.length;
    return budget.participants.map((participantId) => ({
      participantId,
      username: userMap[participantId] || `User ${participantId}`,
      owes: splitAmount.toFixed(2),
    }));
  };

  if (loading) return <div className="text-center py-6">Loading shared budgets...</div>;
  if (error) return <div className="text-red-600 py-6 text-center">{error}</div>;
  if (sharedBudgets.length === 0)
    return <div className="p-4 bg-orange-200 rounded shadow text-center">No shared budgets found</div>;

  return (
    <div className="px-4 md:px-8 space-y-6 min-h-screen bg-orange-50">
      <h2 className="text-2xl font-semibold mb-4">Shared Payments</h2>

      <div className="grid gap-6">
        {sharedBudgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-lg">{budget.name}</h3>
            <p className="text-gray-600 mb-2">
              Total: ₹{Number(budget.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <div className="divide-y">
              {calculateOwed(budget).map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 text-gray-700">
                  <span>{p.username}</span>
                  <span className="font-semibold">₹{p.owes}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
