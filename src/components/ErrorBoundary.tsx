import { Component, ReactNode } from 'react';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-8 text-center text-zinc-400">Algo deu errado. <button onClick={() => window.location.reload()} className="text-emerald-500 underline">Recarregar</button></div>;
    return this.props.children;
  }
}