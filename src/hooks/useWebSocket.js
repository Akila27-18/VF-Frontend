import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url, maxMessages = 500) {
  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const isMounted = useRef(false);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = useCallback(() => {
    if (!url) return;

    // Avoid duplicate connections
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) return;
      console.log("WS connected");
      setConnected(true);
    };

    ws.onclose = () => {
      if (!isMounted.current) return;

      console.log("WS closed, reconnecting in 2s...");
      setConnected(false);

      reconnectTimer.current = setTimeout(() => {
        if (isMounted.current) connect();
      }, 2000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close(); // triggers onclose → reconnect
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setMessages((prev) => [...prev.slice(-maxMessages + 1), json]);
      } catch {
        console.error("Invalid WS message:", event.data);
      }
    };
  }, [url, maxMessages]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;

      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);

      if (socketRef.current) {
        socketRef.current.onclose = null; // stop reconnect attempts
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    const ws = socketRef.current;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected, cannot send:", data);
    }
  }, []);

  return { connected, messages, sendMessage };
}
