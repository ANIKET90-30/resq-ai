import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Zap,
  Check,
  Share2,
  Navigation,
  Users,
  Bot,
  Copy,
  SlidersHorizontal,
  Compass,
  AlertCircle,
  AlertTriangle,
  Radio,
  Plus,
  X,
  Crosshair,
  CheckCircle2,
} from 'lucide-react';
import { DisasterAlert, SavedCoordinates, AggregatedAlert, User, SeverityLevel } from '../types';
import { DBService } from '../services/db';
import { AlertAggregatorService, SortMethod } from '../services/alertAggregator';

interface AlertAggregatorProps {
  user: User | null;
  alerts: DisasterAlert[];
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
}

const LOCATION_PRESETS = [
  { name: 'Downtown Sector (Saved Home)', lat: 30.901, lng: 75.8573 },
  { name: 'Sutlej River Basin Zone B', lat: 30.915, lng: 75.865 },
  { name: 'Northern Forest Ridge', lat: 30.945, lng: 75.815 },
  { name: 'Industrial Corridor Gate 4', lat: 30.898, lng: 75.845 },
  { name: 'Central Coastal Belt Sector', lat: 31.02, lng: 75.75 },
];

export const AlertAggregator: React.FC<AlertAggregatorProps> = ({
  user,
  alerts: initialAlerts,
  onNavigate,
  onOpenSOS,
}) => {
  // Load saved location coordinates from DBService
  const [savedCoords, setSavedCoords] = useState<SavedCoordinates>(() =>
    DBService.getSavedCoordinates(user?.id)
  );

  const [alertsList, setAlertsList] = useState<DisasterAlert[]>(initialAlerts);
  const [sortMethod, setSortMethod] = useState<SortMethod>('priority');
  const [maxDistance, setMaxDistance] = useState<number | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(savedCoords.name);
  const [editLat, setEditLat] = useState<number>(savedCoords.latitude);
  const [editLng, setEditLng] = useState<number>(savedCoords.longitude);

  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [familyNotifiedId, setFamilyNotifiedId] = useState<string | null>(null);
  const [simulatedAlertCount, setSimulatedAlertCount] = useState<number>(0);

  // Sync initialAlerts into state if prop changes
  useEffect(() => {
    setAlertsList(initialAlerts);
  }, [initialAlerts]);

  // Handle Location Saved
  const handleSaveLocation = (name: string, lat: number, lng: number) => {
    const newCoords: SavedCoordinates = {
      name,
      latitude: lat,
      longitude: lng,
      updatedAt: new Date().toISOString(),
    };
    setSavedCoords(newCoords);
    DBService.saveSavedCoordinates(newCoords, user?.id);
    setShowLocationModal(false);
  };

  // Detect GPS coordinates
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        setEditLat(lat);
        setEditLng(lng);
        setEditName('Current GPS Location');
      },
      (err) => {
        alert('Could not retrieve current location: ' + err.message);
      }
    );
  };

  // Manual Feed Refresh
  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }, 600);
  };

  // Simulate Incoming Real-Time High Priority Alert
  const handleSimulateIncomingAlert = () => {
    const alertId = `sim-alt-${Date.now()}`;
    const hazardTypes = [
      {
        title: 'Flash Water Surge Warning — Low-Lying Sector',
        category: 'flood' as const,
        severity: 'critical' as SeverityLevel,
        desc: 'Unannounced reservoir spillway release detected upstream. Surge wave reaching your vicinity within 12 minutes.',
        action: 'Evacuate immediately to 3rd floor or hillside elevated structures.',
        offsetLat: 0.008,
        offsetLng: -0.005,
      },
      {
        title: 'High Velocity Gas Line Leak Detected',
        category: 'health' as const,
        severity: 'critical' as SeverityLevel,
        desc: 'Main supply pipeline ruptured during seismic movement. Methane concentration spiking within 1.5km radius.',
        action: 'Extinguish open flames, do not flip electrical switches, evacuate upwind.',
        offsetLat: -0.006,
        offsetLng: 0.007,
      },
      {
        title: 'Urban Brushfire Rapid Flame Advance',
        category: 'fire' as const,
        severity: 'high' as SeverityLevel,
        desc: 'Wind gusts pushing flame front towards residential perimeter at 35 km/h.',
        action: 'Close all exterior shutters, soak perimeter, gather go-bag for immediate signal.',
        offsetLat: 0.012,
        offsetLng: 0.011,
      },
    ];

    const template = hazardTypes[simulatedAlertCount % hazardTypes.length];
    const newAlert: DisasterAlert = {
      id: alertId,
      title: template.title,
      category: template.category,
      severity: template.severity,
      location: `Near ${savedCoords.name}`,
      latitude: parseFloat((savedCoords.latitude + template.offsetLat).toFixed(4)),
      longitude: parseFloat((savedCoords.longitude + template.offsetLng).toFixed(4)),
      radiusKm: 8,
      issuedAt: new Date().toISOString(),
      source: 'Automated Sensor Mesh Grid',
      description: template.desc,
      actionRequired: template.action,
    };

    setAlertsList((prev) => [newAlert, ...prev]);
    setSimulatedAlertCount((prev) => prev + 1);
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  // Process and sort aggregated alerts using AlertAggregatorService
  const aggregatedAlerts: AggregatedAlert[] = AlertAggregatorService.processAlerts(
    alertsList,
    savedCoords,
    {
      sortMethod,
      maxDistanceKm: maxDistance,
      category: categoryFilter,
    }
  ).filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalCount = alertsList.length;
  const inRadiusCount = alertsList.filter((a) => {
    const aggregated = AlertAggregatorService.processAlerts([a], savedCoords)[0];
    return aggregated.isWithinRadius;
  }).length;
  const criticalCount = alertsList.filter((a) => a.severity === 'critical').length;

  const handleCopyBrief = (alertItem: AggregatedAlert) => {
    const brief = `[EMERGENCY ALERT: ${alertItem.priorityLabel}]\nTitle: ${alertItem.title}\nSeverity: ${alertItem.severity.toUpperCase()}\nDistance: ${alertItem.distanceKm} km from ${savedCoords.name}\nAction: ${alertItem.actionRequired}\nSource: ${alertItem.source}`;
    navigator.clipboard.writeText(brief);
    setCopiedId(alertItem.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNotifyFamily = (alertItem: AggregatedAlert) => {
    setFamilyNotifiedId(alertItem.id);
    setTimeout(() => setFamilyNotifiedId(null), 3000);
  };

  return (
    <div className="space-y-5 text-slate-100">
      {/* Aggregator Header Panel */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
                Automated Alert Aggregator Service
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                Location-Aware Spatial Triage
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              Priority Hazard Feed
            </h2>

            {/* Saved Location Badge Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-1">
              <span className="text-slate-400">Aggregating alerts for saved coordinates:</span>
              <button
                onClick={() => {
                  setEditName(savedCoords.name);
                  setEditLat(savedCoords.latitude);
                  setEditLng(savedCoords.longitude);
                  setShowLocationModal(true);
                }}
                className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-bold flex items-center gap-1.5 transition-all shadow-sm group"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
                <span>{savedCoords.name}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  ({savedCoords.latitude.toFixed(4)}°, {savedCoords.longitude.toFixed(4)}°)
                </span>
                <span className="text-[10px] text-cyan-400 underline ml-1">Change</span>
              </button>
            </div>
          </div>

          {/* Realtime Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateIncomingAlert}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Real-time Alert</span>
            </button>

            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refreshed {lastRefreshed}</span>
            </button>
          </div>
        </div>

        {/* Spatial Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-[10px] uppercase font-mono text-slate-500 font-semibold">Total Aggregated</span>
            <span className="text-lg font-black font-mono text-white">{totalCount} Alerts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-[10px] uppercase font-mono text-slate-500 font-semibold">Inside Hazard Zone</span>
            <span className="text-lg font-black font-mono text-rose-400">{inRadiusCount} Alerts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-[10px] uppercase font-mono text-slate-500 font-semibold">Critical Severity</span>
            <span className="text-lg font-black font-mono text-amber-400">{criticalCount} Critical</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-[10px] uppercase font-mono text-slate-500 font-semibold">Sorting Engine</span>
            <span className="text-xs font-bold text-cyan-300 capitalize">{sortMethod} Score</span>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search aggregated alerts by title, source, location..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none"
          />
        </div>

        {/* Filter Controls Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="flood">Flood</option>
              <option value="fire">Wildfire</option>
              <option value="earthquake">Earthquake</option>
              <option value="storm">Storm</option>
              <option value="health">Health & Chemical</option>
            </select>
          </div>

          {/* Proximity Radius Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Distances</option>
              <option value="5">Within 5 km</option>
              <option value="15">Within 15 km</option>
              <option value="30">Within 30 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>

          {/* Sorting Method Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortMethod}
              onChange={(e: any) => setSortMethod(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="priority">Priority Weighted Score</option>
              <option value="proximity">Closest Distance First</option>
              <option value="severity">Highest Severity First</option>
              <option value="recency">Most Recent First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Aggregated Alerts Feed List */}
      <div className="space-y-3.5">
        {aggregatedAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900 border border-dashed border-slate-800 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No Disaster Alerts Match Your Filter Criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your proximity radius, category filter, or search keywords to view aggregated alerts across other zones.
            </p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setMaxDistance('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-cyan-400 hover:bg-slate-700 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          aggregatedAlerts.map((item, idx) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 relative overflow-hidden ${
                item.priorityLabel === 'P1 - Critical'
                  ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-rose-950/30 border-rose-500/50 shadow-xl shadow-rose-950/20'
                  : item.priorityLabel === 'P2 - High'
                  ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/20 border-amber-500/40 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Priority Badge, Proximity & Time */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Priority Tag */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                      item.priorityLabel === 'P1 - Critical'
                        ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse'
                        : item.priorityLabel === 'P2 - High'
                        ? 'bg-amber-500 text-slate-950'
                        : item.priorityLabel === 'P3 - Moderate'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{item.priorityLabel}</span>
                  </span>

                  {/* Priority Score Tag */}
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800">
                    Priority Score: {item.priorityScore}
                  </span>

                  {/* Category Tag */}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.category}
                  </span>
                </div>

                {/* Spatial Proximity Tag */}
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`font-bold font-mono flex items-center gap-1 ${
                      item.distanceKm <= 3
                        ? 'text-rose-400'
                        : item.distanceKm <= 10
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{item.distanceKm} km away</span>
                  </span>

                  <span className="text-slate-500 text-[11px]">
                    Issued {item.timeAgoMinutes < 1 ? 'Just now' : `${item.timeAgoMinutes}m ago`}
                  </span>
                </div>
              </div>

              {/* Title & Location Header */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{item.title}</h3>

                  {item.isWithinRadius && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex-shrink-0 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      Direct Hazard Radius Overlap
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Target Area: {item.location}</span>
                  <span>•</span>
                  <span>Source: {item.source}</span>
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

              {/* Required Action Banner */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs text-cyan-300 font-medium flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Mandatory Action: </strong>
                  <span>{item.actionRequired}</span>
                </div>
              </div>

              {/* Interactive Quick Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Route to Shelter */}
                  <button
                    onClick={() => onNavigate('map')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Find Safe Shelter Route</span>
                  </button>

                  {/* Ask AI Assistant */}
                  <button
                    onClick={() => onNavigate('assistant')}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Triage Plan</span>
                  </button>

                  {/* Broadcast to Family Safety Grid */}
                  <button
                    onClick={() => handleNotifyFamily(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    {familyNotifiedId === item.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Notified Family Grid</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Notify Family Grid</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Copy Alert Brief */}
                <button
                  onClick={() => handleCopyBrief(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Brief Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Brief</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Saved Location Coordinates Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Update Saved Coordinates</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              The automated alert aggregator calculates spatial proximity and priority scores using your saved coordinates.
            </p>

            {/* Presets List */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Choose Quick Sector Preset:</label>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {LOCATION_PRESETS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setEditName(preset.name);
                      setEditLat(preset.lat);
                      setEditLng(preset.lng);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left text-xs flex items-center justify-between group transition-all"
                  >
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-400">{preset.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {preset.lat}, {preset.lng}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Coordinates Inputs */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLocation(editName, editLat, editLng);
              }}
              className="space-y-3 pt-2 border-t border-slate-800"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Saved Location Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Saved Home / Sector 4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editLat}
                    onChange={(e) => setEditLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editLng}
                    onChange={(e) => setEditLng(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleDetectGPS}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Detect GPS Location from Device</span>
              </button>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Save Coordinates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
