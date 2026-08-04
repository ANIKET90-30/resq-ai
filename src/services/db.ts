import {
  User,
  Profile,
  Conversation,
  Message,
  ImageUpload,
  EmergencyReport,
  DisasterAlert,
  ShelterFacility,
  NotificationItem,
  UserSettings,
  AuditLog,
  SavedCoordinates,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'resq_users',
  CURRENT_USER: 'resq_current_user',
  PROFILES: 'resq_profiles',
  CONVERSATIONS: 'resq_conversations',
  MESSAGES: 'resq_messages',
  IMAGE_UPLOADS: 'resq_image_uploads',
  REPORTS: 'resq_reports',
  NOTIFICATIONS: 'resq_notifications',
  SETTINGS: 'resq_settings',
  AUDIT_LOGS: 'resq_audit_logs',
  SAVED_COORDS: 'resq_saved_coords',
};

// Seed initial alerts
export const INITIAL_ALERTS: DisasterAlert[] = [
  {
    id: 'alt-1',
    title: 'Flash Flood Warning — Low-Lying Riverine Areas',
    category: 'flood',
    severity: 'critical',
    location: 'Sutlej River Basin & Downtown Flood Zone',
    latitude: 30.912,
    longitude: 75.862,
    radiusKm: 10,
    issuedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    source: 'National Disaster Management Authority',
    description: 'Rapid water accumulation reported due to heavy rain upstream. Water levels elevated by 1.8m.',
    actionRequired: 'Move to higher ground or 2nd floor immediately. Avoid driving through standing water.',
  },
  {
    id: 'alt-5',
    title: 'Industrial Chemical Containment Alert — Sector 7',
    category: 'health',
    severity: 'critical',
    location: 'Industrial Corridor Gate 4',
    latitude: 30.898,
    longitude: 75.845,
    radiusKm: 5,
    issuedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    source: 'Hazardous Materials Quick Response Force',
    description: 'Ammonia vapor cloud detected near industrial district. Air scrubbers engaged.',
    actionRequired: 'Seal windows and doors. Turn off air conditioners and external ventilation.',
  },
  {
    id: 'alt-2',
    title: 'Wildfire Risk Elevated — High Winds & Low Humidity',
    category: 'fire',
    severity: 'high',
    location: 'Northern Forest Rim & Ridge Sector',
    latitude: 30.948,
    longitude: 75.812,
    radiusKm: 15,
    issuedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    source: 'Forestry Emergency Center',
    description: 'Dry brush and wind gusts up to 45 km/h increasing flame spread risk in peripheral sectors.',
    actionRequired: 'Prepare go-bags, clear dry leaves near homes, and monitor evacuation advisories.',
  },
  {
    id: 'alt-3',
    title: 'Seismic Aftershock Advisory — Sector 4',
    category: 'earthquake',
    severity: 'moderate',
    location: 'Metropolitan Fault Zone',
    latitude: 30.875,
    longitude: 75.895,
    radiusKm: 20,
    issuedAt: new Date(Date.now() - 360 * 60000).toISOString(),
    source: 'Seismological Observation Post',
    description: 'Minor magnitude 3.8 aftershocks detected. Structural integrity scans underway.',
    actionRequired: 'Inspect walls for cracks. Keep emergency kit near front entry.',
  },
  {
    id: 'alt-4',
    title: 'Severe Thunderstorm & High Wind Watch',
    category: 'storm',
    severity: 'moderate',
    location: 'Central Coastal Belt',
    latitude: 31.02,
    longitude: 75.75,
    radiusKm: 30,
    issuedAt: new Date(Date.now() - 720 * 60000).toISOString(),
    source: 'Meteorological Department',
    description: 'Gusty winds and heavy precipitation expected between 18:00 and 23:00 local time.',
    actionRequired: 'Secure outdoor loose items, park away from power lines and large trees.',
  },
];

// Seed initial shelters
export const INITIAL_SHELTERS: ShelterFacility[] = [
  {
    id: 'sh-1',
    name: 'Central Municipal Relief Center & Shelter',
    type: 'shelter',
    latitude: 30.908,
    longitude: 75.852,
    address: '104 Civic Plaza Road, Sector 3',
    phone: '+1 (800) 555-0199',
    capacity: '450 people (Food, Water, Beds)',
    open247: true,
  },
  {
    id: 'sh-2',
    name: 'St. Jude General Emergency Hospital',
    type: 'hospital',
    latitude: 30.895,
    longitude: 75.865,
    address: '42 Medical Care Boulevard',
    phone: '+1 (800) 555-0112',
    capacity: 'Trauma Unit · ICU Available',
    open247: true,
  },
  {
    id: 'sh-3',
    name: 'District Police Headquarters & Help Desk',
    type: 'police',
    latitude: 30.903,
    longitude: 75.842,
    address: '88 Public Safety Avenue',
    phone: '100 / 112',
    capacity: 'Emergency Command Station',
    open247: true,
  },
  {
    id: 'sh-4',
    name: 'Central Fire & Rescue Station No. 1',
    type: 'fire_station',
    latitude: 30.898,
    longitude: 75.848,
    address: '15 Rescue Engine Way',
    phone: '101',
    capacity: 'Hazmat & Rescue Teams',
    open247: true,
  },
  {
    id: 'sh-5',
    name: 'High School Relief Camp & Clean Water Station',
    type: 'water',
    latitude: 30.915,
    longitude: 75.86,
    address: '220 Education Parkway',
    phone: '+1 (800) 555-0188',
    capacity: 'Potable Water Distribution & Medical Kits',
    open247: false,
  },
];

export class DBService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // --- Users & Profiles ---
  static getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, []);
  }

  static getCurrentUser(): User | null {
    return this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, {
      id: 'usr-demo-1',
      email: 'alex.citizen@resq.ai',
      fullName: 'Alex Morgan',
      role: 'user',
      phone: '+1 (555) 234-5678',
      createdAt: new Date().toISOString(),
    });
  }

  static setCurrentUser(user: User | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  static getProfile(userId: string): Profile {
    const profiles = this.getItem<Profile[]>(STORAGE_KEYS.PROFILES, []);
    const existing = profiles.find((p) => p.userId === userId);
    if (existing) return existing;

    const defaultProfile: Profile = {
      id: 'prof-' + userId,
      userId,
      bloodType: 'O+',
      medicalNotes: 'No major allergies. Carry asthma inhaler.',
      emergencyContacts: [
        { id: 'c1', name: 'Sarah Morgan', relationship: 'Spouse', phone: '+1 (555) 987-6543', isPrimary: true },
        { id: 'c2', name: 'David Morgan', relationship: 'Brother', phone: '+1 (555) 876-5432', isPrimary: false },
      ],
      locationConsent: true,
      city: 'San Francisco',
      country: 'USA',
    };
    profiles.push(defaultProfile);
    this.setItem(STORAGE_KEYS.PROFILES, profiles);
    return defaultProfile;
  }

  static updateProfile(profile: Profile): void {
    const profiles = this.getItem<Profile[]>(STORAGE_KEYS.PROFILES, []);
    const idx = profiles.findIndex((p) => p.userId === profile.userId);
    if (idx >= 0) {
      profiles[idx] = profile;
    } else {
      profiles.push(profile);
    }
    this.setItem(STORAGE_KEYS.PROFILES, profiles);
  }

  // --- Conversations & Messages ---
  static getConversations(userId: string): Conversation[] {
    const convs = this.getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    return convs.filter((c) => c.userId === userId);
  }

  static saveConversation(conv: Conversation): void {
    const convs = this.getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    const idx = convs.findIndex((c) => c.id === conv.id);
    if (idx >= 0) convs[idx] = conv;
    else convs.unshift(conv);
    this.setItem(STORAGE_KEYS.CONVERSATIONS, convs);
  }

  static getMessages(conversationId: string): Message[] {
    const msgs = this.getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
    return msgs.filter((m) => m.conversationId === conversationId);
  }

  static saveMessage(msg: Message): void {
    const msgs = this.getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
    msgs.push(msg);
    this.setItem(STORAGE_KEYS.MESSAGES, msgs);
  }

  // --- Image Uploads & Hazard Analysis ---
  static getImageUploads(userId: string): ImageUpload[] {
    const uploads = this.getItem<ImageUpload[]>(STORAGE_KEYS.IMAGE_UPLOADS, []);
    return uploads.filter((u) => u.userId === userId);
  }

  static saveImageUpload(upload: ImageUpload): void {
    const uploads = this.getItem<ImageUpload[]>(STORAGE_KEYS.IMAGE_UPLOADS, []);
    uploads.unshift(upload);
    this.setItem(STORAGE_KEYS.IMAGE_UPLOADS, uploads);
  }

  // --- Emergency Reports ---
  static getEmergencyReports(): EmergencyReport[] {
    return this.getItem<EmergencyReport[]>(STORAGE_KEYS.REPORTS, [
      {
        id: 'rep-1',
        userId: 'usr-demo-1',
        title: 'Downed Power Lines Near School Crossing',
        type: 'other',
        severity: 'high',
        latitude: 30.902,
        longitude: 75.854,
        locationName: 'Oak Street & 5th Avenue',
        description: 'High-voltage line snapped during windstorm, lying near sidewalk.',
        status: 'responding',
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      },
      {
        id: 'rep-2',
        userId: 'usr-demo-2',
        title: 'Road Washout at Sutlej Bridge',
        type: 'flood',
        severity: 'critical',
        latitude: 30.912,
        longitude: 75.845,
        locationName: 'Sutlej Bridge North Approach',
        description: 'Rushing water eroded eastern embankment. Road impassable.',
        status: 'active',
        createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
      },
    ]);
  }

  static saveEmergencyReport(report: EmergencyReport): void {
    const reports = this.getEmergencyReports();
    reports.unshift(report);
    this.setItem(STORAGE_KEYS.REPORTS, reports);
    this.addAuditLog(report.userId, 'CREATE_EMERGENCY_REPORT', `Reported ${report.title}`);
  }

  // --- Disaster Alerts ---
  static getAlerts(): DisasterAlert[] {
    return INITIAL_ALERTS;
  }

  // --- Shelters ---
  static getShelters(): ShelterFacility[] {
    return INITIAL_SHELTERS;
  }

  // --- Notifications ---
  static getNotifications(userId: string): NotificationItem[] {
    const list = this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        userId,
        title: 'Critical Flood Alert In Your Area',
        body: 'Flash flood warning issued for Sutlej riverbank zone. Check nearby shelters.',
        type: 'alert',
        read: false,
        createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      },
      {
        id: 'notif-2',
        userId,
        title: 'Emergency Go-Bag Check Reminder',
        body: 'Ensure battery power bank and first aid supplies are replenished.',
        type: 'reminder',
        read: true,
        createdAt: new Date(Date.now() - 1440 * 60000).toISOString(),
      },
    ]);
    return list;
  }

  static markNotificationRead(notifId: string): void {
    const list = this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const item = list.find((n) => n.id === notifId);
    if (item) item.read = true;
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // --- Settings ---
  static getSettings(userId: string): UserSettings {
    const settings = this.getItem<Record<string, UserSettings>>(STORAGE_KEYS.SETTINGS, {});
    return (
      settings[userId] || {
        theme: 'dark',
        language: 'en',
        pushAlerts: true,
        smsAlerts: true,
        soundEnabled: true,
        aiProvider: 'gemini',
        locationPermission: true,
      }
    );
  }

  static saveSettings(userId: string, newSettings: UserSettings): void {
    const settings = this.getItem<Record<string, UserSettings>>(STORAGE_KEYS.SETTINGS, {});
    settings[userId] = newSettings;
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- Saved Location Coordinates ---
  static getSavedCoordinates(userId?: string): SavedCoordinates {
    const key = userId ? `${STORAGE_KEYS.SAVED_COORDS}_${userId}` : STORAGE_KEYS.SAVED_COORDS;
    return this.getItem<SavedCoordinates>(key, {
      latitude: 30.901,
      longitude: 75.8573,
      name: 'Downtown Command Sector (Saved Home)',
      updatedAt: new Date().toISOString(),
    });
  }

  static saveSavedCoordinates(coords: SavedCoordinates, userId?: string): void {
    const key = userId ? `${STORAGE_KEYS.SAVED_COORDS}_${userId}` : STORAGE_KEYS.SAVED_COORDS;
    this.setItem(key, coords);
  }

  // --- Audit Logs ---
  static getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        userId: 'usr-demo-1',
        action: 'USER_LOGIN',
        ipAddress: '192.168.1.45',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        details: 'Successful auth session initiated',
      },
      {
        id: 'log-2',
        userId: 'usr-demo-1',
        action: 'SOS_TRIGGER',
        ipAddress: '192.168.1.45',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        details: 'SOS broadcast test dispatched with GPS coordinates',
      },
    ]);
  }

  static addAuditLog(userId: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log-' + Date.now(),
      userId,
      action,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      details,
    });
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // GDPR Data Export & Account Deletion
  static exportUserData(userId: string) {
    return {
      user: this.getCurrentUser(),
      profile: this.getProfile(userId),
      conversations: this.getConversations(userId),
      imageUploads: this.getImageUploads(userId),
      settings: this.getSettings(userId),
      notifications: this.getNotifications(userId),
      exportedAt: new Date().toISOString(),
    };
  }

  static deleteUserData(userId: string) {
    this.setCurrentUser(null);
    this.addAuditLog(userId, 'GDPR_ACCOUNT_DELETED', 'User requested full data deletion');
  }
}
