import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Phone,
  Navigation,
  Clock,
  Shield,
  Building,
  Flame,
  Radio,
} from 'lucide-react';
import { ShelterFacility } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';

interface NearbyHelpPageProps {
  shelters: ShelterFacility[];
}

export const NearbyHelpPage: React.FC<NearbyHelpPageProps> = ({ shelters }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userLat, setUserLat] = useState<number | undefined>(undefined);
  const [userLng, setUserLng] = useState<number | undefined>(undefined);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied' | 'unsupported'>('loading');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const filtered = shelters.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.type === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>Emergency Infrastructure Directory</span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white">Nearby Help & Relief Shelters</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Real-time location directory for relief centers, trauma hospitals, police command posts, and clean water stations.
        </p>
      </div>

      {locationStatus === 'denied' && (
        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          Location access was blocked, so the map is showing a default area. Allow location access in your browser to see facilities near you.
        </div>
      )}
      {locationStatus === 'unsupported' && (
        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          Your browser doesn't support location services, so the map is showing a default area.
        </div>
      )}

      {/* Interactive Map Component */}
      <InteractiveMap
        shelters={shelters}
        selectedCategory={selectedCategory}
        userLat={userLat}
        userLng={userLng}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by facility name or road address..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Facility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((facility) => (
          <div
            key={facility.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    facility.type === 'shelter'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : facility.type === 'hospital'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : facility.type === 'police'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {facility.type.replace('_', ' ')}
                </span>

                <h3 className="text-sm font-bold text-slate-100">{facility.name}</h3>
              </div>

              {facility.open247 && (
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-mono font-medium">
                  Open 24/7
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{facility.address}</p>

            {facility.capacity && (
              <p className="text-xs text-emerald-400 font-medium">
                Capacity & Notes: {facility.capacity}
              </p>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <a
                href={`tel:${facility.phone}`}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: {facility.phone}</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
