import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, Menu, X, User, LogOut, 
  ChevronDown, Sun, Moon, Bell, LayoutDashboard, Library 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ isFixed = true, forceDark = false }) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (forceDark) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceDark]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Reader', path: '/read' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`${isFixed ? 'fixed top-0 left-0' : 'relative'} w-full z-50 transition-all duration-300`}
      style={{
        padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
        background: isScrolled 
          ? (theme === 'dark' ? 'rgba(23,23,23,0.95)' : 'rgba(255,255,255,0.95)') 
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group no-underline">
            <div style={{ padding: '0.5rem', background: 'rgba(34,197,94,0.15)', borderRadius: '0.75rem' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#4ade80' }} />
            </div>
            <span className={`text-xl font-bold tracking-tight group-hover:text-green-400 transition-colors ${(theme === 'dark' || forceDark) ? 'text-white' : 'text-neutral-900'}`}>
              Redify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors no-underline ${
                  isActive(link.path) 
                    ? 'text-green-400' 
                    : ((theme === 'dark' || forceDark) ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900')
                }`}
                style={{ color: isActive(link.path) ? '#4ade80' : undefined }}
              >
                {link.name}
              </Link>
            ))}
            
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 transition-all w-48 focus:w-64"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  color: (theme === 'dark' || forceDark) ? '#f5f5f5' : '#171717',
                  outline: 'none',
                }}
              />
            </form>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${(theme === 'dark' || forceDark) ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className={`p-2 rounded-full transition-colors relative ${(theme === 'dark' || forceDark) ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'}`}>
              <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', border: `2px solid ${theme === 'dark' ? '#171717' : '#f5f5f5'}` }} />
              <Search className="w-5 h-5" style={{ display: 'none' }} />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-1 pl-3 pr-2 rounded-full transition-colors border ${
                    (theme === 'dark' || forceDark)
                      ? 'hover:bg-white/5 border-white/10'
                      : 'hover:bg-black/5 border-black/10'
                  }`}
                >
                  <span className={`text-sm font-medium ${(theme === 'dark' || forceDark) ? 'text-white' : 'text-neutral-900'}`}>{user.name.split(' ')[0]}</span>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-green-400 font-bold border border-green-500/30 overflow-hidden"
                    style={{ 
                      background: user.avatar && user.avatar.length > 5 ? `url(${user.avatar}) center/cover` : 'rgba(34,197,94,0.2)' 
                    }}
                  >
                    {(!user.avatar || user.avatar.length <= 5) && (user.name.charAt(0))}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''} ${(theme === 'dark' || forceDark) ? 'text-neutral-400' : 'text-neutral-500'}`} />
                </button>

                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border overflow-hidden ${(theme === 'dark' || forceDark) ? 'bg-neutral-900 border-white/5' : 'bg-white border-black/5'}`}>
                    <div className={`px-4 py-3 border-b ${(theme === 'dark' || forceDark) ? 'border-white/5' : 'border-black/5'}`}>
                      <p className={`text-sm font-semibold truncate ${(theme === 'dark' || forceDark) ? 'text-white' : 'text-neutral-900'}`}>{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      {user.role === 'Admin' && (
                        <Link to="/admin" className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors no-underline ${(theme === 'dark' || forceDark) ? 'text-green-400 hover:bg-white/5' : 'text-green-600 hover:bg-black/5'}`}>
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors no-underline ${(theme === 'dark' || forceDark) ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'}`}>
                        <Library className="w-4 h-4" /> My Dashboard
                      </Link>
                      <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors no-underline ${(theme === 'dark' || forceDark) ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'}`}>
                        <User className="w-4 h-4" /> Account Settings
                      </Link>
                      <button 
                        onClick={logout}
                        className={`flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full text-left transition-colors`}
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="primary-button no-underline">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className={`p-2 focus:outline-none ${(theme === 'dark' || forceDark) ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden mx-4 mt-2 p-4 rounded-2xl flex flex-col gap-4 border ${
          (theme === 'dark' || forceDark)
            ? 'bg-neutral-900/95 border-white/10'
            : 'bg-white/95 border-black/10'
        }`} style={{ backdropFilter: 'blur(12px)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium p-2 rounded-lg no-underline ${
                isActive(link.path) 
                  ? 'text-green-400 bg-green-500/10' 
                  : ((theme === 'dark' || forceDark) ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-neutral-600 hover:bg-black/5 hover:text-neutral-900')
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
             <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="primary-button w-full mt-2 bg-red-500/20 text-red-400 border-red-500/30"
             >
               Sign Out
             </button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="primary-button w-full mt-2 no-underline text-center">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
