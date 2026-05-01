import React from 'react';
import { ChevronRight } from 'lucide-react';
import BookCard from './BookCard';

export default function BookSection({ title, books, viewAllLink = "#" }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '2rem', background: '#22c55e', borderRadius: '4px' }}></span>
            {title}
          </h2>
          <a
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-green-400 transition-colors group"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
