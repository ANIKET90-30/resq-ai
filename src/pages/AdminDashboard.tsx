import React, { useState } from 'react';
import {
  Radio,
  ShieldAlert,
  Activity,
  Users,
  Send,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
} from 'lucide-react';
import { EmergencyReport, DisasterAlert, AuditLog } from '../types';
import { DBService } from '../services/db';

interface AdminDashboardProps {
  reports: EmergencyReport[];
  alerts: DisasterAlert[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, alerts: initialAlerts }) => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>(initialAlerts);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'flood' | 'fire' | 'earthquake' | 'storm'>('flood');
  const [newSeverity, setNewSeverity] = useState<'low' | 'moderate' | 'high' | 'critical'>('critical');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newAction, setNewAction] = useState<string>('');
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  const auditLogs: AuditLog[] = DBService.getAuditLogs();

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const newAlert: DisasterAlert = {
      id: 'alt-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      severity: newSeverity,
      location: newLocation.trim(),
      issuedAt: new Date().toISOString(),
      source: 'National Emergency Operations Center (HQ)',
      description: newDesc || 'Immediate emergency advisory issued for specified zone.',
      actionRequired: newAction || 'Evacuate or seek immediate shelter.',
    };

    setAlerts([newAlert, ...alerts]);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);

    // Reset
    setNewTitle('');
    setNewLocation('');
    setNewDesc('');
    setNewAction('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5" />
          <span>Responder Command & Control</span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white">Emergency Operations Dashboard</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Dispatch mass disaster advisories, monitor incoming field reports, inspect security audit logs, and manage grid status.
        </p>
      </div>

      {/* Admin Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Active Incidents</span>
          <div className="text-2xl font-black font-mono text-rose-400">{reports.length}</div>
          <p className="text-[10px] text-slate-500">Field reports pending response</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Broadcast Alerts</span>
          <div className="text-2xl font-black font-mono text-amber-400">{alerts.length}</div>
          <p className="text-[10px] text-slate-500">Active regional broadcasts</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Grid Telemetry</span>
          <div className="text-2xl font-black font-mono text-emerald-400">99.9%</div>
          <p className="text-[10px] text-slate-500">Latency: 14ms · Server Mesh</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Audit Events</span>
          <div className="text-2xl font-black font-mono text-rose-400">{auditLogs.length}</div>
          <p className="text-[10px] text-slate-500">Security actions logged</p>
        </div>
      </div>

      {/* Main Grid: Broadcast Alert Creator + Field Incident Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broadcast Alert Creator Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            <span>Broadcast Mass Advisory</span>
          </div>

          {broadcastSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mass alert broadcasted to regional push channels successfully.</span>
            </div>
          )}

          <form onSubmit={handleBroadcastAlert} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Alert Headline</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Flash Flood Evacuation Order Sector 5"
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Threat Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="flood">Flood</option>
                  <option value="fire">Fire</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="storm">Storm</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e: any) => setNewSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Location Zone</label>
              <input
                type="text"
                required
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Sutlej River Corridor & Coastal Highway"
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Situation Description</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Detailed disaster summary..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Mandatory Action Directive</label>
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g. Evacuate immediately to High School Shelter"
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Emergency Signal Now</span>
            </button>
          </form>
        </div>

        {/* Incoming Field Incident Reports */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Incoming Citizen Reports</span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-bold uppercase">
                      {rep.severity}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 mt-1">{rep.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Status: {rep.status}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{rep.description}</p>
                <p className="text-[10px] text-rose-400 font-mono">📍 Location: {rep.locationName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Audit Log Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Security Audit Trail Log</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">[{log.action}]</span>
                <span>{log.details}</span>
              </div>
              <span className="text-slate-500 text-[10px]">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
