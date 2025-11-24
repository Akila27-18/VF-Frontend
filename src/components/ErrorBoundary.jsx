import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  renderFallback() {
    const { fallback } = this.props;
    const { error } = this.state;

    // 1. If fallback is a function → call with error
    if (typeof fallback === "function") {
      return fallback({ error, reset: this.resetError });
    }

    // 2. If fallback is JSX → render directly
    if (React.isValidElement(fallback)) {
      return fallback;
    }

    // 3. Default fallback UI
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <div className="font-semibold">Something went wrong.</div>

        {import.meta.env.DEV && (
          <pre className="text-xs mt-2 whitespace-pre-wrap">
            {error?.toString()}
          </pre>
        )}

        <button
          onClick={this.resetError}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
        >
          Reset
        </button>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}
