import { useEffect, useRef, useState } from "react";

export function useWebSocket(url, maxMessages = 500) {
  const socketRef = useRef(null);
  const reconnectTimeout = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = () => {
    if (!url) return;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, retrying in 2s...");
      setConnected(false);
      reconnectTimeout.current = setTimeout(connect, 2000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev.slice(-maxMessages + 1), data]);
      } catch (err) {
        console.error("Invalid WS message:", event.data);
      }
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [url]);

  const sendMessage = (obj) => {
    if (socketRef.current?.readyState === 1) {
      socketRef.current.send(JSON.stringify(obj));
    }
  };

  return { connected, messages, sendMessage };
}
