import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-red-100">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">Something went wrong</h2>
          <p className="text-xs text-muted-foreground mb-8 max-w-md">
            Our luxury systems encountered a temporary disruption. Please refresh or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-primary text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
