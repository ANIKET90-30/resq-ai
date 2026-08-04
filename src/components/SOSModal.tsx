import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  MessageSquare,
  MapPin,
  Volume2,
  VolumeX,
  X,
  ShieldCheck,
  Radio,
  Send,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone?: string;
  emergencyContacts?: { name: string; phone: string }[];
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, emergencyContacts = [] }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(true);
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [dispatched, setDispatched] = useState<boolean>(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setDispatched(false);
      if (sirenPlaying) stopSiren();
      return;
    }

    // Capture location with consent
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => {
          // Fallback location
          setLocation({ lat: 30.901, lng: 75.857 });
          setLocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setLocation({ lat: 30.901, lng: 75.857 });
      setLocating(false);
    }
  }, [isOpen]);

  // Handle auto countdown
  useEffect(() => {
    let timer: any;
    if (isOpen && countdown > 0 && !dispatched) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isOpen && countdown === 0 && !dispatched) {
      handleDispatchSOS();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, dispatched]);

  const handleDispatchSOS = async () => {
    setDispatched(true);
    const loc = location || { lat: 30.901, lng: 75.857 };
    await ApiClient.sendSOSAlert(loc, 'Emergency SOS button triggered from mobile web application');
  };

  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);

      // Oscillate siren pitch
      let high = true;
      const sirenInterval = setInterval(() => {
        if (!ctx || ctx.state === 'closed') {
          clearInterval(sirenInterval);
          return;
        }
        osc.frequency.setValueAtTime(high ? 600 : 1100, ctx.currentTime);
        high = !high;
      }, 500);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setAudioCtx(ctx);
      setSirenPlaying(true);
    } catch (e) {
      console.error('Audio siren error:', e);
    }
  };

  const stopSiren = () => {
    if (audioCtx) {
      audioCtx.close();
      setAudioCtx(null);
    }
    setSirenPlaying(false);
  };

  if (!isOpen) return null;

  const mapsUrl = location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : '';
  const sosMsg = encodeURIComponent(
    `EMERGENCY SOS: I need immediate assistance! My current location: ${mapsUrl}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-rose-500/30 p-6 shadow-2xl shadow-rose-950/50 text-slate-100 overflow-hidden">
        {/* Top close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-500 shadow-xl shadow-rose-500/30">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-20"></span>
            <AlertOctagon className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold font-display text-white">EMERGENCY SOS SIGNAL</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Broadcasting emergency alarm, GPS location payload, and rescue coordinates.
          </p>
        </div>

        {/* Countdown Banner */}
        {!dispatched ? (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
              Dispatching Signal In
            </p>
            <div className="text-4xl font-black font-mono text-rose-500 tracking-widest">{countdown}s</div>
            <button
              onClick={handleDispatchSOS}
              className="mt-3 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Send Immediately
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center flex items-center justify-center gap-2 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-5 h-5" />
            <span>SOS Distress Signal Broadcasted to Grid</span>
          </div>
        )}

        {/* GPS Coordinates info */}
        <div className="mb-6 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            {locating ? (
              <span className="text-slate-500 animate-pulse">Acquiring GPS fix...</span>
            ) : location ? (
              <span className="font-mono text-cyan-300">
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </span>
            ) : (
              <span className="text-slate-400">Location unavailable</span>
            )}
          </div>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline font-medium text-[11px]"
            >
              View Map
            </a>
          )}
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Direct Emergency Call */}
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 / Emergency</span>
          </a>

          {/* SMS / WhatsApp Location Broadcast */}
          <a
            href={`sms:?body=${sosMsg}`}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send Location SMS</span>
          </a>
        </div>

        {/* Loud Audio Siren Synthesizer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Acoustic Emergency Alarm Siren</span>
          </div>

          <button
            onClick={toggleSiren}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              sirenPlaying
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {sirenPlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5" /> Stop Siren
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" /> Start Siren
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
