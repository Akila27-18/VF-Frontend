// src/pages/Payments.jsx
import React, { useEffect, useState } from "react";

export default function Payments() {
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settledPayments, setSettledPayments] = useState([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    const data = savedExpenses ? JSON.parse(savedExpenses) : [];
    setExpenses(data);

    const items = data.flatMap((e, idx) => {
      if (!e.shared || !e.participants || !e.paidBy) return [];
      const share = Number(e.amount);
      return e.participants
        .filter((p) => p !== e.paidBy)
        .map((p) => ({
          id: `${e.date}_${e.description}_${p}_${e.paidBy}_${idx}`,
          description: e.description,
          from: p,
          to: e.paidBy,
          amount: parseFloat(share.toFixed(2)),
        }));
    });

    setPayments(items);

    const savedSettled = localStorage.getItem("settledPayments");
    if (savedSettled) setSettledPayments(JSON.parse(savedSettled));
  }, []);

  const markSettled = (id) => {
    const updated = [...settledPayments, id];
    setSettledPayments(updated);
    localStorage.setItem("settledPayments", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 px-4 md:px-8">
      <h1 className="text-2xl font-bold">Payments</h1>
      {payments.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p) => {
            const isSettled = settledPayments.includes(p.id);
            return (
              <div key={p.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.from} → {p.to}</div>
                  <div className="text-sm text-gray-500">{isSettled ? "Settled" : "Pending"}</div>
                  <div className="text-xs text-gray-400">{p.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">₹{p.amount.toFixed(0)}</div>
                  {!isSettled && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                      onClick={() => markSettled(p.id)}
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No payments required</div>
      )}
    </div>
  );
}
