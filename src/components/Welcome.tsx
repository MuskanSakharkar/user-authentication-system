import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { 
  ShieldCheck, 
  LogOut, 
  User as UserIcon, 
  Mail, 
  CheckCircle, 
  Calendar, 
  KeyRound, 
  Database, 
  Lock, 
  Code, 
  Copy, 
  Check, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeProps {
  token: string;
  user: User | null;
  onLogout: () => void;
  onRefreshUser?: (updatedUser: User) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ token, user, onLogout, onRefreshUser }) => {
  const [profile, setProfile] = useState<User | null>(user);
  const [isLoading, setIsLoading] = useState(!user);
  const [error, setError] = useState<string | null>(null);
  const [showJwtInspector, setShowJwtInspector] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Fetch live protected profile data using JWT Bearer header
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'JWT authentication failed. Session expired.');
        }

        setProfile(data.user);
        if (onRefreshUser && data.user) {
          onRefreshUser(data.user);
        }
      } catch (err: any) {
        console.error('Profile fetch failed:', err);
        setError(err.message || 'Session expired or invalid token.');
        // If unauthorized, trigger logout after short delay
        setTimeout(() => {
          onLogout();
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const decodeJwtPayload = (jwtToken: string) => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return { error: 'Invalid JWT format' };
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p className="text-sm text-slate-500 font-medium">
          Verifying JWT Token with Express Backend...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Authentication Failed
        </h3>
        <p className="text-sm text-rose-600 max-w-xs mx-auto">
          {error}
        </p>
        <p className="text-xs text-slate-400">
          Redirecting to Login...
        </p>
      </div>
    );
  }

  const currentUser = profile || user;
  const decodedToken = token ? decodeJwtPayload(token) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protected Route Accessed</span>
        </div>

        <h2 id="welcome-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back, {currentUser?.name || 'User'}!
        </h2>
        <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1.5">
          <CheckCircle className="w-4 h-4" />
          <span>You are successfully authenticated.</span>
        </p>
      </div>

      {/* User Information Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Account Profile
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            ✓ Authenticated
          </span>
        </div>

        <div className="space-y-3 text-sm">
          {/* Name */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-0.5">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Full Name</p>
              <p id="user-display-name" className="font-bold text-slate-900 text-base">
                {currentUser?.name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Email Address</p>
              <p id="user-display-email" className="font-semibold text-slate-800 font-mono text-sm">
                {currentUser?.email}
              </p>
            </div>
          </div>

          {/* Member Since / Registration Date */}
          {currentUser?.createdAt && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Member Since</p>
                <p className="font-medium text-slate-700 text-xs">
                  {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backend Tech Stack Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium">
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center justify-center gap-1">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>MongoDB Atlas</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center justify-center gap-1">
          <Lock className="w-3.5 h-3.5 text-blue-600" />
          <span>bcryptjs Hash</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center justify-center gap-1">
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
          <span>JWT Bearer</span>
        </div>
      </div>

      {/* Interactive JWT Token Inspector */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
        <button
          id="btn-toggle-jwt-inspector"
          onClick={() => setShowJwtInspector(!showJwtInspector)}
          className="w-full py-2.5 px-3.5 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-600" />
            <span>Inspect JWT Token Payload</span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold uppercase">
            {showJwtInspector ? 'Hide' : 'View Token'}
          </span>
        </button>

        {showJwtInspector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3.5 bg-slate-900 text-slate-200 text-xs space-y-3 font-mono border-t border-slate-800"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase text-blue-400 font-bold">Decoded Token Payload:</span>
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToken ? 'Copied' : 'Copy Token'}</span>
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 rounded-lg overflow-x-auto text-[11px] text-emerald-400 leading-relaxed border border-slate-800">
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Raw Bearer Authorization Header:</span>
              <p className="p-2 bg-slate-950 rounded-lg text-[10px] text-slate-400 break-all border border-slate-800">
                Authorization: Bearer {token}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Logout Button */}
      <button
        id="btn-logout"
        onClick={onLogout}
        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:scale-[1.005]"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </motion.div>
  );
};

