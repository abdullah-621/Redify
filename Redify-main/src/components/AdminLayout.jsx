import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Book, List, 
  LogOut, Menu, X, ChevronRight, Bell, Search,
  Sun, Moon, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Books', icon: Book, path: '/admin/books' },
    { name: 'Categories', icon: List, path: '/admin/categories' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-neutral-50 text-neutral-900'}`}>
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out border-r ${
          theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-neutral-200'
        } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Book className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AdminPanel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded-xl mb-4 no-underline ${
                theme === 'dark' ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ArrowLeft size={18} />
              <span className="font-medium text-sm">Back to Site</span>
            </Link>

            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-xl transition-all no-underline ${
                  isActive(item.path)
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : theme === 'dark' ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {isActive(item.path) && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className={`h-16 flex items-center justify-between px-4 lg:px-8 border-b ${
          theme === 'dark' ? 'bg-[#111111]/50 border-white/5' : 'bg-white border-neutral-200'
        } backdrop-blur-md sticky top-0 z-40`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Search size={16} className="text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={`p-2 rounded-lg transition-colors relative ${theme === 'dark' ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'}`}>
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="hidden text-right lg:block">
                <p className="text-sm font-semibold leading-none mb-1">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
              </div>
              <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500 font-bold">
                {user?.name[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
