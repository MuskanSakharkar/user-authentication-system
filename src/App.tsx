import { useState, useEffect } from 'react';
import { AuthView, User, HealthApiResponse } from './types';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Welcome } from './components/Welcome';
import { KeyRound, Database, Lock, RefreshCw, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AuthView>(() => {
    return localStorage.getItem('auth_token') ? 'welcome' : 'login';
  });

  const [healthStatus, setHealthStatus] = useState<HealthApiResponse | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Initial state — COLLAPSED (false on page load)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check health status of backend API
  const checkHealth = async () => {
    try {
      setIsCheckingHealth(true);
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      }
    } catch {
      setHealthStatus(null);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleLoginSuccess = (newToken: string, loggedInUser: User) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    setCurrentView('welcome');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      
      {/* Mobile & Tablet Backdrop Overlay when sidebar is open */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden"
            aria-label="Close sidebar backdrop"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar - Collapsible System Overview Section */}
      <aside
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-40
          bg-slate-900 flex flex-col p-6 sm:p-8 lg:p-10 text-white border-r border-slate-800 shrink-0
          transition-all duration-300 ease-in-out
          ${isSidebarOpen
            ? 'w-[300px] sm:w-[340px] lg:w-[380px] xl:w-[400px] translate-x-0 opacity-100 shadow-2xl lg:shadow-none'
            : 'w-0 p-0 border-0 -translate-x-full lg:-translate-x-full lg:w-0 opacity-0 overflow-hidden pointer-events-none'
          }
        `}
      >
        {/* Brand Header & Close Arrow Button (<) */}
        <div className="flex items-center justify-between gap-3 mb-8 lg:mb-12 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-600/30">
              A
            </div>
            <div>
              <h1 id="app-title" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                AuthFlow <span className="text-blue-500 font-normal text-sm bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">v1.0</span>
              </h1>
            </div>
          </div>

          {/* Close Arrow Button (<) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 shadow-sm flex items-center justify-center text-sm font-bold active:scale-95 shrink-0"
            title="Close sidebar (<)"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* System Overview Section */}
        <div className="flex-grow overflow-y-auto pr-1">
          <p className="text-slate-400 text-xs mb-6 leading-relaxed uppercase tracking-wider font-semibold">
            System Overview
          </p>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">JWT Authentication</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Secure stateless authentication with JSON Web Tokens.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Bcrypt Hashing</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Advanced password salt/hashing on the Node.js backend.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">MongoDB Atlas</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fully integrated Mongoose cloud database storage.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer / Server Status */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Server Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-emerald-400 font-mono font-medium">ONLINE :3000</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">System</p>
            <p className="text-xs font-semibold text-slate-300">v1.0 Operational</p>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 bg-[#F8FAFC] flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative min-h-full">
        {/* Top Header Controls */}
        <div className="flex justify-between items-center w-full mb-8">
          <div className="flex items-center gap-2">
            {/* Open Arrow Button (>) when sidebar is collapsed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all border border-slate-800 flex items-center justify-center text-xs font-bold hover:scale-105 active:scale-95"
                title="Open sidebar (>)"
                aria-label="Open sidebar"
              >
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </button>
            )}

            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              <span>Refresh Health</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            {token && currentView === 'welcome' && (
              <button
                id="header-logout-btn"
                onClick={handleLogout}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
            {!token && currentView === 'login' && (
              <button
                id="header-register-btn"
                onClick={() => setCurrentView('register')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md shadow-blue-500/20"
              >
                Create Account
              </button>
            )}
            {!token && currentView === 'register' && (
              <button
                id="header-login-btn"
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Center Authentication Card Form Container */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            <AnimatePresence mode="wait">
              {currentView === 'register' && (
                <Register
                  key="register-view"
                  onNavigateToLogin={() => setCurrentView('login')}
                />
              )}

              {currentView === 'login' && (
                <Login
                  key="login-view"
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateToRegister={() => setCurrentView('register')}
                />
              )}

              {currentView === 'welcome' && token && (
                <Welcome
                  key="welcome-view"
                  token={token}
                  user={user}
                  onLogout={handleLogout}
                  onRefreshUser={(updatedUser) => setUser(updatedUser)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Verification Footer */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-emerald-100 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </span>
            <span className="text-xs font-semibold text-slate-700">API Connection Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">v1.0.4-stable</p>
        </div>
      </main>
    </div>
  );
}

