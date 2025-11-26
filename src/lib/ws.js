// src/lib/ws.js

const WS_BASE =
  import.meta.env.PROD
    ? "wss://vf-backend.onrender.com"
    : "ws://localhost:8000";

function wsUrl(path) {
  let cleanPath = path.trim().replace(/([^:]\/)\/+/g, "$1");
  if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
  return `${WS_BASE}${cleanPath}`;
}

export const WS_CHAT = wsUrl("/ws/chat/");
export const WS_NEWS = wsUrl("/ws/news/");
export const WS_DASHBOARD = wsUrl("/ws/dashboard/");
