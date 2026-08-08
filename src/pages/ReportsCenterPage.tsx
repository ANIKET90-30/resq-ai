import React, { useMemo, useState } from 'react';
import {
  FileWarning,
  Paperclip,
  Plus,
  X,
  Image as ImageIcon,
  Link2,
  Filter,
  BarChart3,
  Flame,
  Waves,
  Activity,
  Car,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { EmergencyReport, User } from '../types';
import { DBService } from '../services/db';

interface ReportsCenterPageProps {
  user: User | null;
  reports: EmergencyReport[];
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  flood: Waves,
  fire: Flame,
  earthquake: Activity,
  accident: Car,
  other: AlertCircle,
};

export const ReportsCenterPage: React.FC<ReportsCenterPageProps> = ({ user, reports: initialReports }) => {
  const [reports, setReports] = useState<EmergencyReport[]>(initialReports);
  const [roleFilter, setRoleFilter] = useState<'mine' | 'all' | 'active' | 'resolved'>(
    user?.role === 'user' ? 'mine' : 'all'
  );
  const [showForm, setShowForm] = useState(false);

  // --- Task 1: Create report with attachment ---
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EmergencyReport['type']>('other');
  const [severity, setSeverity] = useState<EmergencyReport['severity']>('moderate');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  const handleFileAttach = (file: File) => {
    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAttachmentPreview(result);
      setAttachmentUrl(result); // stored as a data URL so it persists with the record
    };
    reader.readAsDataURL(file);
  };

  const handleLinkAttach = (url: string) => {
    setAttachmentUrl(url);
    setAttachmentPreview(url);
    if (!attachmentName) setAttachmentName('linked-evidence');
  };

  const resetForm = () => {
    setTitle('');
    setType('other');
    setSeverity('moderate');
    setLocationName('');
    setDescription('');
    setAttachmentUrl('');
    setAttachmentName('');
    setAttachmentPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    const newReport: EmergencyReport = {
      id: 'rep-' + Date.now(),
      userId: user.id,
      title: title.trim(),
      type,
      severity,
      latitude: 30.9 + (Math.random() - 0.5) * 0.05,
      longitude: 75.85 + (Math.random() - 0.5) * 0.05,
      locationName: locationName.trim() || 'Unspecified location',
      description: description.trim(),
      status: 'active',
      attachmentUrl: attachmentUrl || undefined,
      attachmentName: attachmentName || undefined,
      createdAt: new Date().toISOString(),
    };

    DBService.saveEmergencyReport(newReport);
    setReports((prev) => [newReport, ...prev]);
    resetForm();
    setShowForm(false);
  };

  // --- Task 2: Role-aware filtering ---
  const filteredReports = useMemo(() => {
    switch (roleFilter) {
      case 'mine':
        return reports.filter((r) => r.userId === user?.id);
      case 'active':
        return reports.filter((r) => r.status === 'active' || r.status === 'responding');
      case 'resolved':
        return reports.filter((r) => r.status === 'resolved');
      case 'all':
      default:
        return reports;
    }
  }, [reports, roleFilter, user]);

  // --- Task 3: Analytics / insight summary ---
  const analytics = useMemo(() => {
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    reports.forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    });
    const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
    return { byType, byStatus, topType, total: reports.length };
  }, [reports]);

  const filterTabs: { id: typeof roleFilter; label: string }[] =
    user?.role === 'user'
      ? [
          { id: 'mine', label: 'My Reports' },
          { id: 'all', label: 'All Reports' },
        ]
      : [
          { id: 'all', label: 'All Reports' },
          { id: 'active', label: 'Active / Responding' },
          { id: 'resolved', label: 'Resolved' },
        ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <FileWarning className="w-3.5 h-3.5" />
            <span>Emergency Reports Center</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Reports, Evidence & Insights</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            File a new report with supporting evidence, filter records relevant to your role, and view live
            analytics across all reports.
          </p>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Report'}
        </button>
      </div>

      {/* Task 1: New Report Form with Attachment */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fade-in"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flooded underpass on Main Street"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              >
                <option value="flood">Flood</option>
                <option value="fire">Fire</option>
                <option value="earthquake">Earthquake</option>
                <option value="accident">Accident</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e: any) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
              <input
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. 5th Avenue & Oak Street"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What's happening at the scene?"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Attachment: file upload OR link */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Paperclip className="w-4 h-4" />
              <span>Supporting Evidence (optional)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer text-xs text-slate-300 transition-colors">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>{attachmentName && !attachmentUrl.startsWith('http') ? attachmentName : 'Upload photo/file'}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileAttach(e.target.files[0])}
                />
              </label>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                <Link2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <input
                  placeholder="or paste an image/file URL"
                  onChange={(e) => handleLinkAttach(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {attachmentPreview && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                {attachmentPreview.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)$/i.test(attachmentPreview) ? (
                  <img src={attachmentPreview} alt="attachment preview" className="w-16 h-16 rounded-md object-cover" />
                ) : (
                  <FileWarning className="w-8 h-8 text-slate-500" />
                )}
                <span className="text-[11px] text-slate-400 truncate">{attachmentName || 'Attached evidence'}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors"
          >
            Submit Report
          </button>
        </form>
      )}

      {/* Task 3: Analytics / Insight Summary */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Insight Summary</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500">Total Reports</span>
            <div className="text-xl font-black font-mono text-cyan-400">{analytics.total}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500">Active / Responding</span>
            <div className="text-xl font-black font-mono text-amber-400">
              {(analytics.byStatus['active'] || 0) + (analytics.byStatus['responding'] || 0)}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500">Resolved</span>
            <div className="text-xl font-black font-mono text-emerald-400">{analytics.byStatus['resolved'] || 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500">Top Hazard Type</span>
            <div className="text-sm font-bold text-rose-400 capitalize mt-1">
              {analytics.topType ? `${analytics.topType[0]} (${analytics.topType[1]})` : '—'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(analytics.byType).map(([t, count]) => {
            const Icon = TYPE_ICONS[t] || AlertCircle;
            return (
              <div
                key={t}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span className="capitalize">{t}</span>
                <span className="font-mono text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task 2: Role-aware filter tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>{user?.role === 'user' ? 'Citizen View' : user?.role === 'admin' ? 'Responder View' : 'NGO View'}</span>
          </div>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                roleFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-cyan-500/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="text-[11px] text-slate-500 ml-auto">
            Showing {filteredReports.length} of {reports.length}
          </span>
        </div>

        <div className="space-y-3">
          {filteredReports.length === 0 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
              No reports match this filter.
            </div>
          )}

          {filteredReports.map((r) => {
            const Icon = TYPE_ICONS[r.type] || AlertCircle;
            return (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4">
                {r.attachmentUrl && (
                  <img
                    src={r.attachmentUrl}
                    alt={r.attachmentName || 'evidence'}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-slate-800"
                  />
                )}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <h4 className="text-xs font-bold text-slate-100 truncate">{r.title}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex-shrink-0 ${
                        r.status === 'active'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : r.status === 'responding'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{r.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {r.locationName}
                    </span>
                    <span className="capitalize">{r.severity} severity</span>
                    {r.attachmentUrl && (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Paperclip className="w-3 h-3" /> {r.attachmentName || 'Evidence attached'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
