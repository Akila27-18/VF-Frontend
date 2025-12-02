import API from "../lib/api"; // your axios instance

const handleSubmit = async () => {
  if (!title || !total || !selectedUsers.length || !paidBy)
    return alert("Please fill all fields");

  const amount = Number(total);
  const perPerson = amount / selectedUsers.length;

  const newExpenses = selectedUsers.map((user) => ({
    title,
    amount: perPerson,
    category: "Shared",
    shared: true,
    participants: selectedUsers,
    paidBy,
    date: new Date().toISOString().split("T")[0],
  }));

  try {
    const res = await API.post("/expenses", { expenses: newExpenses });
    onAdd(res.data.expenses); // update frontend state
    onClose();
    setTitle("");
    setTotal("");
    setSelectedUsers([]);
    setPaidBy("");
  } catch (err) {
    console.error(err);
    alert("Failed to save expenses. Try again.");
  }
};
