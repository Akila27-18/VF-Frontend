import { useState } from "react";
import { useWebSocket } from "./useWebSocket";

const WS_URL = "wss://vf-backend-3.onrender.com/ws/chat/";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const { status, sendMessage } = useWebSocket(WS_URL, (msg) => {
    if (msg.type === "chat") setMessages((prev) => [...prev, msg.payload]);
  });

  const sendChat = (from, text) => {
    sendMessage({ type: "chat", payload: { from, text } });
  };

  return { messages, sendChat, status };
}
