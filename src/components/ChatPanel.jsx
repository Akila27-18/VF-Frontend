// frontend/src/components/ChatPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./hooks/useWebSocket";

export default function ChatPanel({ wsUrl, user = "You" }) {
  const scroller = useRef(null);

  // Connect using improved custom hook
  const { messages: rawMessages, sendMessage, connected } = useWebSocket(wsUrl);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  // Convert raw WS messages to chat state
  useEffect(() => {
    rawMessages.forEach((msg) => {
      if (msg.type === "chat") {
        setMessages((prev) => [...prev, msg.payload]);
      }

      if (msg.type === "typing") {
        const from = msg.payload?.from;
        if (!from || from === user) return;

        setTypingUsers((prev) => {
          if (prev.includes(from)) return prev;

          // auto-remove typing after delay
          setTimeout(
            () => setTypingUsers((c) => c.filter((x) => x !== from)),
            2000
          );

          return [...prev, from];
        });
      }
    });
  }, [rawMessages, user]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // Send typing indicator
  const sendTyping = () => {
    sendMessage({
      type: "typing",
      payload: { from: user },
    });
  };

  // Send chat message
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const msg = {
      type: "chat",
      payload: {
        id: "tmp-" + Date.now(),
        from: user,
        text: trimmed,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    };

    sendMessage(msg);
    setMessages((prev) => [...prev, msg.payload]); // optimistic update
    setText("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Partner Chat</div>
        <div
          className={`text-xs ${
            connected ? "text-green-600" : "text-red-500"
          }`}
        >
          {connected ? "Live" : "Offline"}
        </div>
      </div>

      {/* CHAT SCROLLER */}
      <div ref={scroller} className="h-44 overflow-y-auto space-y-3 mb-3 pr-1">
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

        {/* TYPING INDICATOR */}
        {typingUsers.length > 0 && (
          <div className="mr-auto bg-gray-200 text-gray-600 px-3 py-1 rounded-lg inline-block text-sm animate-pulse">
            {typingUsers.join(", ")}{" "}
            {typingUsers.length === 1 ? "is" : "are"} typing…
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            sendTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
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
