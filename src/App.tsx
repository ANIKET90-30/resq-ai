import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SOSModal } from './components/SOSModal';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AssistantPage } from './pages/AssistantPage';
import { HazardPage } from './pages/HazardPage';
import { NearbyHelpPage } from './pages/NearbyHelpPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { GuidePage } from './pages/GuidePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPages } from './pages/AuthPages';
import { PublicPages } from './pages/PublicPages';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { HazardRadarPage } from './pages/HazardRadarPage';

import { User, DisasterAlert, ShelterFacility, EmergencyReport, NotificationItem } from './types';
import { AuthService } from './services/auth';
import { DBService } from './services/db';

export default function App() {
  const [activeView, setActiveView] = useState<string>(() =>
    AuthService.getCurrentUser() ? 'dashboard' : 'login'
  );
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);

  const [alerts, setAlerts] = useState<DisasterAlert[]>(() => DBService.getAlerts());
  const [shelters, setShelters] = useState<ShelterFacility[]>(() => DBService.getShelters());
  const [reports, setReports] = useState<EmergencyReport[]>(() => DBService.getEmergencyReports());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    user ? DBService.getNotifications(user.id) : []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    setActiveView('landing');
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Route each role to its own dashboard instead of sending
    // everyone to the same user-dashboard view.
    if (loggedInUser.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('user-dashboard');
    }
  };

  const renderCurrentView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} onOpenSOS={() => setIsSOSOpen(true)} />;

      case 'dashboard':
        return (
          <Dashboard
            user={user}
            alerts={alerts}
            shelters={shelters}
            reports={reports}
            onNavigate={handleNavigate}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );

      case 'user-dashboard':
        return (
          <UserDashboardPage
            user={user}
            reports={reports}
            onNavigate={handleNavigate}
            onOpenSOS={() => setIsSOSOpen(true)}
            onLogout={handleLogout}
          />
        );

      case 'hazard-radar':
        return <HazardRadarPage />;

      case 'assistant':
        return <AssistantPage />;

      case 'hazard':
        return <HazardPage />;

      case 'map':
        return <NearbyHelpPage shelters={shelters} />;

      case 'checklist':
        return <ChecklistPage />;

      case 'guide':
        return <GuidePage />;

      case 'notifications':
        return (
          <NotificationsPage
            alerts={alerts}
            notifications={notifications}
            onMarkRead={(id) => {
              DBService.markNotificationRead(id);
              if (user) setNotifications(DBService.getNotifications(user.id));
            }}
          />
        );

      case 'admin':
        return <AdminDashboard reports={reports} alerts={alerts} />;

      case 'settings':
        return <SettingsPage user={user} onLogout={handleLogout} />;

      case 'login':
      case 'signup':
      case 'forgot':
        return <AuthPages view={activeView as any} onNavigate={handleNavigate} onSuccess={handleAuthSuccess} />;

      case 'features':
      case 'pricing':
      case 'about':
      case 'contact':
      case 'privacy':
      case 'terms':
        return <PublicPages view={activeView as any} onNavigate={handleNavigate} />;

      default:
        return <Dashboard user={user} alerts={alerts} shelters={shelters} reports={reports} onNavigate={handleNavigate} onOpenSOS={() => setIsSOSOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        user={user}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenSOS={() => setIsSOSOpen(true)}
        unreadCount={unreadCount}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onLogout={handleLogout}
      />

      {/* Main Container Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Rail Navigation Sidebar */}
        <Sidebar activeView={activeView} onNavigate={handleNavigate} isAdmin={user?.role === 'admin'} />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global SOS Emergency Modal Overlay */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        userPhone={user?.phone}
      />
    </div>
  );
}
