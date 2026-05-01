import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookSection from '../components/BookSection';
import CategorySection from '../components/CategorySection';
import Footer from '../components/Footer';
import { SearchX } from 'lucide-react';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  // Handle Search
  const queryParams = new URLSearchParams(location.search);
  const searchStr = queryParams.get('search')?.toLowerCase() || '';
  const catParam = queryParams.get('category')?.toLowerCase() || '';

  const filteredBooks = books.filter(b => {
    const matchesSearch = !searchStr || 
      b.title.toLowerCase().includes(searchStr) || 
      b.author.toLowerCase().includes(searchStr);
    
    const matchesCat = !catParam || 
      b.category?.toLowerCase().includes(catParam) || 
      b.genre?.toLowerCase().includes(catParam);
      
    return matchesSearch && matchesCat;
  });

  // Filtering for different sections (mock logic based on real data)
  const trendingBooks = filteredBooks.slice(0, 8);
  const newReleases = filteredBooks.filter(b => b.publishedYear === '2024' || b.publishedYear === '2023').slice(0, 8);
  const classicsBooks = filteredBooks.filter(b => b.genre === 'Fiction' || b.genre === 'Literature').slice(0, 8);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        {!(searchStr || catParam) && (
          <>
            <Hero />
            <CategorySection />
          </>
        )}
        
        <div style={{ position: 'relative', paddingBottom: '4rem', paddingTop: (searchStr || catParam) ? '120px' : '0' }}>
          {loading ? (
            <div style={{ padding: '8rem 0', textAlign: 'center', color: '#a3a3a3' }}>
               <div className="inline-block animate-pulse text-green-500 mb-4 text-2xl font-bold">Redify</div>
               <p>Loading your library...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div style={{ padding: '8rem 0', textAlign: 'center', color: '#a3a3a3', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SearchX size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No books found</h2>
              <p>We couldn't find any books matching "{searchStr}"</p>
              <button 
                onClick={() => window.location.href = '/'}
                style={{ 
                  marginTop: '2rem', 
                  background: 'rgba(34,197,94,0.1)', 
                  color: '#4ade80', 
                  border: '1px solid rgba(34,197,94,0.2)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {(searchStr || catParam) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                  <h1 className="text-3xl font-bold">
                    {searchStr ? `Search results for "${searchStr}"` : `${catParam.charAt(0).toUpperCase() + catParam.slice(1)} Books`}
                  </h1>
                  <p className="text-neutral-400 mt-2">{filteredBooks.length} books found in this selection</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-4 text-green-500 hover:text-green-400 text-sm font-medium flex items-center gap-2"
                  >
                    ← Back to Home
                  </button>
                </div>
              )}
              
              {(searchStr || catParam) ? (
                <BookSection title="Filter Results" books={filteredBooks} />
              ) : (
                <>
                  <BookSection title="For You" books={classicsBooks} viewAllLink="#" />
                  <BookSection title="Trending Now" books={trendingBooks} viewAllLink="#" />
                  <BookSection title="New Releases" books={newReleases} viewAllLink="#" />
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
