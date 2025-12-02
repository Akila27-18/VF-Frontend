import React, { useState, useRef, useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSocket";

const WS_URL = "wss://vf-backend-2.onrender.com/ws/chat/";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const scroller = useRef(null);

  const { status, sendMessage: sendWSMessage } = useWebSocket(WS_URL, (msg) => {
    if (msg.type === "chat") setMessages((prev) => [...prev, msg.payload]);
    if (msg.type === "typing") {
      const from = msg.payload?.from;
      if (!from) return;
      setTypingUsers((prev) => {
        if (prev.includes(from)) return prev;
        setTimeout(() => setTypingUsers((cur) => cur.filter((x) => x !== from)), 2000);
        return [...prev, from];
      });
    }
  });

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, typingUsers]);

  const sendTyping = () => {
    sendWSMessage({ type: "typing", payload: { from: "You" } });
  };

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const payload = {
      type: "chat",
      payload: {
        from: "You",
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        id: "tmp-" + Date.now(),
      },
    };

    sendWSMessage(payload);
    setMessages((m) => [...m, payload.payload]);
    setText("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Partner Chat</div>
        <div
          className={`text-xs ${
            status === "online"
              ? "text-green-600"
              : status === "connecting"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {status === "online" ? "Live" : status === "connecting" ? "Connecting..." : "Offline"}
        </div>
      </div>

      <div className="h-44 overflow-y-auto space-y-3 mb-3 pr-1" ref={scroller}>
        {messages.map((m) => (
          <div
            key={m.id || Math.random()}
            className={`max-w-[85%] p-2 rounded-lg ${
              m.from === "You" ? "ml-auto bg-[#FF6A00] text-white" : "mr-auto bg-gray-100 text-gray-900"
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

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            sendTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="px-3 py-2 bg-[#FF6A00] text-white rounded hover:bg-orange-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
