import React, { useState } from 'react';
import {
  ShieldAlert,
  Bot,
  Camera,
  MapPin,
  Radio,
  BookOpen,
  CheckCircle2,
  Mail,
  Send,
  Lock,
  Globe,
  Building2,
  FileText,
} from 'lucide-react';

interface PublicPageProps {
  view: 'features' | 'pricing' | 'about' | 'contact' | 'privacy' | 'terms';
  onNavigate: (view: string) => void;
}

export const PublicPages: React.FC<PublicPageProps> = ({ view, onNavigate }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sentMsg, setSentMsg] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentMsg(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setSentMsg(false), 4000);
  };

  if (view === 'features') {
    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-fade-in text-slate-100 pb-12">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-center">
          <h1 className="text-3xl font-bold font-display text-white">Platform Capabilities</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Comprehensive AI disaster intelligence architecture built for zero-downtime emergency operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <Bot className="w-8 h-8 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Server-Side AI Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Google Gemini 3.6 Flash. Executes real-time triage, step-by-step disaster protocol generation, and speech synthesis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <Camera className="w-8 h-8 text-blue-400" />
            <h3 className="text-base font-bold text-white">Multimodal Hazard Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload photos of flooded roads, structural damage, or fire smoke. The computer vision pipeline outputs threat scores and immediate recommendations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <MapPin className="w-8 h-8 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Interactive Shelter Map</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leaflet interactive mapping with proximity filters for hospitals, police stations, fire houses, and clean water distribution camps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <Radio className="w-8 h-8 text-rose-400" />
            <h3 className="text-base font-bold text-white">One-Tap SOS Broadcast</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capture GPS coordinates, launch an acoustic siren alarm, and broadcast pre-formatted distress links to emergency contacts and emergency helplines.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'pricing') {
    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-fade-in text-slate-100 pb-12">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-center">
          <h1 className="text-3xl font-bold font-display text-white">Plans & Access Tiers</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Free forever for public citizen safety, with enterprise & NGO scaling options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-cyan-400 uppercase">Citizen & Family</div>
            <div className="text-3xl font-black font-display text-white">$0</div>
            <p className="text-xs text-slate-400">Essential public safety features.</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Emergency Assistant</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> GPS SOS Broadcast</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline First Aid Guide</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 relative">
            <div className="text-xs font-bold text-cyan-400 uppercase">NGO Relief Team</div>
            <div className="text-3xl font-black font-display text-white">$49 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
            <p className="text-xs text-slate-400">Humanitarian rescue team tools.</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Unlimited Hazard Vision Scans</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Multi-responder Incident Mapping</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-amber-400 uppercase">Gov / Enterprise</div>
            <div className="text-3xl font-black font-display text-white">Custom</div>
            <p className="text-xs text-slate-400">Dedicated emergency grid infrastructure.</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Dedicated PostgreSQL Database</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Custom SMS Gateway Integrations</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'about') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto animate-fade-in text-slate-100 pb-12">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h1 className="text-3xl font-bold font-display text-white">About ResQ AI & Mission</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            ResQ AI was founded on a simple premise: when natural disasters strike, accessible intelligence saves lives. Our platform unifies server-side AI, computer vision hazard analysis, and offline first aid guides into a zero-trust, privacy-first web application.
          </p>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-cyan-400">Clean Architecture</h3>
              <p className="text-slate-400">Express + Vite full-stack node bundle, standard TypeScript typing, and modular adapter interfaces.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-emerald-400">Zero-Trust Privacy</h3>
              <p className="text-slate-400">All Gemini API keys remain strictly on the backend server. Explicit location consent is enforced.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'contact') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-fade-in text-slate-100 pb-12">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h1 className="text-2xl font-bold font-display text-white">Emergency Support & Contact</h1>
          <p className="text-xs text-slate-400">Reach out for government integrations, NGO access grants, or technical support.</p>

          {sentMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              Thank you. Your message has been routed to our emergency response support team.
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="alex.morgan@resq.ai"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Message / Inquiry</label>
              <textarea
                rows={4}
                required
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="How can our emergency platform assist you?"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Privacy Policy & Terms of Service
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in text-slate-100 pb-12">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h1 className="text-2xl font-bold font-display text-white">
          {view === 'privacy' ? 'Privacy Policy & Data Security' : 'Terms of Service'}
        </h1>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>1. Location Consent:</strong> ResQ AI requests GPS location data exclusively for displaying nearby emergency facilities and transmitting location coordinates during user-initiated SOS triggers.
          </p>
          <p>
            <strong>2. API Key Security:</strong> All AI calls are processed server-side. Secrets and API keys are never exposed to browser context.
          </p>
          <p>
            <strong>3. GDPR Compliance:</strong> Users retain full rights to export their personal logs in JSON format or trigger complete account and data deletion at any time in Settings.
          </p>
          <p>
            <strong>4. Emergency Disclaimer:</strong> ResQ AI is an emergency intelligence software tool designed to assist in preparation and decision making. In life-threatening emergencies, always dial official national emergency helplines (112, 911, 100, 108) directly.
          </p>
        </div>
      </div>
    </div>
  );
};
