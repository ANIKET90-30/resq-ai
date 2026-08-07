import React, { useEffect, useState } from 'react';
import { Satellite, MapPin, RefreshCw, AlertTriangle, ExternalLink, Radar } from 'lucide-react';
import { ApiClient } from '../services/apiClient';

interface HazardItem {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  date: string;
  sourceUrl: string | null;
}

export const HazardRadarPage: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied' | 'unsupported'>('loading');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [withinRadius, setWithinRadius] = useState<HazardItem[]>([]);
  const [nearestOutside, setNearestOutside] = useState<HazardItem[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const scanForHazards = async () => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ApiClient.getNearbyHazards(coords.lat, coords.lng, radiusKm);
      setWithinRadius(data.withinRadius || []);
      setNearestOutside(data.nearestOutsideRadius || []);
      setLastChecked(new Date());
    } catch (err) {
      setError('Could not reach the live hazard feed. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords) scanForHazards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-100 pb-12">
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Satellite className="w-3.5 h-3.5" />
          <span>Live Global Hazard Feed</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-white">Hazard Radar</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Scans real, currently-active disaster events (wildfires, floods, storms, volcanoes) reported via NASA's
          EONET feed and checks whether any are within range of your actual current location.
        </p>
      </div>

      {locationStatus === 'loading' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          Requesting your location…
        </div>
      )}

      {locationStatus === 'denied' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          Location access was blocked, so Hazard Radar can't check what's near you. Allow location access in your
          browser and reload this page.
        </div>
      )}

      {locationStatus === 'unsupported' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          Your browser doesn't support location services, so Hazard Radar can't run here.
        </div>
      )}

      {locationStatus === 'granted' && coords && (
        <>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="font-mono">
                {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Radius</label>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={250}>250 km</option>
              </select>

              <button
                onClick={scanForHazards}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Scanning…' : 'Rescan'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {!error && !loading && withinRadius.length === 0 && nearestOutside.length === 0 && lastChecked && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold text-center">
              No active hazards detected within {radiusKm} km. You're clear for now.
            </div>
          )}

          {withinRadius.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>{withinRadius.length} active hazard{withinRadius.length > 1 ? 's' : ''} within {radiusKm} km</span>
              </div>
              {withinRadius.map((h) => (
                <HazardCard key={h.id} hazard={h} critical />
              ))}
            </div>
          )}

          {withinRadius.length === 0 && nearestOutside.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Radar className="w-4 h-4" />
                <span>Nothing within {radiusKm} km — nearest known active events</span>
              </div>
              {nearestOutside.map((h) => (
                <HazardCard key={h.id} hazard={h} critical={false} />
              ))}
            </div>
          )}

          {lastChecked && (
            <p className="text-[10px] text-slate-500 text-center">
              Last scanned {lastChecked.toLocaleTimeString()} · Source: NASA EONET live event feed
            </p>
          )}
        </>
      )}
    </div>
  );
};

const HazardCard: React.FC<{ hazard: HazardItem; critical: boolean }> = ({ hazard, critical }) => (
  <div
    className={`p-4 rounded-2xl bg-slate-950 border space-y-2 ${
      critical ? 'border-rose-500/40' : 'border-slate-800'
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div>
        <span
          className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${
            critical
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {hazard.category}
        </span>
        <h4 className="text-xs font-bold text-slate-100 mt-1">{hazard.title}</h4>
      </div>
      <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{hazard.distanceKm} km away</span>
    </div>
    <p className="text-[10px] text-slate-500">{new Date(hazard.date).toLocaleString()}</p>
    {hazard.sourceUrl && (
      <a
        href={hazard.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:underline"
      >
        View source <ExternalLink className="w-3 h-3" />
      </a>
    )}
  </div>
);
