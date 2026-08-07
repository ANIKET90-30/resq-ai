export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'responder' | 'ngo' | 'admin';
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  bloodType?: string;
  medicalNotes?: string;
  emergencyContacts: EmergencyContact[];
  locationConsent: boolean;
  city?: string;
  country?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  triageLevel?: SeverityLevel;
}

export interface ImageUpload {
  id: string;
  userId: string;
  imageUrl: string;
  hazardType: string;
  riskLevel: SeverityLevel;
  riskScore: number; // 0-100
  explanation: string;
  safetyRecommendations: string[];
  isLikelyAIGenerated?: boolean;
  authenticityConfidence?: number;
  authenticityNotes?: string;
  analyzedAt: string;
}

export interface EmergencyReport {
  id: string;
  userId: string;
  title: string;
  type: 'flood' | 'fire' | 'earthquake' | 'accident' | 'other';
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  locationName: string;
  description: string;
  status: 'active' | 'responding' | 'resolved';
  createdAt: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  category: 'flood' | 'fire' | 'earthquake' | 'storm' | 'tsunami' | 'health';
  severity: SeverityLevel;
  location: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  issuedAt: string;
  source: string;
  description: string;
  actionRequired: string;
}

export interface SavedCoordinates {
  latitude: number;
  longitude: number;
  name: string;
  updatedAt: string;
}

export interface AggregatedAlert extends DisasterAlert {
  distanceKm: number;
  priorityScore: number;
  priorityLabel: 'P1 - Critical' | 'P2 - High' | 'P3 - Moderate' | 'P4 - Info';
  isWithinRadius: boolean;
  timeAgoMinutes: number;
}

export interface ShelterFacility {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'police' | 'fire_station' | 'water';
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  capacity?: string;
  suppliesStatus?: 'stocked' | 'low' | 'critical';
  open247: boolean;
  distanceKm?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'alert' | 'system' | 'sos' | 'reminder';
  read: boolean;
  createdAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'es' | 'hi' | 'fr';
  pushAlerts: boolean;
  smsAlerts: boolean;
  soundEnabled: boolean;
  aiProvider: 'gemini' | 'openai' | 'claude';
  locationPermission: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}
