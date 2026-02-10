import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toaster } from './components/ui/sonner';

// User Components
import { UserDashboard } from './components/user/UserDashboard';
import { TaskList } from './components/user/TaskList';
import { SubmissionsList } from './components/user/SubmissionsList';
import { PointsRewards } from './components/user/PointsRewards';
import { UserProfile } from './components/user/UserProfile';

// QA Components
import { QADashboard } from './components/qa/QADashboard';
import { PendingReviews } from './components/qa/PendingReviews';
import { ReviewedSubmissions } from './components/qa/ReviewedSubmissions';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TaskManagement } from './components/admin/TaskManagement';
import { UserManagement } from './components/admin/UserManagement';
import { AllSubmissions } from './components/admin/AllSubmissions';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  const renderView = () => {
    // User Views
    if (user.role === 'user') {
      switch (currentView) {
        case 'dashboard':
          return <UserDashboard />;
        case 'tasks':
          return <TaskList />;
        case 'submissions':
          return <SubmissionsList />;
        case 'points':
          return <PointsRewards />;
        case 'profile':
          return <UserProfile />;
        default:
          return <UserDashboard />;
      }
    }

    // QA Views
    if (user.role === 'qa') {
      switch (currentView) {
        case 'dashboard':
          return <QADashboard />;
        case 'pending':
          return <PendingReviews />;
        case 'approved':
          return <ReviewedSubmissions status="approved" />;
        case 'rejected':
          return <ReviewedSubmissions status="rejected" />;
        default:
          return <QADashboard />;
      }
    }

    // Admin Views
    if (user.role === 'admin') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'tasks':
          return <TaskManagement />;
        case 'users':
          return <UserManagement />;
        case 'submissions':
          return <AllSubmissions />;
        default:
          return <AdminDashboard />;
      }
    }

    return <UserDashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
          role={user.role}
          isOpen={sidebarOpen}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
        <Toaster position="top-right" />
      </DataProvider>
    </AuthProvider>
  );
}
