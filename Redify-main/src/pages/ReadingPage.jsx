import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bookmark, ChevronLeft, ChevronRight, 
  Plus, Sun, Moon, Settings, List, MessageSquare,
  Maximize2, Minimize2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const C = {
  bg: '#0a0a0a', surface: '#111111', surfaceHover: '#1a1a1a',
  border: 'rgba(255,255,255,0.08)', text: '#f5f5f5', muted: '#a3a3a3',
  accent: '#22c55e', accentLight: '#4ade80', accentDark: '#16a34a',
  accentBg: 'rgba(34,197,94,0.1)', accentBorder: 'rgba(34,197,94,0.2)',
};

const defaultChapters = [
  { id: 1, title: "Prologue: The Awakening" }, 
  { id: 2, title: "Chapter I: Shadows of the Past" },
  { id: 3, title: "Chapter II: The Journey Begins" }, 
  { id: 4, title: "Chapter III: A Secret Revealed" }, 
  { id: 5, title: "Epilogue: New Horizons" },
];

const defaultContent = {
  pages: [
    "The sun began to dip below the horizon, casting long, jagged shadows across the valley. It was a time of transition, not just for the day, but for the world itself. Ancient stories spoke of this moment, when the veil between realities grew thin. For Elara, it was just another Tuesday, until the book appeared on her doorstep. It wasn't just any book; its leather cover felt like warm skin, and the silver latches pulsed with a soft, rhythmic light. When she touched it, a jolt of electricity raced up her arm, and her vision blurred. 'The story begins here,' she whispered, unaware that every word she was about to read would change the course of history forever.",
    "As Elara turned the first page, the room around her seemed to dissolve. The scent of old parchment and damp earth filled her senses. She wasn't in her small apartment anymore; she was standing in a vast, subterranean library. Books floated in the air like birds, and glowing crystals hung from the ceiling, illuminating rows of shelves that stretched into infinity. A voice, ancient and resonant, echoed through the halls. 'Welcome, Seeker. The BoiPori archives have waited a millennium for your return.' Elara clutched the book tighter. She had always felt like she belonged in another world, and now, it seemed, she had finally found it.",
    "The archives were not merely a collection of stories; they were a repository of lived experiences. Each volume held the essence of a soul, a lifetime of memories condensed into ink and paper. As she walked through the aisles, Elara felt the weight of millions of lives. Some books were vibrant and full of joy, their pages smelling of summer rain and jasmine. Others were dark and heavy, radiating a cold sense of dread. She realized then that the book she held was blank—a vessel for her own journey. Her task was not just to read, but to write the next chapter of the world's survival. The ink was her blood, and the pen was her will."
  ]
};

export default function ReadingPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [showSidebar, setShowSidebar] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');

  const themes = {
    dark: { bg: '#0a0a0a', text: '#e5e5e5', surface: '#111111', border: 'rgba(255,255,255,0.08)' },
    light: { bg: '#fdfdfd', text: '#1a1a1a', surface: '#f5f5f5', border: 'rgba(0,0,0,0.08)' },
    sepia: { bg: '#f4ecd8', text: '#5b4636', surface: '#eadfc9', border: 'rgba(91,70,54,0.1)' }
  };

  const currentTheme = themes[theme];

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/books/${bookId}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setLoading(false);
        localStorage.setItem('lastReadBook', bookId);
        
        if (user?.id) {
          fetch(`http://localhost:5000/api/user/${user.id}/read-log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: new Date().toISOString().split('T')[0] })
          }).catch(err => console.error('Failed to log reading session:', err));

          // Fetch notes for this book
          fetch(`http://localhost:5000/api/notes/${user.id}`)
            .then(res => res.json())
            .then(allNotes => {
              const bookNotes = allNotes.filter(n => n.bookId === parseInt(bookId));
              setNotes(bookNotes.map(n => ({ id: n.id, text: n.content, page: n.page })));
            })
            .catch(err => console.error('Error fetching notes:', err));
        }
      })
      .catch(err => {
        console.error('Error fetching book:', err);
        setLoading(false);
      });
  }, [bookId, user?.id]);

  const content = book?.content?.pages || defaultContent.pages;
  const pageCount = content.length;
  const chapters = book?.content?.chapters || defaultChapters;

  const addNote = () => {
    if (!noteText.trim()) return;
    if (!user) {
      alert("Please log in to save notes.");
      return;
    }

    const newNote = {
      content: noteText,
      page: currentPage + 1,
      bookId: parseInt(bookId),
      bookTitle: book?.title,
      userId: user.id
    };

    fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    })
      .then(res => res.json())
      .then(savedNote => {
        setNotes(p => [{ id: savedNote.id, text: savedNote.content, page: savedNote.page }, ...p]);
        setNoteText('');
      })
      .catch(err => console.error('Error saving note:', err));
  };

  if (loading) return (
    <div style={{ height: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-pulse" style={{ color: '#4ade80', fontWeight: '700' }}>Opening the book...</div>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100vh', 
      background: currentTheme.bg, color: currentTheme.text, 
      fontFamily: "'Inter', sans-serif", transition: 'all 0.3s' 
    }}>
      
      {/* HEADER */}
      <header style={{ 
        height: '64px', background: currentTheme.surface, 
        borderBottom: `1px solid ${currentTheme.border}`, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 1.5rem', flexShrink: 0, zIndex: 10 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <ArrowLeft size={22} />
          </button>
          <div style={{ width: '1px', height: '24px', background: currentTheme.border }} />
          <div>
            <h1 style={{ fontSize: '0.9rem', fontWeight: '700', margin: 0 }}>{book?.title}</h1>
            <p style={{ fontSize: '0.7rem', color: C.muted, margin: 0 }}>{book?.author}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Font Size Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(0,0,0,0.05)', padding: '0.25rem', borderRadius: '10px', border: `1px solid ${currentTheme.border}` }}>
            <button 
              onClick={() => setFontSize(s => Math.max(14, s - 2))}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', fontWeight: '700' }}
            >
              A-
            </button>
            <div style={{ width: '1px', height: '16px', background: currentTheme.border }} />
            <button 
              onClick={() => setFontSize(s => Math.min(32, s + 2))}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', fontWeight: '700' }}
            >
              A+
            </button>
          </div>

          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'none', border: 'none', color: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setShowSidebar(!showSidebar)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <List size={20} />
          </button>
          <button onClick={() => setBookmarked(!bookmarked)} style={{ background: 'none', border: 'none', color: bookmarked ? '#4ade80' : 'inherit', cursor: 'pointer' }}>
            <Bookmark size={20} fill={bookmarked ? '#4ade80' : 'none'} />
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT SIDEBAR — Chapters & Notes */}
        {showSidebar && (
          <aside style={{ 
            width: '280px', background: currentTheme.surface, 
            borderRight: `1px solid ${currentTheme.border}`, 
            display: 'flex', flexDirection: 'column', flexShrink: 0 
          }}>
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
              <SectionTitle icon={List} title="Chapters" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
                {chapters.map(ch => (
                  <button key={ch.id} onClick={() => { setActiveChapter(ch.id); setCurrentPage(0); }}
                    style={{ 
                      textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', 
                      background: activeChapter === ch.id ? '#22c55e20' : 'transparent',
                      color: activeChapter === ch.id ? '#22c55e' : 'inherit',
                      fontSize: '0.85rem', cursor: 'pointer', fontWeight: activeChapter === ch.id ? '600' : '400'
                    }}
                  >{ch.title}</button>
                ))}
              </div>

              <SectionTitle icon={MessageSquare} title="Notes" />
              <textarea 
                value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Write a note for this page..."
                style={{ 
                  width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.05)', 
                  border: `1px solid ${currentTheme.border}`, borderRadius: '12px', 
                  color: 'inherit', padding: '0.75rem', fontSize: '0.85rem', outline: 'none', resize: 'none'
                }}
              />
              <button onClick={addNote} style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem', borderRadius: '10px', background: '#16a34a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Add Note</button>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notes.map(note => (
                  <div key={note.id} style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', border: `1px solid ${currentTheme.border}` }}>
                    <p style={{ fontSize: '0.7rem', color: '#22c55e', margin: '0 0 0.25rem' }}>Page {note.page}</p>
                    <p style={{ fontSize: '0.8rem', margin: 0 }}>{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          <div style={{ 
            maxWidth: '750px', width: '100%', margin: '0 auto', 
            padding: '4rem 2rem', boxSizing: 'border-box' 
          }}>
            <div style={{ 
              fontSize: `${fontSize}px`, lineHeight: '1.8', 
              textAlign: 'justify', fontFamily: 'Georgia, serif' 
            }}>
              {content[currentPage]}
            </div>
          </div>

          {/* PAGE NAVIGATION */}
          <div style={{ 
            position: 'fixed', bottom: '2rem', left: showSidebar ? 'calc(280px + 50%)' : '50%', 
            transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '2rem', 
            background: currentTheme.surface, padding: '0.75rem 1.5rem', 
            borderRadius: '20px', border: `1px solid ${currentTheme.border}`, 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'left 0.3s'
          }}>
            <button 
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: currentPage === 0 ? 0.3 : 1 }}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Page {currentPage + 1} / {pageCount}</span>
              <div style={{ width: '100px', height: '3px', background: currentTheme.border, borderRadius: '2px', marginTop: '4px' }}>
                <div style={{ width: `${((currentPage + 1) / pageCount) * 100}%`, height: '100%', background: '#22c55e', borderRadius: '2px' }} />
              </div>
            </div>

            <button 
              disabled={currentPage === pageCount - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: currentPage === pageCount - 1 ? 0.3 : 1 }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </main>

      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: C.muted }}>
      <Icon size={14} />
      <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
    </div>
  );
}
