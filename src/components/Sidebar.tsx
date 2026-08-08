import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Camera,
  MapPin,
  CheckSquare,
  BookOpen,
  Bell,
  Settings,
  ShieldAlert,
  Radio,
  Home,
  LifeBuoy,
  Info,
  User as UserIcon,
  Satellite,
  FileWarning,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isAdmin }) => {
  const primaryNav = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { id: 'user-dashboard', label: 'User Dashboard', icon: UserIcon, badge: 'Profile' },
    { id: 'hazard-radar', label: 'Hazard Radar', icon: Satellite, badge: 'Live' },
    { id: 'reports-center', label: 'Reports Center', icon: FileWarning, badge: null },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Live' },
    { id: 'hazard', label: 'Image Hazard Scan', icon: Camera, badge: 'Vision' },
    { id: 'map', label: 'Map & Shelters', icon: MapPin, badge: null },
    { id: 'checklist', label: 'Checklists', icon: CheckSquare, badge: null },
    { id: 'guide', label: 'Offline First Aid', icon: BookOpen, badge: 'Cached' },
    { id: 'notifications', label: 'Live Alerts', icon: Bell, badge: 'Alerts' },
  ];

  const secondaryNav = [
    { id: 'landing', label: 'Platform Overview', icon: Home },
    { id: 'features', label: 'Capabilities', icon: ShieldAlert },
    { id: 'pricing', label: 'NGO & Enterprise', icon: LifeBuoy },
    { id: 'about', label: 'Architecture', icon: Info },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];

  if (isAdmin) {
    primaryNav.push({ id: 'admin', label: 'Ops Control', icon: Radio, badge: 'Admin' });
  }

  return (
    <aside className="w-16 md:w-60 flex-shrink-0 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between py-4 sticky top-16 h-[calc(100vh-4rem)] z-20">
      {/* Primary Navigation Section */}
      <div className="space-y-6 px-2 md:px-3 overflow-y-auto">
        <div>
          <div className="hidden md:block text-[10px] font-mono tracking-wider text-slate-500 uppercase px-3 mb-2 font-semibold">
            Emergency Ops
          </div>
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="hidden md:inline truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`hidden md:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        item.badge === 'Live' || item.badge === 'Vision'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : item.badge === 'Alerts'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="hidden md:block text-[10px] font-mono tracking-wider text-slate-500 uppercase px-3 mb-2 font-semibold">
            Resources & Legal
          </div>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System Status Banner */}
      <div className="px-2 md:px-3 pt-3 border-t border-slate-800/80">
        <div className="hidden md:block p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
          <p className="font-semibold text-slate-300 mb-0.5">ResQ Net Mesh</p>
          <p className="text-[10px] text-slate-500">Node: Local Sandbox Cloud</p>
        </div>
      </div>
    </aside>
  );
};
