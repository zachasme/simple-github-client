import { Component } from "react";
import { html } from "htm/react";

import RedBox from "redbox-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error);
    console.debug({ errorInfo });
  }
  render() {
    // You can render any custom fallback UI
    if (!this.state.error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return "Something went wrong";
  }
}
export default ErrorBoundary;
