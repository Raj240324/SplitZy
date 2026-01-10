import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-8 animate-pulse">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Something went wrong</h1>
          <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed font-light">
            An unexpected error occurred. Don't worry, your data is safe. Try refreshing the page to get back to the vibez.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="font-bold gap-2 bg-primary hover:bg-primary/90 rounded-2xl px-8"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="w-5 h-5" />
              Reload Page
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl px-8"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-6 bg-black/50 border border-white/5 rounded-3xl text-left max-w-2xl w-full overflow-auto">
              <p className="text-destructive font-mono text-sm mb-2 font-bold">Error Detail:</p>
              <pre className="text-slate-500 font-mono text-xs whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
