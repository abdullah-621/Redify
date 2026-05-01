import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, BookOpen, Plus, Heart, ChevronRight, Loader2, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceLight: '#1a1a1a',
  border: 'rgba(255,255,255,0.08)',
  text: '#f5f5f5',
  muted: '#a3a3a3',
  accent: '#22c55e',
  accentLight: '#4ade80',
  accentDark: '#16a34a',
  accentBg: 'rgba(34,197,94,0.1)',
};

const AVATAR_COLORS = [
  ['#16a34a','#4ade80'], ['#1d4ed8','#60a5fa'], ['#7e22ce','#c084fc'],
  ['#be123c','#fb7185'], ['#b45309','#fcd34d'], ['#0e7490','#22d3ee'],
];

function getAvatarColor(name) {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function StarRating({ value, onChange, size = 22 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={size}
          fill={(hovered || value) >= i ? '#fbbf24' : 'none'}
          stroke={(hovered || value) >= i ? '#fbbf24' : '#666'}
          style={{ cursor: onChange ? 'pointer' : 'default', transition: 'transform 0.1s' }}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(i)}
        />
      ))}
    </div>
  );
}

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isOnShelf, setIsOnShelf] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchBook = () => {
    return fetch(`http://localhost:5000/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setReviews(data.Reviews || []);
        return data;
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const shelf = JSON.parse(localStorage.getItem('shelf') || '[]');
    setIsFavorited(favorites.includes(parseInt(id)));
    setIsOnShelf(shelf.includes(parseInt(id)));

    fetchBook()
      .then(data => fetch('http://localhost:5000/api/books').then(r => r.json()).then(all => ({ data, all })))
      .then(({ data, all }) => {
        const similar = all.filter(b => b.id !== parseInt(id) && b.genre === data.genre).slice(0, 4);
        setRecommendations(similar);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { setReviewError('Please log in to write a review.'); return; }
    if (reviewRating === 0) { setReviewError('Please select a star rating.'); return; }
    if (reviewComment.trim().length < 10) { setReviewError('Review must be at least 10 characters.'); return; }

    setSubmitting(true);
    setReviewError('');
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user.name,
          comment: reviewComment.trim(),
          rating: reviewRating,
          avatar: user.name[0].toUpperCase(),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setReviewRating(0);
      setReviewComment('');
      triggerToast('✅ Review submitted!');
    } catch {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavs = isFavorited
      ? favorites.filter(fid => fid !== parseInt(id))
      : [...favorites, parseInt(id)];
    if (!isFavorited) triggerToast('Added to Favorites ❤️');
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    setIsFavorited(!isFavorited);
  };

  const toggleShelf = () => {
    const shelf = JSON.parse(localStorage.getItem('shelf') || '[]');
    const newShelf = isOnShelf
      ? shelf.filter(sid => sid !== parseInt(id))
      : [...shelf, parseInt(id)];
    if (!isOnShelf) triggerToast('Added to your Shelf 📚');
    localStorage.setItem('shelf', JSON.stringify(newShelf));
    setIsOnShelf(!isOnShelf);
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : book?.rating;

  const ratingDist = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100) : 0
  }));

  if (loading) return (
    <div style={{ height: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
      <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
      <p>Loading book details...</p>
    </div>
  );

  if (!book) return (
    <div style={{ height: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
      <p>Book not found.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <Navbar isFixed={true} forceDark={true} />

      {/* Toast */}
      {showToast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100,
          background: C.accentDark, color: 'white', padding: '1rem 2rem',
          borderRadius: '12px', fontWeight: '600', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}>
          {showToast}
        </div>
      )}

      <main style={{ paddingTop: '100px', paddingBottom: '4rem' }}>

        {/* ── BOOK HERO ───────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

            {/* Cover */}
            <div style={{
              width: '100%', maxWidth: '280px', margin: '0 auto', flexShrink: 0,
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 40px 80px -20px rgba(34,197,94,0.2)',
              border: `1px solid ${C.border}`
            }}>
              <img src={book.coverUrl} alt={book.title} style={{ width: '100%', display: 'block' }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: C.muted, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                <ChevronRight size={14} />
                <span>{book.genre}</span>
                <ChevronRight size={14} />
                <span style={{ color: C.text }}>{book.title}</span>
              </div>

              <span style={{ padding: '0.4rem 0.8rem', background: C.accentBg, color: C.accentLight, borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', display: 'inline-block', marginBottom: '1rem' }}>
                {book.category}
              </span>

              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', margin: '0 0 0.5rem', color: C.text, fontFamily: 'Georgia, serif' }}>{book.title}</h1>
              <p style={{ fontSize: '1.25rem', color: C.muted, margin: '0 0 1.5rem' }}>by <span style={{ color: C.text, fontWeight: '600' }}>{book.author}</span></p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <StarRating value={Math.floor(avgRating)} size={18} />
                <span style={{ color: C.text, fontWeight: '700', fontSize: '1.1rem' }}>{avgRating}</span>
                <div style={{ width: '1px', height: '16px', background: C.border }} />
                <span style={{ color: C.muted, fontSize: '0.9rem' }}>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
              </div>

              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: C.muted, marginBottom: '2.5rem', maxWidth: '700px' }}>
                {book.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px]" style={{ background: C.border, borderRadius: '12px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                <InfoItem label="PAGES" value={book.pages || 'N/A'} />
                <InfoItem label="PUBLISHER" value={book.publisher || 'N/A'} />
                <InfoItem label="LANGUAGE" value={book.language || 'English'} />
                <InfoItem label="PUBLISHED" value={book.publishedYear || 'N/A'} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <button onClick={() => navigate(`/read/${id}`)} style={{ padding: '0.85rem 2rem', borderRadius: '12px', background: C.accentDark, color: 'white', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(34,197,94,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.accent}
                  onMouseLeave={e => e.currentTarget.style.background = C.accentDark}>
                  <BookOpen size={20} /> Read Now
                </button>
                <button onClick={toggleShelf} style={{ padding: '0.85rem 1.5rem', borderRadius: '12px', background: isOnShelf ? C.accentBg : C.surface, border: `1px solid ${isOnShelf ? C.accentLight : C.border}`, color: isOnShelf ? C.accentLight : C.text, fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {isOnShelf ? '✓ In Shelf' : '+ Add to Shelf'}
                </button>
                <button onClick={toggleFavorite} style={{ padding: '0.85rem', borderRadius: '12px', background: isFavorited ? 'rgba(239,68,68,0.1)' : C.surface, border: `1px solid ${isFavorited ? '#ef4444' : C.border}`, color: isFavorited ? '#ef4444' : C.text, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Heart size={20} fill={isFavorited ? '#ef4444' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── REVIEWS SECTION ─────────────────────────────── */}
        <section style={{ marginTop: '6rem' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>
                Reader <span style={{ color: C.accentLight, fontStyle: 'italic' }}>Reviews</span>
              </h2>
              {reviews.length > 0 && (
                <span style={{ color: C.muted, fontSize: '0.9rem' }}>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* LEFT — Rating Summary + Write Review */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Rating Summary */}
                {reviews.length > 0 && (
                  <div style={{ background: C.surface, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '4rem', fontWeight: '800', margin: 0, color: C.text, lineHeight: 1 }}>{avgRating}</p>
                      <StarRating value={Math.round(avgRating)} size={20} />
                      <p style={{ color: C.muted, fontSize: '0.8rem', marginTop: '0.5rem' }}>Based on {reviews.length} reviews</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {ratingDist.map(({ star, count, pct }) => (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ color: C.muted, fontSize: '0.8rem', minWidth: '10px' }}>{star}</span>
                          <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#fbbf24', borderRadius: '9999px', transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ color: C.muted, fontSize: '0.75rem', minWidth: '28px', textAlign: 'right' }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Write Review Form */}
                <div style={{ background: C.surface, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '2rem' }}>
                  <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: '700' }}>
                    ✏️ Write a Review
                  </h3>

                  {!user ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                      <p style={{ color: C.muted, fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Log in to share your thoughts on this book.
                      </p>
                      <button onClick={() => navigate('/login')} style={{ padding: '0.7rem 1.5rem', background: C.accentDark, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                        Log In to Review
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Reviewer Name (read-only) */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', color: C.muted, marginBottom: '0.5rem' }}>POSTING AS</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${C.accentDark}, ${C.accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                            {user.name[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</span>
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', color: C.muted, marginBottom: '0.5rem' }}>YOUR RATING</label>
                        <StarRating value={reviewRating} onChange={setReviewRating} size={26} />
                      </div>

                      {/* Comment */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', color: C.muted, marginBottom: '0.5rem' }}>YOUR REVIEW</label>
                        <textarea
                          value={reviewComment}
                          onChange={e => setReviewComment(e.target.value)}
                          placeholder="Share your thoughts about this book..."
                          rows={5}
                          style={{
                            width: '100%', resize: 'vertical', padding: '0.85rem 1rem',
                            background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                            borderRadius: '12px', color: C.text, fontSize: '0.9rem', lineHeight: '1.6',
                            outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                          }}
                          onFocus={e => e.target.style.borderColor = C.accentLight}
                          onBlur={e => e.target.style.borderColor = C.border}
                        />
                      </div>

                      {reviewError && (
                        <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{reviewError}</p>
                      )}

                      <button type="submit" disabled={submitting} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                        padding: '0.85rem', borderRadius: '12px', background: submitting ? 'rgba(34,197,94,0.4)' : C.accentDark,
                        color: 'white', border: 'none', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem', transition: 'background 0.2s',
                      }}>
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* RIGHT — Review Cards */}
              <div className="lg:col-span-2">
                {reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', background: C.surface, borderRadius: '20px', border: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</p>
                    <p style={{ color: C.muted, fontSize: '1rem', fontWeight: '500' }}>No reviews yet.</p>
                    <p style={{ color: C.muted, fontSize: '0.85rem', marginTop: '0.25rem' }}>Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {reviews.map((rev, i) => {
                      const [from, to] = getAvatarColor(rev.userName);
                      return (
                        <div key={rev.id || i} style={{
                          background: C.surface, padding: '1.75rem', borderRadius: '20px',
                          border: `1px solid ${C.border}`, transition: 'border-color 0.2s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                        >
                          {/* Review Header */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                              <div style={{
                                width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                                background: `linear-gradient(135deg, ${from}, ${to})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '800', fontSize: '1rem', color: 'white'
                              }}>
                                {rev.avatar || rev.userName?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>{rev.userName}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: C.muted }}>
                                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                                </p>
                              </div>
                            </div>
                            <StarRating value={rev.rating} size={15} />
                          </div>

                          {/* Review Comment */}
                          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: '#d4d4d4' }}>
                            {rev.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── RECOMMENDATIONS ─────────────────────────────── */}
        {recommendations.length > 0 && (
          <section style={{ marginTop: '6rem' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem' }}>
                You May Also <span style={{ color: C.accentLight, fontStyle: 'italic' }}>Enjoy</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recommendations.map(rec => (
                  <BookCard key={rec.id} book={rec} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={{ padding: '1.25rem', background: C.surface, textAlign: 'center' }}>
      <p style={{ margin: '0 0 0.4rem', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.1em', color: C.muted }}>{label}</p>
      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
    </div>
  );
}
