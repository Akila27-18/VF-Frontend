import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useWebSocket } from "../hooks/useWebSocket";

export default function ChatPanel({ wsUrl, user = "You" }) {
  const scroller = useRef(null);
  const typingTimeouts = useRef({});

  const { messages: rawMessages, sendMessage, connected } = useWebSocket(wsUrl);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);

  // -----------------------------
  // Load older messages
  // -----------------------------
  const loadOlderMessages = async () => {
    if (loadingOlder || messages.length === 0) return;
    setLoadingOlder(true);

    const oldest = messages[0]?.createdAt || new Date().toISOString();

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages`,
        {
          params: { before: oldest, limit: 20 }
        }
      );

      if (Array.isArray(res.data)) {
        setMessages((prev) => [...res.data, ...prev]);
      }
    } catch (err) {
      console.error("Load older messages failed:", err);
    } finally {
      setLoadingOlder(false);
    }
  };

  // Scroll listener
  const handleScroll = () => {
    if (scroller.current?.scrollTop < 40) {
      loadOlderMessages();
    }
  };

  useEffect(() => {
    const s = scroller.current;
    if (!s) return;

    s.addEventListener("scroll", handleScroll);
    return () => s.removeEventListener("scroll", handleScroll);
  }, [messages]);

  // -----------------------------
  // Handle incoming WebSocket messages
  // -----------------------------
  useEffect(() => {
    if (!rawMessages || rawMessages.length === 0) return;

    rawMessages.forEach((msg) => {
      if (!msg || !msg.type) return;

      // Chat message
      if (msg.type === "chat" && msg.payload?.id) {
        setMessages((prev) =>
          prev.some((m) => m.id === msg.payload.id)
            ? prev
            : [...prev, msg.payload]
        );
      }

      // Typing indicator
      if (msg.type === "typing") {
        const from = msg.payload?.from;
        if (!from || from === user) return;

        setTypingUsers((prev) =>
          prev.includes(from) ? prev : [...prev, from]
        );

        if (typingTimeouts.current[from]) {
          clearTimeout(typingTimeouts.current[from]);
        }

        typingTimeouts.current[from] = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((x) => x !== from));
        }, 1600);
      }
    });
  }, [rawMessages, user]);

  // -----------------------------
  // Auto-scroll on new messages
  // -----------------------------
  useEffect(() => {
    if (!scroller.current) return;

    requestAnimationFrame(() => {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    });
  }, [messages, typingUsers]);

  // -----------------------------
  // Send typing event (debounced)
  // -----------------------------
  const typingTimeout = useRef(null);
  const sendTyping = () => {
    if (typingTimeout.current) return; // prevent spamming

    sendMessage({ type: "typing", payload: { from: user } });

    typingTimeout.current = setTimeout(() => {
      typingTimeout.current = null;
    }, 800);
  };

  // -----------------------------
  // Send chat message
  // -----------------------------
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const msg = {
      type: "chat",
      payload: {
        id: Date.now().toString(),
        from: user,
        text: trimmed,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    };

    // Optimistic update
    setMessages((prev) => [...prev, msg.payload]);
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
          <div className="text-center text-xs text-gray-500">
            Loading older messages…
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] p-2 rounded-lg ${
              m.from === user
                ? "ml-auto bg-[#FF6A00] text-white"
                : "mr-auto bg-gray-100 text-gray-900"
            }`}
          >
            <div className="text-sm break-words">{m.text}</div>
            <div className="text-[10px] opacity-70 mt-1">
              {m.from} • {m.time}
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
            sendTyping(); // debounced typing
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
