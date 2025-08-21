import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isProd = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'production';
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Terjadi kesalahan</h2>
            {isProd ? (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-sm text-red-800">
                Silakan coba lagi beberapa saat atau masuk ulang.
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <pre className="text-sm text-red-800 whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </pre>
              </div>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
