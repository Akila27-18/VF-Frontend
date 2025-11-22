// src/components/ErrorBoundary.jsx
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

  render() {
    if (this.state.hasError) {
      // Use fallback prop if provided, else default message
      return this.props.fallback || (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Something went wrong.
        </div>
      );
    }

    return this.props.children;
  }
}
