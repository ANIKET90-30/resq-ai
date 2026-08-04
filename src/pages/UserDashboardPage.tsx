import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Phone,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FileText,
  Radio,
  Bot,
  MapPin,
  Settings,
  LogOut,
  Sparkles,
  Users,
  Activity,
  Edit2,
  Check,
  ShieldCheck,
  Camera,
  Share2,
} from 'lucide-react';
import { User, Profile, EmergencyContact, EmergencyReport } from '../types';
import { DBService } from '../services/db';

interface UserDashboardPageProps {
  user: User | null;
  reports: EmergencyReport[];
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
  onLogout: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  user,
  reports,
  onNavigate,
  onOpenSOS,
  onLogout,
}) => {
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">Sign In to Access Your User Dashboard</h2>
        <p className="text-xs text-slate-400 max-w-md">
          Access your personal emergency profile, medical passport, registered family safety status, and active incident tracking.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
          >
            Sign In Now
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs hover:border-cyan-500 transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const profile: Profile = DBService.getProfile(user.id);
  const userReports = reports.filter((r) => r.userId === user.id);

  // User Safety Status State
  const [safetyStatus, setSafetyStatus] = useState<'safe' | 'sheltered' | 'need_help'>('safe');
  const [statusNote, setStatusNote] = useState<string>('All clear in my immediate area.');
  const [contacts, setContacts] = useState<EmergencyContact[]>(profile.emergencyContacts || []);

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState([
    { id: 'fm1', name: 'Sarah Morgan', relation: 'Spouse', status: 'Safe', phone: '+1 (555) 234-5678' },
    { id: 'fm2', name: 'Leo Morgan', relation: 'Child', status: 'At School Shelter', phone: '+1 (555) 345-6789' },
  ]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');

  const [newFamName, setNewFamName] = useState('');
  const [newFamRelation, setNewFamRelation] = useState('Dependent');
  const [showAddFam, setShowAddFam] = useState(false);

  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [bloodType, setBloodType] = useState(profile.bloodType || 'O+');
  const [medicalNotes, setMedicalNotes] = useState(profile.medicalNotes || 'No known drug allergies. Asthmatic (inhaler in go-bag).');

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newC: EmergencyContact = {
      id: 'c-' + Date.now(),
      name: newContactName,
      relationship: newContactRelation,
      phone: newContactPhone,
      isPrimary: contacts.length === 0,
    };

    const updated = [...contacts, newC];
    setContacts(updated);
    profile.emergencyContacts = updated;
    DBService.updateProfile(profile);

    setNewContactName('');
    setNewContactPhone('');
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    profile.emergencyContacts = updated;
    DBService.updateProfile(profile);
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName) return;
    setFamilyMembers([
      ...familyMembers,
      { id: 'fm-' + Date.now(), name: newFamName, relation: newFamRelation, status: 'Safe', phone: 'Not listed' },
    ]);
    setNewFamName('');
    setShowAddFam(false);
  };

  const handleSaveMedical = () => {
    profile.bloodType = bloodType;
    profile.medicalNotes = medicalNotes;
    DBService.updateProfile(profile);
    setIsEditingMedical(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 pb-12">
      {/* User Dashboard Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/20 flex-shrink-0">
              {user.fullName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">{user.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {user.role} Account
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Grid Connected
                </span>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-3">
                <span>Email: {user.email}</span>
                <span>•</span>
                <span>Phone: {user.phone || '+1 (555) 019-2834'}</span>
              </p>

              <p className="text-[11px] text-slate-500">
                User ID: <span className="font-mono text-slate-400">{user.id}</span> | Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSOS}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>SOS Broadcast</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-rose-400 font-medium text-xs flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Status Beacon Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Live Emergency Safety Check-In</h2>
          </div>
          <span className="text-[11px] text-slate-400">Updates sync automatically with response dispatchers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setSafetyStatus('safe')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              safetyStatus === 'safe'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold">I Am Safe</div>
              <div className="text-[10px] opacity-80">No immediate danger or injuries</div>
            </div>
          </button>

          <button
            onClick={() => setSafetyStatus('sheltered')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              safetyStatus === 'sheltered'
                ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold">In Safe Shelter</div>
              <div className="text-[10px] opacity-80">At emergency evacuation center</div>
            </div>
          </button>

          <button
            onClick={() => setSafetyStatus('need_help')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              safetyStatus === 'need_help'
                ? 'bg-rose-500/15 border-rose-500 text-rose-300 ring-1 ring-rose-500/30 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-rose-400">Need Assistance</div>
              <div className="text-[10px] opacity-80">Request medical or rescue help</div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Add status note (e.g. At Central High School Shelter with family)..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none"
          />
          <button
            onClick={() => alert(`Status updated to [${safetyStatus.toUpperCase()}]: "${statusNote}"`)}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-semibold transition-all"
          >
            Broadcast Status
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide): Medical Passport & Family Safety */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Passport Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-400" />
                <h2 className="text-sm font-bold text-white">Emergency Medical Passport</h2>
              </div>
              <button
                onClick={() => setIsEditingMedical(!isEditingMedical)}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingMedical ? 'Cancel' : 'Edit Passport'}</span>
              </button>
            </div>

            {isEditingMedical ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Blood Type</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Medical Conditions, Allergies & Prescription Notes</label>
                  <textarea
                    rows={3}
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleSaveMedical}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Medical Passport</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">Blood Type</span>
                  <div className="text-xl font-black font-mono text-rose-400">{bloodType}</div>
                  <p className="text-[11px] text-slate-500">Universal Donor / Compatible match registered</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">Emergency Triage Notes</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{medicalNotes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Family & Dependents Tracker Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Family & Household Safety Grid</h2>
              </div>

              <button
                onClick={() => setShowAddFam(!showAddFam)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            {showAddFam && (
              <form onSubmit={handleAddFamilyMember} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newFamName}
                    onChange={(e) => setNewFamName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                  <select
                    value={newFamRelation}
                    onChange={(e) => setNewFamRelation(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Dependent">Dependent</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddFam(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {familyMembers.map((fam) => (
                <div key={fam.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                      {fam.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{fam.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({fam.relation})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{fam.phone}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {fam.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User's Incident Reports Log */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">My Submitted Emergency Reports</h2>
              </div>
              <button
                onClick={() => onNavigate('hazard')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Submit New Scan</span>
              </button>
            </div>

            {userReports.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                No active emergency reports filed by your account.
              </div>
            ) : (
              <div className="space-y-3">
                {userReports.map((report) => (
                  <div key={report.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white">{report.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {report.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{report.description}</p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Location: {report.locationName}</span>
                      <span>Filed: {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col wide): Registered Emergency Contacts & Quick Assist */}
        <div className="space-y-6">
          {/* Emergency Contacts Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Phone className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Emergency Contacts</h2>
            </div>

            {/* Add Contact Form */}
            <form onSubmit={handleAddContact} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="Contact Name (e.g. Jane Doe)"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number (+1 555-0123)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Emergency Contact</span>
              </button>
            </form>

            {/* Contacts List */}
            <div className="space-y-2.5 pt-2">
              {contacts.map((c) => (
                <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {c.isPrimary && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300">
                          Primary
                        </span>
                      )}
                    </div>
                    <a href={`tel:${c.phone}`} className="text-[11px] text-cyan-400 hover:underline">
                      {c.phone}
                    </a>
                  </div>

                  <button
                    onClick={() => handleDeleteContact(c.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Voice Assistant Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-cyan-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Personal AI Assistant</span>
            </div>
            <h3 className="text-sm font-bold text-white">Hands-Free Crisis Guidance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask AI step-by-step instructions for medical emergencies, evacuation shelter paths, or flood response protocols.
            </p>

            <button
              onClick={() => onNavigate('assistant')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Launch Voice Assistant</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
