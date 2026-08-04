import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Filter,
  Volume2,
} from 'lucide-react';
import { NotificationItem, DisasterAlert } from '../types';
import { DBService } from '../services/db';

interface NotificationsPageProps {
  alerts: DisasterAlert[];
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  alerts,
  notifications,
  onMarkRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'critical') return a.severity === 'critical';
    if (filter === 'warning') return a.severity === 'high' || a.severity === 'moderate';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5" />
          <span>Real-Time Alert Feed</span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white">Disaster Notifications & Advisories</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Live government and meteorological broadcast channel. Severe weather, flash flood, and seismic advisories.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Advisories ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
            filter === 'critical'
              ? 'bg-rose-500 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Critical Threats
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
            filter === 'warning'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Warnings & Watches
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              alert.severity === 'critical'
                ? 'bg-gradient-to-r from-rose-950/30 to-slate-900 border-rose-500/40'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : alert.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">{alert.location}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{alert.title}</h3>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{new Date(alert.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-medium flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{alert.actionRequired}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">Source: {alert.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
