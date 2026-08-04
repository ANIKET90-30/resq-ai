import React, { useState, useEffect } from 'react';
import {
  Bell,
  Shield,
  Clock,
  User as UserIcon,
  Search,
  Sun,
  Moon,
  AlertTriangle,
  Radio,
  LogOut,
  Settings,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
  unreadCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  onNavigate,
  onOpenSOS,
  unreadCount,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const [time, setTime] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const titleMap: Record<string, string> = {
    landing: 'Home',
    dashboard: 'Command Center Dashboard',
    'user-dashboard': 'User Safety & Security Dashboard',
    assistant: 'AI Emergency Intelligence Assistant',
    hazard: 'Multimodal Image Hazard Analysis',
    map: 'Live Emergency Map & Shelter Router',
    checklist: 'Preparedness Checklists',
    guide: 'Offline Emergency & First Aid Guide',
    notifications: 'Real-time Emergency Alerts',
    admin: 'Emergency Operations & Response Command',
    settings: 'Platform Settings & Safety Controls',
    features: 'Platform Capabilities',
    pricing: 'Plans & NGO Access',
    about: 'Mission & Emergency Architecture',
    contact: 'Emergency Contacts & Support',
    privacy: 'Privacy Policy & Data Security',
    terms: 'Terms of Service',
    login: 'Sign In',
    signup: 'Create ResQ Account',
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Title & Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 font-display text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20">
            RQ
          </div>
          <span className="hidden sm:inline">ResQ AI</span>
        </button>

        <span className="hidden md:inline text-slate-700">|</span>

        <h1 className="text-sm font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-xs md:max-w-none">
          {titleMap[activeView] || 'ResQ AI'}
        </h1>

        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Grid Active
        </div>
      </div>

      {/* Right section: Clock, SOS, Theme, Notifs, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Clock */}
        <div className="hidden xl:flex items-center gap-1.5 font-mono text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time}</span>
        </div>

        {/* Global Emergency SOS Quick Button */}
        <button
          onClick={onOpenSOS}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 border border-red-400/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          title="Trigger Emergency SOS Broadcast"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
          <span>SOS</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Disaster Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Account / Profile Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs">
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-slate-300 max-w-[100px] truncate">
                {user.fullName}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="font-semibold text-slate-200">{user.fullName}</p>
                  <p className="text-slate-500 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('user-dashboard');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center gap-2 mt-1"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  User Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings & Profile
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-amber-400 flex items-center gap-2"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    Admin Command
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
