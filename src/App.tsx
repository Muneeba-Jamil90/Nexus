import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage }    from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard }     from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile }     from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage }     from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage }      from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage }      from './pages/settings/SettingsPage';
import { HelpPage }          from './pages/help/HelpPage';
import { DealsPage }         from './pages/deals/DealsPage';
import { Dashboard }         from './pages/dashboard/Dashboard';

// Security
import SecurityPage from './pages/security/SecurityPage';

// Chat
import { ChatPage } from './pages/chat/ChatPage';

// Other
import VideoCall        from './components/chat/Videocall';
import DocumentChamber  from './components/collaboration/DocumentChamber';
import PaymentDashboard from './components/payment/PaymentDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ── Auth ── */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Dashboard ── */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="investor"     element={<InvestorDashboard />} />
          </Route>

          {/* ── Profile ── */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route path="entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="investor/:id"     element={<InvestorProfile />} />
          </Route>

          {/* ── Investors ── */}
          <Route path="/investors" element={<DashboardLayout />}>
            <Route index element={<InvestorsPage />} />
          </Route>

          {/* ── Entrepreneurs ── */}
          <Route path="/entrepreneurs" element={<DashboardLayout />}>
            <Route index element={<EntrepreneursPage />} />
          </Route>

          {/* ── Messages ── */}
          <Route path="/messages" element={<DashboardLayout />}>
            <Route index element={<MessagesPage />} />
          </Route>

          {/* ── Notifications ── */}
          <Route path="/notifications" element={<DashboardLayout />}>
            <Route index element={<NotificationsPage />} />
          </Route>

          {/* ── Payments ── */}
          <Route path="/payments" element={<DashboardLayout />}>
            <Route index element={<PaymentDashboard />} />
          </Route>

          {/* ── Security ── */}
          <Route path="/security" element={<DashboardLayout />}>
            <Route index element={<SecurityPage />} />
          </Route>

          {/* ── Settings ── */}
          <Route path="/settings" element={<DashboardLayout />}>
            <Route index element={<SettingsPage />} />
          </Route>

          {/* ── Help ── */}
          <Route path="/help" element={<DashboardLayout />}>
            <Route index element={<HelpPage />} />
          </Route>

          {/* ── Deals ── */}
          <Route path="/deals" element={<DashboardLayout />}>
            <Route index element={<DealsPage />} />
          </Route>

          {/* ── Calendar ── */}
          <Route path="/calendar" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>

          {/* ── Chat ── */}
          <Route path="/chat" element={<DashboardLayout />}>
            <Route index          element={<ChatPage />} />
            <Route path=":userId" element={<ChatPage />} />
          </Route>

          {/* ── Standalone ── */}
          <Route path="/documents" element={<DocumentChamber />} />
          <Route path="/video-call" element={
            <div className="h-screen p-4 bg-gray-950">
              <VideoCall remoteUserName="Entrepreneur" />
            </div>
          } />

          {/* ── Redirects ── */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;