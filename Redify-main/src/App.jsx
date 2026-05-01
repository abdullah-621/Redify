import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReadingPage from './pages/ReadingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import BookDetails from './pages/BookDetails';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBooks from './pages/admin/AdminBooks';
import AdminCategories from './pages/admin/AdminCategories';
import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'Admin') return <Navigate to="/" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

// Simple Redirector for Last Read
const LastReadRedirect = () => {
  const lastId = localStorage.getItem('lastReadBook') || '1';
  return <Navigate to={`/read/${lastId}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/read" element={<LastReadRedirect />} />
        <Route path="/read/:bookId" element={<ReadingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
