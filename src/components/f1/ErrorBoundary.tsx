import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by F1 ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f2f0ea] text-stone-900 p-8 font-mono text-center z-50">
          <h2 className="text-sm font-bold mb-4 uppercase tracking-widest text-red-600">Museum Showcase Error</h2>
          <p className="text-[10px] max-w-lg text-stone-600 mb-6 leading-relaxed bg-white/50 border border-stone-200 p-4 rounded-lg select-all">
            {this.state.error?.stack || this.state.error?.message || "An unknown error occurred while initializing the 3D scene."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-full border border-stone-950 bg-stone-900 text-white text-[10px] tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            Reload Showcase
          </button>
        </div>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
