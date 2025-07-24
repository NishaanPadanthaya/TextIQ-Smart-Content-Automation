import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-bold text-red-800 mb-2">Component Error</h1>
            <p className="text-red-600 mb-4">{this.state.error?.message || 'Unknown error occurred'}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Import components with lazy loading and error handling
// Navigation component that uses router hooks
const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">🚀 TextIQ</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/transform"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/transform') ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Transform
            </Link>
            <Link
              to="/qa"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/qa') ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Q&A
            </Link>
            <Link
              to="/presentation"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/presentation') ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Presentation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const TextTransform = React.lazy(() => import('./pages/TextTransform'));
const QAPage = React.lazy(() => import('./pages/QAPage'));
const PresentationGenerator = React.lazy(() => import('./pages/PresentationGenerator'));





function App() {
  console.log('App component rendering...');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />

        <Navigation />

        {/* Content */}
        <main>
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <React.Suspense fallback={<div className="p-8">Loading Dashboard...</div>}>
                  <Dashboard />
                </React.Suspense>
              </ErrorBoundary>
            } />
            <Route path="/transform" element={
              <ErrorBoundary>
                <React.Suspense fallback={<div className="p-8">Loading Text Transform...</div>}>
                  <TextTransform />
                </React.Suspense>
              </ErrorBoundary>
            } />
            <Route path="/qa" element={
              <ErrorBoundary>
                <React.Suspense fallback={<div className="p-8">Loading Q&A...</div>}>
                  <QAPage />
                </React.Suspense>
              </ErrorBoundary>
            } />
            <Route path="/presentation" element={
              <ErrorBoundary>
                <React.Suspense fallback={<div className="p-8">Loading Presentation Generator...</div>}>
                  <PresentationGenerator />
                </React.Suspense>
              </ErrorBoundary>
            } />

          </Routes>
        </main>
      </div>
    </Router>
  );

}

export default App;
