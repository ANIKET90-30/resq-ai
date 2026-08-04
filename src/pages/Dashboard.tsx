import React from 'react';
import {
  ShieldAlert,
  Bot,
  Camera,
  MapPin,
  CheckSquare,
  BookOpen,
  Radio,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  Compass,
} from 'lucide-react';
import { User, DisasterAlert, ShelterFacility, EmergencyReport } from '../types';
import { AlertAggregator } from '../components/AlertAggregator';

interface DashboardProps {
  user: User | null;
  alerts: DisasterAlert[];
  shelters: ShelterFacility[];
  reports: EmergencyReport[];
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  alerts,
  shelters,
  reports,
  onNavigate,
  onOpenSOS,
}) => {
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high');
  const nearestShelter = shelters[0];

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 pb-12">
      {/* Top Banner / Hero Greeting */}
      <div className="relative p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/50 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Real-Time Situation Room</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Welcome, {user ? user.fullName.split(' ')[0] : 'Citizen'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Grid operational. AI disaster monitoring active. Your safety index is updated in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('assistant')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:brightness-110 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </button>

            <button
              onClick={onOpenSOS}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Send SOS Signal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Nearby Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">{alerts.length}</div>
          <p className="text-[11px] text-slate-500">{criticalAlerts.length} High/Critical Severity</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Nearest Shelter</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">1.2 km</div>
          <p className="text-[11px] text-slate-500 truncate">{nearestShelter ? nearestShelter.name : 'Central Shelter'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Prep Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">85%</div>
          <p className="text-[11px] text-slate-500">Go-Bag & First Aid Cached</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Offline Engine</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">Ready</div>
          <p className="text-[11px] text-slate-500">First Aid Guides Synchronized</p>
        </div>
      </div>

      {/* Main Grid: Live Threat Alerts + AI Smart Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Automated Alert Aggregator Feed */}
        <div className="lg:col-span-2">
          <AlertAggregator
            user={user}
            alerts={alerts}
            onNavigate={onNavigate}
            onOpenSOS={onOpenSOS}
          />
        </div>

        {/* Right Col: AI Recommendations & Quick Launcher */}
        <div className="space-y-6">
          {/* AI Smart Advisory Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Situation Recommendation</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                <strong className="text-slate-100">River Basin Advisory:</strong> Flash flood surge predicted downstream within 2 hours.
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                <li>Verify go-bag water supply (minimum 3 Liters per person).</li>
                <li>Charge secondary power banks to 100%.</li>
                <li>Park vehicles away from drainage channels.</li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('assistant')}
              className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Ask AI for Custom Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Action Tiles */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('hazard')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <Camera className="w-5 h-5 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">Scan Hazard</p>
                <p className="text-[10px] text-slate-500">Analyze photo</p>
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <MapPin className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">Find Shelter</p>
                <p className="text-[10px] text-slate-500">Live router</p>
              </button>

              <button
                onClick={() => onNavigate('checklist')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <CheckSquare className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">Prep Checklists</p>
                <p className="text-[10px] text-slate-500">Check go-bag</p>
              </button>

              <button
                onClick={() => onNavigate('guide')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <BookOpen className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">First Aid</p>
                <p className="text-[10px] text-slate-500">Offline guides</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
