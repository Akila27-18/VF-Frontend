import React, { useEffect, useState } from "react";

export default function Payments() {
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settledPayments, setSettledPayments] = useState([]);

  /** Load from localStorage on mount */
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    const data = savedExpenses ? JSON.parse(savedExpenses) : [];
    setExpenses(data);

    const balances = computeBalances(data);
    const computedPayments = computePaymentsFromBalances(balances);
    setPayments(computedPayments);

    const savedSettled = localStorage.getItem("settledPayments");
    if (savedSettled) setSettledPayments(JSON.parse(savedSettled));
  }, []);

  /** Compute per-user net balances */
  const computeBalances = (expenses) => {
    const balances = {};

    expenses.forEach((e) => {
      if (!e.shared || !e.participants || !e.paidBy) return;

      const total = Number(e.amount) || 0;
      const participants = e.participants.length || 1;
      const share = total / participants;

      // Each participant owes their share
      e.participants.forEach((p) => {
        balances[p] = (balances[p] || 0) - share;
      });

      // Payer gets full credit
      balances[e.paidBy] = (balances[e.paidBy] || 0) + total;
    });

    return balances;
  };

  /** Compute minimal pay graph */
  const computePaymentsFromBalances = (balances) => {
    const debtors = [];
    const creditors = [];

    for (const [user, amount] of Object.entries(balances)) {
      if (amount > 0) creditors.push({ user, amount });
      else if (amount < 0) debtors.push({ user, amount: -amount });
    }

    // Sort for cleaner deterministic matching
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const payments = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      payments.push({
        from: debtor.user,
        to: creditor.user,
        amount: Number(amount.toFixed(2)),
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount <= 0.0001) i++;
      if (creditor.amount <= 0.0001) j++;
    }

    return payments;
  };

  /** Mark any payment as settled */
  const markSettled = (from, to) => {
    const updated = [...settledPayments, { from, to }];
    setSettledPayments(updated);
    localStorage.setItem("settledPayments", JSON.stringify(updated));
  };

  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { minimumFractionDigits: 2 })
      : n;

  return (
    <div className="space-y-6 px-4 md:px-8 pb-8">
      <h1 className="text-2xl font-bold">Payments</h1>

      {payments.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p, idx) => {
            const isSettled = settledPayments.some(
              (s) => s.from === p.from && s.to === p.to
            );

            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-lg">
                    {p.from} → {p.to}
                  </div>

                  <div
                    className={`text-sm font-medium mt-1 px-2 py-0.5 rounded inline-block ${
                      isSettled
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isSettled ? "Settled" : "Pending"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-semibold text-lg">₹{fmt(p.amount)}</div>

                  {!isSettled && (
                    <button
                      className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 text-sm"
                      onClick={() => markSettled(p.from, p.to)}
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
        <div className="text-gray-500 text-sm">No payments required 🎉</div>
      )}
    </div>
  );
}
