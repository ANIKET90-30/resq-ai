import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShelterFacility } from '../types';
import { Phone, Navigation, MapPin } from 'lucide-react';

interface InteractiveMapProps {
  shelters: ShelterFacility[];
  userLat?: number;
  userLng?: number;
  selectedCategory?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  shelters,
  userLat = 30.901,
  userLng = 75.857,
  selectedCategory = 'all',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, { zoomControl: true }).setView([userLat, userLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView([userLat, userLng]);
    }

    renderMarkers();
  }, [shelters, userLat, userLng, activeCategory]);

  const getMarkerIcon = (type: string) => {
    let color = '#2ed88a'; // Green shelter default
    if (type === 'hospital') color = '#4f8cff'; // Blue
    else if (type === 'police') color = '#ffb020'; // Amber
    else if (type === 'fire_station') color = '#ff4757'; // Red
    else if (type === 'user') color = '#22d3ee'; // Cyan

    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `<div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid #0f172a;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      "></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  const renderMarkers = () => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // User location marker
    L.marker([userLat, userLng], { icon: getMarkerIcon('user') })
      .addTo(markersGroupRef.current)
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
          <strong style="color: #0284c7;">📍 Your Current Location</strong>
          <p style="margin-top: 4px; color: #475569;">Latitude: ${userLat.toFixed(4)}, Longitude: ${userLng.toFixed(4)}</p>
        </div>`
      );

    // Filter shelters by category
    const filtered =
      activeCategory === 'all' ? shelters : shelters.filter((s) => s.type === activeCategory);

    filtered.forEach((facility) => {
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; font-size: 13px; min-width: 180px; color: #0f172a; padding: 2px;">
          <strong style="font-size: 14px; display: block; margin-bottom: 4px; color: #0f172a;">${facility.name}</strong>
          <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #0284c7;">${facility.type.replace('_', ' ')}</span>
          <p style="margin: 6px 0; font-size: 12px; color: #475569;">${facility.address}</p>
          ${facility.capacity ? `<p style="margin: 4px 0; font-size: 11px; color: #16a34a; font-weight: 600;">Capacity: ${facility.capacity}</p>` : ''}
          <div style="margin-top: 10px; display: flex; gap: 8px;">
            <a href="tel:${facility.phone}" style="padding: 5px 10px; background: #0284c7; color: #fff; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">Call: ${facility.phone}</a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}" target="_blank" rel="noreferrer" style="padding: 5px 10px; background: #334155; color: #fff; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">Directions</a>
          </div>
        </div>
      `;

      L.marker([facility.latitude, facility.longitude], { icon: getMarkerIcon(facility.type) })
        .addTo(markersGroupRef.current!)
        .bindPopup(popupHtml);
    });
  };

  return (
    <div className="space-y-3">
      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 ${
            activeCategory === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Facilities ({shelters.length})
        </button>
        <button
          onClick={() => setActiveCategory('shelter')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${
            activeCategory === 'shelter'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Shelters
        </button>
        <button
          onClick={() => setActiveCategory('hospital')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${
            activeCategory === 'hospital'
              ? 'bg-blue-500 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          Hospitals
        </button>
        <button
          onClick={() => setActiveCategory('police')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${
            activeCategory === 'police'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Police
        </button>
        <button
          onClick={() => setActiveCategory('fire_station')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${
            activeCategory === 'fire_station'
              ? 'bg-rose-500 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          Fire Stations
        </button>
      </div>

      {/* Map canvas */}
      <div className="relative w-full h-[450px] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
      </div>
    </div>
  );
};
