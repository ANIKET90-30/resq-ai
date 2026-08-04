import React from 'react';
import {
  ShieldAlert,
  Bot,
  Camera,
  MapPin,
  Radio,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  HeartHandshake,
  Globe,
  Zap,
  Lock,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSOS }) => {
  return (
    <div className="space-y-16 pb-16 animate-fade-in text-slate-100">
      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 overflow-hidden shadow-2xl">
        {/* Background glow graphics */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Disaster Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white leading-tight">
            ResQ AI <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Emergency Intelligence Platform
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            Prepare, respond, and recover with server-side AI, multimodal computer vision hazard detection, real-time shelter routing, and one-tap emergency SOS broadcasts.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('assistant')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Assistant</span>
            </button>

            <button
              onClick={onOpenSOS}
              className="px-5 py-3.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-400 font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Threat Ticker */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 text-xs overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-bold uppercase tracking-wider flex-shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Active Threat Monitor</span>
        </div>
        <div className="truncate text-slate-300 font-mono">
          [CRITICAL] Sutlej River Flood Stage +1.8m · [HIGH] Forest Rim Ridge Wildfire Watch · [MODERATE] Seismic Aftershocks Sector 4
        </div>
      </div>

      {/* Core Capabilities Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Engineered for Critical Seconds</h2>
          <p className="text-sm text-slate-400">
            A comprehensive disaster response stack built with zero-trust privacy and offline resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
              AI Emergency Assistant
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step-by-step guidance for evacuation, CPR, structural collapse, and wildfire protocols powered by server-side Gemini AI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
              Multimodal Hazard Scanner
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload or snap a photo of any scene. The computer vision scanner evaluates risk scores and flags immediate danger points.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
              Interactive Shelter Map
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time routing to hospitals, clean water stations, relief shelters, and police stations with capacity tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-400 transition-colors">
              One-Tap SOS Broadcast
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly transmit GPS coordinates via SMS, acoustic siren alarm, and pre-formatted emergency dispatch links.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
              Offline First Aid Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully cached offline protocols for CPR, severe bleeding, burns, fractures, and flood survival accessible with zero cellular signal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
              Privacy & GDPR Compliance
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict location consent policies, encrypted session storage, and one-click personal data export or account deletion.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-display text-white">Built for All Disaster Ecosystems</h2>
          <p className="text-xs text-slate-400">Tailored operational workflows for individuals and emergency organizations.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <Users className="w-6 h-6 text-cyan-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">Families</h4>
            <p className="text-[10px] text-slate-500">Go-bags & GPS SOS</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <Building2 className="w-6 h-6 text-blue-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">NGOs</h4>
            <p className="text-[10px] text-slate-500">Resource dispatch</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <Radio className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">Responders</h4>
            <p className="text-[10px] text-slate-500">Incident triage</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <HeartHandshake className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">Gov Orgs</h4>
            <p className="text-[10px] text-slate-500">Mass alert feeds</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <Globe className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">Travelers</h4>
            <p className="text-[10px] text-slate-500">Offline multi-lang</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <Zap className="w-6 h-6 text-indigo-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-200">Students</h4>
            <p className="text-[10px] text-slate-500">Campus emergency</p>
          </div>
        </div>
      </section>

      {/* Pricing & Access Tiers Placeholder */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-display text-white">Accessible Emergency Intelligence</h2>
          <p className="text-xs text-slate-400">Free for public emergency access, scalable for organizations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Citizen & Family</div>
            <div className="text-3xl font-black font-display text-white">Free Forever</div>
            <p className="text-xs text-slate-400">Essential emergency tools for every individual.</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Emergency Assistant</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> One-Tap SOS Location Broadcast</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline First Aid Guide</li>
            </ul>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Get Started
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900 border border-cyan-500/40 space-y-4 relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">
              POPULAR FOR NGOS
            </div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">NGO & Relief Teams</div>
            <div className="text-3xl font-black font-display text-white">$49 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
            <p className="text-xs text-slate-400">Enhanced command features for humanitarian organizations.</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Unlimited Vision Hazard Scans</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Incident Mapping & Heatmaps</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Multi-responder Team Sync</li>
            </ul>
            <button
              onClick={() => onNavigate('pricing')}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Explore NGO Plan
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Government & Enterprise</div>
            <div className="text-3xl font-black font-display text-white">Custom Tier</div>
            <p className="text-xs text-slate-400">Dedicated emergency infrastructure & API feeds.</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Dedicated Cloud SQL Database</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Custom SMS Gateway Integration</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 24/7 SLA Operations Support</li>
            </ul>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Contact Emergency Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
