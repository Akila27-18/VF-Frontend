import React, { useEffect, useRef, useState, useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { apiFetch } from "../lib/api";

export default function ChatPanel({ wsUrl, user = "You", receiverId }) {
  const scroller = useRef(null);
  const typingTimeouts = useRef({});
  const typingDebounce = useRef(null);

  const { messages: rawMessages, sendMessage, connected } = useWebSocket(wsUrl);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);

  // ----------------------------- Normalize incoming messages -----------------------------
  const normalizeMessage = (msg) => ({
    ...msg,
    from_user: msg.from_user || msg.from || "Anonymous",
    created_at: msg.created_at || msg.createdAt || new Date().toISOString(),
    time:
      msg.time ||
      new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
  });

  // ----------------------------- Load older messages -----------------------------
  const loadOlderMessages = async () => {
    if (loadingOlder) return;
    setLoadingOlder(true);

    const oldest = messages[0]?.created_at || new Date().toISOString();

    try {
      const older = await apiFetch(`/chat/messages/?before=${oldest}&limit=20`);
      setMessages((prev) => [...older.map(normalizeMessage), ...prev]);
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

    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const newMessages = [];

      rawMessages.forEach((msg) => {
        if (!msg?.type) return;

        // Chat message from backend
        if (msg.type === "message" && msg.data?.id && !ids.has(msg.data.id)) {
          newMessages.push(normalizeMessage(msg.data));
        }

        // Typing indicator
        if (msg.type === "typing") {
          const from = msg.data?.from; // backend uses "data"
          if (!from || from === user) return;

          setTypingUsers((prevTyping) =>
            prevTyping.includes(from) ? prevTyping : [...prevTyping, from]
          );

          if (typingTimeouts.current[from]) clearTimeout(typingTimeouts.current[from]);
          typingTimeouts.current[from] = setTimeout(() => {
            setTypingUsers((prevTyping) => prevTyping.filter((x) => x !== from));
          }, 1600);
        }
      });

      return [...prev, ...newMessages];
    });
  }, [rawMessages, user]);

  // ----------------------------- Auto-scroll on new messages -----------------------------
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (atBottom) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages, typingUsers]);

  // ----------------------------- Typing indicator -----------------------------
  const sendTyping = useCallback(() => {
    if (typingDebounce.current) clearTimeout(typingDebounce.current);

    // Backend uses self.scope.user.username, no need for from field
    sendMessage({ type: "typing" });

    typingDebounce.current = setTimeout(() => {
      typingDebounce.current = null;
    }, 800);
  }, [sendMessage]);

  // ----------------------------- Send message -----------------------------
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !receiverId) return;

    const msg = {
      type: "message", // must match backend
      payload: {
        text: trimmed,
        receiver_id: receiverId, // required by backend
      },
    };

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      normalizeMessage({
        id: Date.now().toString(),
        from_user: user,
        text: trimmed,
        created_at: new Date().toISOString(),
      }),
    ]);

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
              m.from_user === user
                ? "ml-auto bg-[#FF6A00] text-white"
                : "mr-auto bg-gray-100 text-gray-900"
            }`}
          >
            <div className="text-sm break-words">{m.text}</div>
            <div className="text-[10px] opacity-70 mt-1">
              {m.from_user} • {m.time}
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
          disabled={!text.trim()}
          className="px-3 py-2 bg-[#FF6A00] text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
