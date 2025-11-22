import { useEffect, useRef, useState } from "react";

export function useWebSocket(url) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Invalid WS message:", event.data);
      }
    };

    return () => ws.close();
  }, [url]);

  const sendMessage = (obj) => {
    if (!socketRef.current || socketRef.current.readyState !== 1) return;
    socketRef.current.send(JSON.stringify(obj));
  };

  return { connected, messages, sendMessage };
}
