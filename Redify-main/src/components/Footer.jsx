import React from 'react';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer 
      style={{ 
        background: theme === 'dark' ? 'rgba(23,23,23,0.5)' : 'rgba(255,255,255,0.5)', 
        borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        backdropFilter: 'blur(10px)'
      }} 
      className="py-6 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Compact Brand */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Redify</span>
            <span className="hidden md:block mx-2 text-neutral-600">|</span>
            <p className="text-xs text-neutral-500 hidden md:block">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Minimalist Links */}
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'About', 'Contact'].map(link => (
              <a 
                key={link} 
                href="#" 
                className={`text-xs font-medium transition-colors no-underline ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                {link}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
