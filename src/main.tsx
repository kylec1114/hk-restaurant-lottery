import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', background: '#0f172a', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>App Error</h2>
          <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', fontSize: '0.75rem' }}>
            {this.state.error.message}\n{this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
