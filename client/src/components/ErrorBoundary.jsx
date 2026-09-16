import { Component } from 'react';

/**
 * Global React Error Boundary
 * Catches any JS runtime errors in the component tree and shows a friendly
 * fallback instead of a blank white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f0f11',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', color: '#ff6b6b', marginBottom: '0.75rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '0.5rem', maxWidth: '400px' }}>
            An unexpected error occurred. This is likely a network issue or server cold-start.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '0.5rem',
                background: '#ff9500',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none',
                fontSize: '0.875rem',
              }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '0.5rem',
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid #334155',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              ← Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
