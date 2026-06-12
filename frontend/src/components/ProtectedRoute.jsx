import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-dark-bg transition-colors duration-300">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary-light/10 flex items-center justify-center animate-pulse-glow">
            <Leaf className="w-8 h-8 text-primary dark:text-primary-light animate-spin-slow" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
          Loading EcoStep...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
