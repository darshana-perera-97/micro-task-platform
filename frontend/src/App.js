import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toaster } from './components/ui/sonner';
import { cn } from './components/ui/utils';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { RoleRedirect } from './components/routing/RoleRedirect';

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
import { AllClaims } from './components/admin/AllClaims';

function AppLayout({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar
          role={user.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className={cn(
          "flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full bg-[#fafafa] lg:ml-64"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Root redirect */}
      <Route path="/" element={<RoleRedirect />} />

      {/* User Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="submissions" element={<SubmissionsList />} />
        <Route path="points" element={<PointsRewards />} />
        <Route path="profile" element={<UserProfile />} />
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Route>

      {/* QA Routes */}
      <Route
        path="/qa"
        element={
          <ProtectedRoute allowedRoles={['qa']}>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<QADashboard />} />
        <Route path="pending" element={<PendingReviews />} />
        <Route path="approved" element={<ReviewedSubmissions status="approved" />} />
        <Route path="rejected" element={<ReviewedSubmissions status="rejected" />} />
        <Route index element={<Navigate to="/qa/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/qa/dashboard" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="submissions" element={<AllSubmissions />} />
        <Route path="claims" element={<AllClaims />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
