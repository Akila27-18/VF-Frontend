import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { apiFetch } from "../lib/api";

export default function ChatPanel({ wsUrl, user = "You" }) {
  const scroller = useRef(null);
  const typingTimeouts = useRef({});
  const { messages: rawMessages, sendMessage, connected } = useWebSocket(wsUrl);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);

  // ----------------------------- Load older messages -----------------------------
  const loadOlderMessages = async () => {
    if (loadingOlder) return;

    setLoadingOlder(true);
    const oldest = messages[0]?.created_at || new Date().toISOString();

    try {
      const older = await apiFetch(`/chat/messages/?before=${oldest}&limit=20`);
      setMessages((prev) => [...older, ...prev]);
    } catch (err) {
      console.error("Failed to load older messages:", err);
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleScroll = () => {
    if (scroller.current?.scrollTop < 40) loadOlderMessages();
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [messages]);

  // ----------------------------- Handle WebSocket messages -----------------------------
  useEffect(() => {
    if (!rawMessages) return;

    rawMessages.forEach((msg) => {
      if (!msg?.type) return;

      // Chat message
      if (msg.type === "chat" && msg.payload?.id) {
        setMessages((prev) =>
          prev.some((m) => m.id === msg.payload.id)
            ? prev
            : [...prev, {
                ...msg.payload,
                from: msg.payload.from_user || msg.payload.from || "Anonymous",
                created_at: msg.payload.createdAt || msg.payload.created_at || new Date().toISOString()
              }]
        );
      }

      // Typing indicator
      if (msg.type === "typing") {
        const from = msg.payload?.from;
        if (!from || from === user) return;

        setTypingUsers((prev) => (prev.includes(from) ? prev : [...prev, from]));

        if (typingTimeouts.current[from]) clearTimeout(typingTimeouts.current[from]);
        typingTimeouts.current[from] = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((x) => x !== from));
        }, 1600);
      }
    });
  }, [rawMessages, user]);

  // ----------------------------- Auto-scroll on new messages -----------------------------
  useEffect(() => {
    if (!scroller.current) return;
    requestAnimationFrame(() => {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    });
  }, [messages, typingUsers]);

  // ----------------------------- Typing indicator -----------------------------
  const typingTimeout = useRef(null);
  const sendTyping = () => {
    if (typingTimeout.current) return;
    sendMessage({ type: "typing", payload: { from: user } });
    typingTimeout.current = setTimeout(() => {
      typingTimeout.current = null;
    }, 800);
  };

  // ----------------------------- Send message -----------------------------
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const msg = {
      type: "chat",
      payload: {
        id: Date.now().toString(),
        from_user: user,
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    };

    // Optimistic update
    setMessages((prev) => [...prev, { ...msg.payload, created_at: new Date().toISOString() }]);
    sendMessage(msg);
    setText("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Partner Chat</div>
        <div className={`text-xs ${connected ? "text-green-600" : "text-red-500"}`}>
          {connected ? "Live" : "Offline"}
        </div>
      </div>

      {/* Messages */}
      <div ref={scroller} className="h-60 overflow-y-auto space-y-3 mb-3 pr-1">
        {loadingOlder && (
          <div className="text-center text-xs text-gray-500">Loading older messages…</div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] p-2 rounded-lg ${
              m.from_user === user ? "ml-auto bg-[#FF6A00] text-white" : "mr-auto bg-gray-100 text-gray-900"
            }`}
          >
            <div className="text-sm break-words">{m.text}</div>
            <div className="text-[10px] opacity-70 mt-1">
              {m.from_user} • {m.time || new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="mr-auto bg-gray-200 text-gray-600 px-3 py-1 rounded-lg inline-block text-sm animate-pulse">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            sendTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 bg-[#FF6A00] text-white rounded hover:bg-orange-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
