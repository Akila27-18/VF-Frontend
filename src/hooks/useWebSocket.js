import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url, maxMessages = 500) {
  const socketRef = useRef(null);
  const reconnectTimeout = useRef(null);
  const isMounted = useRef(false);
  const manuallyClosed = useRef(false);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = useCallback(() => {
    if (!url) return console.warn("WebSocket URL missing");

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

    manuallyClosed.current = false;

    // CLEAN URL (do NOT remove trailing slash)
    let cleanUrl = url.trim();
    cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, "$1");
    console.log("Final WebSocket URL:", cleanUrl);

    const ws = new WebSocket(cleanUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) return;
      setConnected(true);
      console.log("WebSocket connected ✔");
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setMessages((prev) => [...prev.slice(-maxMessages + 1), json]);
      } catch (e) {
        console.error("Invalid WS message:", event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close();
    };

    ws.onclose = () => {
      if (!isMounted.current || manuallyClosed.current) return;
      setConnected(false);
      console.warn("WebSocket closed. Reconnecting in 2s...");

      reconnectTimeout.current = setTimeout(() => {
        if (isMounted.current && !manuallyClosed.current) connect();
      }, 2000);
    };
  }, [url, maxMessages]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      manuallyClosed.current = true;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected → message dropped:", data);
    }
  }, []);

  return { connected, messages, sendMessage };
}
