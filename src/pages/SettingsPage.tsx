import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bot,
  Plus,
  Trash2,
  Download,
  UserX,
  CheckCircle2,
  Moon,
  Sun,
  Lock,
} from 'lucide-react';
import { User as UserType, Profile, UserSettings } from '../types';
import { DBService } from '../services/db';

interface SettingsPageProps {
  user: UserType | null;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onLogout }) => {
  const profile: Profile = user
    ? DBService.getProfile(user.id)
    : {
        id: 'p1',
        userId: 'u1',
        bloodType: 'O+',
        medicalNotes: 'No major allergies.',
        emergencyContacts: [],
        locationConsent: true,
      };

  const [settings, setSettings] = useState<UserSettings>(
    user
      ? DBService.getSettings(user.id)
      : {
          theme: 'dark',
          language: 'en',
          pushAlerts: true,
          smsAlerts: true,
          soundEnabled: true,
          aiProvider: 'gemini',
          locationPermission: true,
        }
  );

  const [contacts, setContacts] = useState(profile.emergencyContacts || []);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveSettings = () => {
    if (user) {
      DBService.saveSettings(user.id, settings);
      profile.emergencyContacts = contacts;
      DBService.updateProfile(profile);
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newC = {
      id: 'c-' + Date.now(),
      name: newContactName,
      relationship: 'Family / Friend',
      phone: newContactPhone,
      isPrimary: contacts.length === 0,
    };

    setContacts([...contacts, newC]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleExportData = () => {
    if (!user) return;
    const data = DBService.exportUserData(user.id);
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `resq_ai_user_data_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    if (confirm('Are you sure you want to permanently delete your account and clear all local data?')) {
      DBService.deleteUserData(user.id);
      onLogout();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          <span>Safety Preferences & Privacy Controls</span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white">Settings & Profile</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Configure AI provider adapters, emergency contacts, notification preferences, and GDPR data rights.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings and safety preferences updated successfully.</span>
        </div>
      )}

      {/* AI Provider Config Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Bot className="w-4 h-4" />
          <span>AI Engine Provider Adapter</span>
        </div>

        <div className="space-y-2 text-xs text-slate-400">
          <p>Choose the backend intelligence provider for emergency processing:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setSettings({ ...settings, aiProvider: 'gemini' })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.aiProvider === 'gemini'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="block font-bold text-xs text-cyan-400">Google Gemini</span>
              <span className="text-[10px] text-slate-500">Gemini 3.6 Flash Server Proxy</span>
            </button>

            <button
              onClick={() => setSettings({ ...settings, aiProvider: 'openai' })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.aiProvider === 'openai'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="block font-bold text-xs text-emerald-400">OpenAI Adapter</span>
              <span className="text-[10px] text-slate-500">GPT-4o Emergency Proxy</span>
            </button>

            <button
              onClick={() => setSettings({ ...settings, aiProvider: 'claude' })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.aiProvider === 'claude'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="block font-bold text-xs text-amber-400">Claude Adapter</span>
              <span className="text-[10px] text-slate-500">Claude Sonnet Proxy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Manager */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Emergency Contacts (Notified on SOS)</span>
        </div>

        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-200">{c.name}</span>
                <span className="text-slate-500 ml-2 font-mono">{c.phone}</span>
              </div>

              <button onClick={() => handleDeleteContact(c.id)} className="text-slate-600 hover:text-rose-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddContact} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <input
            type="text"
            placeholder="Contact Name"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </form>
      </div>

      {/* Save Settings Button */}
      <button
        onClick={handleSaveSettings}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Save All Settings</span>
      </button>

      {/* GDPR & Data Privacy Rights */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>GDPR Data Rights & Privacy Controls</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Personal JSON Data</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs flex items-center gap-2"
          >
            <UserX className="w-4 h-4" />
            <span>Delete ResQ Account & Wipe Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
