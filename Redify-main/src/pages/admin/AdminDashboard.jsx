import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, List, TrendingUp, 
  UserPlus, Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!user?.id) return;
    fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'user-id': user.id }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: Access denied`);
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user?.id]);

  const card = theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-green-500 font-bold text-lg">Loading dashboard...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <p className="text-neutral-500 text-sm">Make sure you are logged in as Admin.</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Users',     value: stats?.totalUsers,      icon: Users,    color: 'text-blue-500',   bg: 'bg-blue-500/10' },
    { label: 'Total Books',     value: stats?.totalBooks,      icon: BookOpen, color: 'text-green-500',  bg: 'bg-green-500/10' },
    { label: 'Categories',      value: stats?.totalCategories, icon: List,     color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Growth',          value: '+12%',                 icon: TrendingUp,color:'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name} 👋</h1>
        <p className="text-neutral-500 text-sm">Here's what's happening on Redify today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={22} />
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Live</span>
            </div>
            <p className="text-neutral-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value ?? '—'}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className={`p-6 rounded-2xl border ${card}`}>
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="text-blue-500" size={20} />
            <h2 className="font-bold">Recent New Users</h2>
          </div>
          <div className="space-y-3">
            {(stats?.recentUsers ?? []).length === 0 && (
              <p className="text-neutral-500 text-sm">No users yet.</p>
            )}
            {(stats?.recentUsers ?? []).map(u => (
              <div key={u.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-neutral-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-green-400 text-sm"
                    style={{ background: 'rgba(34,197,94,0.15)' }}>
                    {u.name ? u.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{u.name}</p>
                    <p className="text-xs text-neutral-500">{u.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                  u.role === 'Admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                }`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Books */}
        <div className={`p-6 rounded-2xl border ${card}`}>
          <div className="flex items-center gap-2 mb-6">
            <Upload className="text-green-500" size={20} />
            <h2 className="font-bold">Recently Added Books</h2>
          </div>
          <div className="space-y-3">
            {(stats?.recentBooks ?? []).length === 0 && (
              <p className="text-neutral-500 text-sm">No books yet.</p>
            )}
            {(stats?.recentBooks ?? []).map(b => (
              <div key={b.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-neutral-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-12 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                    {b.coverUrl
                      ? <img src={b.coverUrl} className="w-full h-full object-cover" alt={b.title} />
                      : <div className="w-full h-full flex items-center justify-center"><BookOpen size={14} /></div>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold line-clamp-1">{b.title}</p>
                    <p className="text-xs text-neutral-500">{b.author}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
