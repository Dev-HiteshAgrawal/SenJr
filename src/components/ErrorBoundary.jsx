import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Senjr recovered from a render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-container">
          <section className="recovery-card card" role="alert">
            <span className="recovery-kicker">Recovery mode</span>
            <h1>Something paused, but your work is safe.</h1>
            <p>Refresh once. Senjr keeps your session state locally so you can continue without losing momentum.</p>
            <button className="btn-primary" type="button" onClick={() => window.location.reload()}>
              Restore Senjr
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
