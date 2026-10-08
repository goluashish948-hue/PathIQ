import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { MentorFloatingWidget } from './components/MentorFloatingWidget';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LearnQuizPage } from './pages/LearnQuizPage';
import { ProfilePage } from './pages/ProfilePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { InterviewPage } from './pages/InterviewPage';
import { ResumePortfolioPage } from './pages/ResumePortfolioPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { DailyPlannerPage } from './pages/DailyPlannerPage';
import { DomainsPage } from './pages/DomainsPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// Root Route: opens Login page directly if not logged in, or Dashboard if logged in
const RootRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* App opens directly with Login, and once logged in opens Dashboard */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/domains" element={<DomainsPage />} />

          {/* Protected Student Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <LearnQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumePortfolioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <ResumePortfolioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <DailyPlannerPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <MentorFloatingWidget />

      {/* Modern Minimal Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PathIQ — Adaptive AI Career GPS Engine • Zero-Hallucination Evidence-Backed Architecture</span>
          <span className="font-mono text-[11px] text-slate-400">Spec 1–50 • R1–R12 Verified</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
