import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url, onMessageReceived) {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const [status, setStatus] = useState("connecting");

  const connect = useCallback(() => {
    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setStatus("online");

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (onMessageReceived) onMessageReceived(msg);
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    ws.onclose = () => {
      setStatus("offline");
      reconnectRef.current = setTimeout(connect, 1500);
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
      ws.close();
    };
  }, [url, onMessageReceived]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      reconnectRef.current && clearTimeout(reconnectRef.current);
    };
  }, [connect]);

  const sendMessage = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket not connected");
    }
  }, []);

  return { status, sendMessage };
}
