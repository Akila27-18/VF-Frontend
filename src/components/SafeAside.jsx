// src/components/SafeAside.jsx
import React from "react";
import ChatPanel from "./ChatPanel";
import NewsFeed from "./NewsFeed";
import MultiStockWidget from "./dashboard/MultiStockWidget";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("SafeAside child error:", error, info); }
  render() {
    if (this.state.hasError) return <div className="p-4 bg-red-100 text-red-700 rounded">Widget failed to load</div>;
    return this.props.children;
  }
}

export default function SafeAside({ wsUrl, stockSymbols = [] }) {
  return (
    <aside className="space-y-4 w-full max-w-xs">
      <ErrorBoundary><ChatPanel wsUrl={wsUrl} /></ErrorBoundary>
      <ErrorBoundary><NewsFeed /></ErrorBoundary>
      <ErrorBoundary><MultiStockWidget symbols={stockSymbols} /></ErrorBoundary>
    </aside>
  );
}
