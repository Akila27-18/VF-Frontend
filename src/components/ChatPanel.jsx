import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

export default function ChatPanel({ wsUrl, user = "You" }) {
  const scroller = useRef(null);
  const typingTimeouts = useRef({});
  const { messages: rawMessages, sendMessage, connected } = useWebSocket(wsUrl);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);

  // Load older messages
  const loadOlderMessages = async () => {
    if (loadingOlder || messages.length === 0) return;
    setLoadingOlder(true);

    const oldest = messages[0].createdAt || new Date().toISOString();
    try {
      const res = await axios.get(`/api/messages?before=${oldest}&limit=20`);
      setMessages((prev) => [...res.data, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleScroll = () => {
    if (scroller.current.scrollTop < 50) loadOlderMessages();
  };

  useEffect(() => {
    const s = scroller.current;
    s.addEventListener("scroll", handleScroll);
    return () => s.removeEventListener("scroll", handleScroll);
  }, [messages]);

  // Incoming WS messages
  useEffect(() => {
    rawMessages.forEach((msg) => {
      if (msg.type === "chat" && msg.payload?.id) {
        setMessages((prev) => (prev.some((m) => m.id === msg.payload.id) ? prev : [...prev, msg.payload]));
      }
      if (msg.type === "typing") {
        const from = msg.payload?.from;
        if (!from || from === user) return;

        setTypingUsers((prev) => (prev.includes(from) ? prev : [...prev, from]));
        if (typingTimeouts.current[from]) clearTimeout(typingTimeouts.current[from]);
        typingTimeouts.current[from] = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((x) => x !== from));
          delete typingTimeouts.current[from];
        }, 2000);
      }
    });
  }, [rawMessages, user]);

  // Auto-scroll
  useEffect(() => {
    if (scroller.current) requestAnimationFrame(() => scroller.current.scrollTop = scroller.current.scrollHeight);
  }, [messages, typingUsers]);

  const sendTyping = () => sendMessage({ type: "typing", payload: { from: user } });
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg = { type: "chat", payload: { id: Date.now().toString(), from: user, text: trimmed, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } };
    sendMessage(msg);
    setText("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Partner Chat</div>
        <div className={`text-xs ${connected ? "text-green-600" : "text-red-500"}`}>{connected ? "Live" : "Offline"}</div>
      </div>

      <div ref={scroller} className="h-60 overflow-y-auto space-y-3 mb-3 pr-1">
        {loadingOlder && <div className="text-center text-xs text-gray-500">Loading older messages…</div>}
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[85%] p-2 rounded-lg ${m.from === user ? "ml-auto bg-[#FF6A00] text-white" : "mr-auto bg-gray-100 text-gray-900"}`}>
            <div className="text-sm break-words">{m.text}</div>
            <div className="text-[10px] opacity-70 mt-1">{m.from} • {m.time}</div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="mr-auto bg-gray-200 text-gray-600 px-3 py-1 rounded-lg inline-block text-sm animate-pulse">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); sendTyping(); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={handleSend} className="px-3 py-2 bg-[#FF6A00] text-white rounded hover:bg-orange-600">Send</button>
      </div>
    </div>
  );
}
