const WS_URL = import.meta.env.VITE_WS_URL;

export function createWebSocket(path = "") {
  const url = WS_URL + path; // path appended if needed
  const socket = new WebSocket(url);

  socket.onopen = () => console.log("WebSocket connected:", url);
  socket.onclose = () => console.log("WebSocket disconnected");
  socket.onerror = (err) => console.error("WebSocket error:", err);

  return socket;
}
