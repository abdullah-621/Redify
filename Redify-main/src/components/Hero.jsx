import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ books: null, users: null, categories: null });

  useEffect(() => {
    // Fetch real counts from server
    Promise.all([
      fetch('http://localhost:5000/api/books').then(r => r.json()),
      fetch('http://localhost:5000/api/categories').then(r => r.json()),
    ]).then(([books, cats]) => {
      setStats({ books: books.length, categories: cats.length });
    }).catch(() => {});
  }, []);

  const fmt = (n) => {
    if (n === null) return '...';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M+';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K+';
    return n + '+';
  };

  const handleStartReading = () => {
    if (user) {
      navigate('/read');
    } else {
      navigate('/login');
    }
  };

  const handleExploreBooks = () => {
    const section = document.getElementById('category-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-20 pb-10 lg:pt-28 lg:pb-16 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{ position: 'absolute', top: '25%', left: '20%', width: '24rem', height: '24rem', background: 'rgba(34,197,94,0.15)', borderRadius: '9999px', filter: 'blur(100px)' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '24rem', height: '24rem', background: 'rgba(59,130,246,0.08)', borderRadius: '9999px', filter: 'blur(100px)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
            >
              <Star className="w-4 h-4" style={{ fill: '#4ade80' }} />
              <span>Editors' Choice of the Month</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight" style={{ color: 'var(--text)' }}>
              Dive into the <br className="hidden lg:block" />
              <span style={{ backgroundImage: 'linear-gradient(to right, #4ade80, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                World of Stories
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed" style={{ color: 'var(--muted)' }}>
              Discover millions of books, audiobooks, and comics. Join our community of readers and share your journey through endless imaginations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={handleStartReading}
                className="primary-button text-base px-8 py-3 w-full sm:w-auto group"
              >
                Start Reading
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleExploreBooks}
                className="glass-button text-base px-8 py-3 w-full sm:w-auto flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Explore Books
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{fmt(stats.books)}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Available Books</p>
              </div>
              <div style={{ width: '1px', height: '3rem', background: 'var(--border)' }}></div>
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{fmt(stats.categories)}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Categories</p>
              </div>
              <div style={{ width: '1px', height: '3rem', background: 'var(--border)' }}></div>
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Free</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>To Read</p>
              </div>
            </div>
          </div>

          {/* Featured Book Showcase */}
          <div className="flex-1 w-full max-w-md lg:max-w-none relative">
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105"
              style={{ aspectRatio: '3/4', boxShadow: '0 40px 80px -20px rgba(34,197,94,0.25)', transform: 'rotate(-2deg)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop"
                alt="Classic Library"
                className="w-full h-full object-cover"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}></div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>Featured Release</p>
                <h3 className="text-3xl font-bold text-white mb-2">The Silent Echo</h3>
                <p className="text-white/80 mb-4">By Sarah Jenkins</p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>Mystery</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>Thriller</span>
                </div>
              </div>
            </div>
            {/* Decorative offset borders */}
            <div className="absolute -z-10 rounded-2xl" style={{ inset: 0, top: '2rem', right: '-2rem', border: '1px solid rgba(255,255,255,0.08)', transform: 'translate(1rem, 1rem)' }}></div>
          </div>

        </div>
      </div>
    </div>
  );
}
