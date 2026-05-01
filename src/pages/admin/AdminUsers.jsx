import React, { useState, useEffect } from 'react';
import { 
  Search, Trash2, Shield, ShieldOff, 
  MoreVertical, Mail, Calendar, UserX
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (currentUser?.id) {
      fetchUsers();
    }
  }, [currentUser?.id]);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/admin/users', {
      headers: { 'user-id': currentUser.id }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error('Access denied: You are not an admin in the database.');
          if (res.status === 401) throw new Error('Unauthorized: No user ID found.');
          throw new Error(`Server Error (${res.status}): Failed to fetch users.`);
        }
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Admin Fetch Error:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  const toggleRole = (userId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'Reader' : 'Admin';
    fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'user-id': currentUser.id 
      },
      body: JSON.stringify({ role: newRole })
    }).then(() => fetchUsers());
  };

  const deleteUser = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    fetch(`http://localhost:5000/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'user-id': currentUser.id }
    }).then(() => fetchUsers());
  };

  const filteredUsers = users.filter(u => {
    const name = u.name?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-neutral-500 text-sm">Monitor and manage user accounts and permissions.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200'}`}>
          <Search size={18} className="text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-transparent border-none outline-none text-sm w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-neutral-100'}`}>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-500">User</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Role</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Joined</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center font-bold">
                        {u.avatar ? <img src={u.avatar} className="w-full h-full rounded-full object-cover" /> : (u.name ? u.name[0] : 'U')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{u.name}</p>
                        <p className="text-xs text-neutral-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      u.role === 'Admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-neutral-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleRole(u.id, u.role)}
                        title={u.role === 'Admin' ? 'Demote to Reader' : 'Promote to Admin'}
                        className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-green-500"
                      >
                        {u.role === 'Admin' ? <ShieldOff size={18} /> : <Shield size={18} />}
                      </button>
                      <button 
                        onClick={() => deleteUser(u.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error ? (
            <div className="p-12 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={fetchUsers} className="primary-button mx-auto">Retry Loading</button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              <UserX size={48} className="mx-auto mb-4 opacity-20" />
              <p>{loading ? 'Loading users...' : 'No users found matching your search.'}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
