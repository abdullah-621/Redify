import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, BookmarkPlus } from 'lucide-react';

export default function BookCard({ book }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleRead = (e) => {
    e.stopPropagation();
    navigate(`/read/${book.id}`);
  };

  return (
    <div
      className="group cursor-pointer flex flex-col gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleRead}
    >
      {/* Cover Image */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: '2/3',
          border: '1px solid rgba(255,255,255,0.06)',
          background: '#171717',
          boxShadow: hovered ? '0 20px 40px -10px rgba(34,197,94,0.18)' : '0 4px 20px rgba(0,0,0,0.4)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.35s ease',
        }}
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{
            background: 'rgba(0,0,0,0.62)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        >
          <button
            onClick={handleRead}
            style={{
              width: '120px',
              padding: '0.5rem 0',
              borderRadius: '8px',
              background: '#16a34a',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
              transform: hovered ? 'translateY(0)' : 'translateY(14px)',
              transition: 'transform 0.3s 0.05s, background 0.2s',
              boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#22c55e'}
            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
          >
            Read Now
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/book/${book.id}`); }}
            style={{
              width: '120px',
              padding: '0.5rem 0',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transform: hovered ? 'translateY(0)' : 'translateY(20px)',
              transition: 'transform 0.3s 0.1s, background 0.2s',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            Details
          </button>
        </div>

        {/* Floating Bookmark */}
        <button
          onClick={e => e.stopPropagation()}
          className="absolute top-3 right-3 rounded-full text-white/70 hover:text-white transition-colors"
          style={{
            padding: '0.45rem',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            cursor: 'pointer',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'all 0.3s',
            color: 'white',
          }}
        >
          <BookmarkPlus style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h4
          className="font-medium line-clamp-1 transition-colors"
          style={{ color: hovered ? '#4ade80' : '#f5f5f5', fontSize: '0.9rem' }}
        >
          {book.title}
        </h4>
        <p className="text-sm text-neutral-400 line-clamp-1">{book.author}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1" style={{ color: '#4ade80' }}>
            <Star style={{ width: '13px', height: '13px', fill: '#4ade80' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{book.rating}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#525252' }}>•</span>
          <span style={{ fontSize: '0.75rem', color: '#737373' }}>{book.genre}</span>
        </div>
      </div>
    </div>
  );
}
