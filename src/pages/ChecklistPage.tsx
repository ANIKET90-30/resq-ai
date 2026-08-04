import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Waves,
  AlertOctagon,
  Flame,
  Wind,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export const ChecklistPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'flood' | 'earthquake' | 'fire' | 'storm'>('flood');
  const [customText, setCustomText] = useState<string>('');

  const initialChecklists: Record<string, ChecklistItem[]> = {
    flood: [
      { id: 'fl-1', text: 'Gather official identification papers and insurance in waterproof pouch', completed: true },
      { id: 'fl-2', text: 'Pack 3 days worth of non-perishable food and 3 Gallons clean water per person', completed: true },
      { id: 'fl-3', text: 'Prepare high-capacity power bank and solar emergency radio', completed: false },
      { id: 'fl-4', text: 'Locate main electricity breaker and gas shut-off valve', completed: true },
      { id: 'fl-5', text: 'Elevate major appliances and high-value electronics onto tables or bricks', completed: false },
      { id: 'fl-6', text: 'Verify nearest shelter location on ResQ AI map router', completed: true },
    ],
    earthquake: [
      { id: 'eq-1', text: 'Secure tall bookcases and wall shelves to studs using L-brackets', completed: true },
      { id: 'eq-2', text: 'Keep heavy shoes and flashlight beside every bed', completed: true },
      { id: 'eq-3', text: 'Identify interior Drop-Cover-Hold safe spots in living room and bedrooms', completed: false },
      { id: 'eq-4', text: 'Stock emergency trauma kit including pressure bandages and splints', completed: false },
    ],
    fire: [
      { id: 'fr-1', text: 'Install smoke alarms in bedrooms and test battery monthly', completed: true },
      { id: 'fr-2', text: 'Keep Class ABC fire extinguisher near kitchen exit', completed: true },
      { id: 'fr-3', text: 'Establish two clear escape routes from every floor', completed: false },
      { id: 'fr-4', text: 'Designate family meeting point outside at safe distance', completed: true },
    ],
    storm: [
      { id: 'st-1', text: 'Clear rain gutters and storm drains around residential perimeter', completed: false },
      { id: 'st-2', text: 'Secure or store loose patio furniture, planters, and garbage cans', completed: true },
      { id: 'st-3', text: 'Inspect window seals and prepare hurricane tape or plywood shutters', completed: false },
    ],
  };

  const [itemsMap, setItemsMap] = useState<Record<string, ChecklistItem[]>>(initialChecklists);

  const items = itemsMap[activeCategory] || [];
  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  const toggleItem = (id: string) => {
    setItemsMap((prev) => {
      const current = prev[activeCategory] || [];
      const updated = current.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i));
      return { ...prev, [activeCategory]: updated };
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newItem: ChecklistItem = {
      id: 'item-' + Date.now(),
      text: customText.trim(),
      completed: false,
    };

    setItemsMap((prev) => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), newItem],
    }));

    setCustomText('');
  };

  const deleteItem = (id: string) => {
    setItemsMap((prev) => ({
      ...prev,
      [activeCategory]: (prev[activeCategory] || []).filter((i) => i.id !== id),
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Go-Bag & Preparedness Engine</span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white">Emergency Preparedness Checklists</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Actionable go-bag & home safety checklists. Track your completion rate and ensure nothing is forgotten.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory('flood')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeCategory === 'flood'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>Flood Preparedness</span>
        </button>

        <button
          onClick={() => setActiveCategory('earthquake')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeCategory === 'earthquake'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Seismic / Earthquake</span>
        </button>

        <button
          onClick={() => setActiveCategory('fire')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeCategory === 'fire'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Fire Escape Plan</span>
        </button>

        <button
          onClick={() => setActiveCategory('storm')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeCategory === 'storm'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Storm & Wind</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Preparedness Completion Rate</span>
          <span className="font-mono text-cyan-400 text-sm">
            {completedCount} / {items.length} ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Item Checklist List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.completed
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                  : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <button className="flex-shrink-0">
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                  )}
                </button>
                <span className={`text-xs sm:text-sm font-medium ${item.completed ? 'line-through' : ''}`}>
                  {item.text}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Custom Item Form */}
        <form onSubmit={handleAddItem} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Add custom preparedness item..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </form>
      </div>
    </div>
  );
};
