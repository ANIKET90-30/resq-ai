import React, { useState } from 'react';
import {
  Shield,
  Key,
  Mail,
  User as UserIcon,
  ArrowRight,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  Radio,
  Building,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AuthService } from '../services/auth';
import { User } from '../types';

interface AuthPageProps {
  view: 'login' | 'signup' | 'forgot';
  onNavigate: (view: string) => void;
  onSuccess: (user: User) => void;
}

export const AuthPages: React.FC<AuthPageProps> = ({ view, onNavigate, onSuccess }) => {
  const [email, setEmail] = useState<string>('alex.citizen@resq.ai');
  const [password, setPassword] = useState<string>('demoPass123');
  const [fullName, setFullName] = useState<string>('Alex Morgan');
  const [role, setRole] = useState<'user' | 'responder' | 'ngo'>('user');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === 'login') {
        const user = await AuthService.login(email, password);
        onSuccess(user);
      } else if (view === 'signup') {
        const user = await AuthService.signup(fullName, email, password, role);
        onSuccess(user);
      } else {
        await AuthService.resetPassword(email);
        alert(`Password reset link dispatched to ${email}`);
        onNavigate('login');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: 'user' | 'admin' | 'ngo') => {
    setLoading(true);
    setError(null);

    const demoEmail =
      demoRole === 'admin'
        ? 'admin.responder@resq.ai'
        : demoRole === 'ngo'
        ? 'ngo.relief@resq.ai'
        : 'alex.citizen@resq.ai';

    try {
      const user = await AuthService.login(demoEmail, 'demoPass123');
      onSuccess(user);
    } catch (err: any) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in text-slate-100 max-w-5xl mx-auto space-y-8">
      {/* Login Portal Title Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Secure Emergency Mesh Authentication
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          {view === 'login'
            ? 'ResQ User Command Dashboard Login'
            : view === 'signup'
            ? 'Create ResQ Emergency Account'
            : 'Reset Account Password'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          {view === 'login'
            ? 'Sign in to access your personal safety dashboard, family emergency grid, AI voice assistant, and live hazard monitoring.'
            : view === 'signup'
            ? 'Join the AI disaster response grid for instant crisis triage, shelter routing, and local emergency alerts.'
            : 'Enter your registered email address to receive secure access recovery instructions.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
        {/* Left Column (5 cols): Demo Presets & Role Information */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Instant Demo Login Presets</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">1-Click Auth</span>
            </div>

            <p className="text-xs text-slate-400">
              Select a pre-configured account role below to immediately test full platform capabilities:
            </p>

            <div className="space-y-3">
              {/* Citizen Demo */}
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-left transition-all hover:scale-[1.01] group space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span>Citizen & Family Account</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                    Default User
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Full access to User Dashboard, AI Voice Assistant, Medical Passport, Hazard Vision, and SOS.
                </p>
              </button>

              {/* Admin / Responder Demo */}
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 text-left transition-all hover:scale-[1.01] group space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <span>First Responder & Ops Admin</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    Ops Command
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Access live incident dispatch, emergency alert broadcasts, shelter capacity management, and triage control.
                </p>
              </button>

              {/* NGO Relief Demo */}
              <button
                type="button"
                onClick={() => handleDemoLogin('ngo')}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/60 text-left transition-all hover:scale-[1.01] group space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>NGO & Relief Coordinator</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                    Relief Grid
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Manage supply distribution, medical aid caches, and disaster shelter logistics.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Main Auth Form Box */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20">
                  RQ
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {view === 'login' ? 'User Credentials Login' : view === 'signup' ? 'New Account Registration' : 'Password Reset'}
                  </h2>
                  <p className="text-[11px] text-slate-400">Encrypted Local Authentication Engine</p>
                </div>
              </div>

              {/* Toggle Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => onNavigate('login')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    view === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    view === 'signup' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.citizen@resq.ai"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {view !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-400">Password</label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => onNavigate('forgot')}
                        className="text-[11px] text-cyan-400 hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {view === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">User Role Profile</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="user">Citizen / Household Resident</option>
                    <option value="responder">First Responder / Paramedic / EMS</option>
                    <option value="ngo">NGO Relief Worker / Logistics Manager</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Authenticating...'
                    : view === 'login'
                    ? 'Sign In to User Dashboard'
                    : view === 'signup'
                    ? 'Complete Account Setup'
                    : 'Dispatch Recovery Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline-capable session caching active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
