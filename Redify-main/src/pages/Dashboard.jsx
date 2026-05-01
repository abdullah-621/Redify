import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Library, BookOpen, Bookmark, FileText, Heart, 
  BarChart2, Settings, LogOut, Flame, Clock, 
  Book, File, ChevronRight, Plus, Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  surfaceLight: 'var(--surface)',
  border: 'var(--border)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  accent: '#22c55e',
  accentLight: '#4ade80',
  accentBg: 'rgba(34,197,94,0.1)',
  streak: 'linear-gradient(135deg, #f59e0b, #ef4444)',
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const chartData = [45, 30, 60, 25, 85, 40, 20];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shelfBooks, setShelfBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [lastRead, setLastRead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activeTab, setActiveTab] = useState('shelf'); // 'shelf', 'favorites', 'recent', 'notes'

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/books');
        const allBooks = await res.json();
        
        const shelfIds = JSON.parse(localStorage.getItem('shelf') || '[]');
        const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
        const lastId = localStorage.getItem('lastReadBook');

        setShelfBooks(allBooks.filter(b => shelfIds.includes(b.id)));
        setFavoriteBooks(allBooks.filter(b => favIds.includes(b.id)));
        setLastRead(allBooks.find(b => b.id === parseInt(lastId)));
        
        // Fetch notes
        const notesRes = await fetch(`http://localhost:5000/api/notes/${user.id}`);
        const notesData = await notesRes.json();
        setNotes(notesData);

        // Fetch stats
        const statsRes = await fetch(`http://localhost:5000/api/dashboard-stats/${user.id}`);
        const statsData = await statsRes.json();
        setDashboardStats(statsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const deleteNote = async (noteId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (loading) return (
    <div style={{ background: C.bg, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
      <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
      Loading Dashboard...
    </div>
  );

  const statsCards = [
    { label: 'In My Shelf', value: shelfBooks.length, sub: 'Books you plan to read', icon: Library, color: '#3b82f6' },
    { label: 'Favorites', value: favoriteBooks.length, sub: 'Your top picks', icon: Heart, color: '#ef4444' },
    { label: 'Reading Progress', value: dashboardStats?.readingProgress || '12%', sub: 'Avg. across shelf', icon: BarChart2, color: '#10b981' },
    { label: 'Reading Days', value: dashboardStats?.readingDays || 0, sub: `Streak: ${dashboardStats?.streak || 0} days`, icon: Flame, color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <Navbar isFixed={true} forceDark={true} />
      
      <div style={{ display: 'flex', paddingTop: '64px', height: 'calc(100vh - 64px)' }}>
        
        {/* SIDEBAR */}
        <aside style={{ width: '260px', background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '1.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '12px', 
              background: user?.avatar && user.avatar.length > 5 ? `url(${user.avatar}) center/cover` : C.streak, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: '700', color: 'white',
              overflow: 'hidden'
            }}>
              {(!user?.avatar || user.avatar.length <= 5) && (user?.name?.[0].toUpperCase() || 'U')}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</p>
              <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: '700' }}>Pro Reader</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            <MenuItem 
              icon={Library} 
              label="My Shelf" 
              count={shelfBooks.length} 
              active={activeTab === 'shelf'} 
              onClick={() => setActiveTab('shelf')} 
            />
            <MenuItem 
              icon={Heart} 
              label="Favorites" 
              count={favoriteBooks.length} 
              active={activeTab === 'favorites'} 
              onClick={() => setActiveTab('favorites')} 
            />
            <MenuItem 
              icon={Clock} 
              label="Recently Read" 
              active={activeTab === 'recent'} 
              onClick={() => setActiveTab('recent')} 
            />
            <MenuItem 
              icon={FileText} 
              label="My Notes" 
              count={notes.length} 
              active={activeTab === 'notes'} 
              onClick={() => setActiveTab('notes')} 
            />
          </nav>
          
          <button 
            onClick={() => { logout(); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${C.border}`, background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', marginTop: 'auto' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>Welcome back, <span style={{ color: C.accentLight }}>{user?.name?.split(' ')[0]}.</span></h1>
              <p style={{ margin: '0.25rem 0 0', color: C.muted, fontSize: '0.85rem' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <button onClick={() => navigate('/')} style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: C.surfaceLight, border: `1px solid ${C.border}`, color: C.text, fontWeight: '600', cursor: 'pointer' }}>+ Browse More</button>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            {statsCards.map((stat, i) => (
              <div key={i} style={{ background: C.surface, padding: '1.25rem', borderRadius: '16px', border: `1px solid ${C.border}` }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, marginBottom: '0.75rem' }}>
                  <stat.icon size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: C.muted }}>{stat.label}</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', color: C.accentLight }}>{stat.sub}</p>
              </div>
            ))}
          </div>

          {activeTab === 'shelf' && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>My <span style={{ color: C.accentLight, fontStyle: 'italic' }}>Shelf</span></h2>
              {shelfBooks.length === 0 ? (
                <EmptyState message="Your shelf is empty. Start adding some books!" />
              ) : (
                <BookGrid books={shelfBooks} onBookClick={(id) => navigate(`/book/${id}`)} />
              )}
            </section>
          )}

          {activeTab === 'favorites' && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>My <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Favorites</span></h2>
              {favoriteBooks.length === 0 ? (
                <EmptyState message="No favorite books yet. Heart some books to see them here!" />
              ) : (
                <BookGrid books={favoriteBooks} onBookClick={(id) => navigate(`/book/${id}`)} />
              )}
            </section>
          )}

          {activeTab === 'recent' && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>Recently <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>Read</span></h2>
              {lastRead ? (
                <div 
                  onClick={() => navigate(`/read/${lastRead.id}`)}
                  style={{ background: C.streak, borderRadius: '20px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                   <div>
                     <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Pick up where you left off</p>
                     <h2 style={{ margin: '0.5rem 0', fontSize: '2.2rem', fontWeight: '800' }}>{lastRead.title}</h2>
                     <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>by {lastRead.author}</p>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', backdropFilter: 'blur(10px)' }}>Resume Reading →</div>
                </div>
              ) : (
                <EmptyState message="You haven't read any books yet." />
              )}
            </section>
          )}

          {activeTab === 'notes' && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>My <span style={{ color: C.accentLight, fontStyle: 'italic' }}>Notes</span></h2>
              {notes.length === 0 ? (
                <EmptyState message="No notes saved yet. You can add notes while reading!" />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {notes.map(note => (
                    <div key={note.id} style={{ background: C.surface, padding: '1.5rem', borderRadius: '16px', border: `1px solid ${C.border}`, position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: C.accentLight, fontWeight: '700', textTransform: 'uppercase' }}>{note.bookTitle}</p>
                          <p style={{ margin: 0, fontSize: '0.65rem', color: C.muted }}>Page {note.page} • {new Date(note.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button 
                          onClick={() => deleteNote(note.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete note"
                        >
                          <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
                        </button>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section style={{ background: C.surface, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '1.5rem 2rem' }}>
             <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Reading Activity</h2>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', gap: '1rem' }}>
              {(dashboardStats?.weeklyActivity || [
                { day: 'Mon', read: false, isPast: true },
                { day: 'Tue', read: false, isPast: true },
                { day: 'Wed', read: false, isPast: true },
                { day: 'Thu', read: false, isPast: true },
                { day: 'Fri', read: false, isPast: true },
                { day: 'Sat', read: false, isPast: true },
                { day: 'Sun', read: false, isPast: true }
              ]).map((data, i) => {
                let barColor = C.surfaceLight;
                if (data.read) barColor = '#22c55e'; // Green
                else if (data.isPast) barColor = '#ef4444'; // Red
                
                return (
                  <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '100%', height: data.read ? '80%' : '40%', background: barColor, borderRadius: '4px', opacity: data.isPast || data.read ? 1 : 0.2 }} />
                    <span style={{ fontSize: '0.65rem', color: C.muted }}>{data.day}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, count, active = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none',
        background: active ? C.accentBg : 'transparent', color: active ? C.accentLight : C.muted, cursor: 'pointer', fontSize: '0.85rem', width: '100%', textAlign: 'left',
        transition: 'all 0.2s'
      }}
    >
      <Icon size={18} /> <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: '0.7rem', background: active ? C.accentBg : C.surfaceLight, padding: '0.1rem 0.4rem', borderRadius: '4px', color: active ? C.accentLight : C.muted }}>{count}</span>}
    </button>
  );
}

function BookGrid({ books, onBookClick }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
      {books.map((book) => (
        <div key={book.id} onClick={() => onBookClick(book.id)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ aspectRatio: '2/3', background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: '1rem' }}>
            <img src={book.coverUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</h3>
          <p style={{ margin: 0, fontSize: '0.75rem', color: C.muted }}>{book.author}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ padding: '3rem', textAlign: 'center', background: C.surface, borderRadius: '20px', border: `1px dashed ${C.border}`, color: C.muted }}>
      {message}
    </div>
  );
}
