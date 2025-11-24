// src/components/SafeAside.jsx
import React, { memo } from "react";
import PropTypes from "prop-types";
import ChatPanel from "./ChatPanel";
import NewsFeed from "./NewsFeed";
import MultiStockWidget from "./dashboard/MultiStockWidget";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("SafeAside child error:", error, info);
  }

  handleReset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p className="font-semibold">Widget failed to load</p>
          <button
            onClick={this.handleReset}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function SafeAside({ wsUrl, stockSymbols }) {
  return (
    <aside className="space-y-4 w-full max-w-xs">
      <ErrorBoundary>
        <ChatPanel wsUrl={wsUrl} />
      </ErrorBoundary>

      <ErrorBoundary>
        <NewsFeed />
      </ErrorBoundary>

      <ErrorBoundary>
        <MultiStockWidget symbols={stockSymbols} />
      </ErrorBoundary>
    </aside>
  );
}

SafeAside.propTypes = {
  wsUrl: PropTypes.string,
  stockSymbols: PropTypes.arrayOf(PropTypes.string),
};

SafeAside.defaultProps = {
  wsUrl: "",
  stockSymbols: [],
};

export default memo(SafeAside);
