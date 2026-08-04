import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  PhoneCall,
  Printer,
  ShieldCheck,
  Heart,
  Flame,
  Waves,
  Activity,
  AlertOctagon,
  ChevronRight,
} from 'lucide-react';

export const GuidePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('cpr');

  const guides = [
    {
      id: 'cpr',
      category: 'First Aid',
      title: 'Cardiopulmonary Resuscitation (CPR) Protocol',
      icon: Heart,
      summary: 'Immediate life support for non-responsive victims.',
      steps: [
        'Check scene safety and confirm victim responsiveness.',
        'Call 112 / Emergency services or assign someone specific to call.',
        'Place hands in center of chest, lock elbows, compress 5-6 cm deep at 100-120 compressions per minute.',
        'Give 2 rescue breaths after every 30 chest compressions if trained.',
        'Continue uninterrupted until AED arrives or professional medical help takes over.',
      ],
    },
    {
      id: 'bleeding',
      category: 'First Aid',
      title: 'Severe Bleeding & Hemorrhage Control',
      icon: Activity,
      summary: 'Direct pressure and pressure dressing procedures.',
      steps: [
        'Apply firm, continuous direct pressure over the wound using sterile gauze or clean cloth.',
        'Elevate injured limb above heart level if no bone fracture is suspected.',
        'Apply a firm pressure bandage over gauze without cutting off limb circulation.',
        'If bleeding continues through bandage, apply secondary tourniquet 5-7 cm above wound site.',
        'Note exact tourniquet application time on victim forehead.',
      ],
    },
    {
      id: 'burns',
      category: 'First Aid',
      title: 'Thermal & Chemical Burn Treatment',
      icon: Flame,
      summary: 'Cooling, cleaning, and protective dressing.',
      steps: [
        'Cool burn immediately under clean cool running water for 10-20 minutes.',
        'Never apply ice, butter, grease, or ointments directly to fresh open burn blisters.',
        'Cover burn loosely with clean non-stick sterile dressing or plastic film wrap.',
        'Remove rings or tight clothing before tissue swelling begins.',
        'Seek urgent hospital care for chemical burns or burns exceeding 10% body surface.',
      ],
    },
    {
      id: 'flood',
      category: 'Disaster Survival',
      title: 'Flash Flood & Rising Water Protocol',
      icon: Waves,
      summary: 'Evacuation guidelines for rapid water accumulation.',
      steps: [
        'Ascend to higher floor or hill elevation immediately. Do not wait for evacuation orders.',
        'Never walk or drive through flowing water. 15 cm of moving water can knock you down.',
        'Disconnect main electrical circuit breaker if water approaches power outlets.',
        'Avoid contact with floodwater — assume chemical and sewage contamination.',
        'Signal rescue teams from roof using bright cloth or flashlight.',
      ],
    },
    {
      id: 'earthquake',
      category: 'Disaster Survival',
      title: 'Earthquake Drop-Cover-Hold Protocol',
      icon: AlertOctagon,
      summary: 'Indoor and outdoor seismic shelter steps.',
      steps: [
        'DROP to hands and knees immediately to avoid being knocked down.',
        'COVER head and torso under a sturdy table, desk, or interior door frame away from windows.',
        'HOLD ON until shaking stops completely.',
        'If outdoors, move away from tall buildings, utility poles, and overpasses.',
        'After shaking stops, inspect gas lines for leaks before switching electrical devices.',
      ],
    },
  ];

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeGuide = guides.find((g) => g.id === selectedCategory) || guides[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Header with Offline Status */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cached Offline Engine</span>
          </div>

          <h1 className="text-2xl font-bold font-display text-white">Offline Emergency & First Aid Guide</h1>
          <p className="text-xs text-slate-400">
            Accessible without internet connectivity. Standard emergency medical and survival protocols.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Emergency Helpline Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>National Emergency Helpline Directory:</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <a href="tel:112" className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors">
            Universal Emergency: 112
          </a>
          <a href="tel:108" className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            Ambulance: 108
          </a>
          <a href="tel:101" className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
            Fire: 101
          </a>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search first aid topics (e.g. CPR, Burns, Bleeding, Flood, Earthquake)..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Main Layout: List sidebar + Detail view */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Guide Directory</h2>
          {filteredGuides.map((guide) => {
            const Icon = guide.icon;
            const isSelected = guide.id === activeGuide.id;
            return (
              <button
                key={guide.id}
                onClick={() => setSelectedCategory(guide.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold truncate max-w-[150px]">{guide.title}</h3>
                    <p className="text-[10px] text-slate-500">{guide.category}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Active Guide Details */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider">
              {activeGuide.category}
            </span>

            <h2 className="text-xl font-bold font-display text-white">{activeGuide.title}</h2>
            <p className="text-xs text-slate-400">{activeGuide.summary}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step-By-Step Survival Directives
            </h3>

            <ol className="space-y-3">
              {activeGuide.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
