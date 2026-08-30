import { useState, useEffect } from 'react';
import Login from './Login';
import AdminLivePreview from './AdminLivePreview';
import { AnimatePresence } from 'framer-motion';

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if a token is in localStorage
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fbff] dark:bg-[#06070b]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900 dark:bg-[#06070b] dark:text-slate-100 font-sans">
      <AnimatePresence mode="wait">
        {!token ? (
          <Login key="login" onLogin={handleLogin} />
        ) : (
          <AdminLivePreview key="dashboard" token={token} onLogout={handleLogout} />
        )}
      </AnimatePresence>
    </div>
  );
}
