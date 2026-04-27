import React from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} reset={this.reset} />;
      }

      return (
        <div className="error-boundary-overlay">
          <motion.div
            className="error-boundary-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="error-icon">💥</div>
            <h2>Algo deu errado!</h2>
            <p className="error-message">{this.state.error?.message || 'Erro desconhecido'}</p>
            <div className="error-actions">
              <button onClick={this.reset} className="error-reset-btn">
                Tentar Novamente
              </button>
            </div>
            <details className="error-details">
              <summary>Detalhes técnicos</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
